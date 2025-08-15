import User from "#models/user";
import { BasePolicy } from "@adonisjs/bouncer";
import type { AuthorizerResponse } from "@adonisjs/bouncer/types";

export default class FollowPolicy extends BasePolicy {
  follow(user: User, target: User | null): AuthorizerResponse {
    return user.id !== target?.id;
  }
}
