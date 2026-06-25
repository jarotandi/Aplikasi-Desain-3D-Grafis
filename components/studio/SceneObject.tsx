"use client";

import { Edges, Text, useGLTF, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import type { StudioObject } from "@/lib/types/studio";
import { useStudioStore } from "@/lib/store/studioStore";
import { TransformController } from "@/components/studio/TransformController";

interface SceneObjectProps {
  object: StudioObject;
}

function ImportedModel({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  return <primitive object={scene} />;
}

function DecalPlane({ object }: { object: StudioObject }) {
  const texture = useTexture(object.decalImageUrl ?? object.material.textureDataUrl ?? "");
  return (
    <mesh>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial map={texture} transparent opacity={object.material.opacity} />
    </mesh>
  );
}

function ObjectMaterial({ object }: { object: StudioObject }) {
  if (object.material.textureDataUrl) {
    return <TexturedObjectMaterial object={object} textureUrl={object.material.textureDataUrl} />;
  }

  return (
    <meshStandardMaterial
      color={object.material.color}
      roughness={object.material.roughness}
      metalness={object.material.metalness}
      opacity={object.material.opacity}
      transparent={object.material.opacity < 1}
    />
  );
}

function TexturedObjectMaterial({ object, textureUrl }: { object: StudioObject; textureUrl: string }) {
  const texture = useTexture(textureUrl);

  return (
    <meshStandardMaterial
      color={object.material.color}
      map={texture}
      roughness={object.material.roughness}
      metalness={object.material.metalness}
      opacity={object.material.opacity}
      transparent={object.material.opacity < 1}
    />
  );
}

function MugHandle({ object }: { object: StudioObject }) {
  if (object.productMockupType !== "mug") return null;

  return (
    <mesh position={[0.78, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <torusGeometry args={[0.32, 0.06, 18, 48, Math.PI]} />
      <meshStandardMaterial color={object.material.color} roughness={object.material.roughness} metalness={object.material.metalness} />
    </mesh>
  );
}

function PrimitiveGeometry({ object }: { object: StudioObject }) {
  switch (object.type) {
    case "sphere":
      return <sphereGeometry args={[0.75, 48, 32]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.65, 0.65, 1.4, 48]} />;
    case "plane":
      return <boxGeometry args={[2, 0.04, 2]} />;
    case "cone":
      return <coneGeometry args={[0.75, 1.45, 48]} />;
    case "torus":
      return <torusGeometry args={[0.65, 0.22, 32, 96]} />;
    case "text":
      return <boxGeometry args={[1.8, 0.08, 0.6]} />;
    default:
      return <boxGeometry args={[1, 1, 1]} />;
  }
}

export function SceneObject({ object }: SceneObjectProps) {
  const groupRef = useRef<Group>(null);
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);
  const selectedObjectIds = useStudioStore((state) => state.selectedObjectIds);
  const selectObject = useStudioStore((state) => state.selectObject);
  const isSelected = selectedObjectIds.includes(object.id) || selectedObjectId === object.id;

  if (!object.visible) return null;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectObject(object.id, event.ctrlKey || event.metaKey || event.shiftKey);
  };

  return (
    <TransformController objectId={object.id} groupRef={groupRef}>
      <group
        ref={groupRef}
        name={object.name}
        position={object.transform.position}
        rotation={object.transform.rotation}
        scale={object.transform.scale}
        onClick={handleClick}
        userData={{ studioObjectId: object.id }}
      >
        {object.type === "model" && object.modelDataUrl ? (
          <Suspense fallback={null}>
            <ImportedModel url={object.modelDataUrl} />
          </Suspense>
        ) : object.type === "decal" ? (
          <Suspense fallback={null}>
            <DecalPlane object={object} />
          </Suspense>
        ) : (
          <mesh castShadow receiveShadow>
            <PrimitiveGeometry object={object} />
            <ObjectMaterial object={object} />
            {isSelected ? <Edges color="#facc15" threshold={15} /> : null}
          </mesh>
        )}

        <MugHandle object={object} />

        {object.type === "text" || object.productMockupType ? (
          <Text position={[0, 0.58, 0]} fontSize={0.16} color="#e5e7eb" anchorX="center" anchorY="middle">
            {object.productMockupType ?? "3D Text"}
          </Text>
        ) : null}
      </group>
    </TransformController>
  );
}
