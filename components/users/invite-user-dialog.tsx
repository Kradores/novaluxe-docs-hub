"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
import { RoleModel, RoleName } from "@/types/user";
import { createUserInvitation } from "@/app/[locale]/users/actions";
import { canAssignRole } from "@/lib/auth/users";

type Props = {
  currentRole: RoleName;
  roles: RoleModel[];
};

export default function InviteUserDialog({ currentRole, roles }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const t = useTranslations("users.invite");
  const rolesT = useTranslations("users.roles");

  const handleInvite = async () => {
    const role = roles.find((r) => r.id === roleId);

    if (!role) {
      toast.warning(t("warning"));
    }

    try {
      await createUserInvitation(email, role);
      toast.success(t("success"));
      setOpen(false);
      setEmail("");
      setRoleId("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("trigger")}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>

        <div className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Select value={roleId} onValueChange={setRoleId}>
            <SelectTrigger>
              <SelectValue placeholder={t("placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {roles
                .filter((r) => canAssignRole(currentRole, r.name))
                .map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {rolesT(r.name)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button onClick={handleInvite}>{t("submit")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
