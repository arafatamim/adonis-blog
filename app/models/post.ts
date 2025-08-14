import { attachment } from "@jrmc/adonis-attachment";
import { slugify } from "@adonisjs/lucid-slugify";
import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";
import User from "#models/user";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import { Attachment } from "@jrmc/adonis-attachment/types/attachment";
import SavedPost from "./saved_post.js";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare title: string;

  @attachment({ folder: "covers", preComputeUrl: true })
  declare coverImage?: Attachment | null;

  @column()
  declare content: string;

  @column()
  declare published: boolean;

  @column()
  @slugify({
    strategy: "shortId",
    fields: ["title"],
  })
  declare slug: string;

  @column()
  declare userId: number;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @hasMany(() => SavedPost)
  declare saves: HasMany<typeof SavedPost>;

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone("utc").toJSON() : null;
    },
  })
  declare createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone("utc").toJSON() : null;
    },
  })
  declare updatedAt: DateTime;
}
