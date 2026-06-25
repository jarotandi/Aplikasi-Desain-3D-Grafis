"use client";

import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import type { MockupModelConfig } from "@/lib/mockup/mockup-models";

type Transform = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
};

function DesignPlane({ imageUrl, config, transform }: { imageUrl?: string | null; config: MockupModelConfig; transform: Transform }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl || "/reference/template_sosmed_set.jpg");
  const [px, py, pz] = config.designArea.position;
  const [rx, ry, rz] = config.designArea.rotation;
  const [sx, sy, sz] = config.designArea.scale;

  return (
    <mesh
      position={[px + transform.x, py + transform.y, pz]}
      rotation={[rx, ry, rz + (transform.rotate * Math.PI) / 180]}
      scale={[sx * transform.scale, sy * transform.scale, sz]}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent roughness={0.45} metalness={0.05} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  );
}

function ProductPlaceholder({ config, color }: { config: MockupModelConfig; color: string }) {
  if (config.kind === "mug") {
    return (
      <group>
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 1.8, 64, 1, true]} />
          <meshStandardMaterial color={color} roughness={0.38} metalness={0.08} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 0.85, 64]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>
        <mesh position={[0.95, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.45, 0.08, 16, 48, Math.PI * 1.35]} />
          <meshStandardMaterial color={color} roughness={0.38} />
        </mesh>
      </group>
    );
  }

  if (config.kind === "tote") {
    return (
      <group>
        <mesh>
          <boxGeometry args={[1.9, 2.35, 0.22]} />
          <meshStandardMaterial color={color} roughness={0.72} />
        </mesh>
        <mesh position={[-0.45, 1.32, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.38, 0.045, 12, 48, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.72} />
        </mesh>
        <mesh position={[0.45, 1.32, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.38, 0.045, 12, 48, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.72} />
        </mesh>
      </group>
    );
  }

  if (config.kind === "box") {
    return (
      <group rotation={[0, -0.35, 0]}>
        <mesh>
          <boxGeometry args={[2, 1.55, 2]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
      </group>
    );
  }

  if (config.kind === "keychain") {
    return (
      <group>
        <mesh>
          <boxGeometry args={[1.9, 1.2, 0.18]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.48, 0.11]}>
          <torusGeometry args={[0.13, 0.025, 16, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      </group>
    );
  }

  if (config.kind === "trophy") {
    return (
      <group>
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.56, 0.36, 1.05, 48]} />
          <meshStandardMaterial color={color} metalness={0.35} roughness={0.28} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 0.72, 32]} />
          <meshStandardMaterial color={color} metalness={0.35} roughness={0.28} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <boxGeometry args={[1.45, 0.36, 0.72]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.44} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.8, 2.25, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.64} />
      </mesh>
      <mesh position={[-1.12, 0.32, 0]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.58, 1.35, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.64} />
      </mesh>
      <mesh position={[1.12, 0.32, 0]} rotation={[0, 0, 0.32]}>
        <boxGeometry args={[0.58, 1.35, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.64} />
      </mesh>
      <mesh position={[0, 1.06, 0.02]}>
        <torusGeometry args={[0.34, 0.035, 16, 40, Math.PI]} />
        <meshStandardMaterial color="#eef2f7" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Scene({ config, productColor, designImage, transform }: { config: MockupModelConfig; productColor: string; designImage?: string | null; transform: Transform }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 3]} intensity={2.8} castShadow />
      <spotLight position={[-3, 4, 5]} angle={0.32} penumbra={0.6} intensity={2.2} />
      <hemisphereLight args={["#ffffff", "#dbeafe", 1.1]} />
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.08}>
        <ProductPlaceholder config={config} color={productColor} />
        <DesignPlane imageUrl={designImage} config={config} transform={transform} />
      </Float>
      <ContactShadows position={[0, -1.42, 0]} opacity={0.28} scale={6} blur={2.8} />
      <OrbitControls makeDefault enablePan={false} minDistance={3.2} maxDistance={7} />
    </>
  );
}

export function MockupViewer3D({
  config,
  productColor,
  designImage,
  transform
}: {
  config: MockupModelConfig;
  productColor: string;
  designImage?: string | null;
  transform: Transform;
}) {
  return (
    <Canvas shadows camera={{ position: [0, 0.6, 4.7], fov: 42 }} gl={{ preserveDrawingBuffer: true, antialias: true }} className="rounded-[2rem]">
      <color attach="background" args={["#f8fafc"]} />
      <Suspense fallback={null}>
        <Scene config={config} productColor={productColor} designImage={designImage} transform={transform} />
      </Suspense>
    </Canvas>
  );
}
