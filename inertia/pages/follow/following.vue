<script setup lang="ts">
import type { InferPageProps } from "@adonisjs/inertia/types";

import { Link } from "@inertiajs/vue3";
import type UsersController from "#controllers/users_controller";

const props = defineProps<{
  targetUser?: InferPageProps<UsersController, "following">["targetUser"];
  following?: InferPageProps<UsersController, "following">["following"];
}>();
</script>

<template>
  <section class="section">
    <h1 class="title">@{{ targetUser?.username }}'s followings</h1>

    <div
      v-if="props.following && props.following.length > 0"
      class="columns is-multiline"
    >
      <div
        v-for="following in props.following!"
        :key="following.id"
        class="column is-2"
      >
        <div class="box has-text-centered">
          <figure v-if="following.profile?.avatar" class="mb-3">
            <img
              :src="following.profile.avatar.url"
              alt="Avatar"
              width="64"
              height="64"
              class="is-rounded"
            />
          </figure>
          <p class="title is-5 mb-1">
            <Link :href="`/${following.username}`">
              {{ following.profile?.name ?? `@${following.username}` }}
            </Link>
          </p>
          <p class="is-6 has-text-grey">@{{ following.username }}</p>
        </div>
      </div>
    </div>

    <p v-else class="has-text-centered has-text-grey">No followings yet.</p>
  </section>
</template>
