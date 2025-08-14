<script setup lang="ts">
import { Head, Link, router } from "@inertiajs/vue3";
import { reactive } from "vue";
import Flash from "~/components/flash.vue";

defineProps<{
  errors?: Record<string, string>;
  csrfToken?: string;
  redirect?: string;
}>();

const form = reactive({
  username: "",
  password: "",
  rememberMe: false,
});
</script>

<template>
  <Head title="Login" />
  <section class="section">
    <h1 class="title">Login</h1>
    <div>
      <Flash v-if="errors" :errors="errors" />
      <form
        @submit.prevent="router.post(`/login?redirect=${redirect}`, form)"
        method="POST"
      >
        <input type="hidden" name="_csrf" :value="csrfToken" />
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Username"
              name="username"
              v-model="form.username"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="password"
              placeholder="Password"
              name="password"
              v-model="form.password"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                v-model="form.rememberMe"
              />
              Remember me
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button type="submit" class="button is-link">Login</button>
          </div>
        </div>
        <Link href="/signup">Create an account</Link>
      </form>
    </div>
  </section>
</template>
