<template>
  <div class="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg" style="direction: rtl;">
    <h1 class="text-3xl font-bold mb-6 text-start">تفاصيل القضية</h1>
    <div v-if="caseData">
      <div class="border p-6 rounded-lg">
        <div class="space-y-6">
          <!-- معلومات أساسية -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>رقم القضية:</strong> {{ caseData.case_number || 'غير متوفر' }}</p>
              <p><strong>عنوان القضية:</strong> {{ caseData.case_title || 'غير متوفر' }}</p>
              <p><strong>درجة القضية:</strong> {{ caseData.case_degree || 'غير متوفر' }}</p>
              <p><strong>نوع القضية:</strong> {{ caseData.case_type || 'غير متوفر' }}</p>
              <p><strong>تاريخ التسجيل:</strong> {{ new Date(caseData.registration_date).toLocaleDateString() || 'غير متوفر' }}</p>
              <p><strong>تاريخ الجلسة القادمة:</strong> {{ new Date(caseData.next_court_session).toLocaleDateString() || 'غير متوفر' }}</p>
              <p><strong>قيمة الدعوى:</strong> {{ caseData.case_price || 'غير متوفر' }}</p>
              <p><strong>حالة القضية:</strong> {{ caseData.case_status || 'غير متوفر' }}</p>
              <p><strong>رول القضية:</strong> {{ caseData.case_roll || 'غير متوفر' }}</p>
              <p><strong>رابط القضية:</strong> <a :href="caseData.case_url" target="_blank">{{ caseData.case_url || 'غير متوفر' }}</a></p>
              <p><strong>مستشار:</strong> {{ caseData.advisor_name || 'غير متوفر' }}</p>
              <p><strong>المحكمة:</strong> {{ caseData.court || 'غير متوفر' }}</p>
              <p><strong>موكلي:</strong> {{ caseData.client || 'غير متوفر' }}</p>
            </div>
            <div>
              <!-- المدعى عليهم -->
              <div>
                <h3 class="text-lg font-semibold mb-2">المدعى عليهم</h3>
                <ul class="list-disc pl-5">
                  <li v-if="caseData.defendents.length === 0">لا يوجد مدعى عليهم</li>
                  <li v-for="defendant in caseData.defendents" :key="defendant.id">
                    {{ defendant.name || 'غير متوفر' }}
                  </li>
                </ul>
              </div>

              <!-- المدعين -->
              <div>
                <h3 class="text-lg font-semibold mb-2">المدعين</h3>
                <ul class="list-disc pl-5">
                  <li v-if="caseData.claimants.length === 0">لا يوجد مدعين</li>
                  <li v-for="claimant in caseData.claimants" :key="claimant.id">
                    {{ claimant.name || 'غير متوفر' }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- أحدث قرار -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-2">أحدث قرار</h3>
            <div v-if="latestDecision">
              <p><strong>تاريخ القرار:</strong> {{ new Date(latestDecision.date).toLocaleDateString() || 'غير متوفر' }}</p>
              <p><strong>تفاصيل القرار:</strong> {{ latestDecision.decision || 'غير متوفر' }}</p>
            </div>
            <div v-else>
              <p>لا يوجد قرارات</p>
            </div>
          </div>

          <!-- ملاحظات -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-2">ملاحظات</h3>
            <p>{{ caseData.note || 'غير متوفر' }}</p>
          </div>
        </div>

        <!-- الأزرار -->
        <div class="mt-6 flex gap-4 justify-end">
          <Button :loading="loading"  label="إضافة قرار جديد" icon="pi pi-plus" @click="showDialog = true" class="p-button-primary" v-if="roleId == 7 || roleId == 13 || roleId == 11 || roleId == 6 || roleId == 8"/>
          <Button :loading="loading" label="عرض القرارات السابقة" icon="pi pi-list" @click="viewPreviousDecisions" class="p-button-secondary"/>
          <Button :loading="loading" label="تعديل المدعي والمدعى عليه" icon="pi pi-pencil" @click="showEditDialog = true" class="p-button-info" v-if="roleId == 13 || roleId == 7 || roleId == 6 || roleId == 10 || roleId == 5"/>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="text-center">تحميل البيانات...</p>
    </div>

    <!-- Dialog for adding new decision -->
    <Dialog v-model:visible="showDialog" header="إضافة قرار جديد" modal style="direction: rtl;" class="w-[500px]">
      <div class="p-4">
        <form @submit.prevent="submitNewDecision">
          <div class="mb-4">
            <label for="decisionDate" class="block text-sm font-medium text-gray-700">تاريخ القرار</label>
            <input id="decisionDate" v-model="newDecision.date" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div class="mb-4">
            <label for="decisionDetails" class="block text-sm font-medium text-gray-700">تفاصيل القرار</label>
            <textarea id="decisionDetails" v-model="newDecision.decision" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          
          <div class="flex gap-4">
            <Button label="حفظ" icon="pi pi-check" type="submit" class="p-button-primary"/>
            <Button label="إلغاء" icon="pi pi-times" @click="showDialog = false" class="p-button-secondary"/>
          </div>
        </form>
      </div>
    </Dialog>

    <!-- Dialog for displaying previous decisions -->
    <Dialog v-model:visible="showDecisionsDialog" header="القرارات السابقة" modal style="direction: rtl;" class="w-[800px]">
      <div class="p-4">
        <table class="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th class="border border-gray-300 p-2">تاريخ القرار</th>
              <th class="border border-gray-300 p-2">تفاصيل القرار</th>
              <th class="border border-gray-300 p-2">حالة القرار</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="decision in decisions" :key="decision.id">
              <td class="border border-gray-300 p-2 text-center">{{ new Date(decision.attributes.date).toLocaleDateString() }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ decision.attributes.decision }}</td>
              <td class="border border-gray-300 p-2 text-center">
                <select class="w-100 rounded-lg py-1 text-center cursor-pointer" 
        :class="decision.attributes.status === 'منجز' ? 'bg-green-400' : 'bg-red-400'"
        style="border: 1px solid;"
        v-model="decision.attributes.status"
        @change="updateDecisionStatus(decision.id, decision.attributes.status)">
  <option v-if="roleId == 13 || roleId == 7 || roleId == 6 || roleId == 10 || roleId == 5"   value="منجز">منجز</option>
  <option  v-if="roleId == 13 || roleId == 7 || roleId == 6 || roleId == 10 || roleId == 5"  value="غير منجز">غير منجز</option>
</select>

              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4">
          <Button label="إغلاق" icon="pi pi-times" @click="showDecisionsDialog = false" class="p-button-secondary"/>
        </div>
      </div>
    </Dialog>

    <!-- Dialog for editing claimants and defendants -->
    <Dialog v-model:visible="showEditDialog" header="تعديل المدعي والمدعى عليه" modal style="direction: rtl;" class="w-[600px]">
      <div class="p-4">
        <table class="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th class="border border-gray-300 p-2">المدعين</th>
              <th class="border border-gray-300 p-2">المدعى عليهم</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 p-2">
                <ul>
                  <li v-for="(claimant, index) in caseData.claimants" :key="claimant.id" class="flex justify-between items-center">
                    <input v-model="caseData.claimants[index].name" class="w-full border border-gray-300 rounded-md p-1 mr-2" />
                    <div>
                      <Button icon="pi pi-trash" class="p-button-sm p-button-text p-button-danger" @click="deleteClaimant(index)" v-if="roleId == 13 || roleId == 7 || roleId == 9 || roleId == 10 || roleId == 11"/>
                    </div>
                  </li>
                </ul>
              </td>
              <td class="border border-gray-300 p-2">
                <ul>
                  <li v-for="(defendant, index) in caseData.defendents" :key="defendant.id" class="flex justify-between items-center">
                    <input v-model="caseData.defendents[index].name" class="w-full border border-gray-300 rounded-md p-1 mr-2" />
                    <div>
                      <Button icon="pi pi-trash" class="p-button-sm p-button-text p-button-danger" @click="deleteDefendant(index)"/>
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4 flex justify-end">
          <Button label="حفظ التعديلات" icon="pi pi-check" @click="submitEdits" class="p-button-primary" v-if="roleId == 13 || roleId == 7 || roleId == 6 || roleId == 10 || roleId == 5"/>
          <Button label="إغلاق" icon="pi pi-times" @click="showEditDialog = false" class="p-button-secondary"/>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const route = useRoute();
const caseData = ref(null);
const showDialog = ref(false);
const showDecisionsDialog = ref(false); // Control showing the decisions table
const showEditDialog = ref(false); // Control showing the edit dialog for claimants and defendants
const newDecision = ref({
  date: '',
  decision: '',
  caseId: route.params.id,
  status: '',
  locale: 'ar'
});
const decisions = ref([]); // Store previous decisions

// للحصول على أحدث قرار
const latestDecision = computed(() => {
  if (caseData.value && caseData.value.decisions.data.length > 0) {
    const decisionsArray = caseData.value.decisions.data.map(decision => ({
      ...decision.attributes,
      date: new Date(decision.attributes.date)
    }));
    return decisionsArray[decisionsArray.length - 1]; // الوصول إلى العنصر الأخير في المصفوفة
  }
  return null;
});

// دالة لجلب بيانات القضية
const fetchCaseData = async () => {
  try {
    
    const response = await axios.get(`https://backend.eyhadvocates.com/api/cases/${route.params.id}?populate=*`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    caseData.value = response.data.data.attributes;
  } catch (error) {
    console.error('Error fetching case data:', error);
  }
};

onMounted(fetchCaseData);

const fetchPreviousDecisions = async () => {
  try {
    loading.value = true

    const response = await axios.get(`https://backend.eyhadvocates.com/api/cases/${route.params.id}?populate=*`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    decisions.value = response.data.data.attributes.decisions.data.map(decision => ({
      ...decision,
      attributes: {
        ...decision.attributes,
        status: decision.attributes.status || 'غير منجز', // تعيين القيمة الافتراضية هنا
      }
    }));
    showDecisionsDialog.value = true; // Show the decisions table
  } catch (error) {
    console.error('Error fetching previous decisions:', error);
  }
  finally {
    loading.value = false
  }
};

const submitNewDecision = async () => {
  try {
    await axios.post(`https://backend.eyhadvocates.com/api/decisions`, {
      data: {
        date: newDecision.value.date,
        decision: newDecision.value.decision,
        status: newDecision.value.status,
        case: newDecision.value.caseId,
        locale: newDecision.value.locale
      }
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    });

    showDialog.value = false;
    newDecision.value = { date: '', decision: '', caseId: route.params.id, status: '', locale: 'ar' }; // Reset form data

    // Fetch new data
    fetchCaseData();
    alert('تمت إضافة القرار بنجاح');
  } catch (error) {
    console.error('Error adding new decision:', error);
    alert('حدث خطأ أثناء إضافة القرار');
  }
};

const updateDecisionStatus = async (decisionId, status) => {
  try {
    loading.value = true

    await axios.put(`https://backend.eyhadvocates.com/api/decisions/${decisionId}`, {
      data: {
        status: status,
        case: route.params.id,
        locale: 'ar'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    });

    alert('تم تحديث حالة القرار بنجاح');
  } catch (error) {
    console.error('Error updating decision status:', error);
    alert('حدث خطأ أثناء تحديث حالة القرار');
  }
  finally{
    loading.value = false

  }
};
const loading = ref(false);
const viewPreviousDecisions = () => {
  fetchPreviousDecisions();

};

const submitEdits = async () => {
  try {
    await axios.put(`https://backend.eyhadvocates.com/api/cases/${route.params.id}?populate=*`, {
      data: {
        claimants: caseData.value.claimants,
        defendents: caseData.value.defendents,
      }
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    });

    showEditDialog.value = false;
    alert('تم حفظ التعديلات بنجاح');
    fetchCaseData();
  } catch (error) {
    console.error('Error updating case:', error);
    alert('حدث خطأ أثناء تحديث القضية');
  }
};

const deleteClaimant = async (index) => {
  caseData.value.claimants.splice(index, 1);
  try {
    await axios.put(`https://backend.eyhadvocates.com/api/cases/${route.params.id}?populate=*`, {
      data: {
        claimants: caseData.value.claimants,
        defendents: caseData.value.defendents,
      }
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    });
    fetchCaseData();
    alert('تم حذف المدعي بنجاح');
  } catch (error) {
    console.error('Error deleting claimant:', error);
    alert('حدث خطأ أثناء حذف المدعي');
  }
};

const deleteDefendant = async (index) => {
  caseData.value.defendents.splice(index, 1);
  try {
    await axios.put(`https://backend.eyhadvocates.com/api/cases/${route.params.id}?populate=*`, {
      data: {
        claimants: caseData.value.claimants,
        defendents: caseData.value.defendents,
      }
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    });
    fetchCaseData();
    alert('تم حذف المدعى عليه بنجاح');
  } catch (error) {
    console.error('Error deleting defendant:', error);
    alert('حدث خطأ أثناء حذف المدعى عليه');
  }
};

const jwt = ref('');
  const roleId = ref('');


onMounted(() => {
  roleId.value= localStorage.getItem('roleId')
  jwt.value = localStorage.getItem('jwt')
  if (!jwt) {
    navigateTo('/')
  } 
});

</script>

<style scoped>
/* أضف هنا أي تنسيقات مخصصة إذا لزم الأمر */
</style>
