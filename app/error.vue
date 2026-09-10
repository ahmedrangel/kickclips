<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="bg-body p-5 rounded-3 shadow">
      <h1>Error <span class="text-primary">{{ error.status }}</span></h1>
      <h5>An error occurred. {{ error.message || error.statusText || "error" }}</h5>
      <p>Go back: <NuxtLink to="/" class="underline hover:text-primary">{{ SITE.url }}</NuxtLink></p>
    </div>
  </div>
</template>
