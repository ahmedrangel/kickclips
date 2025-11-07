<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";

const channel = ref<string>("");
const channelResults = ref<KickChannelSearchResult["hits"][number]["document"][]>([]);
const searching = ref<boolean>(false);
const loading = ref<boolean>(false);

const goToChannel = () => {
  if (channel.value) navigateTo(`/${channel.value}`);
};

defineProps<{
  align?: "start" | "center" | "end";
}>();

watch(channel, () => {
  searching.value = true;
});

watchDebounced(channel, async () => {
  if (!channel.value) {
    channelResults.value = [];
    loading.value = false;
    searching.value = false;
    return;
  }
  loading.value = true;
  channelResults.value = await searchChannel(channel.value);
  searching.value = false;
  loading.value = false;
}, { debounce: 500 });
</script>

<template>
  <form @submit.prevent="goToChannel()">
    <div class="d-flex justify-content-center" :class="`justify-content-md-${align || 'center'}`">
      <div class="d-flex position-relative">
        <input id="search" v-model="channel" class="form-control search-input" type="text" placeholder="Search channel clips" style="max-width: 200px;" autocomplete="off">
        <button v-ripple type="submit" class="btn d-flex align-items-center justify-content-center text-dark fw-bold" style="background-color: var(--app-bg-color); color: var(--app-text-color);">
          <Icon name="ph:magnifying-glass-bold" size="1.2em" />
        </button>
        <div v-if="channelResults.length || searching" class="position-absolute border border-secondary rounded-1 overflow-hidden w-100" style="top: 45px;">
          <ul class="list-group w-100 bg-dark">
            <template v-if="searching">
              <Icon name="eos-icons:loading" class="m-2 align-self-center" size="1.4em" />
            </template>
            <NuxtLink v-for="result in channelResults" :key="result.slug" :to="`/${result.slug}`" class="text-decoration-none">
              <li class="list-group-item list-group-item-action list-group-item-dark d-flex align-items-center gap-2">
                <span>{{ result.username || result.slug }}</span>
                <Icon v-if="result.verified" name="ph:check-circle-fill" class="text-primary" />
              </li>
            </NuxtLink>
          </ul>
        </div>
      </div>
    </div>
  </form>
</template>
