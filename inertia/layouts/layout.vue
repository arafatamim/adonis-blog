<script setup lang="ts">
import type User from "#models/user";
import Header from "~/components/header.vue";

defineProps<{
  user?: User;
  csrfToken?: string;
}>();
</script>

<template>
  <Header :user="user" :csrfToken="csrfToken" />
  <main>
    <article>
      <Suspense>
        <slot />

        <template #fallback>
          <div>
            <p>Loading...</p>
          </div>
        </template>
      </Suspense>
    </article>
  </main>
</template>
