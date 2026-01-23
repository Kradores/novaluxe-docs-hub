import { getTranslations } from "next-intl/server";

import { getUserRoleName } from "@/lib/server/user";
import { redirect } from "@/config/i18n/navigation";
import { allRoutes } from "@/config/site";
import { assertDefined } from "@/lib/utils";
import PageHeader from "@/components/page-header";
import ActiveUsersTable from "@/components/users/active-users-table";
import InvitationsTable from "@/components/users/invitations-table";
import InviteUserDialog from "@/components/users/invite-user-dialog";

import { getActiveUsers, getRoles, getPendingInvites } from "./actions";

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentRole = await getUserRoleName();
  const t = await getTranslations("users");

  if (!currentRole || currentRole === "user") {
    redirect({ href: allRoutes.home, locale });
  }
  assertDefined(currentRole, "currentUserRole");

  const [users, roles, invites] = await Promise.all([
    getActiveUsers(),
    getRoles(),
    getPendingInvites(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="space-y-10">
        <PageHeader
          action={<InviteUserDialog currentRole={currentRole} roles={roles} />}
          backTo={allRoutes.home}
          subtitle={t.has("subtitle") && t("subtitle")}
          title={t("title")}
        />
        <ActiveUsersTable currentRole={currentRole} users={users ?? []} />
        {invites && invites.length > 0 && (
          <InvitationsTable invites={invites} />
        )}
      </div>
    </div>
  );
}
