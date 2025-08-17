import {
  afterCreate,
  BaseModel,
  belongsTo,
  column,
  hasMany,
  scope,
} from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";
import Post from "./post.js";
import User from "./user.js";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare content: string;

  @column()
  declare userId: number;

  @column()
  declare postId: number;

  @column()
  declare parentCommentId: number | null;

  @column()
  declare depth: number;

  @column({ columnName: "thread_path" })
  declare threadPath: string | null;

  @column({ columnName: "replies_count" })
  declare repliesCount: number;

  @column()
  declare isDeleted: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  // relationships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>;

  @belongsTo(() => Comment, {
    foreignKey: "parentCommentId",
  })
  declare parentComment?: BelongsTo<typeof Comment>;

  @hasMany(() => Comment, {
    foreignKey: "parentCommentId",
  })
  declare replies: HasMany<typeof Comment>;

  public static topLevel = scope(
    (query: ModelQueryBuilderContract<typeof Comment>) => {
      query.whereNull("parent_comment_id");
    },
  );

  public static withReplies = scope(
    (query: ModelQueryBuilderContract<typeof Comment>) => {
      query.preload("replies", (repliesQuery) => {
        repliesQuery.preload("user");
        repliesQuery.orderBy("created_at", "asc");
      });
    },
  );

  // instance methods
  public isReply(): boolean {
    return this.parentCommentId !== null;
  }

  public canReply(): boolean {
    return this.depth < 4;
  }

  public isTopLevel(): boolean {
    return this.parentCommentId === null;
  }

  public async getThread(): Promise<Comment[]> {
    if (!this.threadPath) {
      return [this];
    }

    const threadIds = this.threadPath.split("/").map(Number);
    return await Comment.query()
      .whereIn("id", threadIds)
      .orderBy("depth", "asc");
  }

  public async incrementRepliesCount(): Promise<void> {
    this.repliesCount = this.repliesCount + 1;
    await this.save();
  }

  public async decrementRepliesCount(): Promise<void> {
    this.repliesCount = Math.max(0, this.repliesCount - 1);
    await this.save();
  }

  public async buildThreadPath(): Promise<void> {
    if (!this.parentCommentId) {
      this.threadPath = this.id.toString();
      return;
    }

    const parent = await Comment.findOrFail(this.parentCommentId);
    this.threadPath = parent.threadPath
      ? `${parent.threadPath}/${this.id}`
      : `${parent.id}/${this.id}`;
  }

  // hooks
  @afterCreate()
  public static async setThreadPath(comment: Comment) {
    await comment.buildThreadPath();
    await comment.save();

    if (comment.parentCommentId) {
      const parent = await Comment.findOrFail(comment.parentCommentId);
      await parent.incrementRepliesCount();
    }
  }
}
