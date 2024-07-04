<template>
    <v-card
      v-if="showTable"
      title="جميع القضايا"
      flat
      :class="cardClass"
      class="mx-10 rounded-lg"
    >
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="البحث"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>
  
      <v-data-table
        :class="cardClass"
        :headers="headers"
        :items="desserts"
        :search="search"
        :custom-filter="customFilter"
      >
        <template #item.1="{ item }">
          {{ formatDate(item['1']) }}
        </template>
        <template #item.2="{ item }">
          {{ formatDate(item['2']) }}
        </template>
      </v-data-table>
  
    </v-card>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  const colorMode = useColorMode();
  const search = ref('');
  const showTable = ref(false);
  
  const headers = [
    { align: 'start', key: 'name', sortable: false, title: 'عنوان القضية' },
    { key: 'calories', title: 'رقم القضية' },
    { key: 'fat', title: 'المُدعي' },
    { key: 'fatt', title: 'المُدعي عليه' },
    { key: 'carbs', title: 'نوع القضية' },
    { key: 'protein', title: 'درجة القضية' },
    { key: 'iron', title: 'قيمة الدعوة' },
    { key: '1', title: 'تاريخ التسجيل' },
    { key: '2', title: 'تاريخ الجلسة القادمة' },
    { key: '4', title: 'القرارات' },
    { key: '5', title: 'حالة القضية' },
    { key: '6', title: 'نوع الإعلان' },
    { key: '7', title: 'رابط الدعوة' },
    { key: '8', title: 'رول القضية' },
    { key: '9', title: 'حذف القضية' },
  ];
  
  const desserts = ref([
    {
      name: 'قتل',
      calories: 159,
      fat: 'ياسر',
      fatt: 'محمد / احمد /محمود',
      carbs: 'جنائي',
      protein: 4.0,
      iron: 100,
      1: '21/7/2024',
      2: '28/8/2024',
      4: 'تأجيل',
      5: 'مفتوحة',
      6: 'إعلات إلكتروني',
      7: 'www.googlemeet.com',
      8: '12',
      9: 'حذف'
    },
    {
      name: 'سرقة',
      calories: 122,
      fat: 'محمد',
      fatt: 'محمد/صالح',
      carbs: 'جنائي',
      protein: 4.0,
      iron: 100,
      1: '22/8/2024',
      2: '-',
      4: '',
      5: 'مفتوحة',
      6: 'إعلات بالتحري والنشر',
      7: 'www.googlemeet.com',
      8: '1',
      9: 'حذف'
    },
    {
      name: 'سرقة',
      calories: 122,
      fat: 'محمد',
      fatt: 'محمد/صالح',
      carbs: 'جنائي',
      protein: 4.0,
      iron: 100,
      1: '27/9/2024',
      2: '-',
      4: '',
      5: 'مغلقة',
      6: 'إعلات بالتحري والنشر',
      7: 'www.googlemeet.com',
      8: '1',
      9: 'حذف'
    },
  ]);
  
  const cardClass = computed(() => {
    return colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white';
  });
  
  const formatDate = (dateStr) => {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`; // Return ISO format for correct sorting
    }
    return '';
  };
  
  const customFilter = (value, search, item) => {
    if (search.length === 0) return true; // No search term, always match
  
    const itemValue = item[value]; // Get the value of the item's property
    if (!itemValue) return false; // If no value, do not match
  
    const searchDate = new Date(formatDate(search));
    const itemDate = new Date(formatDate(itemValue));
  
    return searchDate.getTime() === itemDate.getTime();
  };
  
  onMounted(() => {
    setTimeout(() => {
      showTable.value = true;
    }, 1); // Delay in milliseconds
  });
  </script>
  