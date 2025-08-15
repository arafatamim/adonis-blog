<script setup lang="ts">
import { Head, Link, router } from "@inertiajs/vue3";
import type Post from "#models/post";
import type User from "#models/user";
import {
  PhBookmark,
  PhPencil,
  PhTrash,
  PhClock,
  PhCalendar,
} from "@phosphor-icons/vue";
import { toRelative } from "~/utils";
import useSave from "~/composables/use_save";
import type { PostMeta } from "~/types/post_meta";

const props = defineProps<
  {
    post: Post;
    user?: User;
    isOwnPost?: boolean;
  } & PostMeta
>();

const { isSaved, savesCount, toggleSave } = useSave(props.post.id, {
  isSaved: props.isSaved,
  savesCount: props.savesCount,
});

const deletePost = () => {
  if (confirm("Are you sure you want to delete this post?")) {
    router.delete(`/posts/${props.post.id}`);
  }
};
</script>

<template>
  <Head :title="post.title" />

  <!-- Hero Section -->
  <section class="hero is-medium">
    <div class="hero-body">
      <div class="container has-text-centered">
        <!-- Post Status Badge -->
        <div v-if="!post.published" class="mb-4">
          <span class="tag is-warning is-medium">
            <span class="icon">
              <PhClock />
            </span>
            <span>Draft</span>
          </span>
        </div>

        <!-- Post Title -->
        <h1 class="title is-1 has-text-weight-bold">{{ post.title }}</h1>

        <!-- Post Meta -->
        <div class="subtitle is-5">
          <span class="icon-text">
            <span class="icon">
              <PhCalendar />
            </span>
            <span>{{ toRelative(post.createdAt) }}</span>
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- Cover Image -->
  <figure v-if="post.coverImage?.url" class="image cover-image">
    <img :src="post.coverImage.url" alt="Cover image" />
  </figure>

  <!-- Main Content -->
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8-desktop is-10-tablet">
          <!-- Author Card -->
          <div class="card mb-6">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure
                    v-if="post.user.profile?.avatar"
                    class="image is-64x64"
                  >
                    <img
                      class="is-rounded"
                      style="width: 64px; height: 64px; object-fit: cover"
                      :src="post.user.profile.avatar.url"
                      :alt="`${post.user.username} avatar`"
                    />
                  </figure>
                  <div v-else class="avatar-placeholder">
                    {{ post.user.username.charAt(0).toUpperCase() }}
                  </div>
                </div>

                <div class="media-content">
                  <Link :href="`/${post.user.username}`" class="has-text-dark">
                    <p class="title is-5 mb-1">
                      {{ post.user.profile?.name || post.user.username }}
                    </p>
                    <p class="is-6 has-text-grey">@{{ post.user.username }}</p>
                  </Link>
                  <p v-if="post.user.profile?.bio" class="content">
                    {{ post.user.profile.bio }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div v-if="user" class="media-right">
                  <div class="field has-addons">
                    <div class="control">
                      <button
                        @click="toggleSave"
                        :disabled="isOwnPost"
                        :class="[
                          'button',
                          isSaved ? 'is-primary' : 'is-light',
                          { 'is-static': isOwnPost },
                        ]"
                      >
                        <span class="icon">
                          <PhBookmark :weight="isSaved ? 'fill' : 'regular'" />
                        </span>
                        <span>{{ isSaved ? "Saved" : "Save" }}</span>
                        <span v-if="savesCount > 0"
                          >&nbsp;({{ savesCount }})</span
                        >
                      </button>
                    </div>

                    <div v-if="isOwnPost" class="control">
                      <Link
                        :href="`/${post.user.username}/${post.slug}/edit`"
                        class="button is-info"
                      >
                        <span class="icon">
                          <PhPencil />
                        </span>
                        <span>Edit</span>
                      </Link>
                    </div>

                    <div v-if="isOwnPost" class="control">
                      <button @click="deletePost" class="button is-danger">
                        <span class="icon">
                          <PhTrash />
                        </span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Article Content -->
          <div class="card">
            <div class="card-content">
              <div
                class="content is-size-5 preserve-whitespace"
                v-html="post.content"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cover-image {
  height: 60vh;
  margin: 0;
  padding: 0;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.preserve-whitespace {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.preserve-whitespace p {
  margin-bottom: 1rem;
}

.preserve-whitespace br {
  margin-bottom: 0.5rem;
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: hsl(171, 100%, 41%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .cover-image {
    height: 40vh;
  }

  .media-right {
    margin-top: 1rem;
  }

  .field.has-addons {
    flex-wrap: wrap;
  }
}
</style>
