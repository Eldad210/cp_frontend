import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { Loader2, Axis3d } from 'lucide-react';
import * as THREE from 'three';
import { HtmlOverlay } from './HtmlOverlay';

interface AutodeskViewerProps {
  file: File;
  results?: any[];
}

// IFC Viewer Component that loads and displays the IFC model
function IFCModel({ file }: { file: File }) {
  const { scene } = useThree();
  const modelRef = useRef<THREE.Object3D>();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<IFCLoader | null>(null);

  useEffect(() => {
    // Initialize the loader only once
    if (!loaderRef.current) {
      console.log("Initializing IFCLoader...");
      loaderRef.current = new IFCLoader();
      
      // Make sure we're using the correct web-ifc version
      // The latest version might not work correctly; use a specific working version
      loaderRef.current.ifcManager.setWasmPath('https://unpkg.com/web-ifc@0.0.36/');
      
      // Set up progress tracking
      loaderRef.current.ifcManager.setOnProgress((event) => {
        const progress = Math.floor((event.loaded / event.total) * 100);
        setLoadingProgress(progress);
      });
    }
    
    // Clean up previous model if it exists
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = undefined;
    }
    
    // Create a URL for the file
    const url = URL.createObjectURL(file);
    
    // Show a debug cube while we're loading
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    modelRef.current = cube;
    
    // Load the IFC file
    if (loaderRef.current) {
      console.log("Loading IFC file:", file.name);
      
      try {
        loaderRef.current.load(
          url,
          (ifcModel) => {
            console.log("IFC model loaded successfully");
            
            // Remove the placeholder cube
            if (modelRef.current) {
              scene.remove(modelRef.current);
            }
            
            // Add the new model to the scene
            scene.add(ifcModel);
            modelRef.current = ifcModel;
            
            // Center the model in view
            const box = new THREE.Box3().setFromObject(ifcModel);
            const center = box.getCenter(new THREE.Vector3());
            
            // Adjust model position to center
            ifcModel.position.x = -center.x;
            ifcModel.position.y = -center.y;
            ifcModel.position.z = -center.z;
            
            setLoadingProgress(100);
          },
          (event) => {
            // Additional progress callback for debugging
            console.log(`Loading progress: ${Math.floor((event.loaded / event.total) * 100)}%`);
          },
          (error) => {
            console.error('Error loading IFC file:', error);
            setError('Failed to load IFC file. Please check the file format.');
          }
        );
      } catch (error) {
        console.error('Exception during IFC loading:', error);
        setError('Exception occurred while loading IFC file');
      }
    }
    
    return () => {
      URL.revokeObjectURL(url);
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }
    };
  }, [file, scene]);

  if (error) {
    return (
      <>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" wireframe />
        </mesh>
        <HtmlOverlay position={[0, 2, 0]} className="bg-white p-2 rounded shadow">
          <span className="text-red-500 text-xs font-medium">{error}</span>
        </HtmlOverlay>
      </>
    );
  }

  return loadingProgress < 100 ? (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" wireframe />
    </mesh>
  ) : null;
}

// Proper error message component that works with Three.js
function ErrorMessage({ message }: { message: string }) {
  return (
    <sprite>
      <spriteMaterial transparent opacity={0} />
      <group position={[0, 0, 0]}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '8px',
            borderRadius: '4px',
            color: 'red',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            userSelect: 'none',
          }}
        >
          {message}
        </div>
      </group>
    </sprite>
  );
}

// Scene setup component
function Scene({ file }: { file: File }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05} 
        minDistance={1} 
        maxDistance={100} 
      />
      <Grid 
        infiniteGrid 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#6f6f6f" 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor="#9d4b4b" 
        fadeDistance={50} 
        fadeStrength={1.5} 
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <IFCModel file={file} />
      </Suspense>
    </>
  );
}

export function AutodeskViewer({ file }: AutodeskViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set loading to false after a short delay to allow the component to mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [file]);
  
  return (
    <div className="relative w-full h-[600px]">
      <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
        <Canvas shadows>
          <Scene file={file} />
        </Canvas>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-700">Loading viewer...</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 left-4 bg-white/80 p-2 rounded z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Axis3d className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium">IFC Viewer</p>
            <p className="text-xs text-gray-500">File: {file.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
