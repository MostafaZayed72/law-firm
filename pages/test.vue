<template>
  <div class="p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-2xl font-semibold mb-4">تفاصيل القضية</h1>
    <div v-if="caseData">
      <div class="mb-4">
        <span class="font-bold">رقم القضية:</span>
        <span>{{ caseData.case_number || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">عنوان القضية:</span>
        <span>{{ caseData.case_title || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">المدعى عليه:</span>
        <span>{{ caseData.defendant || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">المدعي:</span>
        <span>{{ caseData.claimant || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">درجة القضية:</span>
        <span>{{ caseData.case_degree || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">نوع القضية:</span>
        <span>{{ caseData.case_type || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">تاريخ التسجيل:</span>
        <span>{{ new Date(caseData.registration_date).toLocaleDateString() || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">تاريخ الجلسة القادمة:</span>
        <span>{{ new Date(caseData.next_court_session).toLocaleDateString() || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">سعر القضية:</span>
        <span>{{ caseData.case_price || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">حالة القضية:</span>
        <span>{{ caseData.case_status || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">ملاحظات:</span>
        <span>{{ caseData.note || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">مستشار:</span>
        <span>{{ caseData.advisor_name || 'غير متوفر' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">المحكمة:</span>
        <span>{{ caseData.court || 'غير متوفر' }}</span>
      </div>
    </div>
    <div v-else>
      <p>تحميل البيانات...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const caseData = ref(null);

onMounted(async () => {
  const caseId = route.params.id;
  try {
    const response = await axios.get(`https://backend.eyhadvocates.com/api/cases/${caseId}?populate=*`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    caseData.value = response.data.data.attributes;
  } catch (error) {
    console.error('Error fetching case data:', error);
  }
});
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
