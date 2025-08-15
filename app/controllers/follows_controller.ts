import User from "#models/user";
import type { HttpContext } from "@adonisjs/core/http";

export default class FollowsController {
  async follow({ params, bouncer, auth, response }: HttpContext) {
    const currentUser = await auth.use("web").authenticate();
    const targetUserId = params.id;

    const targetUser = await User.find(targetUserId);

    if (targetUser == null || currentUser == null) {
      return response.notFound();
    }

    await bouncer.with("FollowPolicy").authorize("follow", targetUser);

    // check existing follow
    const existingFollow = await currentUser
      .related("following")
      .query()
      .where("users.id", targetUserId)
      .first();

    if (existingFollow != null) {
      return response.conflict("You already follow this user");
    }

    await currentUser.related("following").attach([targetUserId]);

    return response.redirect().back();
  }

  async unfollow({ params, bouncer, auth, response }: HttpContext) {
    const currentUser = await auth.use("web").authenticate();
    const targetUserId = params.id;

    const targetUser = await User.find(targetUserId);

    if (targetUser == null || currentUser == null) {
      return response.notFound();
    }

    await bouncer.with("FollowPolicy").authorize("follow", targetUser);

    // check existing follow
    const existingFollow = await currentUser
      .related("following")
      .query()
      .where("users.id", targetUserId)
      .first();

    if (existingFollow == null) {
      return response.conflict("You don't follow this user");
    }

    await currentUser.related("following").detach([targetUserId]);

    return response.redirect().back();
  }

  /** Check if authenticated user is following a user */
  async checkFollowingStatus({ params, auth, response }: HttpContext) {
    const currentUser = await auth.use("web").authenticate();
    const targetUserId = params.id;

    const targetUser = await User.find(targetUserId);
    if (!targetUser) {
      return response.notFound({
        message: "User not found",
      });
    }

    const isFollowing = await currentUser
      .related("following")
      .query()
      .where("users.id", targetUserId)
      .first();

    // Get follower counts
    const followerCount = await targetUser
      .related("followers")
      .query()
      .count("* as total");
    const followingCount = await targetUser
      .related("following")
      .query()
      .count("* as total");

    return response.ok({
      isFollowing: !!isFollowing,
      targetUser: {
        id: targetUser.id,
        username: targetUser.username,
        followerCount: followerCount[0].$extras.total,
        followingCount: followingCount[0].$extras.total,
      },
    });
  }
}
