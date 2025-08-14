import vine from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";

export const settingsValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(100),
    username: vine.string().maxLength(50),
    avatar: vine
      .file({
        size: "500kb",
        extnames: ["jpg", "jpeg", "png", "webp"],
      })
      .optional(),
    deleteAvatar: vine.boolean(),
    websiteUrl: vine.string().url().optional(),
    location: vine.string().maxLength(100).optional(),
    bio: vine.string().maxLength(500).optional(),
  }),
);

export type SettingsValidator = Infer<typeof settingsValidator>;

export type SettingsValidatorClient = Omit<SettingsValidator, "avatar"> & {
  avatar?: File | null;
};
