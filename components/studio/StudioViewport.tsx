"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Bounds, Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Box3, Vector3 } from "three";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { SceneObject } from "@/components/studio/SceneObject";
import { useStudioStore } from "@/lib/store/studioStore";
import { exportObjectAsGLB } from "@/lib/three/exportGLB";
import { captureCanvasScreenshot } from "@/lib/three/screenshot";

interface ViewportEventsProps {
  rootRef: React.RefObject<Group | null>;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

function ViewportEvents({ rootRef, controlsRef }: ViewportEventsProps) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);

  useEffect(() => {
    const setCameraView = (position: [number, number, number], target: [number, number, number] = [0, 0.8, 0]) => {
      camera.position.set(...position);
      camera.lookAt(...target);
      if (controlsRef.current) {
        controlsRef.current.target.set(...target);
        controlsRef.current.update();
      }
    };

    const exportHandler = () => {
      if (rootRef.current) exportObjectAsGLB(rootRef.current);
    };
    const screenshotHandler = () => {
      const url = captureCanvasScreenshot(gl.domElement);
      window.dispatchEvent(new CustomEvent("studio:render-preview-ready", { detail: { url } }));
    };
    const zoomSelectedHandler = () => {
      const root = rootRef.current;
      if (!root || !selectedObjectId) return;
      const selected = root.children.find((child) => child.userData.studioObjectId === selectedObjectId);
      if (!selected) return;

      const bounds = new Box3().setFromObject(selected);
      const center = bounds.getCenter(new Vector3());
      const size = bounds.getSize(new Vector3()).length();
      const distance = Math.max(size * 1.6, 2.5);
      setCameraView([center.x + distance, center.y + distance * 0.65, center.z + distance], [center.x, center.y, center.z]);
    };
    const resetHandler = () => setCameraView([4.8, 3.8, 5.4]);
    const frontHandler = () => setCameraView([0, 1.8, 7]);
    const sideHandler = () => setCameraView([7, 1.8, 0]);
    const topHandler = () => setCameraView([0, 7, 0.01], [0, 0, 0]);
    const perspectiveHandler = () => setCameraView([4.8, 3.8, 5.4]);

    window.addEventListener("studio:export-glb", exportHandler);
    window.addEventListener("studio:capture-preview", screenshotHandler);
    window.addEventListener("studio:camera-reset", resetHandler);
    window.addEventListener("studio:camera-front", frontHandler);
    window.addEventListener("studio:camera-side", sideHandler);
    window.addEventListener("studio:camera-top", topHandler);
    window.addEventListener("studio:camera-perspective", perspectiveHandler);
    window.addEventListener("studio:camera-zoom-selected", zoomSelectedHandler);
    return () => {
      window.removeEventListener("studio:export-glb", exportHandler);
      window.removeEventListener("studio:capture-preview", screenshotHandler);
      window.removeEventListener("studio:camera-reset", resetHandler);
      window.removeEventListener("studio:camera-front", frontHandler);
      window.removeEventListener("studio:camera-side", sideHandler);
      window.removeEventListener("studio:camera-top", topHandler);
      window.removeEventListener("studio:camera-perspective", perspectiveHandler);
      window.removeEventListener("studio:camera-zoom-selected", zoomSelectedHandler);
    };
  }, [camera, controlsRef, gl.domElement, rootRef, selectedObjectId]);

  return null;
}

function SceneContent() {
  const rootRef = useRef<Group>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const objects = useStudioStore((state) => state.objects);
  const selectObject = useStudioStore((state) => state.selectObject);
  const viewportSettings = useStudioStore((state) => state.viewportSettings);

  return (
    <>
      <color attach="background" args={[viewportSettings.background]} />
      <PerspectiveCamera makeDefault position={[4.8, 3.8, 5.4]} fov={45} />
      <ambientLight intensity={viewportSettings.ambientIntensity} />
      <hemisphereLight args={["#dbeafe", "#0f172a", 0.45]} />
      <directionalLight position={[4, 6, 3]} intensity={viewportSettings.directionalIntensity} castShadow />
      {viewportSettings.grid ? (
        <Grid position={[0, 0, 0]} args={[20, 20]} cellSize={0.5} cellThickness={0.6} sectionSize={2.5} sectionThickness={1.1} fadeDistance={30} infiniteGrid />
      ) : null}
      <Bounds fit clip observe margin={1.4}>
        <group ref={rootRef} name="3D Product Studio Scene">
          {objects.map((object) => (
            <SceneObject key={object.id} object={object} />
          ))}
        </group>
      </Bounds>
      <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.08} />
      <ViewportEvents rootRef={rootRef} controlsRef={controlsRef} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onClick={() => selectObject(undefined)} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#111827" roughness={0.9} metalness={0} transparent opacity={0.18} />
      </mesh>
    </>
  );
}

export function StudioViewport() {
  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-slate-950">
      <Canvas shadows gl={{ preserveDrawingBuffer: true, antialias: true }} camera={{ position: [4.8, 3.8, 5.4], fov: 45 }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 shadow-xl backdrop-blur">
        Orbit: drag viewport | Select: click object | Transform: toolbar mode
      </div>
    </div>
  );
}
