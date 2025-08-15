import User from "#models/user";

export default class FollowService {
  async getFollowStatus(currentUserId: number, targetUserId: number) {
    const currentUser = await User.find(currentUserId);
    const targetUser = await User.find(targetUserId);

    if (!currentUser || !targetUser) {
      return null;
    }

    const isFollowing =
      currentUserId !== targetUserId
        ? await currentUser
            .related("following")
            .query()
            .where("users.id", targetUserId)
            .first()
        : null;

    const followerCount = await targetUser
      .related("followers")
      .query()
      .count("* as total");
    const followingCount = await targetUser
      .related("following")
      .query()
      .count("* as total");

    return {
      isFollowing: !!isFollowing,
      followerCount: Number.parseInt(followerCount[0].$extras.total),
      followingCount: Number.parseInt(followingCount[0].$extras.total),
    };
  }

  async getFollowers(user: User) {
    const followers = await user
      .related("followers")
      .query()
      .preload("profile");

    return followers;
  }

  async getFollowing(user: User) {
    const following = await user
      .related("following")
      .query()
      .preload("profile");

    return following;
  }
}
