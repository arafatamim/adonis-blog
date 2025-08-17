import Comment from "#models/comment";
import { BaseSeeder } from "@adonisjs/lucid/seeders";

export default class extends BaseSeeder {
  static environment = ["development"];

  async run() {
    await Comment.create({
      content: "This is comment level one by user 1 on post 1",
      userId: 1,
      postId: 1,
      depth: 0,
      id: 1,
    });

    await Comment.create({
      content: "This is first reply on comment id 1 by user 1 on post 1",
      userId: 1,
      postId: 1,
      parentCommentId: 1,
      depth: 1,
      id: 2,
    });

    await Comment.create({
      content: "This is a level 1 comment id 3 by user 1 on post 1",
      userId: 1,
      postId: 1,
      depth: 0,
      id: 3,
    });

    await Comment.create({
      content: "This is a level 2 comment id 4 parent 3 by user 1 on post 1",
      userId: 1,
      postId: 1,
      depth: 1,
      id: 4,
      parentCommentId: 3,
    });

    await Comment.create({
      content: "This is level 2 comment id 5 parent 3 by user 1 on post 1",
      userId: 1,
      postId: 1,
      depth: 1,
      id: 5,
      parentCommentId: 3,
    });

    await Comment.create({
      content: "This is level 3 comment id 6 parent 5 by user 1 on post 1",
      userId: 1,
      postId: 1,
      depth: 2,
      id: 6,
      parentCommentId: 5,
    });
  }
}
