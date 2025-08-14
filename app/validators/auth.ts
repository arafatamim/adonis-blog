import vine from "@vinejs/vine";

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string(),
    rememberMe: vine.boolean(),
  }),
);

export const signupValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string(),
  }),
);
