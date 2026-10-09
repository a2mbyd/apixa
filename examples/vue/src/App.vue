<script setup lang="ts">
import { isApiError } from "@apixa/core";
import { onMounted, ref } from "vue";
import { api, type User } from "./api";

const users = ref<User[]>([]);
const name = ref("");
const email = ref("");
const error = ref<string | null>(null);
const loading = ref(true);

async function load() {
  error.value = null;
  try {
    users.value = await api.users.getAll();
  } catch (err) {
    error.value = isApiError(err)
      ? `${err.name}: ${err.message}. Start the FastAPI backend on :8787.`
      : "Failed to load users";
  } finally {
    loading.value = false;
  }
}

async function createUser() {
  error.value = null;
  try {
    await api.users.create({ name: name.value, email: email.value });
    name.value = "";
    email.value = "";
    await load();
  } catch (err) {
    error.value = isApiError(err) ? err.message : "Create failed";
  }
}

async function remove(id: string) {
  error.value = null;
  try {
    await api.users.delete(id);
    await load();
  } catch (err) {
    error.value = isApiError(err) ? err.message : "Delete failed";
  }
}

onMounted(() => {
  void load();
});
</script>

<template>
  <main>
    <p class="eyebrow">Apixa · Vue</p>
    <h1>Typed client in Vue 3</h1>
    <p class="lede">Uses <code>defineApi</code> from <code>@apixa/core</code>.</p>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading">Loading…</p>

    <ul>
      <li v-for="user in users" :key="user.id">
        <div>
          <strong>{{ user.name }}</strong>
          <span>{{ user.email }} · {{ user.id }}</span>
        </div>
        <button type="button" @click="remove(user.id)">Delete</button>
      </li>
    </ul>

    <form @submit.prevent="createUser">
      <input v-model="name" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit">Create</button>
    </form>
  </main>
</template>
