<script setup lang="ts">
defineProps<{
  text?: string;
}>();
</script>

<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="spinner-border spinner-lg" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <span class="ms-2">{{ text || 'Processing...' }}</span>
  </div>
</template>
