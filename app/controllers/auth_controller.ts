import User from "#models/user";
import { loginValidator, signupValidator } from "#validators/auth";
import type { HttpContext } from "@adonisjs/core/http";

export default class AuthController {
  async login({ request, response, auth }: HttpContext) {
    const { username, password, rememberMe } =
      await request.validateUsing(loginValidator);
    const user = await User.verifyCredentials(username, password);

    await auth.use("web").login(user, rememberMe);

    response.redirect(`/${user.username}`);
  }

  public async signup({ request, response, auth }: HttpContext) {
    const { username, password } = await request.validateUsing(signupValidator);
    const user = await User.create({ username, password });

    await auth.use("web").login(user);

    response.redirect("/settings");
  }

  public async logout({ response, auth }: HttpContext) {
    await auth.use("web").logout();
    return response.redirect("/");
  }
}
