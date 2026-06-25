import type { PrintableArea3D } from "@/types/product";

export function getPrintableAreaById(areas: PrintableArea3D[], id?: string) {
  return areas.find((area) => area.id === id) ?? areas[0];
}
