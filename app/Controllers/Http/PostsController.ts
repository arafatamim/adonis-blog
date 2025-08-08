import { Exception } from "@adonisjs/core/build/standalone";
import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Post from "App/Models/Post";
import * as marked from "marked";
import xss from "xss";

export default class PostsController {
  private async findPostBySlug(slug: string) {
    const post = await Post.query()
      .where("slug", slug)
      .preload("user", (q) => q.preload("profile"))
      .first();

    if (post == null) {
      throw new Exception("Post not found", 404);
    }

    const content = xss(marked.parse(post.content));

    return { post, content };
  }

  public async show({ request, view, bouncer }: HttpContextContract) {
    const slug = request.param("slug");

    const post = await this.findPostBySlug(slug);

    await bouncer.authorize("viewPost", post.post);

    return view.render("post/show", post);
  }

  public async showEdit({ request, view, bouncer }: HttpContextContract) {
    const slug = request.param("slug");

    const post = await this.findPostBySlug(slug);

    await bouncer.authorize("ownsPost", post.post);

    return view.render("post/edit", post);
  }

  public async create({ response, request, auth }: HttpContextContract) {
    if (auth?.user == null) {
      throw new UnauthorizedException("Unauthorized", 403, "E_UNAUTHORIZED");
    }

    const data = request.all();

    const coverImage = request.file("coverImage", {
      size: "500kb",
      extnames: ["jpg", "jpeg", "png", "webp"],
    });
    const title = data["title"];
    const body = data["body"];
    const published = data["action"] === "publish";

    const post = await Post.create({
      title,
      coverImage: coverImage?.isValid ? Attachment.fromFile(coverImage) : null,
      content: body,
      published,
      userId: auth.user.id,
    });

    return response.redirect("/" + auth.user.username + "/" + post.slug);
  }

  public async edit({ response, request, auth, bouncer }: HttpContextContract) {
    const id = request.param("id");

    const coverImage = request.file("coverImage", {
      size: "500kb",
      extnames: ["jpg", "jpeg", "png", "webp"],
    });
    const body = request.input("body");
    const action = request.input("action");
    const published = action === "publish";

    const post = await Post.findBy("id", id);
    if (post == null) {
      throw new Exception("Post not found!", 404);
    }

    if (action === "delete") {
      await post.delete();
      return response.redirect("/" + auth.user?.username);
    }

    await bouncer.authorize("modifyPost", post);

    if (coverImage?.isValid) {
      post.coverImage = Attachment.fromFile(coverImage);
    }

    post.published = published;
    post.content = body;

    await post.save();

    return response.redirect(`/${auth.user?.username}/${post.slug}`);
  }

  public async destroy({ response, bouncer, request }: HttpContextContract) {
    const postId = request.param("id");

    const post = await Post.findBy("id", postId);
    if (post == null) {
      return response.notFound();
    }

    await bouncer.authorize("modifyPost", post);

    await post.delete();
    return response.ok({});
  }
}
