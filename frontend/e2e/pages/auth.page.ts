import { type Locator, type Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class AuthPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signInButton: Locator;
  readonly createAccountButton: Locator;
  readonly createAccountLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signOutButton: Locator;
  readonly errorAlert: Locator;
  readonly welcomeBackHeading: Locator;
  readonly createAccountHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByLabel("Name");
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password", { exact: true });
    this.confirmPasswordInput = page.getByLabel("Confirm password");
    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.createAccountButton = page.getByRole("button", {
      name: "Create account",
    });
    this.createAccountLink = page.getByRole("button", {
      name: "Create an account",
    });
    this.forgotPasswordLink = page.getByRole("button", {
      name: "Forgot password?",
    });
    this.signOutButton = page.getByRole("button", { name: "Sign out" });
    this.errorAlert = page.getByRole("alert");
    this.welcomeBackHeading = page.getByRole("heading", {
      name: "Welcome back",
    });
    this.createAccountHeading = page.getByRole("heading", {
      name: "Create your account",
    });
  }

  async goto(): Promise<void> {
    await this.navigate("/");
  }

  async goToRegister(): Promise<void> {
    await this.createAccountLink.click();
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.createAccountButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async logout(): Promise<void> {
    await this.signOutButton.click();
  }

  async expectSignedIn(firstName: string): Promise<void> {
    await expect(
      this.page.getByText(new RegExp(`welcome, ${firstName}`, "i")),
    ).toBeVisible();
  }
}
