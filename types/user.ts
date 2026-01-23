export type RoleName = "super_admin" | "admin" | "user";

export type RoleModel = {
  id: string;
  name: RoleName;
};

export type ActiveUser = {
  user_id: string;
  email: string;
  role: RoleName;
  created_at: string;
};

export type Invitation = {
  id: string;
  email: string;
  role: RoleName;
  expires_at: string;
};

export type UserInvitationData = {
  id: string;
  email: string;
  roles: { name: RoleName };
  expires_at: string;
};
