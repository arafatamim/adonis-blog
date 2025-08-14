<script setup lang="ts">
import { useForm } from "@inertiajs/vue3";
import { ref } from "vue";
import type User from "#models/user";
import type Profile from "#models/profile";
import Flash from "~/components/flash.vue";
import type { SettingsValidatorClient } from "#validators/settings";

const props = defineProps<{
  user?: User;
  profile?: Profile;
  errors?: Record<string, string>;
}>();

const profileForm = useForm<SettingsValidatorClient>({
  name: props.profile?.name ?? "",
  username: props.user?.username ?? "",
  avatar: null as File | null,
  deleteAvatar: false,
  websiteUrl: props.profile?.websiteUrl ?? "",
  location: props.profile?.location ?? "",
  bio: props.profile?.bio ?? "",
});

const passwordForm = useForm({
  currentPassword: "",
  newPassword: "",
});

const avatarUrl = ref(props.profile?.avatar?.url ?? null);
const avatarFileName = ref(props.profile?.avatar?.originalName ?? null);

const onFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    profileForm.deleteAvatar = false; // new file selected
    profileForm.avatar = file;
    avatarFileName.value = file.name;

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeAvatar = () => {
  profileForm.avatar = null;
  profileForm.deleteAvatar = true;
  avatarUrl.value = null;
  avatarFileName.value = null;
};

const submitProfile = () => {
  profileForm.post("/settings");
};

const submitPassword = () => {
  passwordForm.post("/settings/password");
};

const deleteAccount = () => {
  if (
    confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    )
  ) {
    // Implementation for account deletion
  }
};
</script>

<template>
  <div>
    <section class="section">
      <h1 class="title">
        Settings for
        <a :href="`/${user?.username}`">{{ "@" + user?.username }}</a>
      </h1>

      <Flash :errors="errors" />

      <form @submit.prevent="submitProfile" enctype="multipart/form-data">
        <!-- Name field -->
        <div class="field">
          <label class="label" for="name">Name</label>
          <div class="control">
            <input
              v-model="profileForm.name"
              class="input"
              :class="{ 'is-danger': errors?.name }"
              type="text"
              name="name"
              id="name"
              :placeholder="profile?.name || ''"
            />
          </div>
          <p v-if="errors?.name" class="help is-danger">{{ errors.name }}</p>
        </div>

        <!-- Username field -->
        <div class="field">
          <label class="label" for="username">Username</label>
          <div class="control">
            <input
              class="input"
              type="text"
              disabled
              name="username"
              id="username"
              :value="user?.username"
            />
          </div>
        </div>

        <!-- Avatar field -->
        <div class="field">
          <label for="avatar" class="label">Avatar</label>
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="User avatar"
            width="150"
            height="150"
            class="mb-3"
          />
          <div class="control file has-name">
            <label class="file-label">
              <input
                type="file"
                id="avatar"
                name="avatar"
                class="file-input"
                @change="onFileInput"
                accept="image/*"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label"> Choose a file... </span>
              </span>
              <span class="file-name">
                {{ avatarFileName || "No file uploaded" }}
              </span>
            </label>
            <span
              v-if="avatarFileName"
              class="file-delete"
              @click="removeAvatar"
            >
              <button class="button" type="button">Remove avatar</button>
            </span>
          </div>
          <p v-if="errors?.avatar" class="help is-danger">
            {{ errors.avatar }}
          </p>
        </div>

        <!-- Website URL field -->
        <div class="field">
          <label class="label" for="website_url">Website URL</label>
          <div class="control">
            <input
              v-model="profileForm.websiteUrl"
              class="input"
              :class="{ 'is-danger': errors?.websiteUrl }"
              type="text"
              name="website_url"
              id="website_url"
              :placeholder="profile?.websiteUrl || ''"
            />
          </div>
          <p v-if="errors?.websiteUrl" class="help is-danger">
            {{ errors.websiteUrl }}
          </p>
        </div>

        <!-- Location field -->
        <div class="field">
          <label class="label" for="location">Location</label>
          <div class="control">
            <input
              v-model="profileForm.location"
              class="input"
              :class="{ 'is-danger': errors?.location }"
              type="text"
              name="location"
              id="location"
              :placeholder="profile?.location || ''"
            />
          </div>
          <p v-if="errors?.location" class="help is-danger">
            {{ errors.location }}
          </p>
        </div>

        <!-- Bio field -->
        <div class="field">
          <label class="label" for="bio">Bio</label>
          <div class="control">
            <input
              v-model="profileForm.bio"
              class="input"
              :class="{ 'is-danger': errors?.bio }"
              type="text"
              name="bio"
              id="bio"
              :placeholder="profile?.bio || ''"
            />
          </div>
          <p v-if="errors?.bio" class="help is-danger">{{ errors.bio }}</p>
        </div>

        <!-- Submit button -->
        <div class="field">
          <div class="control">
            <button
              type="submit"
              class="button is-primary"
              :class="{ 'is-loading': profileForm.processing }"
              :disabled="profileForm.processing"
            >
              Save information
            </button>
          </div>
        </div>
      </form>
    </section>

    <!-- Change password section -->
    <section class="section">
      <h1 class="title">Change password</h1>
      <form @submit.prevent="submitPassword">
        <div class="field">
          <label class="label" for="currentPassword">Current password</label>
          <div class="control">
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="input"
              :class="{ 'is-danger': errors?.currentPassword }"
              name="currentPassword"
              id="currentPassword"
            />
          </div>
          <p v-if="errors?.currentPassword" class="help is-danger">
            {{ errors.currentPassword }}
          </p>
        </div>

        <div class="field">
          <label class="label" for="newPassword">New password</label>
          <div class="control">
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="input"
              :class="{ 'is-danger': errors?.newPassword }"
              name="newPassword"
              id="newPassword"
            />
          </div>
          <p v-if="errors?.newPassword" class="help is-danger">
            {{ errors.newPassword }}
          </p>
        </div>

        <div class="field">
          <div class="control">
            <button
              type="submit"
              class="button is-primary"
              :class="{ 'is-loading': passwordForm.processing }"
              :disabled="passwordForm.processing"
            >
              Update password
            </button>
          </div>
        </div>
      </form>
    </section>

    <!-- Danger zone section -->
    <section class="section">
      <h1 class="title">Danger zone</h1>
      <div class="field">
        <div class="control">
          <button class="button is-danger" @click="deleteAccount">
            Delete my account
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
