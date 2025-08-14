<script setup lang="ts">
import { Head, useForm, router } from "@inertiajs/vue3";
import { PhUpload } from "@phosphor-icons/vue";
import { ref, computed, onMounted } from "vue";
import type Post from "#models/post";
import type User from "#models/user";

const props = defineProps<{
  post: Post;
  user?: User;
  csrfToken?: string;
}>();

const form = useForm({
  title: props.post.title,
  coverImage: null as File | null,
  body: props.post.content,
  isPublished: props.post.published,
});

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const fileUrl = ref<string | null>(null);

const fileName = computed(() => selectedFile.value?.name || null);

onMounted(() => {
  if (props.post.coverImage?.url) {
    fileUrl.value = props.post.coverImage.url;
  }
});

const onFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    selectedFile.value = file;
    form.coverImage = file;

    // Create preview URL
    if (fileUrl.value && !fileUrl.value.startsWith("http")) {
      URL.revokeObjectURL(fileUrl.value);
    }
    fileUrl.value = URL.createObjectURL(file);
  }
};

const submitForm = (action: "publish" | "draft" | "delete") => {
  form.isPublished = action === "publish";

  if (action === "delete") {
    if (confirm("Are you sure you want to delete this post?")) {
      router.delete(`/posts/${props.post.id}`);
    }
    return;
  }

  form.put(`/posts/${props.post.id}`, {
    forceFormData: true,
  });
};
</script>

<template>
  <Head :title="`Edit - ${post.title}`" />

  <section class="section">
    <h1 class="title">Edit post</h1>

    <form @submit.prevent="submitForm('publish')">
      <div class="field">
        <label for="postTitle" class="label">Title</label>
        <div class="control">
          <input type="text" class="input" v-model="form.title" />
        </div>
      </div>

      <div class="field">
        <label for="coverImage" class="label">Cover image</label>
        <img
          v-if="fileUrl"
          :src="fileUrl"
          alt="Cover image"
          style="max-height: 500px; margin-bottom: 1rem"
        />

        <div class="control file" :class="{ 'has-name': fileName }">
          <label class="file-label">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="file-input"
              @change="onFileInput"
            />
            <span class="file-cta">
              <span class="file-icon">
                <PhUpload />
              </span>
              <span class="file-label"> Choose a new file... </span>
            </span>
            <span v-if="fileName" class="file-name" :title="fileName">
              {{ fileName }}
            </span>
          </label>
        </div>
        <p v-if="form.errors.coverImage" class="help is-danger">
          {{ form.errors.coverImage }}
        </p>
        <p class="help">
          Max filesize: 500KB. Accepted filetypes: jpg, png, webp
        </p>
      </div>

      <div class="field">
        <label for="postContent" class="label">Body</label>
        <div class="control">
          <textarea
            class="textarea is-family-code"
            v-model="form.body"
            :class="{ 'is-danger': form.errors.body }"
            rows="10"
          ></textarea>
        </div>
        <p v-if="form.errors.body" class="help is-danger">
          {{ form.errors.body }}
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-primary"
            :class="{ 'is-loading': form.processing }"
            :disabled="form.processing"
          >
            Publish
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            @click="submitForm('draft')"
            class="button"
            :class="{ 'is-loading': form.processing }"
            :disabled="form.processing"
          >
            Save draft
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            @click="submitForm('delete')"
            class="button is-danger"
            :disabled="form.processing"
          >
            Delete
          </button>
        </div>
      </div>
    </form>
  </section>
</template>
