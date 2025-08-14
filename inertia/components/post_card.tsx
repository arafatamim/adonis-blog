import type { FunctionalComponent } from "vue";
import { Link } from "@inertiajs/vue3";
import { toRelative } from "~/utils";
import type PostDto from "#dtos/post";
import type UserDto from "#dtos/user";
import type { Serialize } from "@tuyau/utils/types";

type PostCardProps = {
  post: Serialize<PostDto>;
  user?: Serialize<UserDto>;
  isOwnPost?: boolean;
};

type Events = {
  savePost(postId: number): void;
};

const PostCard: FunctionalComponent<PostCardProps, Events> = (
  props,
  context,
) => {
  const { post, user, isOwnPost } = props;

  const excerpt = (content: string, length: number) => {
    return content.length > length
      ? content.substring(0, length) + "..."
      : content;
  };

  const handleSavePost = () => {
    context.emit("savePost", post.id);
  };

  return (
    <div class="columns">
      <div class="column">
        <div class="card is-horizontal shadow-md transform is-duration-300 hover-shadow-xl hover-translate-y">
          <div class="card-image">
            <figure class="image">
              <img
                src={post.coverImage?.url ?? "/assets/post_placeholder.png"}
                alt="Cover image"
              />
            </figure>
          </div>
          <div class="card-content p-0 is-flex is-flex-direction-column">
            <div
              class="content p-5 has-background-info-light is-desktop mb-0"
              style={{ flex: 0 }}
            >
              <div class="columns">
                {post.user?.profile?.avatar?.url && (
                  <div class="column pb-0 is-narrow">
                    <img
                      class="avatar"
                      src={post.user.profile.avatar.url}
                      alt="user avatar"
                    />
                  </div>
                )}
                <div class="column">
                  <div class="is-size-6">
                    <Link href={`/${post.user?.username}`}>
                      <span class="has-text-weight-semibold">
                        {post.user?.profile?.name}
                      </span>{" "}
                      <span class="has-text-grey">@{post.user?.username}</span>
                    </Link>
                  </div>
                  <div class="is-size-6">{toRelative(post.updatedAt)}</div>
                </div>
              </div>
            </div>
            <div class="content p-5 has-text-grey-light mb-0">
              <h3>
                <Link href={`/${post.user?.username}/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              <p class="is-size-6 has-text-weight-normal">
                {excerpt(post.content, 200)}
              </p>
            </div>
            {/*{user != null && !isOwnPost && (
              <div class="content p-5 has-background-info-light is-desktop mb-0">
                <div class="field has-addons">
                  <div class="control">
                    <button class="button is-small" onClick={handleSavePost}>
                      <span class="icon">
                        <PhBookmark />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}*/}
          </div>
        </div>
      </div>
    </div>
  );
};

PostCard.props = {
  post: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    default: null,
  },
  isOwnPost: {
    type: Boolean,
    default: false,
  },
};

PostCard.emits = {
  savePost: (postId: number) => typeof postId === "number",
};

export default PostCard;
