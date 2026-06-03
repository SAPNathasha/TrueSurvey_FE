import { getStoredAccessToken } from "@/lib/axios";

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(
      normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    );

    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getStringField(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return null;
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

export function getStoredCreatorId() {
  if (typeof window === "undefined") {
    return null;
  }

  const directId =
    window.localStorage.getItem("creatorId") ||
    window.localStorage.getItem("userId");

  if (directId) {
    return directId;
  }

  const storedUser = window.localStorage.getItem("user");

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      const userId = getStringField(parsedUser, [
        "creatorId",
        "userId",
        "id",
        "sub",
      ]);

      if (userId) {
        return userId;
      }
    } catch {
      // Ignore malformed local user payloads and fall back to the token.
    }
  }

  const token = getStoredAccessToken();
  const tokenPayload = token ? decodeJwtPayload(token) : null;

  return getStringField(tokenPayload, ["creatorId", "userId", "id", "sub"]);
}
