import { expect, test } from "@playwright/test";

test("3D Product Studio renders an interactive nonblank viewport", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByText("3D Product Studio")).toBeVisible();
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
  await page.getByRole("button", { name: /Sphere/ }).click();
  await expect(page.locator('input[value*="Sphere"]').first()).toBeVisible();
  await page.screenshot({ path: "test-results/3d-product-studio.png", fullPage: true });
});
