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
  blobUrl?: string;
  blobName?: string;
  fileSize?: number;
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
 * Upload a document to Azure storage
 */
export async function uploadDocument(file: File, projectId: string, isTranscript: boolean = false): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);
  formData.append('isTranscript', isTranscript ? 'true' : 'false');
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload document');
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