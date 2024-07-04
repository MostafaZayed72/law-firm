<template>
    <v-container class="d-flex flex-column align-center justify-center fill-height w-100" style="direction: rtl;">
      <v-card class="pa-5 w-100" style="direction: rtl; text-align: right;">
        <v-card-title>
          <span class="text-h5">إنشاء حساب جديد</span>
        </v-card-title>
        <v-card-text>
          <v-form style="direction: rtl;">
            <v-text-field
              v-model="emailOrPhone"
              label="البريد الإلكتروني أو رقم الهاتف"
              prepend-icon="mdi-email"
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
            <v-text-field
              v-model="confirmPassword"
              label="تأكيد كلمة المرور"
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
  import { ref } from 'vue'
  
  const emailOrPhone = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  
  const register = () => {
    if (password.value !== confirmPassword.value) {
      alert('كلمات المرور غير متطابقة')
      return
    }
    // وظيفة إنشاء الحساب هنا
    console.log('البريد الإلكتروني أو رقم الهاتف:', emailOrPhone.value)
    console.log('كلمة المرور:', password.value)
  }
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  