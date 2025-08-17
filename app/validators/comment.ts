import vine from "@vinejs/vine";

export const commentValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(1).maxLength(500).escape(),
  }),
);
