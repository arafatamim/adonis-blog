import Post from "#models/post";
import Profile from "#models/profile";
import User from "#models/user";
import type { HttpContext } from "@adonisjs/core/http";

export default class UsersController {
  public async show({
    params,
    response,
    auth,
    inertia,
    session,
    bouncer,
  }: HttpContext) {
    const username = params.username;

    const user = await User.findBy("username", username);
    if (user == null) {
      return response.notFound("User not found");
    }

    const profile = await Profile.findBy("user_id", user.id);

    if (profile == null) {
      const currentUser = auth.user;
      if (currentUser != null && currentUser.id === user.id) {
        session.flash("error", "Please create your profile first");
        return response.redirect("/settings");
      }
      return response.notFound("Profile not found");
    }

    const posts = await Post.query()
      .where("user_id", user.id)
      .orderBy("updated_at", "desc")
      .preload("user", (builder) => builder.preload("profile"));

    const visiblePosts = posts.filter(
      async (post) => await bouncer.with("PostPolicy").allows("view", post),
    );

    return inertia.render("profile", {
      profile,
      posts: visiblePosts,
      isOwnProfile: auth.user?.id === user.id,
    });
  }
}
