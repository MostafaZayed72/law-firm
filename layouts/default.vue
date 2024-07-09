<template>
  <div style="direction: rtl;" class="dark:bg-dark1 bg-gray-300 dark:text-white ">
    <v-layout>
      <v-navigation-drawer  location="right" permanent v-if="show " class="hidden">
        <template v-slot:prepend>
          <div class="flex flex-col">
            <div class="flex justify-center items-center gap-10">
              <img class="w-[20%]" src="/assets/images/logo.png" alt="">
              <color-mode /> 
            </div>
            <v-list-item  lines="two"
              prepend-avatar="https://media-hbe1-1.cdn.whatsapp.net/v/t61.24694-24/445156387_434453806052029_8839455247940985259_n.jpg?ccb=11-4&oh=01_Q5AaIG_mOtKGSomW6-qC0lK8ZpXSPLKmeBMkPTJkCYLhss9c&oe=6691058A&_nc_sid=e6ed6c&_nc_cat=107"
              subtitle="Logged in" title="أ/عبدالله"></v-list-item>
          </div>
        </template>

        <v-list density="compact" nav>
          <NuxtLink to="/"><v-list-item prepend-icon="mdi-home-city" title="الرئيسية" value="home"></v-list-item></NuxtLink>
          <!-- <NuxtLink v-if="logedIn == 'true'" to="/profile"><v-list-item prepend-icon="mdi-account" title="حسابي" value="account"></v-list-item></NuxtLink> -->
          <NuxtLink  to="/cases"><v-list-item prepend-icon="mdi-gavel" title="جميع القضايا" value="users"></v-list-item></NuxtLink>
          <NuxtLink  @click.prevent="logout"><v-list-item prepend-icon="mdi-account-circle" title="تسجيل الخروج" value="logOut"></v-list-item></NuxtLink>
        </v-list>
      </v-navigation-drawer>

      <v-main class="h-screen mt-10 relative">
        <v-btn icon class="absolute top-0 right-0" @click="toggleDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <div class="">
          <slot />
        </div>
      </v-main>
    </v-layout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const show = ref(true);
const logedIn = ref(true);
const jwt =ref()
const toggleDrawer = () => {
  show.value = !show.value;
};

// قراءة حالة تسجيل الدخول من localStorage عند تحميل الصفحة
onMounted(() => {
  logedIn.value = localStorage.getItem('logedIn');
  jwt.value = localStorage.getItem('jwt');
});


// دالة لتسجيل الخروج
const logout = () => {
  localStorage.setItem('logedIn', 'false');
  localStorage.removeItem('jwt');
  logedIn.value = false;
navigateTo('/login')
  // يمكن توجيه المستخدم إلى صفحة تسجيل الدخول هنا
};
</script>
