<script setup lang="ts">
const scrolled = ref(false);
const maxScroll = 200;

const topFunction = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  window.onscroll = () => {
    scrolled.value = (document.body.scrollTop > maxScroll || document.documentElement.scrollTop > maxScroll);
  };
});
</script>

<template>
  <Transition name="tab">
    <button v-if="scrolled" id="back-to-top" class="bg-primary top rounded position-fixed m-4 end-0 bottom-0 btn btn-lg shadow d-none d-lg-block align-items-center" role="button" @click="topFunction()">
      <span class="p-2 d-flex align-items-center">
        <Icon name="ph:arrow-up-fill" size="1.5rem" />
      </span>
    </button>
  </Transition>
</template>

<style scoped>
.top {
  z-index: 10021;
}
</style>
