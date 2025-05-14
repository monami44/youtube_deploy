import os
from azure.storage.blob import BlobServiceClient, ContentSettings
from app.core.config import settings

class AzureStorageClient:
    """Client for Azure Blob Storage operations"""
    
    def __init__(self):
        """Initialize the Azure Storage client"""
        self.connection_string = settings.azure_storage_connection_string
        self.container_name = settings.azure_storage_container_name
        self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        self.container_client = self.blob_service_client.get_container_client(self.container_name)
    
    def upload_file(self, file_content, filename, content_type):
        """Upload a file to Azure Blob Storage
        
        Args:
            file_content: The content of the file
            filename: The name of the file in Azure Blob Storage
            content_type: The content type of the file
            
        Returns:
            The URL of the uploaded blob
        """
        # Create blob client
        blob_client = self.container_client.get_blob_client(filename)
        
        # Set content settings
        content_settings = ContentSettings(content_type=content_type)
        
        # Upload the file
        blob_client.upload_blob(file_content, content_settings=content_settings, overwrite=True)
        
        # Return the URL
        return blob_client.url
    
    def list_blobs(self):
        """List all blobs in the container
        
        Returns:
            A list of blob names
        """
        return [blob.name for blob in self.container_client.list_blobs()]
    
    def download_blob(self, blob_name):
        """Download a blob from the container
        
        Args:
            blob_name: The name of the blob to download
            
        Returns:
            The blob content
        """
        blob_client = self.container_client.get_blob_client(blob_name)
        return blob_client.download_blob().readall()
    
    def delete_blob(self, blob_name):
        """Delete a blob from the container
        
        Args:
            blob_name: The name of the blob to delete
        """
        blob_client = self.container_client.get_blob_client(blob_name)
        blob_client.delete_blob()

# Create a singleton instance
azure_storage_client = AzureStorageClient() 