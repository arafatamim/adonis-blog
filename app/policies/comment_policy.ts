import Comment from "#models/comment";
import User from "#models/user";
import { allowGuest, BasePolicy } from "@adonisjs/bouncer";
import type { AuthorizerResponse } from "@adonisjs/bouncer/types";

export default class CommentPolicy extends BasePolicy {
  create(_user: User): AuthorizerResponse {
    return true;
  }

  /**
   * Only the comment author can edit their comment
   */
  edit(user: User, comment: Comment): AuthorizerResponse {
    return user.id === comment.userId;
  }

  /**
   * Only the comment author can delete their comment
   */
  delete(user: User, comment: Comment): AuthorizerResponse {
    return user.id === comment.userId;
  }

  /**
   * Everyone can view comments (handled at post level)
   */
  @allowGuest()
  view(_user: User | null, _comment: Comment): AuthorizerResponse {
    return true;
  }

  /**
   * Only logged-in users can reply to comments
   */
  reply(_user: User): AuthorizerResponse {
    return true;
  }
}
