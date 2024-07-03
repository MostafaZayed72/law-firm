<!-- ColorMode.vue -->
<template>
  <div class="cursor-pointer">
    <Icon
      v-if="colorMode.preference === 'dark'"
      name="material-symbols:sunny-outline-rounded"
      class="text-3xl"
      @click="colorMode.preference = 'light'"
    />
    <Icon
      v-else
      name="material-symbols:nightlight"
      class="text-3xl"
      @click="colorMode.preference = 'dark'"
    />
  </div>
</template>

<script setup>

const colorMode = useColorMode();
</script>
