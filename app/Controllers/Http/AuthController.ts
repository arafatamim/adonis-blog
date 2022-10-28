import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "../../Models/User";

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const username = request.input("username");
    const password = request.input("password");
    const remember = request.input("remember") === "on";

    try {
      await auth.use("web").attempt(username, password, remember);
      response.redirect("/" + username);
    } catch (e) {
      console.error(e);
      return response.unauthorized(e);
    }
  }

  public async signup({ request, response, session }: HttpContextContract) {
    const username = request.input("username");
    const password = request.input("password");

    try {
      await User.create({
        username: username,
        password: password,
      });
      response.redirect("/login");
    } catch (e) {
      if (e.errno === 19) {
        session.flash("error", "Could not create account!");
        return response.redirect("/signup");
      }
      return response.badRequest(e);
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    const user = auth.use("web").user;
    if (user != null) {
      await auth.use("web").logout();
      console.log("Logged out " + user.username);
    }
    return response.redirect("/");
  }
}
