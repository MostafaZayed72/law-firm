<template>
  <v-container class="fill-height text-center" v-if="showTable">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg" >
          <v-card-title>نسيت كلمة المرور؟</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field  v-model="email" label="E-mail" type="email" required class="text-end"></v-text-field>
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
import { ref, onMounted, computed } from 'vue';

const email = ref('');
const showTable = ref(false);

const handleSubmit = async () => {
  try {
    const response = await fetch('https://backend.eyhadvocates.com/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    alert('تم إرسال رابط استعادة كلمة المرور إلى إيميلك')
    // يمكنك عرض رسالة للمستخدم هنا بناءً على استجابة الخادم
  } catch (error) {
    console.error('Error:', error);
    alert(error)
  }
};

onMounted(() => {
  setTimeout(() => {
    showTable.value = true;
  });
});

</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
