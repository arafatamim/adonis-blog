import { BaseModelDto } from "@adocasts.com/dto/base";
import Profile from "#models/profile";
import { Attachment } from "@jrmc/adonis-attachment/types/attachment";
import UserDto from "#dtos/user";
import SavedPostDto from "#dtos/saved_post";
import { DateTime } from "luxon";

export default class ProfileDto extends BaseModelDto {
  declare id: number;
  declare name: string;
  declare avatar?: Attachment | null;
  declare websiteUrl?: string;
  declare location?: string;
  declare bio?: string;
  declare userId: number;
  declare createdAt: DateTime;
  declare updatedAt: DateTime;
  declare user: UserDto | null;
  declare savedPosts: SavedPostDto[];

  constructor(profile?: Profile) {
    super();

    if (!profile) return;
    this.id = profile.id;
    this.name = profile.name;
    this.avatar = profile.avatar;
    this.websiteUrl = profile.websiteUrl;
    this.location = profile.location;
    this.bio = profile.bio;
    this.userId = profile.userId;
    this.createdAt = profile.createdAt;
    this.updatedAt = profile.updatedAt;
    this.user = profile.user && new UserDto(profile.user);
    this.savedPosts = SavedPostDto.fromArray(profile.savedPosts);
  }
}
