import type { FunctionalComponent } from "vue";
import { Link } from "@inertiajs/vue3";
import type Post from "#models/post";
import type User from "#models/user";
import { PhBookmark, PhPen, PhTrash } from "@phosphor-icons/vue";

type Props = {
  post: Post;
  user?: User;
};

type Events = {
  deletePost(postId: number): void;
  savePost(postId: number): void;
};

const UserPostCard: FunctionalComponent<Props, Events> = (props, context) => {
  const { post, user } = props;
  const isOwnPost = user?.id === post.userId;

  const excerpt = (content: string, length = 200) => {
    if (!content) return "";
    const normalized = content.replace(/\s+/g, " ").trim();
    return normalized.length > length
      ? normalized.substring(0, length).trimEnd() + "..."
      : normalized;
  };

  const onDelete = () => context.emit("deletePost", post.id);
  const onSave = () => context.emit("savePost", post.id);

  return (
    <div class="card">
      <div class="card-content">
        <div class="media-content">
          <div class="title is-4">
            <Link href={`/${post.user.username}/${post.slug}`}>
              {post.title}
            </Link>
            {!post.published && (
              <>
                &nbsp;<span class="tag is-warning">Draft</span>
              </>
            )}
          </div>
        </div>

        <div class="content">{excerpt(post.content)}</div>

        <div class="level">
          <div class="level-left">
            <div class="field level-item has-addons">
              {isOwnPost ? (
                <>
                  <p class="control">
                    <Link
                      class="button is-small is-link"
                      href={`/${post.user.username}/${post.slug}/edit`}
                    >
                      <span class="icon is-small">
                        <PhPen />
                      </span>
                    </Link>
                  </p>
                  <p class="control">
                    <button
                      type="button"
                      class="button is-small is-danger"
                      onClick={onDelete}
                      aria-label="Delete post"
                    >
                      <span class="icon is-small">
                        <PhTrash />
                      </span>
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div class="control">
                    <button
                      type="button"
                      class="button is-small"
                      onClick={onSave}
                      aria-label="Save post"
                    >
                      <span class="icon is-small">
                        <PhBookmark />
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserPostCard.props = {
  post: { type: Object, required: true },
  user: { type: Object },
};

UserPostCard.emits = {
  deletePost: (postId: number) => typeof postId === "number",
  savePost: (postId: number) => typeof postId === "number",
};

export default UserPostCard;
