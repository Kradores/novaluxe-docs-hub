"use client";

import { useEffect, useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";

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
  RoleName,
  UserInvitationData,
} from "@/types/user";
import { getSessionToken, getUserRoleName } from "@/lib/server/user";

import { getActiveUsers } from "./actions";

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

// --------------------
// Page
// --------------------

export default function UsersPage() {
  const supabase = createSupabaseBrowserClient();

  const [currentRole, setCurrentRole] = useState<RoleName | null>(null);
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<RoleName>("user");
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const role = await getUserRoleName();
      if (!role || role === "user") return;

      setCurrentRole(role);

      // load active users
      const usersData = await getActiveUsers();
      setUsers(usersData ?? []);

      const { data: invitesData } = await supabase
        .from("user_invitations")
        .select<
          string,
          UserInvitationData
        >("id, email, expires_at, roles(name)")
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString());

      setInvites(
        (invitesData ?? []).map((i) => ({
          id: i.id,
          email: i.email,
          role: i.roles.name,
          expires_at: i.expires_at,
        })),
      );
    };

    load();
  }, [supabase]);

  if (!currentRole) {
    return null;
  }

  const handleInvite = async () => {
    const sessionToken = await getSessionToken();
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/invite-user`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      },
    );

    setInviteEmail("");
    setInviteRole("user");
    setInviteOpen(false);
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

                <Select
                  value={inviteRole}
                  onValueChange={(v) => setInviteRole(v as RoleName)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["super_admin", "admin", "user"] as RoleName[])
                      .filter((r) => canAssignRole(currentRole, r))
                      .map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
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
                        {(["super_admin", "admin", "user"] as RoleName[])
                          .filter((r) => canAssignRole(currentRole, r))
                          .map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
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
