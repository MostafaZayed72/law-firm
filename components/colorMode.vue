<template>
  <div class="cursor-pointer">
    <Icon
      v-if="isDarkMode"
      name="material-symbols:sunny-outline-rounded"
      class="text-3xl"
      @click="toggleMode"
    />
    <Icon
      v-else
      name="material-symbols:nightlight"
      class="text-3xl"
      @click="toggleMode"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const colorMode = useColorMode();
const isDarkMode = ref(false);

onMounted(() => {
  isDarkMode.value = colorMode.preference === 'dark';
});

const toggleMode = () => {
  isDarkMode.value = !isDarkMode.value;
  colorMode.preference = isDarkMode.value ? 'dark' : 'light';
};
</script>
