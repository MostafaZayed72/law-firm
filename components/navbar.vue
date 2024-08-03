<template>
    <div class="card" v-if="username">
      <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
        <template #start>
          <div class="flex items-center gap-2">
            <img class="w-8" src="/assets/images/logo.png" alt="">
            <NuxtLink class="bg-blue-400 px-2 py-1 rounded-lg text-slate-50 hover:bg-blue-500 hover:text-black  delay" to="/tasks">المهام</NuxtLink>
            <NuxtLink class="bg-blue-400 px-2 py-1 rounded-lg text-slate-50 hover:bg-blue-500 hover:text-black  delay" to="/users_edit" v-if="roleId == 13">تعديل بيانات المستخدمين</NuxtLink>
            <NuxtLink class="bg-blue-400 px-2 py-1 rounded-lg text-slate-50 hover:bg-blue-500 hover:text-black  delay" to="/permissions" v-if="roleId == 13">الصلاحيات</NuxtLink>
            <DropDownMenu v-if="jwt"/>
            <NuxtLink class="bg-blue-400 px-2 py-1 rounded-lg text-slate-50 hover:bg-blue-500 hover:text-black  delay" to="/">الرئيسية</NuxtLink>
          </div>
        </template>
  
        <template #end>
          <div class="flex items-center relative">
            <span class="cursor-pointer" @click="toggleDropdown">{{ username }}</span>
            <Avatar
              image="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
              style="width: 50px; height: 50px"
            />
            <div v-if="dropdownVisible" class="dropdown-menu text-end">
              <NuxtLink class="cursor-pointer" to="/profile">حسابي</NuxtLink>
              <nuxt-link class="cursor-pointer" @click="logout">تسجيل الخروج</nuxt-link>
            </div>
          </div>
        </template>
      </Toolbar>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const username = ref('');
  const dropdownVisible = ref(false);
  const jwt = ref('');
  const roleId = ref('');

onMounted(() => {
  jwt.value= localStorage.getItem('jwt')
  roleId.value= localStorage.getItem('roleId')
})

  onMounted(async () => {
    try {
      const response = await axios.get('https://backend.eyhadvocates.com/api/users/me?populate=*', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      username.value = response.data.username;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  });
  
  const toggleDropdown = () => {
    dropdownVisible.value = !dropdownVisible.value;
  };
  


  const logout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('roleId');
  navigateTo('/login'); // توجيه المستخدم إلى صفحة تسجيل الدخول
};
  </script>
  
  <style scoped>
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }
  
  .dropdown-menu a {
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #333;
  }
  
  .dropdown-menu a:hover {
    background-color: #f5f5f5;
  }
  </style>
  