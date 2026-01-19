import { RoleName } from "@/types/user";

const ROLE_MATRIX: Record<RoleName, RoleName[]> = {
  super_admin: ["super_admin", "admin", "user"],
  admin: ["admin", "user"],
  user: [],
};

const ROLE_ORDER: Record<RoleName, number> = {
  super_admin: 3,
  admin: 2,
  user: 1,
};

export function canRemoveUser(actor: RoleName, target: RoleName) {
  return ROLE_ORDER[actor] > ROLE_ORDER[target];
}

export function canInviteUser(actor: RoleName, target: RoleName) {
  return ROLE_MATRIX[actor]?.includes(target);
}

export function canAssignRole(actor: RoleName, target: RoleName) {
  if (actor === "super_admin") return true;
  if (actor === "admin") return target !== "super_admin";
  return false;
}
