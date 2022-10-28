import Route from "@ioc:Adonis/Core/Route";
import Post from "App/Models/Post";
import SavedPost from "App/Models/SavedPost";

Route.on("/").render("welcome");

Route.get("/dashboard", async ({ view }) => {
  const posts = await Post.query()
    .whereLike("published", true)
    .orderBy("created_at", "desc")
    .preload("user", (builder) => builder.preload("profile"))
    .limit(10)
    .exec();

  return view.render("dashboard", { posts });
});

Route.group(() => {
  Route.get("login", async ({ view, auth, response }) => {
    const user = auth.user;
    if (user != null) {
      return response.redirect("/" + user.username);
    } else {
      return view.render("login");
    }
  });
  Route.on("signup").render("signup");

  Route.post("logout", "AuthController.logout");
  Route.post("login", "AuthController.login");
  Route.post("signup", "AuthController.signup");
});

Route.group(() => {
  Route.get("/", "SettingsController.show");
  Route.post("/", "SettingsController.edit");
})
  .prefix("/settings")
  .middleware("auth");

Route.get("/:username/:slug", "PostsController.show");
Route.group(() => {
  Route.get("/:username/:slug/edit", "PostsController.showEdit");
  Route.on("/new").render("post/new");

  Route.put("/api/post/:id", "PostsController.edit");
  Route.delete("/api/post/:id", "PostsController.destroy");
  Route.post("/api/post", "PostsController.create");
  Route.post("/api/post/:id/save", async ({auth, request, response})=>{
    const postId = request.param("id")
    console.log(postId)
    if (auth.user == null) {
      throw response.unauthorized()
    }
    const savedPost = new SavedPost()
    savedPost.userId = auth.user.id
    savedPost.postId = parseInt(postId)
    await savedPost.save()
  })
}).middleware("auth");

Route.get("/:username", "UsersController.show");

