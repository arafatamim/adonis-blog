import { BaseModelDto } from "@adocasts.com/dto/base";
import SavedPost from "#models/saved_post";
import UserDto from "#dtos/user";
import PostDto from "#dtos/post";
import { DateTime } from "luxon";

export default class SavedPostDto extends BaseModelDto {
  declare id: number;
  declare userId: number;
  declare postId: number;
  declare user: UserDto | null;
  declare post: PostDto | null;
  declare createdAt: DateTime;
  declare updatedAt: DateTime;

  constructor(savedPost?: SavedPost) {
    super();

    if (!savedPost) return;
    this.id = savedPost.id;
    this.userId = savedPost.userId;
    this.postId = savedPost.postId;
    this.user = savedPost.user && new UserDto(savedPost.user);
    this.post = savedPost.post && new PostDto(savedPost.post);
    this.createdAt = savedPost.createdAt;
    this.updatedAt = savedPost.updatedAt;
  }
}
