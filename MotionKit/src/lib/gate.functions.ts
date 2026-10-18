import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type GateSession = { unlocked?: boolean };

const DEFAULT_SECRET = "motionkit-gate-session-secret-fallback-minimum-32-chars";
const DEFAULT_PASSWORD = "kit";

function config() {
  return {
    password: process.env["SESSION_SECRET"] || DEFAULT_SECRET,
    name: "motionkit-gate",
    // Sans maxAge pour que le cookie expire dès la fermeture du navigateur ou de la PWA
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function matches(input: string, expected: string) {
  const normInput = input.trim();
  const normExpected = expected.trim();
  const a = createHash("sha256").update(normInput, "utf8").digest();
  const b = createHash("sha256").update(normExpected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const checkUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  const password = process.env["SITE_PASSWORD"];
  if (!password || password === DEFAULT_PASSWORD) {
    return { unlocked: true };
  }
  const session = await useSession<GateSession>(config());
  return { unlocked: !!session.data.unlocked };
});

export const unlockSite = createServerFn({ method: "POST" })
  .validator((d: { password: string }) => ({
    password: String(d.password ?? "").slice(0, 200),
  }))
  .handler(async ({ data }) => {
    const expected = process.env["SITE_PASSWORD"] || DEFAULT_PASSWORD;
    if (!matches(data.password, expected)) return { ok: false as const };
    const session = await useSession<GateSession>(config());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(config());
  await session.clear();
  return { ok: true as const };
});
