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

<style scoped>
/* تعريف متغيرات الألوان */
:root {
  --sidebar-bg-dark: #333333; /* لون خلفية ال sidebar في الوضع الداكن */
  --sidebar-bg-light: #f0f0f0; /* لون خلفية ال sidebar في الوضع الفاتح */
}

/* تطبيق الألوان على ال sidebar */
.v-navigation-drawer {
  background-color: var(--sidebar-bg-light); /* افتراضياً، يتم تعيين اللون الفاتح */
}

.dark-mode .v-navigation-drawer {
  background-color: var(--sidebar-bg-dark); /* تغيير لون ال sidebar في الوضع الداكن */
}
</style>
