import { PagedSettingsContainer } from "@/src/components/PagedSettingsContainer";
import Header from "@/src/components/layouts/header";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { api } from "@/src/utils/api";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { useSession, signOut } from "next-auth/react";
import { SettingsDangerZone } from "@/src/components/SettingsDangerZone";
import ContainerPage from "@/src/components/layouts/container-page";
import { useRouter } from "next/router";
import { StringNoHTML } from "@langfuse/shared";
import Link from "next/link";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";
import { env } from "@/src/env.mjs";
import { useTranslation } from "@/src/features/i18n";

const displayNameSchema = z.object({
  name: StringNoHTML.min(1, "Name cannot be empty").max(
    100,
    "Name must be at most 100 characters",
  ),
});

function UpdateDisplayName() {
  const { data: session, update: updateSession } = useSession();
  const utils = api.useUtils();
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const updateDisplayName = api.userAccount.updateDisplayName.useMutation({
    onSuccess: async () => {
      await updateSession();
      await utils.invalidate();
      form.reset();
      showSuccessToast({
        title: t("account.displayName.successTitle"),
        description: t("account.displayName.successDescription"),
      });
    },
    onError: (error) => form.setError("name", { message: error.message }),
  });

  function onSubmit(values: z.infer<typeof displayNameSchema>) {
    updateDisplayName.mutate({ name: values.name });
  }

  return (
    <div>
      <Header title={t("account.displayName.title")} />
      <Card className="p-3">
        {form.getValues().name !== "" ? (
          <p className="mb-4 text-sm text-primary">
            {t("account.displayName.updating")} &quot;
            {session?.user?.name ?? ""}
            &quot; {t("account.displayName.to")} &quot;
            <b>{form.watch().name}</b>&quot;.
          </p>
        ) : (
          <p className="mb-4 text-sm text-primary">
            {t("account.displayName.current")} &quot;
            <b>{session?.user?.name ?? ""}</b>
            &quot;.
          </p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={session?.user?.name ?? ""}
                      {...field}
                      className="flex-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="secondary"
              type="submit"
              loading={updateDisplayName.isPending}
              disabled={form.getValues().name === ""}
              className="mt-4"
            >
              {t("account.displayName.save")}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}

function DeleteAccountButton() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? "";
  const { t } = useTranslation();

  const { data: canDeleteData } = api.userAccount.checkCanDelete.useQuery();
  const deleteAccount = api.userAccount.delete.useMutation();

  const formSchema = z.object({
    email: z.string().refine((val) => val === userEmail, {
      message: `${t("account.delete.dialog.confirmPrefix")} ${userEmail}`,
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const canDelete = canDeleteData?.canDelete ?? false;
  const blockingOrganizations = canDeleteData?.blockingOrganizations ?? [];

  const onSubmit = async () => {
    if (!canDelete) return;
    try {
      await deleteAccount.mutateAsync();
      showSuccessToast({
        title: t("account.delete.successTitle"),
        description: t("account.delete.successDescription"),
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await signOut();
    } catch (error) {
      console.error(error);
      showErrorToast(
        t("account.delete.error"),
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive-secondary">
          {t("account.delete.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("account.delete.dialog.title")}
          </DialogTitle>
          <DialogDescription>
            {!canDelete && blockingOrganizations.length > 0 ? (
              <div>
                <p className="mb-2">{t("account.delete.dialog.blocking")}</p>
                <ul className="list-inside list-disc space-y-1">
                  {blockingOrganizations.map((org) => (
                    <li key={org.id}>
                      <Link
                        href={`/organization/${org.id}/settings`}
                        className="font-semibold text-primary underline hover:text-primary/80"
                      >
                        {org.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-2">{t("account.delete.dialog.instruction")}</p>
              </div>
            ) : (
              `${t("account.delete.dialog.confirmPrefix")} "${userEmail}" ${t("account.delete.dialog.confirmSuffix")}`
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {canDelete && (
              <DialogBody>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder={userEmail} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogBody>
            )}
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                loading={deleteAccount.isPending}
                disabled={!canDelete}
                className="w-full"
              >
                {t("account.delete.button")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type AccountSettingsPage = {
  title: string;
  slug: string;
  content: React.ReactNode;
  cmdKKeywords?: string[];
};

export function useAccountSettingsPages(): AccountSettingsPage[] {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? "";
  const { t } = useTranslation();

  return getAccountSettingsPages(userEmail, t);
}

const getAccountSettingsPages = (
  userEmail: string,
  t: (key: string) => string,
): AccountSettingsPage[] => [
  {
    title: t("account.general.title"),
    slug: "index",
    cmdKKeywords: [
      "account",
      "user",
      "profile",
      "email",
      "password",
      "name",
      "display",
      "delete",
      "remove",
    ],
    content: (
      <div className="flex flex-col gap-6">
        <div>
          <Header title={t("account.email.title")} />
          <Card className="p-3">
            <p className="text-sm text-primary">
              {t("account.email.label")} <b>{userEmail}</b>
            </p>
          </Card>
        </div>
        <UpdateDisplayName />
        <div>
          <Header title={t("account.password.title")} />
          <Card className="p-3">
            <p className="mb-4 text-sm text-primary">
              {t("account.password.description")}
            </p>
            <Button asChild variant="secondary">
              <Link
                href={`${env.NEXT_PUBLIC_BASE_PATH ?? ""}/auth/reset-password`}
              >
                {t("account.password.button")}
              </Link>
            </Button>
          </Card>
        </div>
        <SettingsDangerZone
          items={[
            {
              title: t("account.delete.title"),
              description: t("account.delete.description"),
              button: <DeleteAccountButton />,
            },
          ]}
        />
      </div>
    ),
  },
];

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const userEmail = session?.user?.email ?? "";
  const { t } = useTranslation();

  const pages = getAccountSettingsPages(userEmail, t);

  return (
    <ContainerPage
      headerProps={{
        title: t("account.settings.title"),
      }}
    >
      <PagedSettingsContainer
        activeSlug={router.query.page as string | undefined}
        pages={pages}
      />
    </ContainerPage>
  );
}
