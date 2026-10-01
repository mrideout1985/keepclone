import { http, HttpResponse } from "msw";
import type { RequestHandler } from "msw";

const API = "http://localhost:4000";

const demoUser = {
  id: "u1",
  name: "Ava Lin",
  email: "demo@keepclone.app",
};

export const handlers: RequestHandler[] = [
  http.get(`${API}/api/auth/me`, () =>
    HttpResponse.json(
      { error: { message: "Not authenticated" } },
      { status: 401 },
    ),
  ),
  http.post(`${API}/api/auth/login`, () =>
    HttpResponse.json({ user: demoUser }),
  ),
  http.post(`${API}/api/auth/register`, () =>
    HttpResponse.json({ user: demoUser }, { status: 201 }),
  ),
  http.post(
    `${API}/api/auth/logout`,
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.post(`${API}/api/auth/forgot-password`, () =>
    HttpResponse.json({ ok: true }),
  ),
];

export { demoUser };
