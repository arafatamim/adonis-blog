import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "../../Models/Post";
import Profile from "../../Models/Profile";
import User from "../../Models/User";

export default class UsersController {
  public async show({ params, view, response }: HttpContextContract) {
    const username = params.username;

    try {
      const user = await User.findBy("username", username);
      if (user == null) {
        throw new Error("user not found");
      }

      const profile = await Profile.findBy("user_id", user.id);

      if (profile == null) {
        return response.redirect("/settings");
      }

      const posts = await Post.query()
        .where("user_id", user.id)
        .orderBy("updated_at", "desc")
        .exec();

      return view.render("user", {
        profile,
        user,
        posts,
      });
    } catch (e) {
      return response.notFound();
    }
  }
}
