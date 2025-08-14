import { DateTime } from "luxon";
import hash from "@adonisjs/core/services/hash";
import { compose } from "@adonisjs/core/helpers";
import {
  BaseModel,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from "@adonisjs/lucid/orm";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import Profile from "#models/profile";
import type {
  HasMany,
  HasOne,
  ManyToMany,
} from "@adonisjs/lucid/types/relations";
import Post from "./post.js";
import { DbRememberMeTokensProvider } from "@adonisjs/auth/session";
import SavedPost from "./saved_post.js";

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
  uids: ["username"],
  passwordColumnName: "password",
});

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare username: string;

  @column({ serializeAs: null })
  declare password: string;

  @column()
  declare rememberMeToken?: string;

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>;

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>;

  @manyToMany(() => User)
  declare followers: ManyToMany<typeof User>;

  @hasMany(() => SavedPost)
  declare likedPosts: HasMany<typeof SavedPost>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User);
}
