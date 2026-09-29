import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/testing/utils";
import { HomePage } from "./home-page";

describe("HomePage", () => {
  it("renders the welcome heading", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByRole("heading", { name: /welcome to keepclone/i }),
    ).toBeInTheDocument();
  });
});
