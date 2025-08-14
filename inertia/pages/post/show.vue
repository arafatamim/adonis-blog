<script setup lang="ts">
import { Head, Link, router } from "@inertiajs/vue3";
import type Post from "#models/post";
import type User from "#models/user";
import { PhBookmark, PhPencil, PhTrash } from "@phosphor-icons/vue";
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

  <section class="hero" id="section-post">
    <div class="hero-body">
      <h1 class="title" style="margin-bottom: 5px">{{ post.title }}</h1>
      <span class="subtitle">
        {{ toRelative(post.createdAt) }}
        <span v-if="!post.published" class="tag is-warning">Draft</span>
      </span>

      <figure v-if="post.coverImage?.url" class="mt-5">
        <img
          style="border-radius: 5px"
          :src="post.coverImage.url"
          alt="Cover image"
        />
      </figure>

      <aside class="box mt-5">
        <div class="media">
          <figure v-if="post.user.profile?.avatar" class="media-left">
            <p class="image is-64x64">
              <img
                class="is-rounded small-avatar"
                :src="post.user.profile.avatar.url"
                width="64"
                height="64"
              />
            </p>
          </figure>

          <div class="media-content">
            <div class="content">
              <p>
                <Link :href="`/${post.user.username}`">
                  <strong v-if="post.user.profile?.name">{{
                    post.user.profile.name
                  }}</strong>
                  {{ " " }}
                  <small>@{{ post.user.username }}</small>
                </Link>
                <br />
                <span v-if="post.user.profile?.bio">{{
                  post.user.profile.bio
                }}</span>
              </p>
            </div>
          </div>
        </div>

        <nav v-if="user" class="mt-5">
          <div class="field has-addons">
            <div class="control">
              <button
                @click="toggleSave"
                :disabled="isOwnPost"
                :class="['button', 'is-small', isSaved && 'is-primary']"
              >
                <span class="icon is-small">
                  <PhBookmark :weight="isSaved ? 'fill' : 'regular'" />
                </span>
                <span>
                  {{ isSaved ? "Saved" : "Save" }}
                </span>
                <span v-if="savesCount > 0">&nbsp;({{ savesCount }})</span>
              </button>
            </div>
            <div v-if="isOwnPost" class="control">
              <Link
                class="button is-link is-small"
                :href="`/${post.user.username}/${post.slug}/edit`"
              >
                <span class="icon is-small">
                  <PhPencil />
                </span>
                <span>Edit</span>
              </Link>
            </div>
            <div v-if="isOwnPost" class="control">
              <button @click="deletePost" class="button is-small is-danger">
                <span class="icon is-small">
                  <PhTrash />
                </span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  </section>

  <div class="box article">
    <article
      class="content is-family-sans-serif"
      v-html="post.content"
    ></article>
  </div>
</template>
