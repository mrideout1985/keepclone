import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/testing/mocks/server";
import { renderWithProviders } from "@/testing/utils";
import { AuthForm } from "./auth-form";

const LOGIN = "http://localhost:4000/api/auth/login";

function renderLogin() {
  return renderWithProviders(<AuthForm mode="login" onModeChange={vi.fn()} />);
}

describe("AuthForm (login)", () => {
  it("validates empty fields on submit", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your password/i)).toBeInTheDocument();
  });

  it("rejects a malformed email", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
  });

  it("surfaces a server error as a form-level alert", async () => {
    server.use(
      http.post(LOGIN, () =>
        HttpResponse.json(
          { error: { message: "Incorrect password. Try again." } },
          { status: 401 },
        ),
      ),
    );
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "ava@keepclone.app");
    await user.type(screen.getByLabelText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/incorrect password\. try again\./i),
      ).toBeInTheDocument(),
    );
  });
});
