/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import Post from "#models/post";
import User from "#models/user";
import { Bouncer } from "@adonisjs/bouncer";

export const modifyPost = Bouncer.ability(
  (user: User, post: Post) => user.id === post.userId,
);

export const ownsPost = Bouncer.ability(
  (user: User, post: Post) => post.userId === user.id,
);

export const likePost = Bouncer.ability(
  (user: User, post: Post) => user.id !== post.userId,
);

export const followUser = Bouncer.ability(
  (authUser: User, user: User) => user.id !== authUser.id,
);

// if post is published or user is owner
export const viewPost = Bouncer.ability(
  (user: User, post: Post) => post.published || user.id === post.userId,
);
