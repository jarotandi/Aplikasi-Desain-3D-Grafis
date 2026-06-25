import { test, expect } from "@playwright/test";

test("3d printing customizer renders nonblank preview and validation", async ({ page }) => {
  await page.goto("/3d-printing");
  await expect(page.getByText("3D Printing Customizer")).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();
  await page.waitForTimeout(1500);

  const pixelCheck = await page.locator("canvas").evaluate((canvasElement) => {
    const canvas = canvasElement as HTMLCanvasElement;
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!context) return { ok: false, reason: "webgl context unavailable" };
    const sample = new Uint8Array(4);
    context.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, context.RGBA, context.UNSIGNED_BYTE, sample);
    return { ok: sample[0] + sample[1] + sample[2] > 15, rgba: Array.from(sample) };
  });
  expect(pixelCheck.ok, JSON.stringify(pixelCheck)).toBe(true);

  await page.getByLabel("Thickness mm").fill("2");
  await expect(page.getByText("Ketebalan minimum 3 mm")).toBeVisible();
  await page.screenshot({ path: "test-results/three-d-printing.png", fullPage: true });
});
