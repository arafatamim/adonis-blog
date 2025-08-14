import User from "#models/user";
import Post from "#models/post";
import { allowGuest, BasePolicy } from "@adonisjs/bouncer";
import type { AuthorizerResponse } from "@adonisjs/bouncer/types";

export default class PostPolicy extends BasePolicy {
  @allowGuest()
  view(user: User | null, post: Post): AuthorizerResponse {
    if (post.published) {
      return true;
    }

    // only author can view drafts
    if (!user) {
      return false;
    }

    // return post
    return user.id === post.userId;
  }

  edit(user: User, post: Post): AuthorizerResponse {
    // only author can edit
    return user.id === post.userId;
  }

  create(user: User | null): AuthorizerResponse {
    // allow any authenticated user to create a post
    return user != null;
  }

  save(user: User, post: Post): AuthorizerResponse {
    // author cannot save own post
    return post.published && post.userId !== user.id;
  }
}
