import { getTranslations } from "next-intl/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserInvitationData } from "@/types/user";

export default async function InvitationsTable({
  invites,
}: {
  invites: UserInvitationData[];
}) {
  const t = await getTranslations("users.table.invitations");
  const rolesT = await getTranslations("users.roles");
  return (
    <div>
      <h2 className="mb-2 text-lg font-medium">{t("title")}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("headers.0")}</TableHead>
            <TableHead>{t("headers.1")}</TableHead>
            <TableHead>{t("headers.2")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invites.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.email}</TableCell>
              <TableCell>{rolesT(i.roles.name)}</TableCell>
              <TableCell>{new Date(i.expires_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
