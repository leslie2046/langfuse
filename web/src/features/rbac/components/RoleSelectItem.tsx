import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card";
import { SelectItem } from "@/src/components/ui/select";
import { Role } from "@langfuse/shared";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import { organizationRoleAccessRights } from "@/src/features/rbac/constants/organizationAccessRights";
import { projectRoleAccessRights } from "@/src/features/rbac/constants/projectAccessRights";
import { orderedRoles } from "@/src/features/rbac/constants/orderedRoles";
import { useTranslation } from "@/src/features/i18n";

export const RoleSelectItem = ({
  role,
  isProjectRole,
}: {
  role: Role;
  isProjectRole?: boolean;
}) => {
  const { t } = useTranslation();
  const isProjectNoneRole = role === Role.NONE && isProjectRole;
  const isOrgNoneRole = role === Role.NONE && !isProjectRole;
  const orgScopes = reduceScopesToListItems(
    organizationRoleAccessRights,
    role,
    t,
  );
  const projectScopes = reduceScopesToListItems(
    projectRoleAccessRights,
    role,
    t,
  );

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <SelectItem value={role} className="max-w-56">
          <span>
            {formatRole(role, t)}
            {isProjectNoneRole
              ? ` (${t("organization.members.roles.keepDefault")})`
              : ""}
          </span>
        </SelectItem>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent hideWhenDetached={true} align="center" side="right">
          {isProjectNoneRole ? (
            <div className="text-xs">
              {t("organization.members.tooltips.projectNoneRole")}
            </div>
          ) : isOrgNoneRole ? (
            <div className="text-xs">
              {t("organization.members.tooltips.orgNoneRole")}
            </div>
          ) : (
            <>
              <div className="font-bold">
                {t("organization.members.tooltips.rolePrefix")}
                {formatRole(role, t)}
              </div>
              <p className="mt-2 text-xs font-semibold">
                {t("organization.members.tooltips.orgScopes")}
              </p>
              <ul className="list-inside list-disc text-xs">{orgScopes}</ul>
              <p className="mt-2 text-xs font-semibold">
                {t("organization.members.tooltips.projectScopes")}
              </p>
              <ul className="list-inside list-disc text-xs">{projectScopes}</ul>
              <p className="mt-2 border-t pt-2 text-xs">
                {t("organization.members.tooltips.notePrefix")}
                <span className="text-muted-foreground">
                  {t("organization.members.tooltips.inheritedScopes")}
                </span>
                {t("organization.members.tooltips.inheritedSuffix")}
              </p>
            </>
          )}
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
};

const reduceScopesToListItems = (
  accessRights: Record<string, string[]>,
  role: Role,
  t: any, // Using any for t here as type import is tricky without full setup
) => {
  const currentRoleLevel = orderedRoles[role];
  const lowerRole = Object.entries(orderedRoles).find(
    ([_role, level]) => level === currentRoleLevel - 1,
  )?.[0] as Role | undefined;
  const inheritedScopes = lowerRole ? accessRights[lowerRole] : [];

  return accessRights[role].length > 0 ? (
    <>
      {Object.entries(
        accessRights[role].reduce(
          (acc, scope) => {
            const [resource, action] = scope.split(":");
            if (!acc[resource]) {
              acc[resource] = [];
            }
            acc[resource].push(action);
            return acc;
          },
          {} as Record<string, string[]>,
        ),
      ).map(([resource, actions]) => {
        const inheritedActions = actions.filter((action) =>
          inheritedScopes.includes(`${resource}:${action}`),
        );
        const newActions = actions.filter(
          (action) => !inheritedScopes.includes(`${resource}:${action}`),
        );

        return (
          <li key={resource}>
            <span>{resource}: </span>
            <span className="text-muted-foreground">
              {inheritedActions.length > 0 ? inheritedActions.join(", ") : ""}
              {newActions.length > 0 && inheritedActions.length > 0 ? ", " : ""}
            </span>
            <span className="font-semibold">
              {newActions.length > 0 ? newActions.join(", ") : ""}
            </span>
          </li>
        );
      })}
    </>
  ) : (
    <li>{t("organization.members.roles.none")}</li>
  );
};

const formatRole = (role: Role, t: any) => {
  switch (role) {
    case Role.OWNER:
      return t("organization.members.roles.owner");
    case Role.ADMIN:
      return t("organization.members.roles.admin");
    case Role.MEMBER:
      return t("organization.members.roles.member");
    case Role.VIEWER:
      return t("organization.members.roles.viewer");
    case Role.NONE:
      return t("organization.members.roles.none");
    default:
      const roleStr = String(role);
      return roleStr.charAt(0).toUpperCase() + roleStr.slice(1).toLowerCase();
  }
};
