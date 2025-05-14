import { notFound } from "next/navigation";

export default function DocumentPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch document data server-side
  // This is a simple placeholder for the demo
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Document {params.id}</h1>
      <p>This is a placeholder for document {params.id}.</p>
      <p>In a real application, this page would display document details and summary.</p>
    </div>
  );
} 