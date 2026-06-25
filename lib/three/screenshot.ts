export function captureCanvasScreenshot(canvas?: HTMLCanvasElement | null) {
  if (!canvas) {
    throw new Error("Viewport canvas is not available.");
  }

  return canvas.toDataURL("image/png");
}
