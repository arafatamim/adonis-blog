import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";
import Profile from "App/Models/Profile";

export default class SettingsController {
  public async edit({ auth, request, response }: HttpContextContract) {
    const user = await auth.use("web").authenticate();

    const avatar = request.file("avatar", {
      size: "500kb",
      extnames: ["jpg", "jpeg", "png", "webp"],
    });
    // TODO: profile picture gets deleted if saved with no file selected
    const name = request.input("name");
    const websiteUrl = request.input("website_url");
    const location = request.input("location");
    const bio = request.input("bio");

    await Profile.updateOrCreate(
      {
        userId: user.id,
      },
      {
        avatar: avatar?.isValid ? Attachment.fromFile(avatar) : undefined,
        name: name != "" ? name : undefined,
        websiteUrl: websiteUrl != "" ? websiteUrl : undefined,
        location: location != "" ? location : undefined,
        bio: bio != "" ? bio : undefined,
      }
    );

    return response.redirect("/settings");
  }

  public async show({ view, auth, response }: HttpContextContract) {
    const user = auth.user;
    if (user == null) {
      return response.unauthorized();
    }

    const profile = await Profile.query().where("user_id", user.id).first();

    return view.render("settings", {
      username: user.username,
      profile,
    });
  }
}
