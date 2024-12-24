import { useState } from "react";
import PDFUploader from "@/components/PDFUploader";
import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // This is where you'll integrate with your Python backend
    toast({
      title: "Backend Integration Required",
      description: "Ready to connect to your Python backend API",
    });
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">PDF Analysis Tools</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PDFUploader 
              currentFile={file} 
              onFileSelect={setFile} 
            />
            
            <Button 
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Analyze PDF"}
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 min-h-[600px]">
            {file ? (
              <PDFViewer file={file} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                PDF preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
