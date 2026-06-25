"use client";

import { TransformControls } from "@react-three/drei";
import { useEffect, useState, type ReactElement, type RefObject } from "react";
import type { Group } from "three";
import { useStudioStore } from "@/lib/store/studioStore";
import { toFixedVector } from "@/lib/utils/math";

interface TransformControllerProps {
  objectId: string;
  groupRef: RefObject<Group | null>;
  children: ReactElement;
}

export function TransformController({ objectId, groupRef, children }: TransformControllerProps) {
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);
  const transformMode = useStudioStore((state) => state.transformMode);
  const setTransform = useStudioStore((state) => state.setTransform);
  const isSelected = selectedObjectId === objectId;
  const [target, setTarget] = useState<Group | null>(null);

  useEffect(() => {
    setTarget(groupRef.current);
  }, [groupRef, isSelected]);

  const commitTransform = (recordHistory: boolean) => {
    const group = groupRef.current;
    if (!group) return;
    setTransform(
      objectId,
      {
        position: toFixedVector([group.position.x, group.position.y, group.position.z]),
        rotation: toFixedVector([group.rotation.x, group.rotation.y, group.rotation.z]),
        scale: toFixedVector([group.scale.x, group.scale.y, group.scale.z])
      },
      recordHistory
    );
  };

  if (!isSelected) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {target ? (
        <TransformControls
          mode={transformMode}
          object={target}
          onMouseUp={() => {
            commitTransform(true);
          }}
        />
      ) : null}
    </>
  );
}
