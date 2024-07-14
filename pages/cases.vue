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
    <v-btn class="mr-4 mb-4" @click="addNewCaseDialog = true" color="primary" v-if="roleId ==7 || roleId ==13 || roleId ==11 || roleId ==6 || roleId ==8"
      >إضافة قضية جديدة</v-btn
    >
    <v-btn class="mr-4 mb-4" @click="exportToExcel" color="success"
      >تصدير إلى Excel</v-btn
    >


    <!-- Filter by date button -->
    <v-btn class="mr-4 mb-4" @click="filterDialog = true" color="info"
      >فلترة حسب التاريخ</v-btn
    >

    <!-- Filter by date dialog -->
    <v-dialog v-model="filterDialog" max-width="600px" style="direction: rtl">
      <v-card>
        <v-card-title>فلترة القضايا حسب التاريخ</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" >
                <v-text-field
                  v-model="filterStartDate"
                  type="date"
                  label="من تاريخ"
                ></v-text-field>
              </v-col>
              <v-col cols="12" >
                <v-text-field
                  v-model="filterEndDate"
                  type="date"
                  label="إلى تاريخ"
                ></v-text-field>
              </v-col>
             
              <v-col cols="12" class="flex justify-center">
                <v-btn class=" mb-4" color="info" @click="fetchCases">كل القضايا بدون فلتر</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="filterDialog = false"
            >إلغاء</v-btn
          >
          <v-btn color="blue darken-1" text @click="filterCasesByDate"
            >تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Rest of the template remains unchanged -->

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
                  v-model="newCase.case_number"
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
                  v-model="newCase.case_status"
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
                  v-model="newCase['role']"
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
      <template v-slot:[`item.delete`]="{ item }" v-if="roleId==13 || roleId==7 || roleId==9 || roleId==10 || roleId==11 ">
        <v-btn small icon @click="confirmDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.edit`]="{ item }" v-if="roleId==13 || roleId==7 || roleId==6 || roleId==10 || roleId==5 ">
       
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
    <v-card-title class="text-right">تأكيد الحذف</v-card-title>
    <v-card-text class="text-right">
      <p>هل أنت متأكد من رغبتك في حذف هذه القضية؟</p>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="deleteDialog = false">
        إلغاء
      </v-btn>
      <v-btn color="blue darken-1" text @click="deleteCase">
        تأكيد
      </v-btn>
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
                  v-model="editedCase.case_number"
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
                  v-model="editedCase.case_status"
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
                  v-model="editedCase['role']"
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
import { ref, computed, onMounted } from "vue";
import jsPDF from "jspdf";
import axios from "axios";
import * as XLSX from 'xlsx';

// Ensure useColorMode is properly imported from your library or plugin
const colorMode = useColorMode(); // Uncomment this if useColorMode is properly imported

const case_number = ref("");
const search = ref("");
const showTable = ref(false);
const addNewCaseDialog = ref(false);
const deleteDialog = ref(false);
const editDialog = ref(false);
const filterDialog = ref(false);
const filterStartDate = ref("");
const filterEndDate = ref("");

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
  { key: "case_status", title: "حالة القضية" },
  { key: "6", title: "نوع الإعلان" },
  { key: "7", title: "رابط الدعوى" },
  { key: "role", title: "رول القضية" },
  { key: "court", title: "المحكمة المختصة" },
  { key: "consultant", title: "اسم المستشار" },
  { key: "notes", title: "ملاحظات" },
  { key: "delete", title: "حذف القضية" },
  // You might need to add an edit key if editCase function is defined elsewhere
  { key: "edit", title: "تعديل القضية" },
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


  // autoTable should be defined or imported properly
  // autoTable(doc, {
  //   head: [tableColumn],
  //   body: tableRows,
  // });

const confirmDelete = (item) => {
  selectedCase.value = item;
  deleteDialog.value = true;
};

const deleteCase = async () => {
  const id = selectedCase.value.id;
  const jwt = localStorage.getItem("jwt");
  // const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIwODEwOTYwLCJleHAiOjE3MjM0MDI5NjB9.QgOqOE0x-ZCcH_KKV4y-6wB1dxjIoNTehqW9BeXRG9g";

  try {
    await axios.delete(`https://backend.lawyerstor.com/api/cases/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const index = desserts.value.indexOf(selectedCase.value);
    if (index !== -1) {
      desserts.value.splice(index, 1);
    }

    deleteDialog.value = false;
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

const fetchCases = async () => {
  try {
    const jwt = localStorage.getItem("jwt");
    // const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIwODEwOTYwLCJleHAiOjE3MjM0MDI5NjB9.QgOqOE0x-ZCcH_KKV4y-6wB1dxjIoNTehqW9BeXRG9g";
    const response = await axios.get(
      "https://backend.lawyerstor.com/api/cases?populate=*",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    desserts.value = response.data.data.map((item) => {
      const decisions = item.attributes.decisions.data;
      const lastDecision = decisions[0]?.attributes.decision; // التأكد من وجود القرارات قبل الوصول للعنصر الأخير

      return {
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
        4: lastDecision, // عرض آخر قرار بدلاً من أول قرار
        case_status: item.attributes.case_status, // تأكد من اسم الخاصية
        6: item.attributes.announcement_type,
        7: item.attributes.case_url,
        role: item.attributes.case_roll,
        court: item.attributes.court,
        consultant: item.attributes.advisor_name,
        notes: item.attributes.note,
      };
    });

    showTable.value = true;
  } catch (error) {
    console.error("Error fetching cases:", error);
  }
};

onMounted(fetchCases);

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
  6: "",
  7: "",
  role: "",
  court: "",
  consultant: "",
  notes: "",
  case_status: ""
});

const addNewCase = async () => {
  const jwt = localStorage.getItem("jwt");
  // const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIwODEwOTYwLCJleHAiOjE3MjM0MDI5NjB9.QgOqOE0x-ZCcH_KKV4y-6wB1dxjIoNTehqW9BeXRG9g";

  const newCaseData = {
  data: {
    case_number: newCase.value.case_number,
    case_title: newCase.value.name,
    defendant: newCase.value.fatt,
    claimant: newCase.value.fat,
    case_degree: newCase.value.protein,
    case_type: newCase.value.carbs,
    case_price: parseFloat(newCase.value.iron) || 0,
    case_decision: newCase.value["4"],
    announcement_type: newCase.value["6"],
    case_roll: newCase.value["role"],
    case_url: newCase.value["7"],
    advisor_name: newCase.value.consultant,
    court: newCase.value.court,
    note: newCase.value.notes,
    case_status: newCase.value.case_status,
    locale: "ar",
  },
};

// إضافة حقول التاريخ إذا كانت موجودة
if (newCase.value["1"]) {
  newCaseData.data.registration_date = newCase.value["1"];
}

if (newCase.value["2"]) {
  newCaseData.data.next_court_session = newCase.value["2"];
}
  try {
    const response = await axios.post(
      "https://backend.lawyerstor.com/api/cases",
      newCaseData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (response && response.data) {
      const caseId = response.data.data.id;

      const newDecisionData = {
        data: {
          date: newCase.value["1"],
          decision: newCase.value["4"],
          status: newCase.value.case_status,
          case: caseId,
          locale: "ar",
        },
      };

      const decisionResponse = await axios.post(
        "https://backend.lawyerstor.com/api/decisions",
        newDecisionData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (decisionResponse && decisionResponse.data) {
        const decisionId = decisionResponse.data.data.id;

        desserts.value.push({
          name: newCase.value.name,
          case_number: newCase.value.case_number,
          id: caseId,
          fat: newCase.value.fat,
          fatt: newCase.value.fatt,
          carbs: newCase.value.carbs,
          protein: newCase.value.protein,
          iron: newCase.value.iron,
          1: newCase.value["1"],
          2: newCase.value["2"],
          4: newCase.value["4"],
          6: newCase.value["6"],
          7: newCase.value["7"],
          role: newCase.value.role,
          court: newCase.value.court,
          consultant: newCase.value.consultant,
          notes: newCase.value.notes,
          case_status: newCase.value.case_status,
        });

        addNewCaseDialog.value = false;
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
          6: "",
          7: "",
          role: "",
          court: "",
          consultant: "",
          notes: "",
          case_status: ""
        };
      }
    }
  } catch (error) {
    console.error("Error adding new case:", error);
  }
};

 const saveEditedCase = async () => {
  const caseId = selectedCase.value.id; // معرف القضية
  const jwt = localStorage.getItem("jwt");
  // const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIwODEwOTYwLCJleHAiOjE3MjM0MDI5NjB9.QgOqOE0x-ZCcH_KKV4y-6wB1dxjIoNTehqW9BeXRG9g";

  // Example safeguard using optional chaining
  const decisions = editedCase.value.decisions?.data; // Ensure decisions is defined and has a 'data' property

  const lastDecision = decisions?.length > 0 ? decisions[decisions.length - 1]?.attributes.decision : null;
  const decisionId = lastDecision ? lastDecision.id : null; // استخدام قيمة القرار الأخير

  const updatedCaseData = {
  data: {
    case_number: editedCase.value.case_number,
    case_title: editedCase.value.name,
    defendant: editedCase.value.fatt,
    claimant: editedCase.value.fat,
    case_degree: editedCase.value.protein,
    case_type: editedCase.value.carbs,
    case_price: parseFloat(editedCase.value.iron) || 0,
    case_decision: editedCase.value["4"],
    announcement_type: editedCase.value["6"],
    case_roll: editedCase.value["role"],
    case_url: editedCase.value["7"],
    advisor_name: editedCase.value.consultant,
    court: editedCase.value.court,
    note: editedCase.value.notes,
    case_status: editedCase.value.case_status,
    locale: "ar",
  },
};

// إضافة حقول التاريخ إذا كانت موجودة
if (editedCase.value["1"]) {
  updatedCaseData.data.registration_date = editedCase.value["1"];
}

if (editedCase.value["2"]) {
  updatedCaseData.data.next_court_session = editedCase.value["2"];
}

  const updatedDecisionData = {
    data: {
      date: new Date().toISOString(),
      decision: lastDecision ? lastDecision.decision : null,
      status: editedCase.value.case_status,
      case: caseId, // معرف القضية
      locale: "ar",
    },
  };

  try {
    // ريكويست لتحديث القضية
    await axios.put(
      `https://backend.lawyerstor.com/api/cases/${caseId}`,
      updatedCaseData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // ريكويست لتحديث القرار باستخدام decisionId إذا كان متوفرًا
    
      
    

    // تحديث القائمة المحلية للقضايا إذا كانت هناك قيمة desserts مستخدمة
    const index = desserts.value.findIndex((item) => item.id === caseId);
    if (index !== -1) {
      desserts.value.splice(index, 1, {
        name: editedCase.value.name,
        case_number: editedCase.value.case_number,
        id: caseId,
        fat: editedCase.value.fat,
        fatt: editedCase.value.fatt,
        carbs: editedCase.value.carbs,
        protein: editedCase.value.protein,
        iron: editedCase.value.iron,
        1: editedCase.value["1"],
        2: editedCase.value["2"],
        4: editedCase.value["4"],
        6: editedCase.value["6"],
        7: editedCase.value["7"],
        role: editedCase.value.role,
        court: editedCase.value.court,
        consultant: editedCase.value.consultant,
        notes: editedCase.value.notes,
        case_status: editedCase.value.case_status,
      });
    }

    // إغلاق نافذة التعديل بعد الانتهاء
    editDialog.value = false;
  } catch (error) {
    console.error("Error saving edited case:", error);
  }
};


const filterCases = async () => {
  const jwt = localStorage.getItem("jwt");
  // const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIwODEwOTYwLCJleHAiOjE3MjM0MDI5NjB9.QgOqOE0x-ZCcH_KKV4y-6wB1dxjIoNTehqW9BeXRG9g";

  const filters = {
    start_date: filterStartDate.value,
    end_date: filterEndDate.value,
  };

  try {
    const response = await axios.post(
      "https://backend.lawyerstor.com/api/cases",
      filters,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

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
      case_status: item.attributes.case_status, // Double check attribute name
      6: item.attributes.announcement_type,
      7: item.attributes.case_url,
      role: item.attributes.case_roll,
      court: item.attributes.court,
      consultant: item.attributes.advisor_name,
      notes: item.attributes.note,
    }));

    showTable.value = true;
    filterDialog.value = false;
  } catch (error) {
    console.error("Error filtering cases:", error);
  }
};

const roleId = ref()
onMounted(() => {
   roleId.value = localStorage.getItem('roleId')
  const jwt = localStorage.getItem('jwt')
  if (!jwt) {
    navigateTo('/login')
  } else {
    setTimeout(() => {
      showTable.value = true
    }) 
  }
});

</script>
