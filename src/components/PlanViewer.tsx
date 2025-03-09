
import { useRef, useEffect, useState } from 'react';
import { AnalysisResult } from '@/types';
import { IFCViewer } from './IFCViewer';

interface PlanViewerProps {
  file: File;
  results: AnalysisResult[];
}

export function PlanViewer({ file, results }: PlanViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const isIFCFile = file.name.toLowerCase().endsWith('.ifc');

  useEffect(() => {
    if (isIFCFile) return; // Skip for IFC files
    
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      setImage(img);
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, isIFCFile]);

  useEffect(() => {
    if (isIFCFile || !canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image dimensions
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image
    ctx.drawImage(image, 0, 0);

    // Draw analysis results
    results.forEach((result, index) => {
      // Calculate mock positions for demonstration
      const x = (index + 1) * 100;
      const y = (index + 1) * 100;

      // Draw marker
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = result.severity === 'error' ? 'rgba(239, 68, 68, 0.2)' : 
                     result.severity === 'warning' ? 'rgba(245, 158, 11, 0.2)' :
                     'rgba(59, 130, 246, 0.2)';
      ctx.fill();
      ctx.strokeStyle = result.severity === 'error' ? '#ef4444' : 
                       result.severity === 'warning' ? '#f59e0b' :
                       '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw issue number
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), x, y);
    });
  }, [image, results, isIFCFile]);

  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta * 0.1)));
  };

  if (isIFCFile) {
    return <IFCViewer file={file} />;
  }

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute top-4 right-4 space-x-2 z-10">
        <button
          onClick={() => handleZoom(1)}
          className="bg-white p-2 rounded-md shadow hover:bg-gray-50"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="bg-white p-2 rounded-md shadow hover:bg-gray-50"
        >
          -
        </button>
      </div>
      <div className="overflow-auto p-4" style={{ maxHeight: '600px' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
