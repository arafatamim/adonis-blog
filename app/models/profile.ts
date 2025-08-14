import { attachment } from "@jrmc/adonis-attachment";
import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";
import SavedPost from "#models/saved_post";
import User from "#models/user";
import type { HasMany, BelongsTo } from "@adonisjs/lucid/types/relations";
import { Attachment } from "@jrmc/adonis-attachment/types/attachment";

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @attachment({ folder: "avatars", preComputeUrl: true })
  declare avatar?: Attachment | null;

  @column()
  declare websiteUrl?: string;

  @column()
  declare location?: string;

  @column()
  declare bio?: string;

  @column()
  declare userId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @hasMany(() => SavedPost)
  declare savedPosts: HasMany<typeof SavedPost>;
}
