<template>
    <div class="flex flex-col justify-center items-center h-screen gap-6">
      <h1 class="font-bold text-3xl">أهلاً ومرحباً بك في مكتب البلوشي والمراشدة للمحاماة والإستشارات القانونية</h1>
      <div class="flex gap-4">
        <NuxtLink to=""><v-btn class="hover:bg-black hover:text-white delayed">تسجيل الدخول</v-btn></NuxtLink>
        <NuxtLink to=""><v-btn class="hover:bg-black hover:text-white delayed">تسجيل حساب جديد</v-btn></NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useLayout } from '@/composables/layout'
  
  const { toggleDrawer } = useLayout()
  </script>
  <style >
  .delayed{
    transition: 0.5s;
  }
  </style>