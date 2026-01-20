import { getTranslations } from "next-intl/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActiveUser, RoleName } from "@/types/user";
import { canRemoveUser } from "@/lib/auth/users";

import { ConfirmRemoveDialog } from "./confirm-remove-dialog";

type Props = {
  currentRole: RoleName;
  users: ActiveUser[];
};

export default async function ActiveUsersTable({ currentRole, users }: Props) {
  const t = await getTranslations("users.table.active");
  const rolesT = await getTranslations("users.roles");
  return (
    <div>
      <h2 className="mb-2 text-lg font-medium">{t("title")}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("headers.0")}</TableHead>
            <TableHead>{t("headers.1")}</TableHead>
            <TableHead className="text-center">{t("headers.2")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((u) => (
            <TableRow key={u.user_id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>{rolesT(u.role)}</TableCell>
              <TableCell className="text-center">
                {canRemoveUser(currentRole, u.role) && (
                  <ConfirmRemoveDialog user={u} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
