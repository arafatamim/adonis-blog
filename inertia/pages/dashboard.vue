<script setup lang="ts">
import type Post from "#models/post";
import type Profile from "#models/profile";
import type User from "#models/user";
import { Link } from "@inertiajs/vue3";
import PostCard from "~/components/post_card";

defineProps<{
  user?: User;
  profile?: Profile;
  posts?: Post[];
}>();
</script>

<template>
  <section>
    <div v-if="user != null && profile != null">
      <h1 class="title">Welcome back, {{ profile.name }}!</h1>
    </div>
    <div v-else>
      <h1 class="title">Welcome!</h1>
      <p>
        <Link href="/login">Login</Link> or
        <Link href="/register">Register</Link> to start sharing your thoughts!
      </p>
    </div>
  </section>
  <section class="section" v-if="posts != null && posts.length > 0">
    <h2 class="title">Newest Posts</h2>
    <div>
      <template v-for="post in posts" :key="post.id">
        <PostCard
          :post="post"
          :user="user"
          :is-own-post="user?.id === post.userId"
        />
      </template>
    </div>
  </section>
</template>
