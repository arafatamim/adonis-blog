import Comment from "#models/comment";
import Post from "#models/post";
import { commentValidator } from "../validators/comment.js";
import type { HttpContext } from "@adonisjs/core/http";

export default class CommentsController {
  public async create({
    request,
    response,
    auth,
    bouncer,
    params,
  }: HttpContext) {
    const user = auth.getUserOrFail();
    const postId = params.postId;

    const post = await Post.findOrFail(postId);

    await bouncer.with("PostPolicy").authorize("comment", post);

    const { content } = await request.validateUsing(commentValidator);

    const comment = await Comment.create({
      content,
      userId: user.id,
      postId: post.id,
      parentCommentId: null,
      depth: 0,
    });

    // Build thread path after creation
    await comment.buildThreadPath();
    await comment.save();

    return response.redirect().back();
  }

  public async reply({
    request,
    response,
    auth,
    bouncer,
    params,
  }: HttpContext) {
    const user = auth.getUserOrFail();
    const parentCommentId = params.commentId;

    const parentComment = await Comment.findOrFail(parentCommentId);

    if (!parentComment.canReply()) {
      return response.badRequest({
        message: "Maximum nesting depth reached. Cannot reply to this comment.",
      });
    }

    const post = await Post.findOrFail(parentComment.postId);
    await bouncer.with("PostPolicy").authorize("comment", post);

    const { content } = await request.validateUsing(commentValidator);

    const reply = await Comment.create({
      content,
      userId: user.id,
      postId: parentComment.postId,
      parentCommentId: parentComment.id,
      depth: parentComment.depth + 1,
    });

    await reply.buildThreadPath();
    await reply.save();

    await parentComment.incrementRepliesCount();

    return response.redirect().back();
  }

  public async update({ request, response, bouncer, params }: HttpContext) {
    const commentId = params.id;

    const comment = await Comment.findOrFail(commentId);

    await bouncer.with("CommentPolicy").authorize("edit", comment);

    const { content } = await request.validateUsing(commentValidator);

    comment.content = content;
    await comment.save();

    return response.redirect().back();
  }

  public async destroy({ response, bouncer, params }: HttpContext) {
    const commentId = params.id;

    const comment = await Comment.findOrFail(commentId);

    await bouncer.with("CommentPolicy").authorize("delete", comment);

    // TODO: hard delete parent if parent has been soft deleted and parent has no other children

    if (comment.repliesCount > 0) {
      // Soft delete
      comment.content = "[This comment has been deleted]";
      comment.isDeleted = true;
      await comment.save();
    } else {
      // Hard delete if no replies
      await comment.delete();

      // Decrement parent's replies count if this was a reply
      if (comment.isReply()) {
        const parentComment = await Comment.findOrFail(comment.parentCommentId);
        await parentComment.decrementRepliesCount();

        await this.cleanupSoftDeletedParents(parentComment);
      }
    }

    return response.redirect().back();
  }

  public async index({ params, response }: HttpContext) {
    const postId = params.postId;

    const comments = await Comment.query()
      .where("post_id", postId)
      .preload("user", (userQuery) => {
        userQuery.preload("profile");
      })
      .orderBy("thread_path", "desc")
      .orderBy("created_at", "desc");

    return response.json({
      comments,
      total: comments.length,
    });
  }

  public async thread({ params, response }: HttpContext) {
    const commentId = params.commentId;

    const comment = await Comment.findOrFail(commentId);
    const thread = await comment.getThread();

    await Promise.all(
      thread.map(async (c) => {
        await c.load("user", (userQuery) => {
          userQuery.preload("profile");
        });
      }),
    );

    return response.json({
      thread,
      rootComment: thread[0],
      totalInThread: thread.length,
    });
  }

  private async cleanupSoftDeletedParents(comment: Comment): Promise<void> {
    // If comment is not soft deleted or still has replies, stop recursion
    if (!comment.isDeleted || comment.repliesCount > 0) {
      return;
    }

    let parentComment: Comment | null = null;

    // Load parent comment if this is a reply
    if (comment.isReply()) {
      parentComment = await Comment.findOrFail(comment.parentCommentId);
      // Decrement parent's replies count before deleting this comment
      await parentComment.decrementRepliesCount();
    }

    // Hard delete the soft-deleted comment with no replies
    await comment.delete();

    // Recursively check the parent
    if (parentComment) {
      await this.cleanupSoftDeletedParents(parentComment);
    }
  }
}
