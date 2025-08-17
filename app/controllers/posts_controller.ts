import Comment from "#models/comment";
import CommentDto from "#dtos/comment";
import Post from "#models/post";
import SavedPost from "#models/saved_post";
import { postValidator } from "#validators/post";
import type { HttpContext } from "@adonisjs/core/http";
import { attachmentManager } from "@jrmc/adonis-attachment";
import PostDto from "#dtos/post";
import User from "#models/user";
import UserDto from "#dtos/user";

export default class PostsController {
  private async findPostBySlug(slug: string): Promise<Post | null> {
    const post = await Post.query()
      .where("slug", slug)
      .preload("user", (q) => q.preload("profile"))
      .first();

    if (post == null) {
      return null;
    }

    // const content = xss(marked.parse(post.content));

    return post;
  }

  public async show({
    request,
    inertia,
    bouncer,
    response,
    auth,
  }: HttpContext) {
    const slug = request.param("slug");

    const post = await this.findPostBySlug(slug);
    if (post == null) {
      return response.notFound();
    }

    await bouncer.with("PostPolicy").authorize("view", post);

    let isSaved = false;
    let savesCount = 0;

    let user: User | null | undefined = auth.user;

    if (user) {
      const savedPost = await SavedPost.findBy({
        userId: user.id,
        postId: post.id,
      });
      isSaved = !!savedPost;

      const savedPosts = await SavedPost.query()
        .where("post_id", post.id)
        .count("* as total");

      savesCount = Number.parseInt(savedPosts[0]?.$extras?.total || 0);

      // also get user with profile
      user = await User.query().where("id", user.id).preload("profile").first();
    }

    const flatComments = await Comment.query()
      .where("post_id", post.id)
      .preload("user", (userQuery) => {
        userQuery.preload("profile");
      })
      .preload("parentComment", (q) => q.preload("user"))
      .orderBy("thread_path", "desc")
      .orderBy("created_at", "desc");

    const comments = CommentDto.buildTree(flatComments);

    return inertia.render("post/show", {
      user: new UserDto(user ?? undefined),
      post: new PostDto(post),
      isOwnPost: auth.user?.id === post.userId,
      isSaved,
      savesCount,
      comments,
    });
  }

  public async showEdit({ response, request, inertia, bouncer }: HttpContext) {
    const slug = request.param("slug");

    const post = await this.findPostBySlug(slug);
    if (post == null) {
      return response.notFound();
    }

    await bouncer.with("PostPolicy").authorize("edit", post);

    return inertia.render("post/edit", { post });
  }

  public async create({ response, bouncer, request, auth }: HttpContext) {
    await bouncer.with("PostPolicy").authorize("create");

    const user = await auth.use("web").authenticate();

    const { coverImage, title, body, isPublished } =
      await request.validateUsing(postValidator);

    const post = await new Post()
      .fill({
        title,
        coverImage: coverImage?.isValid
          ? await attachmentManager.createFromFile(coverImage)
          : null,
        content: body,
        published: isPublished,
        userId: user.id,
      })
      .save();

    return response.redirect("/" + user.username + "/" + post.slug);
  }

  public async update({ response, request, auth, bouncer }: HttpContext) {
    const postId = request.param("id");

    const post = await Post.findBy({ id: postId });

    if (post == null) {
      return response.notFound();
    }

    await bouncer.with("PostPolicy").authorize("edit", post);

    const user = await auth.use("web").authenticate();

    const { coverImage, body, title, isPublished } =
      await request.validateUsing(postValidator);

    if (coverImage?.isValid) {
      post.coverImage = await attachmentManager.createFromFile(coverImage);
    }

    post.title = title;
    post.published = isPublished;
    post.content = body;

    await post.save();

    return response.redirect(`/${user.username}/${post.slug}`);
  }

  public async destroy({ response, auth, bouncer, request }: HttpContext) {
    const postId = request.param("id");

    const post = await Post.findBy({ id: postId });
    if (post == null) {
      return response.notFound();
    }

    await bouncer.with("PostPolicy").authorize("edit", post);
    const user = await auth.use("web").authenticate();

    await post.delete();

    return response.redirect(`/${user.username}`);
  }

  async save({ auth, bouncer, params, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const post = await Post.findOrFail(params.id);

    await bouncer.with("PostPolicy").authorize("save", post);

    const existingSave = await SavedPost.findBy({
      userId: user.id,
      postId: post.id,
    });

    if (existingSave) {
      return response.badRequest({ message: "Post already saved" });
    }

    await SavedPost.create({
      userId: user.id,
      postId: post.id,
    });

    return response.redirect().back();
  }

  async unsave({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const savedPost = await SavedPost.findBy({
      userId: user.id,
      postId: params.id,
    });

    if (!savedPost) {
      return response.badRequest({ message: "Post not saved" });
    }

    await savedPost.delete();

    return response.redirect().back();
  }
}
