<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height w-100" style="direction: rtl;" v-if="showTable">
    <v-card class="pa-5 w-100 rounded-lg" style="direction: rtl; text-align: right;" :class="cardClass">
      <v-card-title>
        <span class="text-h5">إنشاء حساب جديد</span>
      </v-card-title>
      <v-card-text>
        <v-form style="direction: rtl;">
          <v-text-field
          class="text-blue-700"
            v-model="username"
            label="username"
            prepend-icon="mdi-account"
            type="text"
            required
          ></v-text-field>
          <v-text-field
          class="text-blue-700"
            v-model="email"
            label="email"
            prepend-icon="mdi-email"
            type="text"
            required
          ></v-text-field>
          <v-text-field
          class="text-blue-700"
            v-model="password"
            label="password"
            prepend-icon="mdi-lock"
            type="password"
            required
          ></v-text-field>
          <v-text-field
          class="text-blue-700"
            v-model="confirmPassword"
            label="confirm password"
            prepend-icon="mdi-lock"
            type="password"
            required
          ></v-text-field>
          <v-btn color="primary" block @click="register">إنشاء حساب</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex flex-column align-center">
        <NuxtLink to="/login" class="my-2">لديك حساب بالفعل؟ تسجيل الدخول</NuxtLink>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert('كلمات المرور غير متطابقة')
    return
  }
  try {
    const response = await axios.post('https://backend.lawyerstor.com/api/auth/local/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    alert("تم التسجيل بنجاح")
    setTimeout(() => {
      navigateTo('/login')
    });
  } catch (error) {
    console.error('خطأ في التسجيل:', error.response.data)
    alert(error.response.data.error.message)
  }
}

const showTable = ref(false)
const colorMode = useColorMode()

onMounted(() => {
  setTimeout(() => {
    showTable.value = true
  }, 500) // Delay in milliseconds
})

const cardClass = computed(() => {
  return colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white'
})
definePageMeta({
    layout:"custome"
})

</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
