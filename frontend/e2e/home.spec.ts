import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "KeepClone", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /welcome to keepclone/i }),
  ).toBeVisible();
});
