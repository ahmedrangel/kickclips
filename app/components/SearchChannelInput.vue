<script setup lang="ts">
const channel = ref<string>("");

const goToChannel = () => {
  if (channel.value) navigateTo(`/${channel.value}`);
};

defineProps<{
  align?: "start" | "center" | "end";
}>();
</script>

<template>
  <form @submit.prevent="goToChannel()">
    <div class="d-flex align-items-stretch justify-content-center" :class="`justify-content-md-${align || 'center'}`">
      <input id="search" v-model="channel" class="form-control" type="text" placeholder="Search channel clips" style="max-width: 200px;">
      <button v-ripple type="submit" class="btn d-flex align-items-center justify-content-center text-dark fw-bold" style="background-color: var(--app-bg-color); color: var(--app-text-color);">
        <Icon name="ph:magnifying-glass-bold" size="1.2em" />
      </button>
    </div>
  </form>
</template>
