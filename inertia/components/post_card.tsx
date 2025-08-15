import type { FunctionalComponent } from "vue";
import { Link } from "@inertiajs/vue3";
import { toRelative } from "~/utils";
import type PostDto from "#dtos/post";
import type { Serialize } from "@tuyau/utils/types";

type PostCardProps = {
  post: Serialize<PostDto>;
};

type Events = {
  savePost(postId: number): void;
};

const PostCard: FunctionalComponent<PostCardProps, Events> = (
  props,
  context,
) => {
  const { post } = props;

  const excerpt = (content: string, length: number) => {
    return content.length > length
      ? content.substring(0, length) + "..."
      : content;
  };

  return (
    <div class="card">
      <div class="card-image">
        <figure class="image is-5by3">
          <img
            src={post.coverImage?.url ?? "/assets/post_placeholder.png"}
            alt="Post image"
            style={{ objectFit: "cover" }}
          />
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          {post.user?.profile?.avatar?.url && (
            <div class="media-left">
              <figure class="image is-48x48">
                <img
                  src={post.user.profile.avatar.url}
                  alt="Avatar image"
                  class="is-rounded"
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
              </figure>
            </div>
          )}
          <div class="media-content">
            <p class="is-4">
              <Link href={`/${post.user?.username}`}>
                {post.user?.profile?.name}
              </Link>
            </p>
            <p class="is-6">@{post.user?.username}</p>
          </div>
        </div>

        <div class="content">
          <Link
            href={`/${post.user?.username}/${post.slug}`}
            class="is-size-4 has-text-weight-bold"
          >
            {post.title}
          </Link>

          <p>{excerpt(post.content, 200)}</p>
          <p>
            {toRelative(post.updatedAt)}{" "}
            {!post.published && <div class="ml-2 tag is-warning">Draft</div>}
          </p>
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
};

export default PostCard;
