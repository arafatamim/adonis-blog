<script setup lang="ts">
import { ref } from "vue";
import { Link } from "@inertiajs/vue3";
import type User from "#models/user";
import { PhPlus } from "@phosphor-icons/vue";

const isActive = ref(false);

defineProps<{ user?: User; csrfToken?: string }>();
</script>

<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <Link class="navbar-item" href="/"> Blogpoint </Link>

      <a
        role="button"
        v-bind:class="{ 'is-active': isActive }"
        @click="isActive = !isActive"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div v-bind:class="{ 'is-active': isActive }" class="navbar-menu">
      <div class="navbar-start">
        <!-- <Link class="navbar-item" href="/dashboard"> Dashboard </Link> -->
      </div>

      <div class="navbar-end">
        <template v-if="user != null">
          <div class="navbar-item">
            <div class="field">
              <p class="control">
                <Link class="button" href="/new">
                  <span class="icon"> <PhPlus /> </span>
                  <span>Create Post</span>
                </Link>
              </p>
            </div>
          </div>

          <div class="navbar-item has-dropdown is-hoverable">
            <span class="navbar-link">
              {{ "@" + user?.username }}
            </span>

            <div class="navbar-dropdown">
              <Link :href="`/${user?.username}`" class="navbar-item">
                Profile
              </Link>
              <Link href="/settings" class="navbar-item"> Settings </Link>
              <div class="container is-fluid navbar-item">
                <form action="/logout" method="POST">
                  <input type="hidden" name="_csrf" :value="csrfToken" />
                  <button class="button is-outlined is-primary is-small">
                    <span>Log out</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </template>
        <div class="navbar-item" v-else>
          <div class="buttons">
            <Link href="/signup" class="button is-primary"> Sign up </Link>
            <Link :href="`/login`" class="button is-light"> Log in </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
