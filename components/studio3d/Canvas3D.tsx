"use client";

import { Bounds, GizmoHelper, GizmoViewport, Grid, Html, OrbitControls, PerspectiveCamera, Text, TransformControls, useGLTF } from "@react-three/drei";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { createGeometry } from "@/lib/three/geometryUtils";
import { exportGLB, exportOBJ, exportProjectJSON, exportSTL } from "@/lib/three/exporters";
import { useStudio3DStore } from "@/store/studio3dStore";
import type { SceneObject } from "@/types/studio3d";

function StudioObjectMesh({ object }: { object: SceneObject }) {
  const ref = useRef<Group>(null);
  const selectedObjectIds = useStudio3DStore((state) => state.selectedObjectIds);
  const transformMode = useStudio3DStore((state) => state.transformMode);
  const materials = useStudio3DStore((state) => state.materials);
  const selectObject = useStudio3DStore((state) => state.selectObject);
  const updateObject = useStudio3DStore((state) => state.updateObject);
  const [target, setTarget] = useState<Group | null>(null);
  const isSelected = selectedObjectIds.includes(object.id);
  const material = materials.find((item) => item.id === object.materialId) ?? materials[0];

  useEffect(() => setTarget(ref.current), []);

  const geometry = useMemo(() => createGeometry(object.geometryType, object.dimensions), [object.geometryType, object.dimensions]);

  if (!object.isVisible) return null;

  const commitTransform = () => {
    const group = ref.current;
    if (!group || object.isLocked) return;
    updateObject(object.id, {
      position: { x: Number(group.position.x.toFixed(3)), y: Number(group.position.y.toFixed(3)), z: Number(group.position.z.toFixed(3)) },
      rotation: { x: Number(group.rotation.x.toFixed(3)), y: Number(group.rotation.y.toFixed(3)), z: Number(group.rotation.z.toFixed(3)) },
      scale: { x: Number(group.scale.x.toFixed(3)), y: Number(group.scale.y.toFixed(3)), z: Number(group.scale.z.toFixed(3)) }
    });
  };

  const importedUrl = typeof object.metadata.importDataUrl === "string" && object.metadata.importType === "glb" ? object.metadata.importDataUrl : undefined;

  const content = (
    <group
      ref={ref}
      name={object.name}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        selectObject(object.id, event.ctrlKey || event.metaKey || event.shiftKey);
      }}
      userData={{ studioObjectId: object.id }}
    >
      {importedUrl ? <ImportedModel url={importedUrl} /> : (
        <mesh castShadow receiveShadow geometry={geometry}>
          <meshStandardMaterial color={material.color} roughness={material.roughness} metalness={material.metalness} opacity={material.opacity} transparent={material.opacity < 1} side={THREE.DoubleSide} />
          {isSelected ? <lineSegments>
            <edgesGeometry args={[geometry]} />
            <lineBasicMaterial color="#22d3ee" />
          </lineSegments> : null}
        </mesh>
      )}
      {object.geometryType === "text3d" ? <Text position={[0, object.dimensions.height / 2 + 0.05, 0]} fontSize={0.2} color="#f8fafc">{object.name}</Text> : null}
      {isSelected ? (
        <Html position={[0, object.dimensions.height / 2 + 0.25, 0]} center>
          <div className="whitespace-nowrap rounded border border-cyan-400/40 bg-zinc-950/90 px-2 py-1 text-[10px] font-medium text-cyan-100 shadow">
            W {object.dimensions.width.toFixed(2)} / H {object.dimensions.height.toFixed(2)} / D {object.dimensions.depth.toFixed(2)}
          </div>
        </Html>
      ) : null}
    </group>
  );

  return (
    <>
      {content}
      {isSelected && target && !object.isLocked ? <TransformControls object={target} mode={transformMode} onMouseUp={commitTransform} /> : null}
    </>
  );
}

function ImportedModel({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  return <primitive object={scene} />;
}

function SceneEventBridge({ rootRef, controlsRef }: { rootRef: React.RefObject<Group | null>; controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const exportProject = useStudio3DStore((state) => state.exportProject);

  useEffect(() => {
    const setView = (position: [number, number, number], target: [number, number, number] = [0, 0.8, 0]) => {
      camera.position.set(...position);
      camera.lookAt(...target);
      if (controlsRef.current) {
        controlsRef.current.target.set(...target);
        controlsRef.current.update();
      }
    };
    const capture = () => window.dispatchEvent(new CustomEvent("studio3d:png-ready", { detail: { url: gl.domElement.toDataURL("image/png") } }));
    const glb = () => rootRef.current && exportGLB(rootRef.current);
    const stl = () => rootRef.current && exportSTL(rootRef.current);
    const obj = () => rootRef.current && exportOBJ(rootRef.current);
    const json = () => exportProjectJSON(exportProject());
    const top = () => setView([0, 8, 0.01], [0, 0, 0]);
    const front = () => setView([0, 1.8, 7]);
    const right = () => setView([7, 1.8, 0]);
    const left = () => setView([-7, 1.8, 0]);
    const perspective = () => setView([5, 4, 6]);
    window.addEventListener("studio3d:export-png", capture);
    window.addEventListener("studio3d:export-glb", glb);
    window.addEventListener("studio3d:export-stl", stl);
    window.addEventListener("studio3d:export-obj", obj);
    window.addEventListener("studio3d:export-json", json);
    window.addEventListener("studio3d:view-top", top);
    window.addEventListener("studio3d:view-front", front);
    window.addEventListener("studio3d:view-right", right);
    window.addEventListener("studio3d:view-left", left);
    window.addEventListener("studio3d:view-perspective", perspective);
    return () => {
      window.removeEventListener("studio3d:export-png", capture);
      window.removeEventListener("studio3d:export-glb", glb);
      window.removeEventListener("studio3d:export-stl", stl);
      window.removeEventListener("studio3d:export-obj", obj);
      window.removeEventListener("studio3d:export-json", json);
      window.removeEventListener("studio3d:view-top", top);
      window.removeEventListener("studio3d:view-front", front);
      window.removeEventListener("studio3d:view-right", right);
      window.removeEventListener("studio3d:view-left", left);
      window.removeEventListener("studio3d:view-perspective", perspective);
    };
  }, [camera, controlsRef, exportProject, gl.domElement, rootRef]);

  return null;
}

function SceneContent() {
  const rootRef = useRef<Group>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const sceneObjects = useStudio3DStore((state) => state.sceneObjects);
  const clearSelection = useStudio3DStore((state) => state.clearSelection);
  const gridSize = useStudio3DStore((state) => state.gridSize);

  return (
    <>
      <color attach="background" args={["#111318"]} />
      <PerspectiveCamera makeDefault position={[5, 4, 6]} fov={45} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 7, 4]} intensity={1.45} castShadow />
      <Grid args={[80, 80]} cellSize={gridSize} sectionSize={gridSize * 5} fadeDistance={45} infiniteGrid />
      <Bounds fit clip observe margin={1.25}>
        <group ref={rootRef} name="Studio3D Scene">
          {sceneObjects.map((object) => <StudioObjectMesh key={object.id} object={object} />)}
        </group>
      </Bounds>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]} onClick={() => clearSelection()} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#18181b" transparent opacity={0.18} />
      </mesh>
      <OrbitControls ref={controlsRef} makeDefault enablePan enableZoom enableRotate enableDamping dampingFactor={0.08} />
      <GizmoHelper alignment="bottom-right" margin={[72, 72]}>
        <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="#f8fafc" />
      </GizmoHelper>
      <SceneEventBridge rootRef={rootRef} controlsRef={controlsRef} />
    </>
  );
}

export function Canvas3D() {
  return (
    <div className="relative h-full min-h-0 bg-[#111318]">
      <Canvas shadows gl={{ preserveDrawingBuffer: true, antialias: true }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
