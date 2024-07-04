<template>
    <v-container class="fill-height text-center" v-if="showTable">
      <v-row justify="center">
        <v-col cols="12" >
          <v-card class="pa-4 rounded-lg" :class="cardClass">
            <v-card-title>نسيت كلمة المرور؟</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="email"
                  label="E-mail"
                  type="email"
                  required
                  class="text-end" 
                ></v-text-field>
                <v-btn type="submit" color="primary" class="mt-4">
                  إرسال رابط إعادة تعيين كلمة المرور
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  
  const handleSubmit = () => {
    console.log('إعادة تعيين كلمة المرور للبريد الإلكتروني:', email.value);
  };

  const showTable = ref(false);
  const colorMode = useColorMode();

onMounted(() => {
  setTimeout(() => {
    showTable.value = true;
  }); // Delay in milliseconds
});
const cardClass = computed(() => {
    return colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white';
  });

  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  