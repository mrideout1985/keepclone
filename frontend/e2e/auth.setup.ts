import { test as setup } from "@playwright/test";
import { AuthPage } from "./pages/auth.page";
import { STORAGE_STATE, uniqueEmail } from "./fixtures/test";

export const SEED_USER = {
  name: "Ava Lin",
  firstName: "Ava",
  email: uniqueEmail("seed"),
  password: "password123",
};

setup("authenticate", async ({ page }) => {
  const auth = new AuthPage(page);
  await auth.goto();
  await auth.goToRegister();
  await auth.register(SEED_USER.name, SEED_USER.email, SEED_USER.password);
  await auth.expectSignedIn(SEED_USER.firstName);
  await page.context().storageState({ path: STORAGE_STATE });
});
