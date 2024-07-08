<template>
    <v-container class="d-flex flex-column align-center justify-center fill-height w-100"  style="direction: rtl;" v-if="showTable">
      <v-card class="pa-5 w-100 rounded-lg" :class="cardClass" style="direction: rtl; text-align: right;">
        <v-card-title >
          <span class="text-h5">الملف الشخصي</span>
        </v-card-title>
        <v-card-text :class="cardClass">
          <v-list :class="cardClass">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="title">اسم المستخدم:</v-list-item-title>
                <v-list-item-subtitle>{{ username }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="title">البريد الإلكتروني:</v-list-item-title>
                <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
    <v-btn class="mr-4 my-4"  color="primary">تغيير كلمة المرور</v-btn>

        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const colorMode = useColorMode();

  const cardClass = computed(() => {
    return colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white';
  });

  const username = ref('اسم المستخدم الخاص بك')
  const mobile = ref('رقم الموبايل الخاص بك')
  const email = ref('example@example.com')

  const showTable = ref(false);

  onMounted(() => {
    setTimeout(() => {
      showTable.value = true;
    }); // Delay in milliseconds
  });

  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  