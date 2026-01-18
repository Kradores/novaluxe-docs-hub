"use client";

import { useEffect, useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import {
  ActiveUser,
  Invitation,
  RoleModel,
  RoleName,
  UserInvitationData,
} from "@/types/user";
import { getUserRoleName } from "@/lib/server/user";

import { createUserInvitation, getActiveUsers, getRoles } from "./actions";

const ROLE_ORDER: Record<RoleName, number> = {
  super_admin: 3,
  admin: 2,
  user: 1,
};

const canAssignRole = (actor: RoleName, target: RoleName) => {
  if (actor === "super_admin") return true;
  if (actor === "admin") return target !== "super_admin";
  return false;
};

const canRemoveRole = (actor: RoleName, target: RoleName) => {
  return ROLE_ORDER[actor] > ROLE_ORDER[target];
};

export default function UsersPage() {
  const supabase = createSupabaseBrowserClient();

  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [currentRole, setCurrentRole] = useState<RoleName | null>(null);
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);

  const [inviteRoleId, setInviteRoleId] = useState<string>();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const [role, usersData, { data: invitesData }, roles] = await Promise.all(
        [
          getUserRoleName(),
          getActiveUsers(),
          supabase
            .from("user_invitations")
            .select<
              string,
              UserInvitationData
            >("id, email, expires_at, roles(name)")
            .is("accepted_at", null)
            .gt("expires_at", new Date().toISOString()),
          getRoles(),
        ],
      );

      if (!role || role === "user") return;

      setCurrentRole(role);
      setUsers(usersData ?? []);
      setInvites(
        (invitesData ?? []).map((i) => ({
          id: i.id,
          email: i.email,
          role: i.roles.name,
          expires_at: i.expires_at,
        })),
      );
      setRoles(roles);
    };

    load();
  }, [supabase]);

  if (!currentRole) {
    return <></>;
  }

  const handleInvite = async () => {
    try {
      await createUserInvitation(
        inviteEmail,
        roles.find((role) => role.id === inviteRoleId),
      );
      setInviteEmail("");
      setInviteRoleId(roles.find((role) => role.name === "user")?.id);
      setInviteOpen(false);
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
      if (error instanceof Error) return toast.error(error.message);
      console.error(error);
    }
  };

  const handleRoleChange = async (userId: string, role: RoleName) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-user-role`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role }),
      },
    );
  };

  const handleRemoveUser = async (userId: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/remove-user`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      },
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>

        {currentRole !== "user" && (
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button>Invite user</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite user</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-muted-foreground">
                Send invitation email, if the user accepts, he will be signedup
                with specified role.
              </DialogDescription>

              <div className="space-y-4">
                <Input
                  placeholder="Email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />

                <Select value={inviteRoleId} onValueChange={setInviteRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles
                      .filter((r) => canAssignRole(currentRole, r.name))
                      .map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Button onClick={handleInvite}>Send invite</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Active users */}
      <div>
        <h2 className="mb-2 text-lg font-medium">Active users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.user_id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  {canAssignRole(currentRole, u.role) ? (
                    <Select
                      defaultValue={u.role}
                      onValueChange={(v) =>
                        handleRoleChange(u.user_id, v as RoleName)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles
                          .filter((r) => canAssignRole(currentRole, r.name))
                          .map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    u.role
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {canRemoveRole(currentRole, u.role) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveUser(u.user_id)}
                    >
                      Remove
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Invitations */}
      {invites.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-medium">Pending invitations</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.email}</TableCell>
                  <TableCell>{i.role}</TableCell>
                  <TableCell>
                    {new Date(i.expires_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
