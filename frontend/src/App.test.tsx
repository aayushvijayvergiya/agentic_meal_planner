import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders backend status once fetch resolves", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ status: "ok" }),
      })
    );

    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("backend-status")).toHaveTextContent(
        "Backend status: ok"
      )
    );
  });
});
