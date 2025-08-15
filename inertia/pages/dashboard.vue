<script setup lang="ts">
import type Post from "#models/post";
import type Profile from "#models/profile";
import type User from "#models/user";
import { Link } from "@inertiajs/vue3";
import PostCard from "~/components/post_card";
import { PhTrendUp, PhUsers, PhCalendar, PhHeart } from "@phosphor-icons/vue";

defineProps<{
  user?: User;
  profile?: Profile;
  posts?: Post[];
  followingsPosts?: Post[];
}>();
</script>

<template>
  <div class="container">
    <section class="hero is-medium" style="background: transparent">
      <div class="hero-body">
        <div class="container">
          <div
            v-if="user != null && profile != null"
            class="columns is-vcentered"
          >
            <div class="column">
              <h1 class="title is-2 has-text-primary">
                Welcome back, {{ profile.name }}! 👋
              </h1>
              <p class="subtitle is-5 has-text-grey-dark">
                Ready to share your thoughts with the world?
              </p>
              <div class="buttons">
                <Link href="/new" class="button is-primary is-medium">
                  <span>Create New Post</span>
                </Link>
                <Link
                  :href="`/${user.username}`"
                  class="button is-light is-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>
            <div class="column is-narrow" v-if="profile.avatar">
              <figure class="image is-128x128">
                <img
                  class="is-rounded"
                  :src="profile.avatar.url"
                  :alt="`${profile.name}'s avatar`"
                />
              </figure>
            </div>
          </div>
          <div v-else class="has-text-centered">
            <h1 class="title is-1 has-text-primary">
              Welcome to Blogpoint! ✨
            </h1>
            <p class="subtitle is-4 has-text-grey-dark mb-5">
              Join our community of writers and readers
            </p>
            <div class="buttons is-centered">
              <Link href="/signup" class="button is-primary is-large">
                <span>Get Started</span>
              </Link>
              <Link href="/login" class="button is-light is-large">
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Followings feed -->
    <section
      v-if="
        user != null && followingsPosts != null && followingsPosts.length > 0
      "
      class="section"
    >
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <h2 class="title is-3">
                  <span class="icon-text">
                    <span>From Your Network</span>
                  </span>
                </h2>
                <p class="subtitle is-6">Latest posts from people you follow</p>
              </div>
            </div>
          </div>
        </div>

        <div class="columns is-multiline">
          <template
            v-for="post in followingsPosts.slice(0, 6)"
            :key="`follower-${post.id}`"
          >
            <div class="column is-6-tablet is-4-desktop">
              <PostCard :post="post" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Latest Posts Section -->
    <section class="section" v-if="posts != null && posts.length > 0">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <h2 class="title is-3">
                  <span class="icon-text">
                    <span>Latest Posts</span>
                  </span>
                </h2>
                <p class="subtitle is-6">
                  Discover the latest and greatest content
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="columns is-multiline">
          <template v-for="post in posts" :key="`trending-${post.id}`">
            <div class="column is-6-tablet is-4-desktop">
              <PostCard
                :post="post"
                :user="user"
                :is-own-post="user?.id === post.userId"
              />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Empty State for No Posts -->
    <section v-if="posts == null || posts.length === 0" class="section">
      <div class="container">
        <div class="has-text-centered">
          <h3 class="title is-4 mt-4">No posts yet</h3>
          <p class="subtitle is-6 has-text-grey">
            Be the first to share something amazing!
          </p>
          <div v-if="user != null">
            <Link href="/new" class="button is-primary">
              Create Your First Post
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero .title,
.hero .subtitle {
  color: white;
}

.box {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.icon-text {
  gap: 0.5rem;
}

.image.is-128x128 img {
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.level {
  margin-bottom: 2rem;
}

.section {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

@media screen and (max-width: 768px) {
  .hero {
    padding: 2rem 0;
  }

  .hero .title {
    font-size: 2rem !important;
  }

  .section {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>
