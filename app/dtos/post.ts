import { BaseModelDto } from "@adocasts.com/dto/base";
import Post from "#models/post";
import { Attachment } from "@jrmc/adonis-attachment/types/attachment";
import UserDto from "#dtos/user";
import SavedPostDto from "#dtos/saved_post";
import { DateTime } from "luxon";

export default class PostDto extends BaseModelDto {
  declare id: number;
  declare title: string;
  declare coverImage?: Attachment | null;
  declare content: string;
  declare published: boolean;
  declare slug: string;
  declare userId: number;
  declare user: UserDto | null;
  declare saves: SavedPostDto[];
  declare createdAt: DateTime;
  declare updatedAt: DateTime;

  constructor(post?: Post) {
    super();

    if (!post) return;
    this.id = post.id;
    this.title = post.title;
    this.coverImage = post.coverImage;
    this.content = post.content;
    this.published = post.published;
    this.slug = post.slug;
    this.userId = post.userId;
    this.user = post.user && new UserDto(post.user);
    this.saves = SavedPostDto.fromArray(post.saves);
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
