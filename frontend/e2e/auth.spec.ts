import { expect, test, uniqueEmail } from "./fixtures/test";

test.describe("Authentication", () => {
  test("register, sign out, then sign back in", async ({ authPage }) => {
    const email = uniqueEmail();
    const password = "password123";

    await authPage.goto();
    await expect(authPage.welcomeBackHeading).toBeVisible();

    await authPage.goToRegister();
    await expect(authPage.createAccountHeading).toBeVisible();
    await authPage.register("Ava Lin", email, password);
    await authPage.expectSignedIn("Ava");

    await authPage.logout();
    await expect(authPage.welcomeBackHeading).toBeVisible();

    await authPage.login(email, password);
    await authPage.expectSignedIn("Ava");
  });

  test("shows an error for a wrong password", async ({ authPage }) => {
    await authPage.goto();
    await authPage.login("demo@keepclone.app", "definitely-wrong");
    await expect(authPage.errorAlert).toContainText(
      /incorrect password|no account/i,
    );
  });

  test("a stored session stays signed in without logging in", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/");
    await expect(authenticatedPage.getByText(/welcome, ava/i)).toBeVisible();
  });
});
