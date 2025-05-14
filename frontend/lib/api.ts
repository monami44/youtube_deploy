/**
 * API service for communicating with the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Document {
  id: string;
  filename: string;
  uploadDate: string;
  status: string;
  summary: string | null;
  extractedText: string | null;
}

/**
 * Fetch all documents
 */
export async function getDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  
  return response.json();
}

/**
 * Get a specific document by ID
 */
export async function getDocument(id: string): Promise<Document> {
  const response = await fetch(`${API_URL}/api/documents/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch document');
  }
  
  return response.json();
}

/**
 * Upload a document
 */
export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/api/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload document');
  }
  
  return response.json();
}

/**
 * Regenerate a document summary with a custom prompt
 */
export async function regenerateSummary(documentId: string, prompt: string): Promise<{ summary: string }> {
  const response = await fetch(`${API_URL}/api/documents/${documentId}/regenerate-summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to regenerate summary');
  }
  
  return response.json();
} 