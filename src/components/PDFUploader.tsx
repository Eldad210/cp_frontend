import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { validatePDFFile } from "@/lib/pdf-utils";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

interface PDFUploaderProps {
  currentFile: File | null;
  onFileSelect: (file: File | null) => void;
}

const PDFUploader = ({ currentFile, onFileSelect }: PDFUploaderProps) => {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (validatePDFFile(file)) {
      onFileSelect(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a valid PDF file under 10MB",
        variant: "destructive",
      });
    }
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          currentFile && "border-green-500 bg-green-50"
        )}
      >
        <input {...getInputProps()} />
        {currentFile ? (
          <div className="flex items-center justify-between">
            <span className="text-green-700">{currentFile.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-700">
              {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
            </p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploader;