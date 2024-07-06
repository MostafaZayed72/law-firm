<template>
    <v-card class="mx-auto mt-5" max-width="800">
      <v-card-title>{{ caseData.name }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="رقم القضية" v-model="caseData.calories" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="المُدعي" v-model="caseData.fat" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="المُدعي عليه" v-model="caseData.fatt" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="نوع القضية" v-model="caseData.carbs" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="درجة القضية" v-model="caseData.protein" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="قيمة الدعوة" v-model="caseData.iron" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="تاريخ التسجيل" v-model="caseData['1']" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="تاريخ الجلسة القادمة" v-model="caseData['2']" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="القرار" v-model="caseData['4']" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="حالة القضية" v-model="caseData['5']" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="نوع الإعلان" v-model="caseData['6']" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="رابط الدعوة" v-model="caseData['7']" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="رول القضية" v-model="caseData['8']" readonly></v-text-field>
            </v-col>
            <!-- Add additional fields as needed -->
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const caseData = ref({
    name: 'اسم القضية',
    calories: 123,
    fat: 'المُدعي',
    fatt: 'المُدعي عليه',
    carbs: 'نوع القضية',
    protein: 'درجة القضية',
    iron: 'قيمة الدعوة',
    1: 'تاريخ التسجيل',
    2: 'تاريخ الجلسة القادمة',
    4: 'القرار',
    5: 'حالة القضية',
    6: 'نوع الإعلان',
    7: 'رابط الدعوة',
    8: 'رول القضية',
    // Additional fields as needed
  });
  
  // Fetch case details based on route params ID
  const route = useRoute();
  const caseId = ref(route.params.id);
  
  // Example of fetching data from an API
  // Replace with your actual API call logic
  onMounted(async () => {
    // Assuming you have a function to fetch case data by ID
    // const caseDetails = await fetchCaseDetails(caseId.value);
    // caseData.value = caseDetails;
  });
  
  </script>
  
  <style scoped>
  /* Custom styling using Tailwind classes */
  </style>
  