import { test, expect } from "@playwright/test";

test("mockup studio 2D and 3D render nonblank", async ({ page }) => {
  await page.goto("/mockup-studio");
  await expect(page.getByText("2D Mockup Preview")).toBeVisible();
  await page.screenshot({ path: "test-results/mockup-studio-2d.png", fullPage: true });

  await page.getByRole("button", { name: /^3D$/ }).click();
  await expect(page.getByText("3D Mockup Preview")).toBeVisible();
  await page.screenshot({ path: "test-results/mockup-studio-3d-before-pixel.png", fullPage: true });
  await expect(page.locator("canvas")).toBeVisible();
  await page.waitForTimeout(1500);

  const pixelCheck = await page.locator("canvas").evaluate((canvasElement) => {
    const canvas = canvasElement as HTMLCanvasElement;
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!context) return { ok: false, reason: "webgl context unavailable" };
    const { width, height } = canvas;
    const sample = new Uint8Array(4);
    context.readPixels(Math.floor(width / 2), Math.floor(height / 2), 1, 1, context.RGBA, context.UNSIGNED_BYTE, sample);
    return {
      ok: sample[0] + sample[1] + sample[2] > 15,
      rgba: Array.from(sample)
    };
  });

  expect(pixelCheck.ok, JSON.stringify(pixelCheck)).toBe(true);
  await page.screenshot({ path: "test-results/mockup-studio-3d.png", fullPage: true });
});
