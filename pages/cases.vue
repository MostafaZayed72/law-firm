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
    <v-btn class="mr-4 mb-4" @click="exportToExcel" color="success">تصدير إلى Excel</v-btn>

    <!-- Add new case dialog -->
    <v-dialog v-model="addNewCaseDialog" max-width="800px" style="direction: rtl;">
      <v-card>
        <v-card-title>إضافة قضية جديدة</v-card-title>
        <v-card-text>
          <v-container>
            <v-row style="direction: rtl;">
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
              <!-- New input fields -->
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
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const colorMode = useColorMode();
const search = ref('');
const showTable = ref(false);
const addNewCaseDialog = ref(false);
const deleteDialog = ref(false);
const editDialog = ref(false);

const selectedCase = ref(null);
const editedCase = ref(null);

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
  { name: 'عنوان القضية 1', id: 1, fat: 'المُدعي 1', fatt: 'المُدعي عليه 1', carbs: 'نوع القضية 1', protein: 'درجة القضية 1', iron: 'قيمة الدعوة 1', '1': '01/01/2023', '2': '01/02/2023', '4': 'القرار 1', '5': 'حالة القضية 1', '6': 'نوع الإعلان 1', '7': 'رابط الدعوة 1', '8': 'رول القضية 1', court: 'المحكمة المختصة 1', consultant: 'اسم المستشار 1', notes: 'ملاحظات 1' },
  { name: 'عنوان القضية 2', id: 2, fat: 'المُدعي 2', fatt: 'المُدعي عليه 2', carbs: 'نوع القضية 2', protein: 'درجة القضية 2', iron: 'قيمة الدعوة 2', '1': '02/01/2023', '2': '02/02/2023', '4': 'القرار 2', '5': 'حالة القضية 2', '6': 'نوع الإعلان 2', '7': 'رابط الدعوة 2', '8': 'رول القضية 2', court: 'المحكمة المختصة 2', consultant: 'اسم المستشار 2', notes: 'ملاحظات 2' },
  // Add more cases as needed
]);

const cardClass = computed(() => {
  return colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white';
});

// Export data to Excel
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(desserts.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cases');
  XLSX.writeFile(workbook, 'cases.xlsx');
};

// Export data to PDF
const exportToPDF = () => {
  const doc = new jsPDF();
  const tableColumn = headers.map(header => header.title);
  const tableRows = desserts.value.map(dessert => headers.map(header => dessert[header.key]));

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
  });

  doc.save('cases.pdf');
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
  deleteDialog.value = false;
};

const editCase = (item) => {
  selectedCase.value = item;
  editedCase.value = { ...item };
  editDialog.value = true;
};

const saveEditedCase = () => {
  const index = desserts.value.findIndex(item => item === selectedCase.value);
  if (index !== -1) {
    desserts.value[index] = { ...editedCase.value };
  }
  editDialog.value = false;
};

const newCase = ref({
  name: '',
  id: '',
  fat: '',
  fatt: '',
  carbs: '',
  protein: '',
  iron: '',
  '1': '',
  '2': '',
  '4': '',
  '5': '',
  '6': '',
  '7': '',
  '8': '',
  court: '',
  consultant: '',
  notes: '',
});

const addNewCase = () => {
  const caseToAdd = { ...newCase.value };
  desserts.value.push(caseToAdd);

  newCase.value = {
    name: '',
    id: '',
    fat: '',
    fatt: '',
    carbs: '',
    protein: '',
    iron: '',
    '1': '',
    '2': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    court: '',
    consultant: '',
    notes: '',
  };

  addNewCaseDialog.value = false;
};

watch(desserts, () => {
  console.log('Desserts updated:', desserts.value);
});

onMounted(() => {
  setTimeout(() => {
    showTable.value = true;
  });
});

definePageMeta({
  middleware: 'auth'
});
</script>
