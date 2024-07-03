<template>
    <div >
      <button @click="toggleDrawer">Toggle Drawer</button>
      <h1>Welcome to Nuxt 3 with Vuetify and TailwindCSS</h1>
    </div>
  </template>
  
  <script setup>
  import { useLayout } from '@/composables/layout'
  
  const { toggleDrawer } = useLayout()
  </script>
  