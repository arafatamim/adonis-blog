import PostDto from "#dtos/post";
import SavedPostDto from "#dtos/saved_post";
import UserDto from "#dtos/user";
import Post from "#models/post";
import Profile from "#models/profile";
import SavedPost from "#models/saved_post";
import User from "#models/user";
import FollowService from "#services/follow_service";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class UsersController {
  constructor(protected followsService: FollowService) {}

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

    const profile = await Profile.query()
      .where("user_id", user.id)
      .preload("user")
      .first();

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

    const savedPosts = await SavedPost.query()
      .where("user_id", user.id)
      .orderBy("created_at", "desc")
      .preload("post", (builder) =>
        builder.preload("user", (userBuilder) =>
          userBuilder.preload("profile"),
        ),
      );

    const followStatus = await this.followsService.getFollowStatus(
      auth.user?.id ?? -1,
      user.id,
    );

    return inertia.render("profile", {
      profile,
      posts: visiblePosts.map((post) => new PostDto(post)),
      savedPosts: savedPosts.map((savedPost) => new SavedPostDto(savedPost)),
      isOwnProfile: auth.user?.id === user.id,
      followStatus: auth.user ? followStatus : null,
    });
  }

  public async followers({ params, response, inertia }: HttpContext) {
    const user = await User.findBy("username", params.username);
    if (user == null) {
      return response.notFound("User not found");
    }

    const followers = await this.followsService.getFollowers(user);

    return inertia.render("follow/followers", {
      targetUser: new UserDto(user),
      followers: followers.map((follow) => new UserDto(follow)),
    });
  }

  public async following({ params, response, inertia }: HttpContext) {
    const user = await User.findBy("username", params.username);
    if (user == null) {
      return response.notFound("User not found");
    }

    const following = await this.followsService.getFollowing(user);

    return inertia.render("follow/following", {
      targetUser: new UserDto(user),
      following: following.map((follow) => new UserDto(follow)),
    });
  }
}
