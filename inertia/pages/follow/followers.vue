<script setup lang="ts">
import type { InferPageProps } from "@adonisjs/inertia/types";

import { Link } from "@inertiajs/vue3";
import type UsersController from "#controllers/users_controller";

const props = defineProps<{
  targetUser?: InferPageProps<UsersController, "followers">["targetUser"];
  followers?: InferPageProps<UsersController, "followers">["followers"];
}>();
</script>

<template>
  <section class="section">
    <h1 class="title">Followers for @{{ targetUser?.username }}</h1>

    <div
      v-if="props.followers && props.followers.length > 0"
      class="columns is-multiline"
    >
      <div
        v-for="follower in props.followers!"
        :key="follower.id"
        class="column is-2"
      >
        <div class="box has-text-centered">
          <figure v-if="follower.profile?.avatar" class="mb-3">
            <img
              :src="follower.profile.avatar.url"
              alt="Avatar"
              width="64"
              height="64"
              class="is-rounded"
            />
          </figure>
          <p class="title is-5 mb-1">
            <Link :href="`/${follower.username}`">
              {{ follower.profile?.name ?? `@${follower.username}` }}
            </Link>
          </p>
          <p class="is-6 has-text-grey">@{{ follower.username }}</p>
        </div>
      </div>
    </div>

    <p v-else class="has-text-centered has-text-grey">No followers yet.</p>
  </section>
</template>
