import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { api } from "@/src/utils/api";
import * as z from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import {
  hasOrganizationAccess,
  useHasOrganizationAccess,
} from "@/src/features/rbac/utils/checkOrganizationAccess";
import { useQueryProject } from "@/src/features/projects/hooks";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { useTranslation } from "@/src/features/i18n";

export function TransferProjectButton() {
  const capture = usePostHogClientCapture();
  const session = useSession();
  const { t } = useTranslation();
  const { project, organization } = useQueryProject();
  const hasAccess = useHasOrganizationAccess({
    organizationId: organization?.id,
    scope: "projects:transfer_org",
  });
  const allOrgs = session.data?.user?.organizations ?? [];
  const organizationsToTransferTo =
    allOrgs.filter((org) =>
      hasOrganizationAccess({
        session: session.data,
        organizationId: org.id,
        scope: "projects:transfer_org",
      }),
    ) ?? [];
  const confirmMessage = (organization?.name + "/" + project?.name)
    .replaceAll(" ", "-")
    .toLowerCase();

  const formSchema = z.object({
    name: z.string().includes(confirmMessage, {
      message: `${t("project.transfer.form.confirmInstruction")} "${confirmMessage}"`,
    }),
    projectId: z.string(),
  });

  const transferProject = api.projects.transfer.useMutation({
    onSuccess: async () => {
      showSuccessToast({
        title: t("project.transfer.successTitle"),
        description: t("project.transfer.successDescription"),
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      void session.update();
      window.location.href = "/";
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      projectId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!project) return;
    capture("project_settings:project_delete");
    transferProject.mutate({
      projectId: project.id,
      targetOrgId: values.projectId,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive-secondary" disabled={!hasAccess}>
          {t("project.transfer.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("project.transfer.dialog.title")}
          </DialogTitle>
          <Alert className="mt-2">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>{t("project.transfer.warning.title")}</AlertTitle>
            <AlertDescription>
              {t("project.transfer.warning.description")}
              <ul className="list-disc pl-4">
                <li>{t("project.transfer.warning.point1")}</li>
                <li>{t("project.transfer.warning.point2")}</li>
              </ul>
            </AlertDescription>
          </Alert>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogBody>
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("project.transfer.form.selectOrg")}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={transferProject.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("project.transfer.form.placeholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationsToTransferTo
                            .filter((org) => org.id !== organization?.id)
                            .map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      {t("project.transfer.form.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("project.transfer.form.confirm")}</FormLabel>
                    <FormControl>
                      <Input placeholder={confirmMessage} {...field} />
                    </FormControl>
                    <FormDescription>
                      {`${t("project.transfer.form.confirmInstruction")} "${confirmMessage}" ${t("project.transfer.form.confirmSuffix")}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                loading={transferProject.isPending}
                className="w-full"
              >
                {t("project.transfer.button")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
