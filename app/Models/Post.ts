import { attachment, AttachmentContract } from "@ioc:Adonis/Addons/AttachmentLite";
import { slugify } from "@ioc:Adonis/Addons/LucidSlugify";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import User from "./User";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @attachment({ folder: "covers", preComputeUrl: true })
  public coverImage?: AttachmentContract | null;

  @column()
  public content: string;

  @column()
  public published: boolean;

  @column()
  @slugify({
    strategy: "dbIncrement",
    fields: ["title"],
  })
  public slug: string;

  @column()
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
