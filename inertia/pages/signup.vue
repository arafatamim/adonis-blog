<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { reactive, ref } from 'vue'
import Flash from '~/components/flash.vue'

defineProps<{
  errors?: Record<string, string>
  csrfToken?: string
}>()

const form = reactive({
  username: '',
  password: '',
  remember: false,
})
</script>

<template>
  <Head title="Signup" />

  <section class="section">
    <h1 class="title">Signup</h1>
    <Flash :errors="errors" />

    <div>
      <form @submit.prevent="router.post('/signup', form)" method="post">
        <input type="hidden" name="_csrf" :value="csrfToken" />
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              name="username"
              placeholder="Username"
              v-model="form.username"
            />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <input
              class="input"
              type="password"
              name="password"
              placeholder="Password"
              v-model="form.password"
            />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button type="submit" class="button is-link">Signup</button>
          </div>
        </div>
        <Link href="/login">Login instead</Link>
      </form>
    </div>
  </section>
</template>
