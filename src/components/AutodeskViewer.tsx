
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AutodeskViewerProps {
  file: File;
  results?: any[];
}

export function AutodeskViewer({ file }: AutodeskViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerError, setViewerError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Load the Autodesk Viewer scripts
    const script1 = document.createElement('script');
    script1.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js';
    script1.onload = loadViewer;
    document.head.appendChild(script1);
    
    // Load the CSS file properly using a link element instead of a script
    const link = document.createElement('link');
    link.href = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    let viewer: any = null;
    
    function loadViewer() {
      if (!window.Autodesk) {
        setViewerError('Failed to load Autodesk Viewer SDK');
        setIsLoading(false);
        return;
      }
      
      const options = {
        env: 'Local',
        getAccessToken: () => ({ accessToken: '', expires_in: 3600 }),
      };
      
      // Initialize the viewer
      const Autodesk = (window as any).Autodesk;
      Autodesk.Viewing.Initializer(options, () => {
        viewer = new Autodesk.Viewing.GuiViewer3D(containerRef.current);
        const startedCode = viewer.start();
        if (startedCode > 0) {
          console.error('Failed to start the viewer');
          setViewerError('Failed to initialize the viewer');
          setIsLoading(false);
          return;
        }
        
        // Load a default model or display a message
        // Since we don't have an actual URN from Autodesk's Model Derivative API
        // we'll just show a placeholder or demo model
        viewer.loadExtension('Autodesk.DefaultTools.NavTools');
        
        // For demo purposes, we're loading a local test model
        // In a real app, you would upload the file to Autodesk's servers and get a URN
        try {
          // Set up demo environment
          viewer.setLightPreset(0);
          viewer.setEnvMapBackground(true);
          viewer.impl.setGroundShadow(true);
          viewer.impl.setGroundReflection(false);

          // Create a simple geometry to demonstrate the viewer works
          const scene = viewer.impl.scene;
          
          // Create a simple box geometry
          const boxGeometry = new Autodesk.Viewing.Private.THREE.BoxGeometry(10, 10, 10);
          const material = new Autodesk.Viewing.Private.THREE.MeshPhongMaterial({ 
            color: 0x3b82f6,
            wireframe: true
          });
          const cube = new Autodesk.Viewing.Private.THREE.Mesh(boxGeometry, material);
          scene.add(cube);
          
          // Add a grid
          const grid = new Autodesk.Viewing.Private.THREE.GridHelper(50, 50);
          scene.add(grid);
          
          // Create text to show the filename
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.width = 512;
            canvas.height = 128;
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = '24px Arial';
            context.fillStyle = '#000000';
            context.textAlign = 'center';
            context.fillText(`File: ${file.name}`, canvas.width / 2, canvas.height / 2);
            
            const texture = new Autodesk.Viewing.Private.THREE.CanvasTexture(canvas);
            const textMaterial = new Autodesk.Viewing.Private.THREE.MeshBasicMaterial({ 
              map: texture, 
              transparent: true,
              side: Autodesk.Viewing.Private.THREE.DoubleSide
            });
            const textGeometry = new Autodesk.Viewing.Private.THREE.PlaneGeometry(20, 5);
            const textMesh = new Autodesk.Viewing.Private.THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.y = 15;
            scene.add(textMesh);
          }
          
          viewer.impl.invalidate(true, true, true);
          setIsLoading(false);
        } catch (error) {
          console.error('Error setting up demo scene:', error);
          setViewerError('Error setting up the 3D scene');
          setIsLoading(false);
        }
      });
    }
    
    return () => {
      if (viewer) {
        viewer.finish();
      }
      document.head.removeChild(script1);
      document.head.removeChild(link);
    };
  }, [file]);
  
  return (
    <div className="relative w-full h-[600px]">
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gray-100 rounded-lg"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-700">Loading viewer...</p>
          </div>
        </div>
      )}
      
      {viewerError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <h3 className="text-red-800 font-medium mb-2">Viewer Error</h3>
            <p className="text-red-700">{viewerError}</p>
            <p className="text-sm text-red-600 mt-2">
              Note: To use the full Autodesk Viewer, you need to set up authentication and
              use the Model Derivative API to convert and load your models.
            </p>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 left-4 bg-white/80 p-2 rounded z-10">
        <p className="text-sm">Autodesk Viewer</p>
        <p className="text-xs text-gray-500">File: {file.name}</p>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded text-xs text-gray-500">
        Note: This is a demo implementation. For production use, you need to integrate with Autodesk's APIs.
      </div>
    </div>
  );
}
