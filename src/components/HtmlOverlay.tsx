import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HtmlOverlayProps {
  children: ReactNode;
  position?: [number, number, number];
  className?: string;
}

/**
 * A component for rendering HTML content in 3D space using CSS3DRenderer
 * This is a proper way to render HTML in a Three.js scene
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
      <mesh visible={false}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <Html>
        <div className={`html-overlay ${className}`}>
          {children}
        </div>
      </Html>
    </group>
  );
}

// This is a special component that allows HTML content in a Three.js scene
// It uses the "annotation" pattern from react-three-fiber
const Html: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate3d(-50%, -50%, 0)',
        textAlign: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};
