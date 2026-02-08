import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type BedrockConfig,
  type BedrockCredential,
  type VertexAIConfig,
  LLMAdapter,
  type LlmApiKeys,
  BEDROCK_USE_DEFAULT_CREDENTIALS,
  VERTEXAI_USE_DEFAULT_CREDENTIALS,
} from "@langfuse/shared";
import { ChevronDown, PlusIcon, TrashIcon } from "lucide-react";
import { z } from "zod/v4";
import { Button } from "@/src/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { api } from "@/src/utils/api";
import { cn } from "@/src/utils/tailwind";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { type useUiCustomization } from "@/src/ee/features/ui-customization/useUiCustomization";
import { DialogFooter } from "@/src/components/ui/dialog";
import { DialogBody } from "@/src/components/ui/dialog";
import { env } from "@/src/env.mjs";

const isLangfuseCloud = Boolean(env.NEXT_PUBLIC_LANGFUSE_CLOUD_REGION);

const isCustomModelsRequired = (adapter: LLMAdapter) =>
  adapter === LLMAdapter.Azure || adapter === LLMAdapter.Bedrock;

import { useTranslation } from "@/src/features/i18n";
import React, { useMemo } from "react";

const createFormSchema = (
  mode: "create" | "update",
  t: (key: string) => string,
  isLangfuseCloud: boolean,
) =>
  z
    .object({
      secretKey: z.string().optional(),
      provider: z
        .string()
        .min(1, t("llmApiKeys.form.errors.providerRequired"))
        .regex(/^[^:]+$/, t("llmApiKeys.form.errors.providerFormat")),
      adapter: z.nativeEnum(LLMAdapter),
      baseURL: z.union([z.literal(""), z.url()]),
      withDefaultModels: z.boolean(),
      customModels: z.array(z.object({ value: z.string().min(1) })),
      awsAccessKeyId: z.string().optional(),
      awsSecretAccessKey: z.string().optional(),
      awsRegion: z.string().optional(),
      vertexAILocation: z.string().optional(),
      extraHeaders: z.array(
        z.object({
          key: z.string().min(1),
          value: mode === "create" ? z.string().min(1) : z.string().optional(),
        }),
      ),
    })
    // 1) Bedrock validation - credentials required in create mode
    .refine(
      (data) => {
        if (data.adapter !== LLMAdapter.Bedrock) return true;

        // In update mode, credentials are optional (existing ones are preserved)
        if (mode === "update") {
          // Only validate region is present
          return data.awsRegion;
        }

        // In create mode, validate credentials
        // For cloud deployments, AWS credentials are required
        if (isLangfuseCloud) {
          return (
            data.awsAccessKeyId && data.awsSecretAccessKey && data.awsRegion
          );
        }

        // For self-hosted deployments, only region is required
        return data.awsRegion;
      },
      {
        message:
          mode === "update"
            ? t("llmApiKeys.form.errors.awsRegionRequired")
            : isLangfuseCloud
              ? t("llmApiKeys.form.errors.bedrockCredentialsRequired")
              : t("llmApiKeys.form.errors.awsRegionRequired"),
        path: ["adapter"],
      },
    )
    .refine(
      (data) => {
        if (isCustomModelsRequired(data.adapter)) {
          return data.customModels.length > 0;
        }
        return true;
      },
      {
        message: t("llmApiKeys.form.errors.customModelRequired"),
        path: ["customModels"],
      },
    )
    // 2) For adapters that support defaults, require default models or at least one custom model
    .refine(
      (data) => {
        if (isCustomModelsRequired(data.adapter)) {
          return true;
        }
        return data.withDefaultModels || data.customModels.length > 0;
      },
      {
        message: t(
          "llmApiKeys.form.errors.customModelRequiredWhenDefaultDisabled",
        ),
        path: ["withDefaultModels"],
      },
    )
    // Vertex AI validation - service account key or ADC sentinel value required
    .refine(
      (data) => {
        if (data.adapter !== LLMAdapter.VertexAI) return true;

        // In update mode, credentials are optional (existing ones are preserved)
        if (mode === "update") return true;

        // secretKey is required (either JSON key or VERTEXAI_USE_DEFAULT_CREDENTIALS sentinel)
        return !!data.secretKey;
      },
      {
        message: isLangfuseCloud
          ? t("llmApiKeys.form.errors.gcpKeyRequired")
          : t("llmApiKeys.form.errors.gcpKeyOrAdcRequired"),
        path: ["secretKey"],
      },
    )
    .refine(
      (data) =>
        data.adapter === LLMAdapter.Bedrock ||
        data.adapter === LLMAdapter.VertexAI ||
        mode === "update" ||
        data.secretKey,
      {
        message: t("llmApiKeys.form.errors.secretKeyRequired"),
        path: ["secretKey"],
      },
    )
    .refine(
      (data) => {
        if (data.adapter !== LLMAdapter.Azure) return true;
        return data.baseURL && data.baseURL.trim() !== "";
      },
      {
        message: t("llmApiKeys.form.errors.azureBaseUrlRequired"),
        path: ["baseURL"],
      },
    );

interface CreateLLMApiKeyFormProps {
  projectId?: string;
  onSuccess: () => void;
  customization: ReturnType<typeof useUiCustomization>;
  mode?: "create" | "update";
  existingKey?: LlmApiKeys;
}

export function CreateLLMApiKeyForm({
  projectId,
  onSuccess,
  customization,
  mode = "create",
  existingKey,
}: CreateLLMApiKeyFormProps) {
  const { t } = useTranslation();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const utils = api.useUtils();
  const capture = usePostHogClientCapture();

  const existingKeys = api.llmApiKey.all.useQuery(
    {
      projectId: projectId as string,
    },
    { enabled: Boolean(projectId) },
  );

  const mutCreateLlmApiKey = api.llmApiKey.create.useMutation({
    onSuccess: () => utils.llmApiKey.invalidate(),
  });

  const mutUpdateLlmApiKey = api.llmApiKey.update.useMutation({
    onSuccess: () => utils.llmApiKey.invalidate(),
  });

  const mutTestLLMApiKey = api.llmApiKey.test.useMutation();
  const mutTestUpdateLLMApiKey = api.llmApiKey.testUpdate.useMutation();

  const defaultAdapter: LLMAdapter = customization?.defaultModelAdapter
    ? LLMAdapter[customization.defaultModelAdapter]
    : LLMAdapter.OpenAI;

  const getCustomizedBaseURL = (adapter: LLMAdapter) => {
    switch (adapter) {
      case LLMAdapter.OpenAI:
        return customization?.defaultBaseUrlOpenAI ?? "";
      case LLMAdapter.Azure:
        return customization?.defaultBaseUrlAzure ?? "";
      case LLMAdapter.Anthropic:
        return customization?.defaultBaseUrlAnthropic ?? "";
      default:
        return "";
    }
  };

  const formSchema = useMemo(
    () => createFormSchema(mode, t, isLangfuseCloud),
    [mode, t],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === "update" && existingKey
        ? {
            adapter: existingKey.adapter as LLMAdapter,
            provider: existingKey.provider,
            secretKey:
              existingKey.adapter === LLMAdapter.VertexAI &&
              existingKey.displaySecretKey === "Default GCP credentials (ADC)"
                ? VERTEXAI_USE_DEFAULT_CREDENTIALS
                : "",
            baseURL:
              existingKey.baseURL ??
              getCustomizedBaseURL(existingKey.adapter as LLMAdapter),
            withDefaultModels: existingKey.withDefaultModels,
            customModels: existingKey.customModels.map((value) => ({ value })),
            extraHeaders:
              existingKey.extraHeaderKeys?.map((key) => ({ key, value: "" })) ??
              [],
            vertexAILocation:
              existingKey.adapter === LLMAdapter.VertexAI && existingKey.config
                ? ((existingKey.config as VertexAIConfig).location ?? "")
                : "",
            awsRegion:
              existingKey.adapter === LLMAdapter.Bedrock && existingKey.config
                ? ((existingKey.config as BedrockConfig).region ?? "")
                : "",
            awsAccessKeyId: "",
            awsSecretAccessKey: "",
          }
        : {
            adapter: defaultAdapter,
            provider: "",
            secretKey: "",
            baseURL: getCustomizedBaseURL(defaultAdapter),
            withDefaultModels: true,
            customModels: [],
            extraHeaders: [],
            vertexAILocation: "global",
            awsRegion: "",
            awsAccessKeyId: "",
            awsSecretAccessKey: "",
          },
  });

  const currentAdapter = form.watch("adapter");

  const hasAdvancedSettings = (adapter: LLMAdapter) =>
    adapter === LLMAdapter.OpenAI ||
    adapter === LLMAdapter.Anthropic ||
    adapter === LLMAdapter.VertexAI ||
    adapter === LLMAdapter.GoogleAIStudio;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customModels",
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control: form.control,
    name: "extraHeaders",
  });

  const renderCustomModelsField = () => (
    <FormField
      control={form.control}
      name="customModels"
      render={() => (
        <FormItem>
          <FormLabel>{t("llmApiKeys.form.customModels")}</FormLabel>
          <FormDescription>
            {t("llmApiKeys.form.customModelsDescription")}
          </FormDescription>
          {currentAdapter === LLMAdapter.Azure && (
            <FormDescription className="text-dark-yellow">
              {t("llmApiKeys.form.customModelsAzureWarning")}
            </FormDescription>
          )}

          {currentAdapter === LLMAdapter.Bedrock && (
            <FormDescription className="text-dark-yellow">
              {t("llmApiKeys.form.customModelsBedrockWarning")}
            </FormDescription>
          )}

          {fields.map((customModel, index) => (
            <span key={customModel.id} className="flex flex-row space-x-2">
              <Input
                {...form.register(`customModels.${index}.value`)}
                placeholder={`${t("llmApiKeys.form.customModelName")} ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </span>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => append({ value: "" })}
            className="w-full"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {t("llmApiKeys.form.addCustomModel")}
          </Button>
        </FormItem>
      )}
    />
  );

  const renderExtraHeadersField = () => (
    <FormField
      control={form.control}
      name="extraHeaders"
      render={() => (
        <FormItem>
          <FormLabel>{t("llmApiKeys.form.extraHeaders")}</FormLabel>
          <FormDescription>
            {t("llmApiKeys.form.extraHeadersDescription", {
              location: isLangfuseCloud
                ? t("llmApiKeys.form.onOurServers")
                : t("llmApiKeys.form.inYourDatabase"),
            })}
          </FormDescription>

          {headerFields.map((header, index) => (
            <div key={header.id} className="flex flex-row space-x-2">
              <Input
                {...form.register(`extraHeaders.${index}.key`)}
                placeholder={t("llmApiKeys.form.headerName")}
              />
              <Input
                {...form.register(`extraHeaders.${index}.value`)}
                placeholder={
                  mode === "update" &&
                  existingKey?.extraHeaderKeys &&
                  existingKey.extraHeaderKeys[index]
                    ? "***"
                    : t("llmApiKeys.form.headerValue")
                }
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeHeader(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            onClick={() => appendHeader({ key: "", value: "" })}
            className="w-full"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {t("llmApiKeys.form.addHeader")}
          </Button>
        </FormItem>
      )}
    />
  );

  // Disable provider and adapter fields in update mode
  const isFieldDisabled = (fieldName: string) => {
    if (mode !== "update") return false;
    return ["provider", "adapter"].includes(fieldName);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!projectId) return console.error("No project ID found.");

    if (mode === "create") {
      if (
        existingKeys?.data?.data
          .map((k) => k.provider)
          .includes(values.provider)
      ) {
        form.setError("provider", {
          type: "manual",
          message: t("llmApiKeys.form.errors.providerExists"),
        });
        return;
      }
      capture("project_settings:llm_api_key_create", {
        provider: values.provider,
      });
    } else {
      capture("project_settings:llm_api_key_update", {
        provider: values.provider,
      });
    }

    let secretKey = values.secretKey;
    let config: BedrockConfig | VertexAIConfig | undefined;

    if (currentAdapter === LLMAdapter.Bedrock) {
      // In update mode, only update credentials if provided
      if (mode === "update") {
        // Only update secretKey if both credentials are provided
        if (values.awsAccessKeyId && values.awsSecretAccessKey) {
          const credentials: BedrockCredential = {
            accessKeyId: values.awsAccessKeyId,
            secretAccessKey: values.awsSecretAccessKey,
          };
          secretKey = JSON.stringify(credentials);
        } else {
          // Keep existing credentials by not setting secretKey
          secretKey = undefined;
        }
      } else {
        // In create mode, handle as before
        if (
          !isLangfuseCloud &&
          (!values.awsAccessKeyId || !values.awsSecretAccessKey)
        ) {
          secretKey = BEDROCK_USE_DEFAULT_CREDENTIALS;
        } else {
          const credentials: BedrockCredential = {
            accessKeyId: values.awsAccessKeyId ?? "",
            secretAccessKey: values.awsSecretAccessKey ?? "",
          };
          secretKey = JSON.stringify(credentials);
        }
      }

      config = {
        region: values.awsRegion ?? "",
      };
    } else if (currentAdapter === LLMAdapter.VertexAI) {
      // Handle Vertex AI credentials
      // secretKey already contains either JSON key or VERTEXAI_USE_DEFAULT_CREDENTIALS sentinel
      if (mode === "update") {
        // In update mode, only update secretKey if a new one is provided
        if (values.secretKey) {
          secretKey = values.secretKey;
        } else {
          // Keep existing credentials by not setting secretKey
          secretKey = undefined;
        }
      }
      // In create mode, secretKey is already set from values.secretKey

      // Build config with location only (projectId removed for security - ADC auto-detects)
      config = {};
      if (values.vertexAILocation?.trim()) {
        config.location = values.vertexAILocation.trim();
      }
      // If config is empty, set to undefined
      if (Object.keys(config).length === 0) {
        config = undefined;
      }
    }

    const extraHeaders =
      values.extraHeaders.length > 0
        ? values.extraHeaders.reduce(
            (acc, header) => {
              acc[header.key] = header.value ?? "";
              return acc;
            },
            {} as Record<string, string>,
          )
        : undefined;

    const newLlmApiKey = {
      id: existingKey?.id ?? "",
      projectId,
      secretKey: secretKey ?? "",
      provider: values.provider,
      adapter: values.adapter,
      baseURL: values.baseURL || undefined,
      withDefaultModels: isCustomModelsRequired(currentAdapter)
        ? false
        : values.withDefaultModels,
      config,
      customModels: values.customModels
        .map((m) => m.value.trim())
        .filter(Boolean),
      extraHeaders,
    };

    try {
      const testResult =
        mode === "create"
          ? await mutTestLLMApiKey.mutateAsync(newLlmApiKey)
          : await mutTestUpdateLLMApiKey.mutateAsync(newLlmApiKey);

      if (!testResult.success) throw new Error(testResult.error);
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : t("llmApiKeys.form.errors.verificationFailed"),
      });

      return;
    }

    return (mode === "create" ? mutCreateLlmApiKey : mutUpdateLlmApiKey)
      .mutateAsync(newLlmApiKey)
      .then(() => {
        form.reset();
        onSuccess();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4 overflow-auto")}
        onSubmit={(e) => {
          e.stopPropagation(); // Prevent event bubbling to parent forms
          form.handleSubmit(onSubmit)(e);
        }}
      >
        <DialogBody>
          {/* LLM adapter */}
          <FormField
            control={form.control}
            name="adapter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("llmApiKeys.form.adapter")}</FormLabel>
                <FormDescription>
                  {t("llmApiKeys.form.adapterDescription")}
                </FormDescription>
                <Select
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value as LLMAdapter);
                    form.setValue(
                      "baseURL",
                      getCustomizedBaseURL(value as LLMAdapter),
                    );
                  }}
                  disabled={isFieldDisabled("adapter")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("llmApiKeys.form.adapterPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(LLMAdapter).map((provider) => (
                      <SelectItem value={provider} key={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Provider name */}
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("llmApiKeys.form.provider")}</FormLabel>
                <FormDescription>
                  {t("llmApiKeys.form.providerDescription")}
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`e.g. ${currentAdapter}`}
                    disabled={isFieldDisabled("provider")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* API Key or AWS Credentials or Vertex AI Credentials */}
          {currentAdapter === LLMAdapter.Bedrock ? (
            <>
              <FormField
                control={form.control}
                name="awsRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("llmApiKeys.form.awsRegion")}</FormLabel>
                    <FormDescription>
                      {mode === "update" &&
                        existingKey?.config &&
                        (existingKey.config as BedrockConfig).region && (
                          <span className="text-sm">
                            {t("llmApiKeys.form.current")}{" "}
                            <code className="rounded bg-muted px-1 py-0.5">
                              {(existingKey.config as BedrockConfig).region}
                            </code>
                          </span>
                        )}
                    </FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          mode === "update" && existingKey?.config
                            ? ((existingKey.config as BedrockConfig).region ??
                              "")
                            : "e.g., us-east-1"
                        }
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="awsAccessKeyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("llmApiKeys.form.awsAccessKeyId")}
                      {!isLangfuseCloud && (
                        <span className="font-normal text-muted-foreground">
                          {" "}
                          {t("llmApiKeys.form.optional")}
                        </span>
                      )}
                    </FormLabel>
                    <FormDescription>
                      {mode === "update"
                        ? t("llmApiKeys.form.bedrockUpdateDescription")
                        : isLangfuseCloud
                          ? t("llmApiKeys.form.bedrockCloudDescription")
                          : t("llmApiKeys.form.bedrockSelfHostedDescription")}
                    </FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          mode === "update"
                            ? existingKey?.displaySecretKey ===
                              "Default AWS credentials"
                              ? t("llmApiKeys.form.usingDefaultAwsCredentials")
                              : `•••••••• ${t("llmApiKeys.form.preservedIfEmpty")}`
                            : undefined
                        }
                        autoComplete="off"
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="awsSecretAccessKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("llmApiKeys.form.awsSecretAccessKey")}
                      {!isLangfuseCloud && (
                        <span className="font-normal text-muted-foreground">
                          {" "}
                          {t("llmApiKeys.form.optional")}
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={
                          mode === "update"
                            ? existingKey?.displaySecretKey ===
                              "Default AWS credentials"
                              ? t("llmApiKeys.form.usingDefaultAwsCredentials")
                              : existingKey?.displaySecretKey
                                ? `${existingKey.displaySecretKey} ${t("llmApiKeys.form.preservedIfEmpty")}`
                                : `•••••••• ${t("llmApiKeys.form.preservedIfEmpty")}`
                            : undefined
                        }
                        autoComplete="new-password"
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isLangfuseCloud && (
                <div className="space-y-2 border-l-2 border-blue-200 pl-4 text-sm text-muted-foreground">
                  <p>
                    <strong>{t("llmApiKeys.form.awsDefaultChainTitle")}</strong>{" "}
                    {t("llmApiKeys.form.awsDefaultChainDescription")}
                  </p>
                  <ul className="ml-2 list-inside list-disc space-y-1">
                    <li>{t("llmApiKeys.form.awsEnvVars")}</li>
                    <li>{t("llmApiKeys.form.awsCredsFile")}</li>
                    <li>{t("llmApiKeys.form.awsIamEc2")}</li>
                    <li>{t("llmApiKeys.form.awsIamEcs")}</li>
                  </ul>
                  <p>
                    <a
                      href="https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {t("llmApiKeys.form.awsLearnMore")}
                    </a>
                  </p>
                </div>
              )}
            </>
          ) : currentAdapter === LLMAdapter.VertexAI ? (
            <>
              {/* Vertex AI ADC option for self-hosted only, create mode only */}
              {!isLangfuseCloud && mode === "create" && (
                <FormItem>
                  <span className="row flex">
                    <span className="flex-1">
                      <FormLabel>{t("llmApiKeys.form.useAdc")}</FormLabel>
                      <FormDescription>
                        {t("llmApiKeys.form.adcDescription")}
                      </FormDescription>
                    </span>
                    <FormControl>
                      <Switch
                        checked={
                          form.watch("secretKey") ===
                          VERTEXAI_USE_DEFAULT_CREDENTIALS
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue(
                              "secretKey",
                              VERTEXAI_USE_DEFAULT_CREDENTIALS,
                            );
                          } else {
                            form.setValue("secretKey", "");
                          }
                        }}
                      />
                    </FormControl>
                  </span>
                </FormItem>
              )}

              {/* Service Account Key - hidden when ADC is enabled */}
              {(isLangfuseCloud ||
                form.watch("secretKey") !==
                  VERTEXAI_USE_DEFAULT_CREDENTIALS) && (
                <FormField
                  control={form.control}
                  name="secretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("llmApiKeys.form.gcpKey")}</FormLabel>
                      <FormDescription>
                        {t("llmApiKeys.form.encryptedStored", {
                          location: isLangfuseCloud
                            ? t("llmApiKeys.form.onOurServers")
                            : t("llmApiKeys.form.inYourDatabase"),
                        })}
                      </FormDescription>
                      <FormDescription className="text-dark-yellow">
                        {t("llmApiKeys.form.gcpKeyDescription")}{" "}
                        {t("llmApiKeys.form.exampleJson")}
                        <pre className="text-xs">
                          {`{
  "type": "service_account",
  "project_id": "<project_id>",
  "private_key_id": "<private_key_id>",
  "private_key": "<private_key>",
  "client_email": "<client_email>",
  "client_id": "<client_id>",
  "auth_uri": "<auth_uri>",
  "token_uri": "<token_uri>",
  "auth_provider_x509_cert_url": "<auth_provider_x509_cert_url>",
  "client_x509_cert_url": "<client_x509_cert_url>",
}`}
                        </pre>
                      </FormDescription>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={
                            mode === "update"
                              ? existingKey?.displaySecretKey
                              : '{"type": "service_account", ...}'
                          }
                          autoComplete="off"
                          spellCheck="false"
                          autoCapitalize="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ADC info box for self-hosted */}
              {!isLangfuseCloud &&
                form.watch("secretKey") ===
                  VERTEXAI_USE_DEFAULT_CREDENTIALS && (
                  <div className="space-y-2 border-l-2 border-blue-200 pl-4 text-sm text-muted-foreground">
                    <p>
                      <strong>{t("llmApiKeys.form.adcTitle")}</strong>{" "}
                      {t("llmApiKeys.form.adcCheckDescription")}
                    </p>
                    <ul className="ml-2 list-inside list-disc space-y-1">
                      <li>{t("llmApiKeys.form.adcEnvVar")}</li>
                      <li>{t("llmApiKeys.form.adcGcloud")}</li>
                      <li>{t("llmApiKeys.form.adcGke")}</li>
                      <li>{t("llmApiKeys.form.adcCloudRun")}</li>
                      <li>{t("llmApiKeys.form.adcComputeEngine")}</li>
                    </ul>
                    <p>
                      <a
                        href="https://cloud.google.com/docs/authentication/application-default-credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {t("llmApiKeys.form.adcLearnMore")}
                      </a>
                    </p>
                  </div>
                )}
            </>
          ) : (
            <FormField
              control={form.control}
              name="secretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("llmApiKeys.form.apiKey")}</FormLabel>
                  <FormDescription>
                    {t("llmApiKeys.form.encryptedStored", {
                      location: isLangfuseCloud
                        ? t("llmApiKeys.form.onOurServers")
                        : t("llmApiKeys.form.inYourDatabase"),
                    })}
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        mode === "update"
                          ? existingKey?.displaySecretKey
                          : undefined
                      }
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Azure Base URL - Always required for Azure */}
          {currentAdapter === LLMAdapter.Azure && (
            <FormField
              control={form.control}
              name="baseURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("llmApiKeys.form.baseUrl")}</FormLabel>
                  <FormDescription>
                    {t("llmApiKeys.form.azureBaseUrlDescription")}
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://your-instance.openai.azure.com/openai/deployments"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Custom models: top-level for Azure/Bedrock */}
          {isCustomModelsRequired(currentAdapter) && renderCustomModelsField()}

          {/* Extra headers - show for Azure in main section (Azure has no advanced settings) */}
          {currentAdapter === LLMAdapter.Azure && renderExtraHeadersField()}

          {hasAdvancedSettings(currentAdapter) && (
            <div className="flex items-center">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="flex items-center pl-0"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                <span>
                  {showAdvancedSettings
                    ? t("llmApiKeys.form.hideAdvanced")
                    : t("llmApiKeys.form.showAdvanced")}
                </span>
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${showAdvancedSettings ? "rotate-180" : "rotate-0"}`}
                />
              </Button>
            </div>
          )}

          {hasAdvancedSettings(currentAdapter) && showAdvancedSettings && (
            <div className="space-y-4 border-t pt-4">
              {/* baseURL */}
              <FormField
                control={form.control}
                name="baseURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("llmApiKeys.form.baseUrl")}</FormLabel>
                    <FormDescription>
                      {t("llmApiKeys.form.baseUrlDescription")}{" "}
                      {currentAdapter === LLMAdapter.OpenAI && (
                        <span>
                          {t("llmApiKeys.form.baseUrlOpenAI")}{" "}
                          https://api.openai.com/v1
                        </span>
                      )}
                      {currentAdapter === LLMAdapter.Anthropic && (
                        <span>
                          {t("llmApiKeys.form.baseUrlAnthropic")}{" "}
                          https://api.anthropic.com (excluding /v1/messages)
                        </span>
                      )}
                    </FormDescription>

                    <FormControl>
                      <Input {...field} placeholder={t("common.default")} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* VertexAI Location */}
              {currentAdapter === LLMAdapter.VertexAI && (
                <FormField
                  control={form.control}
                  name="vertexAILocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("llmApiKeys.form.locationGlobal")}
                      </FormLabel>
                      <FormDescription>
                        {t("llmApiKeys.form.locationGlobalDescription")}
                      </FormDescription>
                      <FormControl>
                        <Input {...field} placeholder="global" data-1p-ignore />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Extra Headers */}
              {currentAdapter === LLMAdapter.OpenAI &&
                renderExtraHeadersField()}

              {/* With default models */}
              <FormField
                control={form.control}
                name="withDefaultModels"
                render={({ field }) => (
                  <FormItem>
                    <span className="row flex">
                      <span className="flex-1">
                        <FormLabel>
                          {t("llmApiKeys.form.enableDefaultModels")}
                        </FormLabel>
                        <FormDescription>
                          {t("llmApiKeys.form.enableDefaultModelsDescription")}
                        </FormDescription>
                      </span>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </span>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom model names */}
              {!isCustomModelsRequired(currentAdapter) &&
                renderCustomModelsField()}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              loading={form.formState.isSubmitting}
            >
              {mode === "create"
                ? t("llmApiKeys.form.createConnection")
                : t("llmApiKeys.form.saveChanges")}
            </Button>
            {form.formState.errors.root && (
              <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
