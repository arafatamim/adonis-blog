<script setup lang="ts">
import type Profile from "#models/profile";
import type User from "#models/user";
import type { InferPageProps } from "@adonisjs/inertia/types";
import type UsersController from "#controllers/users_controller";

import { Link, router } from "@inertiajs/vue3";
import PostCard from "~/components/post_card";
import { toRelative } from "~/utils";
import { ref } from "vue";

const props = defineProps<{
  user?: User;
  profile?: Profile;
  posts?: InferPageProps<UsersController, "show">["posts"];
  savedPosts?: InferPageProps<UsersController, "show">["savedPosts"];
  followStatus?: InferPageProps<UsersController, "show">["followStatus"];
  isOwnProfile?: boolean;
  csrfToken?: string;
}>();

const isFollowing = ref(props.followStatus?.isFollowing ?? false);
const followerCount = ref<number>(props.followStatus?.followerCount ?? 0);
const followingCount = ref<number>(props.followStatus?.followingCount ?? 0);

const toggleFollow = async () => {
  if (!props.user || !props.profile) return;

  if (isFollowing.value) {
    router.delete(`/users/${props.profile?.userId}/follow`, {
      onSuccess: () => {
        isFollowing.value = false;
        followerCount.value -= 1;
      },
      onError: () => {
        isFollowing.value = true;
      },
    });
  } else {
    router.post(`/users/${props.profile?.userId}/follow`, undefined, {
      onSuccess: () => {
        isFollowing.value = true;
        followerCount.value += 1;
      },
      onError: () => {
        isFollowing.value = false;
      },
    });
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
        {{ profile.bio ?? "User" }}
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
        <div
          v-if="user != null && !isOwnProfile"
          class="mt-3 mb-4 is-flex is-align-items-center"
        >
          <button
            :class="['button', isFollowing && 'is-primary', 'mr-3']"
            :disabled="followStatus == null"
            @click="toggleFollow"
            id="btn-follow"
            style="min-width: 110px"
          >
            {{ isFollowing ? "Following" : "Follow" }}
          </button>
        </div>
        <span class="has-text-grey-dark is-size-6">
          <Link :href="`/${profile?.user?.username}/followers`">
            <span class="has-text-weight-semibold">{{ followerCount }}</span>
            <span class="ml-1"
              >follower{{ followerCount === 1 ? "" : "s" }}</span
            >
          </Link>
          <span class="mx-2 has-text-grey-light">•</span>
          <Link :href="`/${profile?.user?.username}/following`">
            <span class="has-text-weight-semibold">{{ followingCount }}</span>
            <span class="ml-1">following</span>
          </Link>
        </span>
      </template>
    </div>
  </section>

  <section class="section">
    <h1 class="title">
      {{ isOwnProfile ? "My" : (profile?.name ?? "User") + "'s" }} Posts
    </h1>
    <Link v-if="isOwnProfile" class="button my-4 is-link is-light" href="/new">
      <span class="icon">+</span>
      <span>Write a new post...</span>
    </Link>
    <div class="columns is-0 is-desktop" style="gap: 1rem" v-if="user != null">
      <template v-for="post in posts" :key="post.id">
        <PostCard
          class="column is-4"
          v-if="post.published || (user.id === post.userId && !post.published)"
          :post="post"
          :user="post.user!"
          :isOwnPost="isOwnProfile"
        />
      </template>
    </div>
  </section>

  <section
    class="section"
    v-if="isOwnProfile && savedPosts && savedPosts.length > 0"
  >
    <h1 class="title">Saved Posts</h1>
    <div class="columns is-0 is-desktop" style="gap: 1rem">
      <template v-for="savedPost in savedPosts" :key="savedPost.id">
        <PostCard
          class="column is-4"
          v-if="
            savedPost.post &&
            (savedPost.post.published ||
              (user?.id === savedPost.userId && !savedPost.post.published))
          "
          :post="savedPost.post"
          :user="savedPost.user!"
          :isOwnPost="isOwnProfile"
        />
      </template>
    </div>
  </section>
</template>
