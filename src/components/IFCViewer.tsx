
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface IFCViewerProps {
  file: File;
}

export function IFCViewer({ file }: IFCViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 3, 2);
    scene.add(directionalLight);
    
    // Add camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Add renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Add a placeholder cube to represent IFC content
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Add grid
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    
    // Display file name as text
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
      context.fillText(`IFC File: ${file.name}`, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const textGeometry = new THREE.PlaneGeometry(4, 1);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.y = 2;
      scene.add(textMesh);
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [file]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-[600px] bg-gray-100 rounded-lg"
    >
      <div className="absolute top-4 left-4 bg-white/80 p-2 rounded z-10">
        <p className="text-sm">IFC Viewer (Preview Mode)</p>
        <p className="text-xs text-gray-500">File: {file.name}</p>
      </div>
    </div>
  );
}
