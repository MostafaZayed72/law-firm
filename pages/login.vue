<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height w-100" style="direction: rtl;" v-if="showTable">
    <v-card class="pa-5 w-100 rounded-lg" :class="cardClass" style="direction: rtl; text-align: right;">
      <v-card-title>
        <span class="text-h5">تسجيل الدخول</span>
      </v-card-title>
      <v-card-text>
        <v-form style="direction: rtl;">
          <v-text-field
            v-model="username"
            label="اسم المستخدم"
            prepend-icon="mdi-account"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="كلمة المرور"
            prepend-icon="mdi-lock"
            type="password"
            required
          ></v-text-field>
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
    const response = await axios.post('https://backend.lawyerstor.com/api/auth/local', {
      identifier: username.value,
      password: password.value
    })
    // تحديث حالة تسجيل الدخول في localStorage
    localStorage.setItem('logedIn', 'true')
    navigateTo('/cases')
    // يمكن توجيه المستخدم إلى الصفحة الرئيسية أو عرض رسالة نجاح هنا
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error.response.data)
    alert('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.')
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
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
