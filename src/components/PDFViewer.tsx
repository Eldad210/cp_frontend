import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useToast } from "@/components/ui/use-toast";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set worker URL
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
}

const PDFViewer = ({ file }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { toast } = useToast();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = () => {
    toast({
      title: "Error",
      description: "Failed to load PDF. Please try another file.",
      variant: "destructive",
    });
  };

  return (
    <div className="h-full flex flex-col items-center">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="max-h-[500px] overflow-auto"
      >
        <Page 
          pageNumber={pageNumber} 
          className="max-w-full"
          scale={1.0}
        />
      </Document>
      {numPages && (
        <p className="mt-4 text-sm text-gray-600">
          Page {pageNumber} of {numPages}
        </p>
      )}
    </div>
  );
};

export default PDFViewer;