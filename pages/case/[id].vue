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
            <p><strong>القرار:</strong> {{ caseData.attributes.decisions.data[0].attributes.decision }}</p>
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
        <v-btn @click="showDecisionsDialog = true" color="primary" class="mt-4">عرض القرارات السابقة</v-btn>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showDecisionsDialog" max-width="600px">
  <v-card :class="cardClass">
    <v-card-title>
      <span class="headline">القرارات السابقة</span>
    </v-card-title>
    <v-card-text :class="cardClass">
      <v-list :class="cardClass">
        <v-list-item-group :class="cardClass">
          <v-list-item v-for="decision in decisionsData" :key="decision.id">
            <v-list-item-content>
              <v-list-item-title class="text-right">{{ decision.attributes.decision }}</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{ new Date(decision.attributes.date).toLocaleString() }}</v-list-item-subtitle>
              <v-btn @click="editDecision(decision)" text small color="primary" v-if="roleId==13 || roleId==7 || roleId==6 || roleId==10 || roleId==5 ">تعديل القرار</v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="showDecisionsDialog = false">إغلاق</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

    <!-- نموذج التعديل -->
    <v-dialog v-model="showEditDialog" max-width="600px" :class="cardClass">
      <v-card :class="cardClass">
        <v-card-title :class="cardClass">
          <span class="headline">تعديل القرار</span>
        </v-card-title>
        <v-card-text>
          <v-container :class="cardClass">
            <v-row :class="cardClass">
              <v-col cols="12" :class="cardClass">
                <v-text-field :class="cardClass" v-model="editForm.date" label="تاريخ القرار" outlined type="date"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editForm.decision" label="نص القرار" outlined></v-text-field>
              </v-col>
              <!-- <v-col cols="12">
                <v-text-field v-model="editForm.status" label="حالة القضية" outlined></v-text-field>
              </v-col> -->
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="updateDecision" color="primary">تحديث القرار</v-btn>
          <v-btn @click="showEditDialog = false">إلغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const caseData = ref(null);
const decisionsData = ref([]);
const showTable = ref(false);
const showDecisionsDialog = ref(false);
const showEditDialog = ref(false);
const editForm = ref({
  id: null,
  date: '',
  decision: '',
  status: ''
});
const colorMode = useColorMode();
const cardClass = computed(() => (colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white'));

onMounted(async () => {
  const caseId = route.params.id;
  // const jwt = localStorage.getItem('jwt');
  const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIwODEwOTYwLCJleHAiOjE3MjM0MDI5NjB9.QgOqOE0x-ZCcH_KKV4y-6wB1dxjIoNTehqW9BeXRG9g";

  try {
    const response = await axios.get(`https://backend.lawyerstor.com/api/cases/${caseId}?populate=*`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    caseData.value = response.data.data;
    decisionsData.value = response.data.data.attributes.decisions.data;
    showTable.value = true;
  } catch (error) {
    console.error('Error fetching case data:', error);
  }
});

function editDecision(decision) {
  editForm.id = decision.id; // Set the id of the decision being edited
  editForm.date = new Date(decision.attributes.date).toISOString().substr(0, 10); // Format date as YYYY-MM-DD
  editForm.decision = decision.attributes.decision;
  editForm.status = caseData.value.attributes.case_status;
  showEditDialog.value = true;
}

async function updateDecision() {
  // const jwt = localStorage.getItem('jwt');
  const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIwODEwOTYwLCJleHAiOjE3MjM0MDI5NjB9.QgOqOE0x-ZCcH_KKV4y-6wB1dxjIoNTehqW9BeXRG9g";

  const decisionId = editForm.id; // Use the ID from editForm

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

    console.log('Decision updated:', response.data);
    
    // Update the local decisionsData with the updated decision
    const updatedDecisionIndex = decisionsData.value.findIndex(dec => dec.id === decisionId);
    if (updatedDecisionIndex !== -1) {
      decisionsData.value[updatedDecisionIndex].attributes.date = response.data.data.attributes.date;
      decisionsData.value[updatedDecisionIndex].attributes.decision = response.data.data.attributes.decision;
      // Update other attributes if needed
    }

    showEditDialog.value = false; // Close the edit dialog after successful update
  } catch (error) {
    console.error('Error updating decision:', error);
  }
}
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

<style scoped>
.container {
  max-width: 800px;
}
</style>
