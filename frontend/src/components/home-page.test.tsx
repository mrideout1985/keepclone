import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/testing/mocks/server";
import { renderWithProviders } from "@/testing/utils";
import { HomePage } from "./home-page";

const ME = "http://localhost:4000/api/auth/me";

describe("HomePage", () => {
  it("shows the sign-in screen when signed out", async () => {
    renderWithProviders(<HomePage />);
    expect(
      await screen.findByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
  });

  it("shows the signed-in view when a session exists", async () => {
    server.use(
      http.get(ME, () =>
        HttpResponse.json({
          user: { id: "u1", name: "Ava Lin", email: "demo@keepclone.app" },
        }),
      ),
    );
    renderWithProviders(<HomePage />);
    expect(await screen.findByText(/welcome, ava/i)).toBeInTheDocument();
  });
});
