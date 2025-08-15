import Profile from "#models/profile";
import { settingsValidator } from "#validators/settings";
import type { HttpContext } from "@adonisjs/core/http";
import { attachmentManager } from "@jrmc/adonis-attachment";

export default class SettingsController {
  public async edit({ auth, request, response }: HttpContext) {
    const { name, avatar, websiteUrl, location, bio, deleteAvatar } =
      await request.validateUsing(settingsValidator);

    console.log(avatar);

    const user = await auth.use("web").authenticate();

    const profile = await Profile.firstOrNew({ userId: user.id });

    profile.merge({
      name: name,
      websiteUrl: websiteUrl,
      location: location,
      bio: bio,
    });

    if (deleteAvatar) {
      profile.avatar = null;
    } else if (avatar?.isValid) {
      profile.avatar = await attachmentManager.createFromFile(avatar);
    }

    await profile.save();
    return response.redirect("/settings");
  }

  public async show({ inertia, auth, response }: HttpContext) {
    try {
      const user = await auth.use("web").authenticate();
      if (user == null) {
        return response.unauthorized();
      }

      const profile = await Profile.query().where("user_id", user.id).first();

      return inertia.render("settings", {
        profile,
      });
    } catch (error) {
      console.error("Error in SettingsController.show:", error);
      return response.redirect("/login");
    }
  }

  public async deleteAccount({ auth, response }: HttpContext) {
    const user = await auth.use("web").authenticate();
    await auth.use("web").logout();

    await user.delete();

    return response.redirect("/");
  }
}
