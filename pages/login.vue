<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height w-100" style="direction: rtl;"
    v-if="showTable">
    <v-card class="pa-5 w-100 rounded-lg" :class="cardClass" style="direction: rtl; text-align: right;">
      <v-card-title>
        <span class="text-h5">تسجيل الدخول</span>
      </v-card-title>
      <v-card-text>
        <v-form style="direction: rtl;">
          <v-text-field class="text-blue-700" v-model="username" label="username" prepend-icon="mdi-account" type="text"
            required></v-text-field>
          <v-text-field class="text-blue-700" v-model="password" label="password" prepend-icon="mdi-lock"
            type="password" required></v-text-field>
          <v-btn color="primary" block @click="login">تسجيل الدخول</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex flex-column align-center">
        <NuxtLink to="/forgot-password" class="my-2">هل نسيت الباسورد؟</NuxtLink>
        <NuxtLink to="/register">إنشاء حساب جديد</NuxtLink>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const username = ref('')
const password = ref('')

const login = async () => {
  try {
    // Trim whitespace from username and password
    const trimmedUsername = username.value.trim()
    const trimmedPassword = password.value.trim()

    const response = await axios.post('https://backend.eyhadvocates.com/api/auth/local', {
      identifier: trimmedUsername,
      password: trimmedPassword
    })
    const token = response.data.jwt
    const userId = response.data.user.id

    localStorage.setItem('jwt', token)
    localStorage.setItem('logedIn', 'true')
    localStorage.setItem('userId', userId)

    // جلب جميع المستخدمين بعد تسجيل الدخول بنجاح
    const usersResponse = await axios.get(`https://backend.eyhadvocates.com/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const role = usersResponse.data.role.id

    localStorage.setItem('roleId', role)

    navigateTo('/cases')
  } catch (error) {
    navigateTo('/cases')
  }
}

const showTable = ref(false)
const colorMode = useColorMode()

onMounted(() => {
  setTimeout(() => {
    showTable.value = true
  }) // Delay in milliseconds
})

const cardClass = computed(() => {
  return colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white'
})

definePageMeta({
  layout: "custome"
})
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
