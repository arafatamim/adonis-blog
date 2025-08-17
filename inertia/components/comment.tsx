import CommentDto from "#dtos/comment";
import UserDto from "#dtos/user";
import { Link } from "@inertiajs/vue3";
import { Fragment, ref } from "vue";
import { defineComponent, PropType } from "vue";
import { toRelative } from "~/utils";

const getIndentStyle = (level: number, maxIndent: number) => {
  const indent = Math.min(level, maxIndent) * 0.01;
  return {
    marginLeft: `${indent}rem`,
  };
};

const ReplyBox = defineComponent({
  name: "ReplyBox",
  props: {
    maxIndent: {
      type: Number,
      default: 4,
    },
    depth: {
      type: Number,
      default: 1,
    },
    user: {
      type: Object as PropType<UserDto>,
      required: true,
    },
    parentComment: {
      type: Object as PropType<CommentDto>,
      required: true,
    },
  },
  emits: ["cancel", "submit"],
  setup({ depth, maxIndent, user, parentComment }, { emit }) {
    const inputRef = ref<HTMLInputElement>();

    return () => (
      <div style={getIndentStyle(depth, maxIndent)}>
        <div class={""} style={{ padding: "1.25rem" }}>
          <article class="media">
            {user?.profile?.avatar && (
              <figure class="media-left">
                <p class="image is-48x48">
                  <img
                    src={user.profile.avatar.url}
                    alt={`${user}'s avatar`}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      width: "48px",
                      height: "48px",
                    }}
                  />
                </p>
              </figure>
            )}
            <div class="media-content">
              <div class="content">
                <p>
                  <Link href={`/${user?.username}`}>
                    <strong>{user?.profile?.name}</strong>{" "}
                    <small>@{user?.username}</small>
                  </Link>
                  <br />
                  <span>
                    {" "}
                    {parentComment && (
                      <small>
                        <span class="has-text-grey">Reply to </span>
                        <Link href={`/${parentComment.user?.username}`}>
                          @{parentComment?.user?.username}
                        </Link>
                      </small>
                    )}{" "}
                    <input maxlength={255} ref={inputRef} class="input" />
                  </span>
                </p>
              </div>
              {/* Actions */}
              <div class="field is-grouped">
                <p class="control">
                  <button
                    class="button is-small is-light is-size-7"
                    style={{ marginTop: "0.25rem" }}
                    onClick={() => {
                      if (inputRef.value?.value) {
                        return emit("submit", inputRef.value.value);
                      }
                    }}
                  >
                    Send
                  </button>
                </p>
                {
                  <p class="control">
                    <button
                      class="button is-small is-light is-danger is-size-7"
                      style={{ marginTop: "0.25rem" }}
                      onClick={() => emit("cancel")}
                    >
                      Cancel
                    </button>
                  </p>
                }
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  },
});

export default defineComponent({
  name: "Comment",
  props: {
    comment: {
      type: Object as PropType<CommentDto>,
      required: true,
    },
    user: {
      type: Object as PropType<UserDto>,
    },
    maxIndent: {
      type: Number,
      default: 4,
    },
  },
  emits: ["delete", "new-reply"],
  setup(props, { emit }) {
    const showReplyBox = ref(false);
    const replyingCommentId = ref(-1);

    const toggleReplyBox = (commentId: number) => {
      showReplyBox.value = !showReplyBox.value;
      replyingCommentId.value = commentId;
    };

    const handleNewReply = (content: string, parentId: number) => {
      showReplyBox.value = false;
      replyingCommentId.value = -1;
      emit("new-reply", content, parentId);
    };

    const renderComment = (comment: CommentDto) => {
      const depth = comment.depth ?? 0;
      const parentComment = comment.parentComment;
      const isOwnComment = comment.userId === props.user?.id;
      const canReply = comment.canReply && !comment.isDeleted;
      const repliesCount = comment.repliesCount;

      return (
        <div style={getIndentStyle(depth, props.maxIndent)}>
          <div
            class={comment.isReply ? "" : "box"}
            style={{ padding: "1.25rem" }}
          >
            <article class="media">
              {comment.user?.profile?.avatar && !comment.isDeleted && (
                <figure class="media-left">
                  <p class="image is-48x48">
                    <img
                      src={comment.user.profile.avatar.url}
                      alt={`${comment.user}'s avatar`}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        width: "48px",
                        height: "48px",
                      }}
                    />
                  </p>
                </figure>
              )}
              <div class="media-content">
                <div class="content">
                  <p>
                    {!comment.isDeleted ? (
                      <Link href={`/${comment.user?.username}`}>
                        <strong>{comment.user?.profile?.name}</strong>{" "}
                        <small>@{comment.user?.username}</small>
                      </Link>
                    ) : (
                      "Deleted comment"
                    )}{" "}
                    • <small>{toRelative(comment.createdAt, true)}</small>
                    {repliesCount > 0 && (
                      <small>
                        {" "}
                        • {repliesCount}{" "}
                        {repliesCount === 1 ? "reply" : "replies"}
                      </small>
                    )}
                    <br />
                    <span>
                      {" "}
                      {parentComment && (
                        <small>
                          <span class="has-text-grey">Replied to </span>
                          <Link href={`/${parentComment.user?.username}`}>
                            @{parentComment?.user?.username}
                          </Link>
                        </small>
                      )}{" "}
                      {comment.content}
                    </span>
                  </p>
                </div>
                {/* Actions */}
                <div class="field is-grouped">
                  {canReply && (
                    <p class="control">
                      <button
                        class="button is-small is-light is-size-7"
                        style={{ marginTop: "0.25rem" }}
                        onClick={() => toggleReplyBox(comment.id)}
                      >
                        Reply
                      </button>
                    </p>
                  )}
                  {isOwnComment && (
                    <p class="control">
                      <button
                        class="button is-small is-light is-danger is-size-7"
                        style={{ marginTop: "0.25rem" }}
                        onClick={() => emit("delete", comment.id)}
                      >
                        Delete
                      </button>
                    </p>
                  )}
                </div>

                {showReplyBox.value &&
                  replyingCommentId.value === comment.id &&
                  props.user && (
                    <ReplyBox
                      user={props.user}
                      parentComment={comment}
                      depth={depth + 1}
                      onCancel={() => toggleReplyBox(comment.id)}
                      onSubmit={(content) =>
                        handleNewReply(content, replyingCommentId.value)
                      }
                    ></ReplyBox>
                  )}

                {/* Render replies recursively */}
                {Array.isArray(comment.replies) &&
                  comment.replies.length > 0 &&
                  comment.replies.map((reply) => (
                    <Fragment key={reply.id}>
                      {renderComment({
                        ...reply,
                        depth: (depth ?? 0) + 1,
                      })}
                    </Fragment>
                  ))}
              </div>
            </article>
          </div>
        </div>
      );
    };

    return () => renderComment(props.comment);
  },
});
