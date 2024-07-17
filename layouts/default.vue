<template>
  <div :style="{ '--bg-color': bgColor, '--text-color': textColor }">
    <v-layout>
      <!-- Side Navigation Drawer -->
      <v-navigation-drawer location="right" permanent v-if="show " class="hidden">
        <template v-slot:prepend>
          <div class="flex flex-col">
            <div class="flex justify-center items-center gap-10">
              <img class="w-[20%]" src="/assets/images/logo.png" alt="">
              <color-mode />
            </div>
            <v-list-item lines="two"
            style="direction: rtl;"
              prepend-avatar="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
              subtitle="Logged in" :title=userName>
            </v-list-item>
          </div>
        </template>

        <v-list density="compact" nav style="direction: rtl">
          <NuxtLink to="/"><v-list-item prepend-icon="mdi-home-city" title="الرئيسية" value="home"></v-list-item></NuxtLink>
          <NuxtLink v-if="logedIn == 'true'" to="/profile"><v-list-item prepend-icon="mdi-account" title="حسابي" value="account"></v-list-item></NuxtLink>
          <NuxtLink to="/cases"><v-list-item prepend-icon="mdi-gavel" title="جميع القضايا" value="users"></v-list-item></NuxtLink>
          <NuxtLink v-if="roleId == 13" to="/permissions"><v-list-item prepend-icon="mdi-account-key" title="إعطاء الصلاحيات للمستخدمين" value="permissions"></v-list-item></NuxtLink>
          <NuxtLink v-if="roleId == 13" to="/users_edit"><v-list-item prepend-icon="mdi-pencil" title="تعديل بيانات الموظفين" value="users_edit"></v-list-item></NuxtLink>
          <NuxtLink @click.prevent="logout"><v-list-item prepend-icon="mdi-account-circle" title="تسجيل الخروج" value="logOut"></v-list-item></NuxtLink>
        </v-list>
      </v-navigation-drawer>

      <!-- Sidebar toggle button -->
      <v-btn  icon class="absolute top-0 left-100 " @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- Main content -->
      <v-main class="h-screen mt-10">
        <div class="h-screen mr-10" style="direction: rtl;">
          <slot />
        </div>
      </v-main>
    </v-layout>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "axios";

const show = ref(true);
const logedIn = ref(true);
const roleId = ref(null);
const colormode = ref('light'); // افتراضياً الوضع الفاتح

const router = useRouter();
const route = useRoute();

// متغيرات الألوان
const bgColor = ref('#ffffff');
const textColor = ref('#000000');

// تحديث الألوان بناءً على colormode
watch(colormode, (newValue) => {
  if (newValue === 'dark') {
    bgColor.value = '#1a202c';
    textColor.value = '#ffffff';
  } else {
    bgColor.value = '#ffffff';
    textColor.value = '#000000';
  }
});

const jwt = ref()
// قراءة حالة تسجيل الدخول من localStorage عند تحميل الصفحة
onMounted(() => {
  logedIn.value = localStorage.getItem('logedIn');
  roleId.value = localStorage.getItem('roleId');
  jwt.value = localStorage.getItem('jwt');
});

// دالة تبديل القائمة الجانبية
const toggleDrawer = () => {
  show.value = !show.value;
};

// دالة تسجيل الخروج
const logout = () => {
  localStorage.setItem('logedIn', 'false');
  localStorage.removeItem('jwt');
  localStorage.removeItem('roleId');
  logedIn.value = false;
  router.push('/login'); // توجيه المستخدم إلى صفحة تسجيل الدخول
};

const userName=ref()


onMounted(async () => {
  try {
    const jwt = localStorage.getItem("jwt");

    const response = await axios.get('https://backend.lawyerstor.com/api/users/me',{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    userName.value = response.data.username;
    console.log(response)
    logedIn.value = true; // يفترض أن المستخدم مسجل الدخول إذا جلبت البيانات بنجاح
  } catch (error) {
    console.error('Failed to fetch user data', error);
    logedIn.value = false; // يمكنك التعامل مع حالة فشل جلب البيانات هنا
  }
});
</script>

<style scoped>
:root {
  --bg-color: var(--default-bg-color);
  --text-color: var(--default-text-color);
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
</style>
