import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Points({ count = 1500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  });

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.04;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#CCFF00"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatingSphere({
  position,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.4;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.4;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#CCFF00"
        wireframe
        emissive="#CCFF00"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

export function ParticleField({
  className = "",
  withSpheres = true,
}: {
  className?: string;
  withSpheres?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className={`absolute inset-0 -z-10 pointer-events-none ${className}`}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#CCFF00" />
        <Suspense fallback={null}>
          <Points />
          {withSpheres && (
            <>
              <FloatingSphere position={[-3.5, 1, -2]} scale={0.6} speed={0.6} />
              <FloatingSphere position={[3.5, -1, -1]} scale={0.9} speed={0.4} />
              <FloatingSphere position={[0, 2, -3]} scale={0.4} speed={0.8} />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
