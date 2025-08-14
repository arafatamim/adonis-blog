<script setup lang="ts">
import type Post from "#models/post";
import type Profile from "#models/profile";
import type User from "#models/user";
import { Link, router } from "@inertiajs/vue3";
import UserPostCard from "~/components/user_post_card";
import { toRelative } from "~/utils";

defineProps<{
  user?: User;
  profile?: Profile;
  posts?: Post[];
  isOwnProfile?: boolean;
  csrfToken?: string;
}>();

const deletePost = (postId: number) => {
  if (confirm("Are you sure you want to delete this post?")) {
    router.delete(`/posts/${postId}`);
  }
};
</script>

<template>
  <section class="hero">
    <div class="hero-body">
      <figure v-if="profile?.avatar">
        <img
          :src="profile.avatar.url"
          width="128"
          height="128"
          alt="User avatar"
          class="is-rounded avatar"
        />
      </figure>
      <p class="title">{{ profile?.name ?? `@${user?.username}` }}</p>
      <p class="subtitle" v-if="profile">
        <template v-if="profile?.bio">
          {{ profile.bio }}
        </template>
        <template v-if="profile?.location">
          <span> • {{ profile.location }}</span>
        </template>
        <template v-if="profile?.createdAt">
          <span>
            • Joined
            {{ toRelative(profile.createdAt) }}</span
          >
        </template>
      </p>
      <p class="subtitle" v-else>Profile empty</p>
      <template v-if="user != null">
        <div v-if="isOwnProfile" class="field is-grouped">
          <p class="control">
            <Link class="button is-primary" href="/settings">Edit profile</Link>
          </p>
          <form action="/logout" method="POST">
            <input type="hidden" name="_csrf" :value="csrfToken" />
            <button type="submit" class="button">Logout</button>
          </form>
        </div>
        <button
          v-else
          class="button"
          disabled
          :data-uid="user.id"
          id="btn-follow"
        >
          Follow
        </button>
      </template>
    </div>
  </section>

  <section class="section">
    <span class="title">
      <h1>My Posts</h1>
      <Link
        v-if="isOwnProfile"
        class="button my-4 is-link is-light"
        href="/new"
      >
        <span class="icon">+</span>
        <span>Write a new post...</span>
      </Link>
    </span>
    <div class="card-list">
      <template v-for="post in posts" :key="post.id">
        <UserPostCard
          v-if="post.published || (user?.id === post.userId && !post.published)"
          :post="post"
          :user="user"
          :isOwnPost="isOwnProfile"
          @delete-post="deletePost"
          @save-post="savePost"
        />
      </template>
    </div>
  </section>
</template>
