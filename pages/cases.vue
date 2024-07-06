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
    <v-btn class="mr-4 mb-4" @click="addNewCaseDialog = true" color="primary">إضافة قضية جديدة</v-btn>

    <!-- Add new case dialog -->
    <v-dialog v-model="addNewCaseDialog" max-width="800px" style="direction: rtl;">
      <v-card>
        <v-card-title>إضافة قضية جديدة</v-card-title>
        <v-card-text>
          <v-container>
            <v-row style="direction: rtl;">
              <!-- Existing input fields -->
              <v-col cols="12" md="6" style="direction: rtl;">
                <v-text-field style="direction: rtl;" v-model="newCase.name" label="عنوان القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.id" label="رقم القضية"></v-text-field>
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
                <v-text-field type="date" v-model="newCase['1']" label="تاريخ التسجيل"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field type="date" v-model="newCase['2']" label="تاريخ الجلسة القادمة"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase['4']" label="القرار"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase['5']" label="حالة القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase['6']" label="نوع الإعلان"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase['7']" label="رابط الدعوة"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase['8']" label="رول القضية"></v-text-field>
              </v-col>
              <!-- New input fields -->
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.court" label="المحكمة المختصة"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.consultant" label="اسم المستشار"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="newCase.notes" label="ملاحظات"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addNewCaseDialog = false">إلغاء</v-btn>
          <v-btn color="blue darken-1" text @click="addNewCase">تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
  :class="cardClass"
  v-model:search="search"
  :headers="headers"
  :items="desserts"
  class="elevation-1 mx-4"
  :footer-props="{ itemsPerPageText: 'عدد العناصر في الصفحة:' }"
  :no-data-text="'لا توجد بيانات'"
>
  <template v-slot:item.1="{ item }">
    <div style="white-space: nowrap;">{{ item['1'] }}</div>
  </template>
  <template v-slot:item.2="{ item }">
    <div style="white-space: nowrap;">{{ item['2'] }}</div>
  </template>
  <template v-slot:[`item.9`]="{ item }">
    <v-btn small icon @click="confirmDelete(item)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </template>
  <template v-slot:[`item.10`]="{ item }">
    <v-btn small icon @click="editCase(item)">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </template>
  <template v-slot:[`item.id`]="{ item }">
    <nuxt-link :to="`/case/${item.id}`">{{ item.id }}</nuxt-link>
  </template>
  <template v-slot:[`item.name`]="{ item }">
    <nuxt-link :to="`/case/${item.id}`">{{ item.name }}</nuxt-link>
  </template>
</v-data-table>


    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>تأكيد الحذف</v-card-title>
        <v-card-text>
          <p>هل أنت متأكد من رغبتك في حذف هذه القضية؟</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">إلغاء</v-btn>
          <v-btn color="blue darken-1" text @click="deleteCase">تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit case dialog -->
    <v-dialog v-model="editDialog" max-width="800px">
      <v-card>
        <v-card-title>تعديل القضية</v-card-title>
        <v-card-text>
          <v-container>
            <v-row style="direction: rtl;">
              <!-- Existing input fields -->
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.name" label="عنوان القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.id" label="رقم القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.fat" label="المُدعي"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.fatt" label="المُدعي عليه"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.carbs" label="نوع القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.protein" label="درجة القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.iron" label="قيمة الدعوة"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field type="date" v-model="editedCase['1']" label="تاريخ التسجيل"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field type="date" v-model="editedCase['2']" label="تاريخ الجلسة القادمة"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase['4']" label="القرار"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase['5']" label="حالة القضية"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase['6']" label="نوع الإعلان"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase['7']" label="رابط الدعوة"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase['8']" label="رول القضية"></v-text-field>
              </v-col>
              <!-- New input fields for editing -->
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.court" label="المحكمة المختصة"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.consultant" label="اسم المستشار"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedCase.notes" label="ملاحظات"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false">إلغاء</v-btn>
          <v-btn color="blue darken-1" text @click="saveEditedCase">حفظ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const colorMode = useColorMode();
const search = ref('');
const showTable = ref(false);
const addNewCaseDialog = ref(false); // Control add new case dialog visibility
const deleteDialog = ref(false); // Control delete confirmation dialog visibility
const editDialog = ref(false); // Control edit dialog visibility

const selectedCase = ref(null); // Ref for selected case
const editedCase = ref(null); // Ref for edited case

const headers = [
  { align: 'start', key: 'name', sortable: false, title: 'عنوان القضية' },
  { key: 'id', title: 'رقم القضية' },
  { key: 'fat', title: 'المُدعي' },
  { key: 'fatt', title: 'المُدعي عليه' },
  { key: 'carbs', title: 'نوع القضية' },
  { key: 'protein', title: 'درجة القضية' },
  { key: 'iron', title: 'قيمة الدعوة' },
  { key: '1', title: 'تاريخ التسجيل' },
  { key: '2', title: 'تاريخ الجلسة القادمة' },
  { key: '4', title: 'القرار' },
  { key: '5', title: 'حالة القضية' },
  { key: '6', title: 'نوع الإعلان' },
  { key: '7', title: 'رابط الدعوة' },
  { key: '8', title: 'رول القضية' },
  { key: 'court', title: 'المحكمة المختصة' },   
  { key: 'consultant', title: 'اسم المستشار' }, 
  { key: 'notes', title: 'ملاحظات' },           
  { key: '9', title: 'حذف القضية' },
  { key: '10', title: 'تعديل القضية' },
];

const desserts = ref([
  {
    name: 'قتل',
    id: 159,
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
    9: 'حذف',
    court: 'محكمة الجنايات',  
    consultant: 'المستشار أحمد',
    notes: 'لا توجد ملاحظات'  
  },
  {
    name: 'سرقة',
    id: 122,
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
    9: 'حذف',
    court: 'محكمة الجنايات',   
    consultant: 'المستشار خالد', 
    notes: 'تم تأجيل الجلسة'   
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

const confirmDelete = (item) => {
  selectedCase.value = item;
  deleteDialog.value = true;
};

const deleteCase = () => {
  const index = desserts.value.indexOf(selectedCase.value);
  if (index !== -1) {
    desserts.value.splice(index, 1);
  }
  deleteDialog.value = false; // Close the delete confirmation dialog
};

const editCase = (item) => {
  selectedCase.value = item;
  editedCase.value = { ...item }; // Make a copy of the selected case for editing
  editDialog.value = true;
};

const saveEditedCase = () => {
  const index = desserts.value.findIndex(item => item === selectedCase.value);
  if (index !== -1) {
    desserts.value[index] = { ...editedCase.value };
  }
  editDialog.value = false; // Close the edit dialog
};

const newCase = ref({
  name: '',
  id: '',
  fat: '',
  fatt: '',
  carbs: '',
  protein: '',
  iron: '',
  1: '',
  2: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  court: '',       
  consultant: '',  
  notes: '',       
  // Additional input fields
  extraField1: '',
  extraField2: ''
});

const addNewCase = () => {
  // Implement add new case logic here
  const caseToAdd = { ...newCase.value };
  desserts.value.push(caseToAdd);

  // Clear the form fields
  newCase.value = {
    name: '',
    id: '',
    fat: '',
    fatt: '',
    carbs: '',
    protein: '',
    iron: '',
    1: '',
    2: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    court: '',       
    consultant: '',  
    notes: '',       
    extraField1: '',
    extraField2: ''
  };

  addNewCaseDialog.value = false; // Close the add new case dialog
};

// Watch for changes in desserts
watch(desserts, () => {
  console.log('Desserts updated:', desserts.value);
});

onMounted(() => {
  setTimeout(() => {
    showTable.value = true;
  }); // Delay in milliseconds
});
</script>
