<script setup lang="ts">
const channel = ref<string>("");

const goToChannel = () => {
  if (channel.value) navigateTo(`/${channel.value}`, { external: true });
};

defineProps<{
  align?: "start" | "center" | "end";
}>();
</script>

<template>
  <form @submit.prevent="goToChannel()">
    <div class="input-group d-flex align-items-center" :class="`justify-content-${align || 'center'}`">
      <input id="search" v-model="channel" class="form-control" type="text" placeholder="Search channel clips" style="max-width: 200px;">
      <button v-ripple type="submit" class="btn d-flex align-items-center justify-content-center text-dark fw-bold" style="background-color: var(--app-bg-color); color: var(--app-text-color);">
        <Icon class="iconify" name="ph:magnifying-glass-bold" height="1.5em" width="1.2em" />
      </button>
    </div>
  </form>
</template>
