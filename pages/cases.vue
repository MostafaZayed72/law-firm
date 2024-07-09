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
    <v-btn class="mr-4 mb-4" @click="addNewCaseDialog = true" color="primary"
      >إضافة قضية جديدة</v-btn
    >
    <v-btn class="mr-4 mb-4" @click="exportToExcel" color="success"
      >تصدير إلى Excel</v-btn
    >

    <!-- Add new case dialog -->
    <v-dialog
      v-model="addNewCaseDialog"
      max-width="800px"
      style="direction: rtl"
    >
      <v-card>
        <v-card-title>إضافة قضية جديدة</v-card-title>
        <v-card-text>
          <v-container>
            <v-row style="direction: rtl">
              <v-col cols="12" md="6" style="direction: rtl">
                <v-text-field
                  style="direction: rtl"
                  v-model="newCase.name"
                  label="عنوان القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.id"
                  label="رقم القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.fat"
                  label="المُدعي"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.fatt"
                  label="المُدعي عليه"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.carbs"
                  label="نوع القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.protein"
                  label="درجة القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.iron"
                  label="قيمة الدعوى"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  type="date"
                  v-model="newCase['1']"
                  label="تاريخ الجلسة السابقة"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  type="date"
                  v-model="newCase['2']"
                  label="تاريخ الجلسة القادمة"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase['4']"
                  label="القرار"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase['5']"
                  label="حالة القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase['6']"
                  label="نوع الإعلان"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase['7']"
                  label="رابط الدعوى"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase['8']"
                  label="رول القضية"
                ></v-text-field>
              </v-col>
              <!-- New input fields -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.court"
                  label="المحكمة المختصة"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.consultant"
                  label="اسم المستشار"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newCase.notes"
                  label="ملاحظات"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addNewCaseDialog = false"
            >إلغاء</v-btn
          >
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
        <div style="white-space: nowrap">{{ item["1"] }}</div>
      </template>
      <template v-slot:item.2="{ item }">
        <div style="white-space: nowrap">{{ item["2"] }}</div>
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
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >إلغاء</v-btn
          >
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
            <v-row style="direction: rtl">
              <!-- Existing input fields -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.name"
                  label="عنوان القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="case_number"
                  label="رقم القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.fat"
                  label="المُدعي"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.fatt"
                  label="المُدعي عليه"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.carbs"
                  label="نوع القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.protein"
                  label="درجة القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.iron"
                  label="قيمة الدعوى"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  type="date"
                  v-model="editedCase['1']"
                  label="تاريخ الجلسة السابقة"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  type="date"
                  v-model="editedCase['2']"
                  label="تاريخ الجلسة القادمة"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase['4']"
                  label="القرار"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase['5']"
                  label="حالة القضية"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase['6']"
                  label="نوع الإعلان"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase['7']"
                  label="رابط الدعوى"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase['8']"
                  label="رول القضية"
                ></v-text-field>
              </v-col>
              <!-- New input fields -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.court"
                  label="المحكمة المختصة"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.consultant"
                  label="اسم المستشار"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCase.notes"
                  label="ملاحظات"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false"
            >إلغاء</v-btn
          >
          <v-btn color="blue darken-1" text @click="saveEditedCase">حفظ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import jsPDF from "jspdf";
import axios from "axios";

const case_number = ref();
const colorMode = useColorMode();
const search = ref("");
const showTable = ref(false);
const addNewCaseDialog = ref(false);
const deleteDialog = ref(false);
const editDialog = ref(false);

const selectedCase = ref(null);
const editedCase = ref(null);

const headers = [
{ key: "id", title: "id" },
  { align: "start", key: "name", sortable: false, title: "عنوان القضية" },
  { key: "case_number", title: "رقم القضية" },
  { key: "fat", title: "المُدعي" },
  { key: "fatt", title: "المُدعي عليه" },
  { key: "carbs", title: "نوع القضية" },
  { key: "protein", title: "درجة القضية" },
  { key: "iron", title: "قيمة الدعوى" },
  { key: "1", title: "تاريخ الجلسة السابقة" },
  { key: "2", title: "تاريخ الجلسة القادمة" },
  { key: "4", title: "القرار" },
  { key: "5", title: "حالة القضية" },
  { key: "6", title: "نوع الإعلان" },
  { key: "7", title: "رابط الدعوى" },
  { key: "8", title: "رول القضية" },
  { key: "court", title: "المحكمة المختصة" },
  { key: "consultant", title: "اسم المستشار" },
  { key: "notes", title: "ملاحظات" },
  { key: "9", title: "حذف القضية" },
  { key: "10", title: "تعديل القضية" },
];

const desserts = ref([]);

const cardClass = computed(() => {
  return colorMode.preference === "dark" ? "bg-grey-darken-3" : "bg-white";
});

// Export data to Excel
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(desserts.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");
  XLSX.writeFile(workbook, "cases.xlsx");
};

// Export data to PDF
const exportToPDF = () => {
  const doc = new jsPDF();
  const tableColumn = headers.map((header) => header.title);
  const tableRows = desserts.value.map((dessert) =>
    headers.map((header) => dessert[header.key])
  );

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
  });

  doc.save("cases.pdf");
};

const confirmDelete = (item) => {
  selectedCase.value = item;
  deleteDialog.value = true;
};

const deleteCase = async () => {
  const id = selectedCase.value.id; // استخراج الـ ID من selectedCase
  const jwt = localStorage.getItem("jwt"); // الحصول على الـ JWT من localStorage

  try {
    await axios.delete(`https://backend.lawyerstor.com/api/cases/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    // بعد حذف ناجح، قم بإزالة القضية من قائمة desserts
    const index = desserts.value.indexOf(selectedCase.value);
    if (index !== -1) {
      desserts.value.splice(index, 1);
    }

    deleteDialog.value = false; // إغلاق حوار التأكيد على الحذف
  } catch (error) {
    console.error("خطأ في حذف القضية:", error.response.data);
  }
};

const editCase = (item) => {
  selectedCase.value = item;
  editedCase.value = { ...item };
  editDialog.value = true;
  case_number.value = item.case_number;
};

const newCase = ref({
  name: "",
  id: "",
  fat: "",
  fatt: "",
  carbs: "",
  protein: "",
  iron: "",
  1: "",
  2: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
  court: "",
  consultant: "",
  notes: "",
});

const addNewCase = async () => {
  const jwt = localStorage.getItem("jwt"); // الحصول على الـ JWT من localStorage

  const caseToAdd = {
    data: {
      case_number: newCase.value.id,
      case_title: newCase.value.name,
      defendant: newCase.value.fatt,
      claimant: newCase.value.fat,
      case_degree: newCase.value.protein,
      case_type: newCase.value.carbs,
      registration_date: newCase.value["1"],
      next_court_session: newCase.value["2"],
      case_price: parseFloat(newCase.value.iron) || 0, // تحويل قيمة الدعوى إلى عدد
      case_decision: newCase.value["4"],
      announcement_type: newCase.value["6"],
      case_roll: newCase.value["8"],
      case_url: newCase.value["7"],
      advisor_name: newCase.value.consultant,
      court: newCase.value.court,
      note: newCase.value.notes,
      case_status: "opened",
      locale: "ar", //
    },
  };

  try {
    const response = await axios.post(
      "https://backend.lawyerstor.com/api/cases",
      caseToAdd,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // في حالة النجاح، أضف القضية إلى قائمة القضايا
    desserts.value.push({ ...newCase.value });

    // إعادة تعيين الحقول
    newCase.value = {
      name: "",
      id: "",
      fat: "",
      fatt: "",
      carbs: "",
      protein: "",
      iron: "",
      1: "",
      2: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      court: "",
      consultant: "",
      notes: "",
    };

    addNewCaseDialog.value = false;
    fetchCases();
  } catch (error) {
    console.error("خطأ في إضافة القضية:", error.response.data);
  }
};

const saveEditedCase = async () => {
  const id = editedCase.value.id; // استخراج الـ ID من الحالة المعدلة
  const jwt = localStorage.getItem("jwt"); // الحصول على الـ JWT من localStorage

  const caseToUpdate = {
    data: {
      case_number: case_number.value,
      case_title: editedCase.value.name,
      defendant: editedCase.value.fatt,
      claimant: editedCase.value.fat,
      case_degree: editedCase.value.protein,
      case_type: editedCase.value.carbs,
      registration_date: editedCase.value["1"],
      next_court_session: editedCase.value["2"],
      case_price: parseFloat(editedCase.value.iron) || 0,
      case_decision: editedCase.value["4"],
      announcement_type: editedCase.value["6"],
      case_roll: editedCase.value["8"],
      case_url: editedCase.value["7"],
      advisor_name: editedCase.value.consultant,
      court: editedCase.value.court,
      note: editedCase.value.notes,
      case_status: "opened",
      locale: "ar",
    },
  };

  try {
    const response = await axios.put(
      `https://backend.lawyerstor.com/api/cases/${id}`,
      caseToUpdate,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    fetchCases();
    // case_number.value=  response.data.data.attributes.case_number
    // بعد نجاح التعديل، قم بتحديث بيانات الحالة في الجدول المحلي
    const index = desserts.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      desserts.value[index] = { ...editedCase.value };
    }

    editDialog.value = false; // إغلاق حوار تعديل الحالة
  } catch (error) {
    console.error("خطأ في تعديل القضية:", error.response.data);
  }
};

const fetchCases = async () => {
  try {
    const jwt = localStorage.getItem("jwt"); // Get JWT from localStorage
    const response = await axios.get(
      "https://backend.lawyerstor.com/api/cases",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // Assuming response.data.data contains an array of cases
    desserts.value = response.data.data.map((item) => ({
      name: item.attributes.case_title,
      case_number: item.attributes.case_number,
      id: item.id,
      fat: item.attributes.claimant,
      fatt: item.attributes.defendant,
      carbs: item.attributes.case_type,
      protein: item.attributes.case_degree,
      iron: item.attributes.case_price,
      1: item.attributes.registration_date,
      2: item.attributes.next_court_session,
      4: item.attributes.case_decision,
      5: item.attributes.case_status,
      6: item.attributes.announcement_type,
      7: item.attributes.case_url,
      8: item.attributes.case_roll,
      court: item.attributes.court,
      consultant: item.attributes.advisor_name,
      notes: item.attributes.note,
    }));

    showTable.value = true; // Show the table once data is fetched
  } catch (error) {
    console.error("Error fetching cases:", error);
  }
};

onMounted(fetchCases);

watch(desserts, () => {
  console.log("Desserts updated:", desserts.value);
});


onMounted(() => {
  setTimeout(() => {
    showTable.value = true;
  });
});

definePageMeta({
  middleware: "auth",
});
</script>
