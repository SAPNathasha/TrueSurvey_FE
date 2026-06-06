export type AppUserRole = "PARTICIPANT" | "CREATOR" | "BOTH";

export function getStoredUserRole() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedRole = window.localStorage.getItem("userRole");

  if (
    storedRole === "PARTICIPANT" ||
    storedRole === "CREATOR" ||
    storedRole === "BOTH"
  ) {
    return storedRole satisfies AppUserRole;
  }

  const storedUser = window.localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser) as Record<string, unknown>;

    if (
      parsedUser.role === "PARTICIPANT" ||
      parsedUser.role === "CREATOR" ||
      parsedUser.role === "BOTH"
    ) {
      return parsedUser.role satisfies AppUserRole;
    }
  } catch {
    return null;
  }

  return null;
}
