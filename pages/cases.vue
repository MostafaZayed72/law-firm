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

    <!-- Add new case button -->
    <v-btn class="mr-4" @click="addNewCaseDialog = true" color="primary">إضافة قضية جديدة</v-btn>

    <!-- Add new case dialog -->
    <v-dialog v-model="addNewCaseDialog" max-width="800px">
      <v-card>
        <v-card-title>إضافة قضية جديدة</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.name" label="عنوان القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.calories" label="رقم القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.fat" label="المُدعي"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.fatt" label="المُدعي عليه"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.carbs" label="نوع القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.protein" label="درجة القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.iron" label="قيمة الدعوة"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase['1']" label="تاريخ التسجيل"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase['2']" label="تاريخ الجلسة القادمة"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="addNewCaseDialog = false">إلغاء</v-btn>
          <v-btn color="blue darken-1" @click="addNewCase">تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, computed, onMounted, watch } from 'vue';

const colorMode = useColorMode();
const search = ref('');
const showTable = ref(false);
const addNewCaseDialog = ref(false); // Control dialog visibility

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
    6: 'إعلات إلكتروني',
    7: 'www.googlemeet.com',
    8: '12',
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

const newCase = ref({
  name: '',
  calories: '',
  fat: '',
  fatt: '',
  carbs: '',
  protein: '',
  iron: '',
  '1': '',
  '2': ''
});

const addNewCase = () => {
  desserts.value.push({
    name: newCase.value.name,
    calories: newCase.value.calories,
    fat: newCase.value.fat,
    fatt: newCase.value.fatt,
    carbs: newCase.value.carbs,
    protein: newCase.value.protein,
    iron: newCase.value.iron,
    1: newCase.value['1'],
    2: newCase.value['2'],
    4: '',
    5: 'مفتوحة',
    6: 'إعلات إلكتروني',
    7: 'www.googlemeet.com',
    8: '12',
    9: 'حذف'
  });

  // Reset the newCase object and close the dialog
  newCase.value = {
    name: '',
    calories: '',
    fat: '',
    fatt: '',
    carbs: '',
    protein: '',
    iron: '',
    '1': '',
    '2': ''
  };
  addNewCaseDialog.value = false; // Close the dialog after adding
};

// Watch for changes in newCase
watch(newCase, () => {
  console.log('New case inputs updated:', newCase.value);
});

onMounted(() => {
  setTimeout(() => {
    showTable.value = true;
  }); // Delay in milliseconds
});
</script>
