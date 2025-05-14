import time
import asyncio
import logging
from sqlalchemy.orm import Session
import traceback

from app.core.config import settings
from app.db.database import SessionLocal
from app.db.repositories import DocumentRepository
from app.utils.azure_storage import azure_storage_client
from app.utils.document_intelligence import document_intelligence_service
from app.utils.summarizer import document_summarizer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

class DocumentProcessingWorker:
    """Worker for processing documents in the background"""
    
    def __init__(self):
        """Initialize the worker"""
        self.poll_interval = settings.poll_interval_seconds
        logger.info(f"Worker initialized with poll interval: {self.poll_interval} seconds")
    
    def get_db(self):
        """Get a database session"""
        db = SessionLocal()
        try:
            return db
        finally:
            db.close()
    
    async def process_document(self, document, db: Session):
        """Process a document
        
        Args:
            document: The document to process
            db: Database session
        """
        try:
            # Update document status
            repo = DocumentRepository(db)
            repo.update_document_status(document.id, "processing")
            logger.info(f"Processing document: {document.id}")
            
            # Download document from blob storage
            blob_content = azure_storage_client.download_blob(document.filename)
            
            # Extract text using Document Intelligence
            extracted_text = document_intelligence_service.analyze_document(blob_content)
            logger.info(f"Text extracted from document: {document.id}")
            
            # Generate summary
            summary = document_summarizer.generate_summary(extracted_text)
            logger.info(f"Summary generated for document: {document.id}")
            
            # Update document with extracted text and summary
            repo.update_document_text_and_summary(document.id, extracted_text, summary)
            logger.info(f"Document processing completed: {document.id}")
            
        except Exception as e:
            logger.error(f"Error processing document {document.id}: {str(e)}")
            logger.error(traceback.format_exc())
            repo.update_document_status(document.id, "error")
    
    async def poll_pending_documents(self):
        """Poll for pending documents and process them"""
        while True:
            try:
                # Get database session
                db = self.get_db()
                
                # Get pending documents
                repo = DocumentRepository(db)
                pending_documents = repo.get_pending_documents()
                
                if pending_documents:
                    logger.info(f"Found {len(pending_documents)} pending documents")
                    
                    # Process each document
                    for document in pending_documents:
                        await self.process_document(document, db)
                
                # Wait before polling again
                await asyncio.sleep(self.poll_interval)
                
            except Exception as e:
                logger.error(f"Error in poll loop: {str(e)}")
                logger.error(traceback.format_exc())
                await asyncio.sleep(self.poll_interval)
            finally:
                db.close()

# Main function to run the worker
async def run_worker():
    """Run the document processing worker"""
    logger.info("Starting document processing worker")
    worker = DocumentProcessingWorker()
    await worker.poll_pending_documents()

# Start the worker when script is run directly
if __name__ == "__main__":
    asyncio.run(run_worker()) 