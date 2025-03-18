
import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { Loader2, Axis3d } from 'lucide-react';
import * as THREE from 'three';
import { HtmlOverlay } from './HtmlOverlay';
import { IfcAPI } from 'web-ifc';

interface AutodeskViewerProps {
  file: File;
  results?: any[];
}

function IFCModel({ file }: { file: File }) {
  const { scene } = useThree();
  const modelRef = useRef<THREE.Object3D>();
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<IFCLoader | null>(null);
  const ifcAPI = useRef<IfcAPI | null>(null);

  useEffect(() => {
    // Initialize the IFC API first
    if (!ifcAPI.current) {
      console.log("Initializing IfcAPI...");
      ifcAPI.current = new IfcAPI();
      ifcAPI.current.SetWasmPath('https://unpkg.com/web-ifc@0.0.36/');
      
      // Load the WebAssembly module
      ifcAPI.current.Init().then(() => {
        console.log("IfcAPI initialized successfully");
        
        // Once the IfcAPI is initialized, create the IFCLoader
        if (!loaderRef.current) {
          console.log("Creating IFCLoader...");
          loaderRef.current = new IFCLoader();
          
          // Set the WASM path for the IFCLoader
          loaderRef.current.ifcManager.setWasmPath(
            'https://unpkg.com/web-ifc@0.0.36/'
          );
          
          // Debug the IFCLoader manager
          console.log("IFCLoader manager created:", loaderRef.current.ifcManager);
          
          // Setup BVH after initialization
          loaderRef.current.ifcManager.setupThreeMeshBVH(
            (progress) => {
              // Ensure progress is a number between 0 and 1
              const normalizedProgress = typeof progress === 'number' ? progress : 0;
              console.log('BVH progress:', normalizedProgress);
              setLoadingProgress((prev) => {
                const newProgress = Math.floor(normalizedProgress * 50);
                console.log(`Setting BVH progress: ${newProgress}%`);
                return newProgress;
              });
            },
            () => {
              console.log('BVH setup complete, setting progress to 50%');
              setLoadingProgress(50);
              loadIFCFile();
            },
            {} // Empty settings object as the third parameter
          );
          
          // Set the progress callback manually
          loaderRef.current.ifcManager.setOnProgress((event) => {
            if (!event || typeof event.loaded !== 'number' || typeof event.total !== 'number') {
              console.warn('Invalid progress event:', event);
              return;
            }
            
            if (event.total <= 0) {
              console.warn('Invalid total in progress event:', event.total);
              return;
            }
            
            const fileProgress = Math.floor((event.loaded / event.total) * 100);
            console.log(`IFC loading progress: ${fileProgress}% (${event.loaded}/${event.total})`);
            
            // Map file progress (0-100) to overall progress (50-100)
            const newProgress = 50 + Math.floor(fileProgress * 0.5);
            console.log(`Setting overall progress: ${newProgress}%`);
            setLoadingProgress(newProgress);
          });
        } else {
          loadIFCFile();
        }
      }).catch(err => {
        console.error("Error initializing IfcAPI:", err);
        setError("Failed to initialize IFC API. Please try again.");
      });
    }
    
    // Function to load the IFC file
    const loadIFCFile = () => {
      if (!loaderRef.current) {
        setError("IFC loader not initialized");
        return;
      }
      
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = undefined;
      }
      
      const url = URL.createObjectURL(file);
      console.log("Created URL for file:", url);
      
      // Add a placeholder while loading
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6,
        wireframe: true,
      });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      modelRef.current = cube;
      
      console.log("Loading IFC file:", file.name, "size:", file.size, "bytes");
      
      try {
        // Monitor loading progress explicitly
        const onProgress = (event) => {
          if (!event || typeof event.loaded !== 'number' || typeof event.total !== 'number') {
            console.warn('Invalid direct progress event:', event);
            return;
          }
          
          if (event.total <= 0) {
            console.warn('Invalid total in direct progress event:', event.total);
            return;
          }
          
          const fileProgress = Math.floor((event.loaded / event.total) * 100);
          console.log(`Direct loading progress: ${fileProgress}% (${event.loaded}/${event.total})`);
          
          // Map file progress (0-100) to overall progress (50-100)
          const newProgress = 50 + Math.floor(fileProgress * 0.5);
          console.log(`Setting direct progress: ${newProgress}%`);
          setLoadingProgress(newProgress);
        };
        
        // Load the IFC file with progress tracking
        loaderRef.current.load(
          url,
          (ifcModel) => {
            console.log("IFC model loaded successfully");
            
            if (modelRef.current) {
              scene.remove(modelRef.current);
            }
            
            scene.add(ifcModel);
            modelRef.current = ifcModel;
            
            const box = new THREE.Box3().setFromObject(ifcModel);
            const center = box.getCenter(new THREE.Vector3());
            
            ifcModel.position.x = -center.x;
            ifcModel.position.y = -center.y;
            ifcModel.position.z = -center.z;
            
            console.log("Setting final progress to 100%");
            setLoadingProgress(100);
          },
          onProgress,
          (error) => {
            console.error('Error loading IFC file:', error);
            setError('Failed to load IFC file. Please check the file format.');
          }
        );
      } catch (error) {
        console.error('Exception during IFC loading:', error);
        setError('Exception occurred while loading IFC file');
      }
    };
    
    return () => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }
    };
  }, [file, scene]);

  console.log("Current loading progress:", loadingProgress);

  // Improved loading indicator with percentage
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
    <>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" wireframe />
      </mesh>
      <HtmlOverlay position={[0, 2, 0]} className="bg-white p-2 rounded shadow">
        <div className="flex flex-col items-center">
          <span className="text-blue-500 text-xs font-medium mb-1">Loading: {loadingProgress}%</span>
          <div className="w-24 bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      </HtmlOverlay>
    </>
  ) : null;
}

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
