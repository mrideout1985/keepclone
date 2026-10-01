import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

const app = buildApp();

const validUser = {
  name: "Ava Lin",
  email: "ava@keepclone.app",
  password: "password123",
};

describe("auth", () => {
  describe("POST /api/auth/register", () => {
    it("creates an account, sets a session cookie and returns the user", async () => {
      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({
        name: "Ava Lin",
        email: "ava@keepclone.app",
      });
      expect(res.body.user.id).toBeTruthy();
      expect(res.body.user.passwordHash).toBeUndefined();
      const cookies = res.headers["set-cookie"] as unknown as string[];
      expect(cookies.some((c) => c.startsWith("keepclone_session="))).toBe(
        true,
      );
    });

    it("lowercases and trims the email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...validUser, email: "  Ava@KeepClone.app " });
      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe("ava@keepclone.app");
    });

    it("rejects a duplicate email with 409", async () => {
      await request(app).post("/api/auth/register").send(validUser);
      const res = await request(app).post("/api/auth/register").send(validUser);
      expect(res.status).toBe(409);
      expect(res.body.error.message).toMatch(/already exists/i);
    });

    it("rejects a short password with 400", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...validUser, password: "short" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(validUser);
    });

    it("signs in with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: validUser.email, password: validUser.password });
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(validUser.email);
    });

    it("returns 401 for an unknown email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@keepclone.app", password: "password123" });
      expect(res.status).toBe(401);
      expect(res.body.error.message).toMatch(/no account/i);
    });

    it("returns 401 for a wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: validUser.email, password: "wrongpassword" });
      expect(res.status).toBe(401);
      expect(res.body.error.message).toMatch(/incorrect password/i);
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns 401 without a session cookie", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("returns the user with a valid session, then 401 after logout", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/register").send(validUser);

      const me = await agent.get("/api/auth/me");
      expect(me.status).toBe(200);
      expect(me.body.user.email).toBe(validUser.email);

      const out = await agent.post("/api/auth/logout");
      expect(out.status).toBe(204);

      const after = await agent.get("/api/auth/me");
      expect(after.status).toBe(401);
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("always returns 200 without revealing account existence", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "whoever@keepclone.app" });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    });
  });
});
