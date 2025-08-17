import { BaseModelDto } from "@adocasts.com/dto/base";
import Comment from "#models/comment";
import UserDto from "#dtos/user";
import PostDto from "#dtos/post";

export default class CommentDto extends BaseModelDto {
  declare id: number;
  declare content: string;
  declare userId: number;
  declare postId: number;
  declare parentCommentId: number | null;
  declare depth: number;
  declare threadPath: string | null;
  declare repliesCount: number;
  declare isDeleted: boolean;
  declare createdAt: string;
  declare updatedAt: string;
  declare user?: UserDto;
  declare post?: PostDto;
  declare parentComment?: CommentDto;
  declare replies: CommentDto[];

  // Computed properties
  declare isReply: boolean;
  declare canReply: boolean;
  declare isTopLevel: boolean;
  declare indentLevel: number;

  constructor(comment?: Comment) {
    super();

    if (!comment) return;

    this.id = comment.id;
    this.content = comment.content;
    this.userId = comment.userId;
    this.postId = comment.postId;
    this.parentCommentId = comment.parentCommentId;
    this.depth = comment.depth;
    this.threadPath = comment.threadPath;
    this.repliesCount = comment.repliesCount;
    this.isDeleted = comment.isDeleted;
    this.createdAt = comment.createdAt.toISO()!;
    this.updatedAt = comment.updatedAt.toISO()!;
    this.user = comment.user && new UserDto(comment.user);
    this.post = comment.post && new PostDto(comment.post);
    this.parentComment =
      comment.parentComment && new CommentDto(comment.parentComment);
    this.replies = comment.replies ? CommentDto.fromArray(comment.replies) : [];

    // Computed properties
    this.isReply = comment.isReply();
    this.canReply = comment.canReply();
    this.isTopLevel = comment.isTopLevel();
    this.indentLevel = comment.threadPath
      ? comment.threadPath.split("/").length - 1
      : 0;
  }

  public static buildTree(comments: Comment[]): CommentDto[] {
    const commentDtoMap = new Map<number, CommentDto>();
    const result: CommentDto[] = [];

    for (const comment of comments) {
      const commentDto = new CommentDto(comment);
      commentDto.replies = [];
      commentDtoMap.set(comment.id, commentDto);
    }

    // Second pass: build hierarchy
    for (const comment of comments) {
      const commentDto = commentDtoMap.get(comment.id)!;

      if (comment.parentCommentId) {
        const parentDto = commentDtoMap.get(comment.parentCommentId);
        if (parentDto) {
          parentDto.replies.push(commentDto);
        }
      } else {
        result.push(commentDto);
      }
    }

    // Third pass: sort at each level (newest first)
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const sortReplies = (comments: CommentDto[]) => {
      for (const comment of comments) {
        comment.replies.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        sortReplies(comment.replies); // Recursively sort nested replies
      }
    };

    sortReplies(result);

    return result;
  }

  public static getTotalCount(comments: CommentDto[]): number {
    return comments.reduce((total, comment) => {
      return total + 1 + this.getTotalCount(comment.replies);
    }, 0);
  }

  public static getTopLevelCount(comments: CommentDto[]): number {
    return comments.length;
  }
}
