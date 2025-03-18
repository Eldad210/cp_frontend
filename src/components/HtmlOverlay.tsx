import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface HtmlOverlayProps {
  children: ReactNode;
  position?: [number, number, number];
  className?: string;
}

/**
 * A component for rendering HTML content in 3D space using Drei's Html component
 */
export function HtmlOverlay({ children, position = [0, 0, 0], className = '' }: HtmlOverlayProps) {
  const ref = useRef<THREE.Group>(null);
  
  // Keep the overlay facing the camera
  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group position={new THREE.Vector3(...position)} ref={ref}>
      <Html transform distanceFactor={10}>
        <div className={`html-overlay ${className}`}>
          {children}
        </div>
      </Html>
    </group>
  );
}
