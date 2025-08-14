import { DateTime } from "luxon";
import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import User from "#models/user";
import Post from "#models/post";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

export default class SavedPost extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare postId: number;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
