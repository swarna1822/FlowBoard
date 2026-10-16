import type { AuthUser, GlobalRole } from "../types";

export const userFromAuth = (
  email: string,
  name?: string,
  role: GlobalRole = "Employee"
): AuthUser => {
  const display = name?.trim() || email.split("@")[0].replace(/[._]/g, " ");
  const initials = display
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return {
    email,
    name: display.replace(/\b\w/g, (char) => char.toUpperCase()),
    initials: initials || "AK",
    personId: "AK",
    role,
  };
};
