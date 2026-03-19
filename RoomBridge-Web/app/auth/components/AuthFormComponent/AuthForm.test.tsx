import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import AuthForm from "./AuthForm";

describe("AuthForm", () => {
  it("renders login heading by default", () => {
    const html = renderToString(<AuthForm />);
    assert.match(html, /Login/);
  });

  it("renders register heading when mode is register", () => {
    const html = renderToString(<AuthForm mode="register" />);
    assert.match(html, /Create account/);
  });
});
