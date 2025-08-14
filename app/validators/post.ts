import vine from "@vinejs/vine";

export const postValidator = vine.compile(
  vine.object({
    coverImage: vine
      .file({
        size: "500kb",
        extnames: ["jpg", "jpeg", "png", "webp", "avif"],
      })
      .optional(),
    title: vine.string().maxLength(255),
    body: vine.string(),
    isPublished: vine.boolean(),
  }),
);
