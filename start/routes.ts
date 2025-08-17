import Post from "#models/post";
import router from "@adonisjs/core/services/router";
import { middleware } from "./kernel.js";
import Profile from "#models/profile";
import PostDto from "#dtos/post";

const UsersController = () => import("#controllers/users_controller");

router
  .get("/", async ({ inertia, auth }) => {
    const posts = await Post.query()
      .where("published", true)
      .orderBy("created_at", "desc")
      .preload("user", (builder) => builder.preload("profile"))
      .limit(10)
      .exec();

    const profile =
      auth.user != null
        ? await Profile.findBy({
            userId: auth.user.id,
          })
        : null;

    const followingsPosts =
      auth.user != null
        ? await Post.query()
            .select("posts.*", "users.username as author_username")
            .join("user_followers", "user_followers.user_id", "posts.user_id")
            .join("users", "users.id", "posts.user_id")
            .where("user_followers.follower_id", auth.user.id)
            .andWhere("posts.published", true)
            .orderBy("posts.created_at", "desc")
            .preload("user", (builder) => builder.preload("profile"))
        : null;

    return inertia.render("dashboard", {
      posts,
      profile,
      followingsPosts: followingsPosts?.map((post) => new PostDto(post)),
    });
  })
  .use(middleware.silentAuth());

// auth
router
  .group(() => {
    const authController = () => import("#controllers/auth_controller");

    router.get("login", async ({ inertia, auth, response }) => {
      try {
        const user = await auth.use("web").authenticate();
        return response.redirect("/" + user.username);
      } catch (error) {
        console.error(error);
        return inertia.render("login");
      }
    });
    router.post("login", [authController, "login"]);

    router.post("signup", [authController, "signup"]);
    router.on("signup").renderInertia("signup");

    router.post("logout", [authController, "logout"]);
  })
  .use(middleware.silentAuth());

// settings
const SettingsController = () => import("#controllers/settings_controller");
router
  .group(() => {
    router.get("/", [SettingsController, "show"]);
    router.post("/", [SettingsController, "edit"]);
  })
  .prefix("/settings")
  .use(middleware.auth());

// user follows
router
  .group(() => {
    router.get("/followers", [UsersController, "followers"]);
    router.get("/following", [UsersController, "following"]);
  })
  .prefix("/:username")
  .middleware(middleware.auth());

// comments
const CommentsController = () => import("#controllers/comments_controller");
router
  .group(() => {
    router.post("/posts/:postId/comments", [CommentsController, "create"]);
    router.post("/comments/:commentId/replies", [CommentsController, "reply"]);
    router.put("/comments/:id", [CommentsController, "update"]);
    router.delete("/comments/:id", [CommentsController, "destroy"]);
  })
  .middleware(middleware.auth());

// comment API routes
router
  .group(() => {
    router.get("/posts/:postId/comments", [CommentsController, "index"]);
    router.get("/comments/:commentId/thread", [CommentsController, "thread"]);
  })
  .prefix("/api")
  .use(middleware.silentAuth());

// posts
const postsController = () => import("#controllers/posts_controller");
router
  .group(() => {
    router.on("/new").renderInertia("post/new");
    router.post("/new", [postsController, "create"]);
  })
  .middleware(middleware.auth());

router
  .group(() => {
    router.delete("/:id", [postsController, "destroy"]);
    router.put("/:id", [postsController, "update"]);

    router.post("/:id/save", [postsController, "save"]);
    router.delete("/:id/save", [postsController, "unsave"]);
  })
  .prefix("/posts")
  .middleware(middleware.auth());

router
  .get("/:username/:slug/edit", [postsController, "showEdit"])
  .middleware(middleware.auth());

router
  .get("/:username/:slug", [postsController, "show"])
  .use(middleware.silentAuth());

// follows
const FollowsController = () => import("#controllers/follows_controller");
router
  .group(() => {
    router.post("/users/:id/follow", [FollowsController, "follow"]);
    router.delete("/users/:id/follow", [FollowsController, "unfollow"]);
    router.get("/users/:id/follow-status", [
      FollowsController,
      "checkFollowingStatus",
    ]);
  })
  .middleware(middleware.auth());

// delete user
router.delete("/users/delete", [SettingsController, "deleteAccount"]);

// user
router
  .get("/:username", [UsersController, "show"])
  .use(middleware.silentAuth());
