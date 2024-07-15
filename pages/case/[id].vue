<template>
  <div class="container mx-auto p-4" v-if="showTable">
    <v-card v-if="caseData" class="my-4 p-4 text-center mx-auto" :class="cardClass">
      <v-card-title>{{ caseData.attributes.case_title }}</v-card-title>
      <v-card-text>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mx-auto">
          <div>
            <p><strong>رقم القضية:</strong> {{ caseData.attributes.case_number }}</p>
            <p><strong>المُدعى عليه:</strong> {{ caseData.attributes.defendant }}</p>
            <p><strong>المدعي:</strong> {{ caseData.attributes.claimant }}</p>
            <p><strong>درجة القضية:</strong> {{ caseData.attributes.case_degree }}</p>
            <p><strong>نوع القضية:</strong> {{ caseData.attributes.case_type }}</p>
            <p><strong>تاريخ الجلسة السابقة:</strong> {{ caseData.attributes.registration_date }}</p>
            <p><strong>تاريخ الجلسة القادمة:</strong> {{ caseData.attributes.next_court_session }}</p>
            <p><strong>قيمة الدعوى:</strong> {{ caseData.attributes.case_price }}</p>
            <p><strong>القرار:</strong> {{ caseData.attributes.decisions.data[caseData.attributes.decisions.data.length - 1].attributes.decision }}</p>
          </div>
          <div>
            <p><strong>نوع الإعلان:</strong> {{ caseData.attributes.announcement_type }}</p>
            <p><strong>رول القضية:</strong> {{ caseData.attributes.case_roll }}</p>
            <p><strong>رابط الدعوى:</strong> <a :href="caseData.attributes.case_url" target="_blank">{{ caseData.attributes.case_url }}</a></p>
            <p><strong>اسم المستشار:</strong> {{ caseData.attributes.advisor_name }}</p>
            <p><strong>المحكمة:</strong> {{ caseData.attributes.court }}</p>
            <p><strong>ملاحظات:</strong> {{ caseData.attributes.note }}</p>
            <p><strong>حالة القضية:</strong> {{ caseData.attributes.case_status }}</p>
          </div>
        </div>
        <!-- زر إضافة قرار جديد -->
        <v-btn @click="showAddDialog = true" color="primary" class="mt-4">إضافة قرار جديد</v-btn>
        
        <!-- زر لعرض القرارات السابقة -->
        <v-btn @click="showDecisionsTable = true" color="primary" class="mt-4">عرض القرارات السابقة</v-btn>
      </v-card-text>
    </v-card>

    <!-- جدول القرارات السابقة -->
    <v-card v-if="showDecisionsTable" class="my-4 p-4 text-center mx-auto" :class="cardClass">
      <v-card-title>القرارات السابقة</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="decisionHeaders"
          :items="reversedDecisionsData"
          item-key="id"
          class="elevation-1"
        >
          <!-- قالب لعرض التاريخ -->
          <template v-slot:item.attributes.date="{ item }">
            {{ new Date(item.attributes.date).toLocaleString() }}
          </template>
          <!-- قالب لعرض الأزرار (تعديل القرار) -->
          <template v-slot:item.actions="{ item }">
            <v-btn @click="editDecision(item)" text small color="primary" v-if="canEdit">
              تعديل القرار
            </v-btn>
          </template>
        </v-data-table>
        <!-- زر للعودة أو إغلاق الجدول -->
        <v-btn @click="showDecisionsTable = false" class="mt-4">العودة</v-btn>
      </v-card-text>
    </v-card>

    <!-- نموذج إضافة قرار جديد -->
    <v-dialog v-model="showAddDialog" max-width="600px" :class="cardClass">
      <v-card :class="cardClass">
        <v-card-title>
          <span class="headline">إضافة قرار جديد</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newDecision.date" label="تاريخ القرار" outlined type="date"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newDecision.decision" label="نص القرار" outlined></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addNewDecision" color="primary">إضافة القرار</v-btn>
          <v-btn @click="showAddDialog = false">إلغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- نموذج تعديل القرار -->
    <v-dialog v-model="showEditDialog" max-width="600px" :class="cardClass">
      <v-card :class="cardClass">
        <v-card-title>
          <span class="headline">تعديل القرار</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editForm.date" label="تاريخ القرار" outlined type="date"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editForm.decision" label="نص القرار" outlined></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="updateDecision" color="primary">حفظ التغييرات</v-btn>
          <v-btn @click="showEditDialog = false">إلغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const caseData = ref(null);
const decisionsData = ref([]);
const showTable = ref(false);
const showDecisionsTable = ref(false);
const showAddDialog = ref(false); // تم تعريفها بشكل صحيح
const showEditDialog = ref(false); // تم تعريفها بشكل صحيح
const newDecision = ref({
  date: '',
  decision: '',
  status: '', // قد تحتاج لإضافة حالة القرار حسب المطلوب
  case: '', // تحديد القضية المرتبطة بالقرار، يمكن تعبئته لاحقاً
  locale: 'ar' // تعيين اللغة المحلية
});
const editForm = ref({
  id: null,
  date: '',
  decision: '',
  status: ''
});
const colorMode = useColorMode();
const cardClass = computed(() => (colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white'));
const decisionHeaders = [
  { text: 'القرار', align: 'start', value: 'attributes.decision' },
  { text: 'التاريخ', value: 'attributes.date' },
  { text: 'تعديل القرار', value: 'actions', sortable: false },
];
const canEdit = ref(false);

const fetchData = async () => {
  const caseId = route.params.id;
  const jwt = localStorage.getItem('jwt');

  try {
    const response = await axios.get(`https://backend.lawyerstor.com/api/cases/${caseId}?populate=*`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    caseData.value = response.data.data;
    decisionsData.value = response.data.data.attributes.decisions.data;
    showTable.value = true;

    // Set edit permissions based on role
    const roleId = localStorage.getItem('roleId');
    canEdit.value = [13, 7, 6, 10, 5].includes(parseInt(roleId));
  } catch (error) {
    console.error('Error fetching case data:', error);
  }
};

const editDecision = (decision) => {
  editForm.value.id = decision.id;
  editForm.value.date = new Date(decision.attributes.date).toISOString().substr(0, 10);
  editForm.value.decision = decision.attributes.decision;
  // Assuming status should be taken from caseData or decision
  editForm.value.status = decision.attributes.status; // Adjust as per your data structure
  showEditDialog.value = true;
};

const addNewDecision = async () => {
  const jwt = localStorage.getItem('jwt');
  const caseId = caseData.value.id;

  try {
    const response = await axios.post('https://backend.lawyerstor.com/api/decisions', {
      data: {
        date: newDecision.value.date,
        decision: newDecision.value.decision,
        status: newDecision.value.status,
        case: caseId,
        locale: newDecision.value.locale
      }
    }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    // Update local decisionsData with the new decision
    decisionsData.value.push(response.data.data);

    // Access the actual array data inside the reactive proxy
    const currentDecisions = caseData.value.attributes.decisions.data;

    // Check if currentDecisions is an array before updating
    if (Array.isArray(currentDecisions)) {
      // Update case data with new decision
      const updatedCaseData = {
        data: {
          ...caseData.value.attributes,
          decisions: [...currentDecisions, response.data.data.id]
        }
      };

      // Send PUT request to update the case with new decision
      await axios.put(`https://backend.lawyerstor.com/api/cases/${caseId}`, updatedCaseData, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
    } else {
      console.error('Decisions data in caseData is not an array:', currentDecisions);
    }

    // Close the dialog after successful addition
    showAddDialog.value = false;
  } catch (error) {
    console.error('Error adding new decision:', error);
  }
};

const updateCaseWithDecisions = async (caseId, updatedCaseData) => {
  try {
    // Prepare the data to update specific fields in the case data
    const updateData = {
      data: {
        decisions: updatedCaseData.data.decisions, // Include decisions array
      }
    };

    // Send PUT request to update case data with new decisions
    await axios.put(`https://backend.lawyerstor.com/api/cases/${caseId}`, updateData, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  } catch (error) {
    console.error('Error updating case with new decisions:', error);
  }
};

const updateDecision = async () => {
  const jwt = localStorage.getItem('jwt');
  const decisionId = editForm.value.id;

  try {
    const response = await axios.put(`https://backend.lawyerstor.com/api/decisions/${decisionId}`, {
      data: {
        date: editForm.value.date,
        decision: editForm.value.decision,
        status: editForm.value.status,
        case: caseData.value.id,
        locale: 'ar'
      }
    }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    // Update decisionsData with updated decision
    const updatedDecisionIndex = decisionsData.value.findIndex(d => d.id === decisionId);
    if (updatedDecisionIndex !== -1) {
      decisionsData.value[updatedDecisionIndex] = response.data.data;
    }

    // Update case data with updated decision
    // Check if caseData.value.attributes.decisions is an array before mapping
    if (Array.isArray(caseData.value.attributes.decisions)) {
      const updatedCaseData = {
        data: {
          ...caseData.value.attributes,
          decisions: caseData.value.attributes.decisions.map(d => d.id === decisionId ? response.data.data : d)
        }
      };

      await axios.put(`https://backend.lawyerstor.com/api/cases/${caseData.value.id}`, updatedCaseData, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
    }

    // Close the dialog after successful update
    showEditDialog.value = false;
  } catch (error) {
    console.error('Error updating decision:', error);
  }
};
fetchData();
const reversedDecisionsData = computed(() => {
  return [...decisionsData.value].reverse(); // عكس ترتيب decisionsData بناءً على الحاجة
});

</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
