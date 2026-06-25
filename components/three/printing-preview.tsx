"use client";

import { ContactShadows, Float, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { ThreeDPrintingConfig } from "@/lib/three-d-printing/types";

function ProductGeometry({ config }: { config: ThreeDPrintingConfig }) {
  const color = config.color;
  const sx = Math.max(config.widthMm / 90, 0.45);
  const sy = Math.max(config.heightMm / 70, 0.35);
  const sz = Math.max(config.thicknessMm / 8, 0.12);

  if (config.productType === "keychain") {
    return (
      <group>
        <mesh>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial color={color} roughness={0.45} />
        </mesh>
        <mesh position={[0, sy / 2 - 0.12, sz / 2 + 0.015]}>
          <torusGeometry args={[Math.max(config.holeDiameterMm / 34, 0.08), 0.018, 16, 36]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} />
        </mesh>
      </group>
    );
  }

  if (config.productType === "logo_stand" || config.productType === "name_plate") {
    return (
      <group>
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[sx * 1.05, 0.22, 0.55]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.05, 0.08]}>
          <boxGeometry args={[sx, sy * 0.55, sz]} />
          <meshStandardMaterial color={color} roughness={0.42} />
        </mesh>
      </group>
    );
  }

  if (config.productType === "trophy") {
    return (
      <group>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.45, 0.28, 1.05, 48]} />
          <meshStandardMaterial color={color} metalness={0.28} roughness={0.24} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.14, 0.22, 0.65, 32]} />
          <meshStandardMaterial color={color} metalness={0.28} roughness={0.24} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <boxGeometry args={[1.25, 0.34, 0.72]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.38} />
        </mesh>
      </group>
    );
  }

  if (config.productType === "plaque") {
    return (
      <mesh rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[sx, sy, sz]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    );
  }

  if (config.productType === "phone_stand") {
    return (
      <group rotation={[0.25, 0, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[sx * 0.8, 0.18, 1.15]} />
          <meshStandardMaterial color={color} roughness={0.44} />
        </mesh>
        <mesh position={[0, 0.18, -0.35]} rotation={[-0.85, 0, 0]}>
          <boxGeometry args={[sx * 0.8, 0.15, 1.25]} />
          <meshStandardMaterial color={color} roughness={0.44} />
        </mesh>
        <mesh position={[0, -0.52, 0.48]}>
          <boxGeometry args={[sx * 0.86, 0.18, 0.18]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.44} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh>
        <boxGeometry args={[sx, sy * 0.72, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.48} />
      </mesh>
      {[-0.42, 0, 0.42].map((x) => (
        <mesh key={x} position={[x, 0, 0.38]}>
          <boxGeometry args={[0.24, sy * 0.62, 0.52]} />
          <meshStandardMaterial color={color} roughness={0.48} />
        </mesh>
      ))}
    </group>
  );
}

function TextPlaceholder({ text }: { text: string }) {
  const bars = text.slice(0, 8).split("");
  return (
    <group position={[-0.42, 0.08, 0.25]}>
      {bars.map((char, index) => (
        <group key={`${char}-${index}`} position={[index * 0.12, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.055, 0.24, 0.035]} />
            <meshStandardMaterial color="#ffffff" roughness={0.35} />
          </mesh>
          <mesh position={[0.03, char.charCodeAt(0) % 2 ? 0.06 : -0.06, 0]}>
            <boxGeometry args={[0.055, 0.055, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scene({ config }: { config: ThreeDPrintingConfig }) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#ffffff", "#dbeafe", 1.1]} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <spotLight position={[-3, 4, 4]} intensity={2.2} angle={0.35} penumbra={0.5} />
      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.08}>
        <ProductGeometry config={config} />
        <TextPlaceholder text={config.text} />
      </Float>
      <ContactShadows position={[0, -0.88, 0]} opacity={0.26} scale={5} blur={2.8} />
      <OrbitControls makeDefault enablePan={false} minDistance={2.8} maxDistance={6} />
    </>
  );
}

export function PrintingPreview({ config }: { config: ThreeDPrintingConfig }) {
  return (
    <Canvas shadows camera={{ position: [0, 0.8, 4.2], fov: 42 }} gl={{ antialias: true, preserveDrawingBuffer: true }} className="rounded-[2rem]">
      <color attach="background" args={["#f8fafc"]} />
      <Scene config={config} />
    </Canvas>
  );
}
