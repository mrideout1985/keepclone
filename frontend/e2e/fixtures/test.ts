import { type Page, test as base } from "@playwright/test";
import { AuthPage } from "../pages/auth.page";

export const STORAGE_STATE = "e2e/.auth/user.json";

type Fixtures = {
  authPage: AuthPage;
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";

export function uniqueEmail(prefix = "ava"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@keepclone.app`;
}
