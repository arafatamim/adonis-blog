import { BaseModelDto } from "@adocasts.com/dto/base";
import User from "#models/user";
import ProfileDto from "#dtos/profile";
import PostDto from "#dtos/post";
import SavedPostDto from "#dtos/saved_post";
import { DateTime } from "luxon";

export default class UserDto extends BaseModelDto {
  declare id: number;
  declare username: string;
  declare password: string;
  declare rememberMeToken?: string;
  declare profile: ProfileDto | null;
  declare posts: PostDto[];
  declare followers: UserDto[];
  declare likedPosts: SavedPostDto[];
  declare createdAt: DateTime;
  declare updatedAt: string | null;

  constructor(user?: User) {
    super();

    if (!user) return;
    this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.rememberMeToken = user.rememberMeToken;
    this.profile = user.profile && new ProfileDto(user.profile);
    this.posts = PostDto.fromArray(user.posts);
    this.followers = UserDto.fromArray(user.followers);
    this.likedPosts = SavedPostDto.fromArray(user.likedPosts);
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt != null ? user.updatedAt.toISO() : null;
  }
}
