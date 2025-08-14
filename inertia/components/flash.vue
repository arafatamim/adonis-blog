<script setup lang="ts">
defineProps<{
  errors?: Record<string, string>
}>()
</script>

<template>
  <div class="message is-danger" v-if="errors">
    <div class="message-body">
      <div v-for="(error, key) in errors" :key="key">{{ key }}: {{ error }}</div>
    </div>
  </div>
</template>
