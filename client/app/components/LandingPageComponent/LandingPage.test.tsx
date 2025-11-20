import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  it("renders the hero heading", () => {
    const html = renderToString(<LandingPage />);
    assert.match(html, /Connecting You to Perfect Spaces/);
  });
});
