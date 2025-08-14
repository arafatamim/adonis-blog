<script setup lang="ts">
import { Head, useForm } from "@inertiajs/vue3";
import { PhUpload } from "@phosphor-icons/vue";
import { ref, computed } from "vue";

defineProps<{
  csrfToken?: string;
}>();

const form = useForm({
  title: "",
  coverImage: null as File | null,
  body: "",
  isPublished: false as boolean,
});

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const fileUrl = ref<string | null>(null);

const fileName = computed(() => selectedFile.value?.name || null);

const onFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    selectedFile.value = file;
    form.coverImage = file;

    // Create preview URL
    if (fileUrl.value) {
      URL.revokeObjectURL(fileUrl.value);
    }
    fileUrl.value = URL.createObjectURL(file);
  }
};

const submitForm = (action: "publish" | "draft") => {
  form.isPublished = action === "publish";
  form.post("/new", {
    forceFormData: true,
  });
};
</script>

<template>
  <Head title="Create post" />

  <section class="section">
    <h1 class="title">Create post</h1>

    <form @submit.prevent="submitForm('publish')">
      <div class="field">
        <label for="postTitle" class="label">Title</label>
        <div class="control">
          <input
            type="text"
            class="input"
            v-model="form.title"
            :class="{ 'is-danger': form.errors.title }"
          />
        </div>
        <p v-if="form.errors.title" class="help is-danger">
          {{ form.errors.title }}
        </p>
        <p class="help">English characters only</p>
      </div>

      <div class="field">
        <label for="coverImage" class="label">Cover image</label>
        <img
          v-if="fileUrl"
          :src="fileUrl"
          alt="Cover image"
          style="max-height: 500px; margin-bottom: 1rem"
        />

        <div class="control file has-name">
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
              <span class="file-label"> Choose a file... </span>
            </span>
            <span class="file-name">
              {{ fileName || "No file selected" }}
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
        <p class="help">Supports markdown formatting</p>
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
      </div>
    </form>
  </section>
</template>
