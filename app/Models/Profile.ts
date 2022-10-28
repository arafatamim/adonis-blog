import { attachment, AttachmentContract } from "@ioc:Adonis/Addons/AttachmentLite";
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Post from "./Post";
import SavedPost from "./SavedPost";
import User from "./User";

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @attachment({ folder: "avatars", preComputeUrl: true })
  public avatar?: AttachmentContract | null;

  @column()
  public websiteUrl?: string;

  @column()
  public location?: string;

  @column()
  public bio?: string;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @hasMany(() => SavedPost)
  public savedPosts: HasMany<typeof SavedPost>;
}
