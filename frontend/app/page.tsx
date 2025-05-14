import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Processor</h1>
        <Link href="/upload">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* This would be populated with real data from the API */}
        <DocumentCard
          title="Sample Document"
          description="Uploaded on 2024-10-22"
          status="Processed"
          id="1"
        />
        <DocumentCard
          title="Example PDF"
          description="Uploaded on 2024-10-20"
          status="Processing"
          id="2"
        />
        <Link href="/upload" className="h-full">
          <Card className="h-full border-dashed flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <PlusCircle className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Upload New Document</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function DocumentCard({ title, description, status, id }: { 
  title: string; 
  description: string; 
  status: string;
  id: string;
}) {
  return (
    <Link href={`/documents/${id}`}>
      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${
              status === "Processed" ? "bg-green-500" : 
              status === "Processing" ? "bg-yellow-500" : "bg-red-500"
            }`} />
            <span className="text-sm text-muted-foreground">{status}</span>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Click to view details</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
