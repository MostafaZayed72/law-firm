<template>
  <div style="direction: rtl">
    <Button class="text-white" label="إضافة قضية جديدة" icon="pi pi-plus" @click="showDialog = true"  v-if="roleId == 7 || roleId == 13 || roleId == 11 || roleId == 6 || roleId == 8"/>

    <Dialog style="direction: rtl" header="إضافة قضية جديدة" v-model:visible="showDialog" :modal="true" :style="{ width: '50vw' }">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="field">
          <label for="case_title">عنوان القضية</label>
          <InputText v-model="formData.case_title" id="case_title" />
        </div>
        <div class="field">
          <label for="case_number">رقم القضية</label>
          <InputText v-model="formData.case_number" id="case_number" />
        </div>
        <div class="field">
          <label for="case_type">نوع القضية</label>
          <InputText v-model="formData.case_type" id="case_type" />
        </div>
        <div class="field">
          <label for="case_degree">درجة القضية</label>
          <InputText v-model="formData.case_degree" id="case_degree" />
        </div>
        <div class="field">
          <label for="court">{{ route.path== '/police'? 'المركز':  route.path== '/experts'? 'الخبير المختص' : 'المحكمة' }}</label>
          <InputText v-model="formData.court" id="court" />
        </div>
        <div class="field">
          <label for="is_active">حالة القضية</label>
          <Dropdown
            v-model="formData.is_active"
            :options="activeStatusOptions"
            option-label="label"
            option-value="value"
            id="is_active"
            placeholder="اختر حالة القضية"
          />
        </div>
        <div class="field">
          <label for="case_price">قيمة الدعوى</label>
          <InputNumber v-model="formData.case_price" id="case_price" />
        </div>
        <div class="field">
          <label for="claimants">{{ route.path== '/executions'? 'المنفذ': 'المدعي' }}</label>
          <div v-for="(claimant, index) in formData.claimants" :key="index" class="flex items-center space-x-2">
            <InputText v-model="claimant.name" :id="'claimant-' + index" />
            <Button icon="pi pi-times" class="p-button-danger" @click="removeClaimant(index)" />
          </div>
          <Button icon="pi pi-plus" @click="addClaimant" />
        </div>
        <div class="field">
          <label for="defendents">{{ route.path== '/executions'? 'المنفذ ضده': 'المدعي عليه' }}</label>
          <div v-for="(defendant, index) in formData.defendents" :key="index" class="flex items-center space-x-2">
            <InputText v-model="defendant.name" :id="'defendant-' + index" />
            <Button icon="pi pi-times" class="p-button-danger" @click="removeDefendant(index)" />
          </div>
          <Button icon="pi pi-plus" @click="addDefendant" />
        </div>
        <div class="field">
          <label for="client">موكلي</label>
          <InputText v-model="formData.client" id="client" />
        </div>
        <div class="field">
          <label for="advisor_name">اسم المستشار</label>
          <InputText v-model="formData.advisor_name" id="advisor_name" />
        </div>
        <div class="field">
          <label for="announcement_type">نوع الإعلان</label>
          <InputText v-model="formData.announcement_type" id="announcement_type" />
        </div>
        <div class="field">
          <label for="registration_date">{{route.path == '/appeals' ? 'تاريخ الحكم' : 'تاريخ الجلسة السابقة' }}</label>
          <InputText v-model="formData.registration_date" id="registration_date" type="date" />
        </div>
        <div class="field">
          <label for="next_court_session">{{route.path == '/appeals' ? 'آخر موعد للطعن ' : 'الجلسة القادمة' }}</label>
          <InputText v-model="formData.next_court_session" id="next_court_session" type="date" />
        </div>
        <div class="field">
          <label for="case_roll">الرول</label>
          <InputText v-model="formData.case_roll" id="case_roll" />
        </div>
        <div class="field">
          <label for="case_url">رابط الدعوة</label>
          <InputText v-model="formData.case_url" id="case_url" />
        </div>
        <div class="field">
          <label for="decision">القرار</label>
          <InputText v-model="formData.decision" id="decision" />
        </div>
        <div class="field">
          <label for="note">ملاحظات</label>
          <InputText v-model="formData.note" id="note" rows="4" />
        </div>
        <div class="field">
          <label for="is_important">أهمية القضية</label>
          <Dropdown
            v-model="formData.is_important"
            :options="importanceOptions"
            option-label="label"
            option-value="value"
            id="is_important"
            placeholder="اختر أهمية القضية"
          />
        </div>
        
        <div class="field">
          <Button label="إرسال" type="submit" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import { useRoute } from 'vue-router'; // استخدام useRoute لاستخراج المسار
import { EventBus } from '/EventBus';

const importanceOptions = [
  { label: 'هامة', value: true },
  { label: 'عادية', value: false }
];

const activeStatusOptions = [
  { label: 'نشط', value: true },
  { label: 'منتهي', value: false }
];

const caseTypeRelations = {
  '/police': 5,
  '/active-cases': 4,
  '/experts': 3,
  '/appeals': 2,
  '/executions': 1
};

const showDialog = ref(false);
const route = useRoute();

const formData = ref({
  case_number: '',
  case_title: '',
  defendents: [{ id: 0, name: '' }],
  claimants: [{ id: 0, name: '' }],
  case_degree: '',
  case_type: '',
  registration_date: '',
  next_court_session: '',
  case_price: 0,
  announcement_type: '',
  case_roll: '',
  case_url: '',
  advisor_name: '',
  court: '',
  note: '',
  decisions: [],
  case_status: '',
  client: '',
  is_active: true,
  is_important: false,
  decision: '',
  case_type_relation: caseTypeRelations[route.path] || null
});

const addClaimant = () => {
  formData.value.claimants.push({ id: formData.value.claimants.length, name: '' });
};

const removeClaimant = (index) => {
  formData.value.claimants.splice(index, 1);
};

const addDefendant = () => {
  formData.value.defendents.push({ id: formData.value.defendents.length, name: '' });
};

const removeDefendant = (index) => {
  formData.value.defendents.splice(index, 1);
};

const submitForm = async () => {
  if (!formData.value.registration_date || !formData.value.next_court_session) {
    alert('يجب إدخال تواريخ الجلسة السابقة والقادمة');
    return;
  }

  // إعداد البيانات للإرسال
  const requestData = {
    case_number: formData.value.case_number,
    case_title: formData.value.case_title,
    claimants: formData.value.claimants.map((claimant) => ({ id: claimant.id, name: claimant.name })),
    defendents: formData.value.defendents.map((defendant) => ({ id: defendant.id, name: defendant.name })),
    case_degree: formData.value.case_degree,
    case_type: formData.value.case_type,
    registration_date: formData.value.registration_date,
    next_court_session: formData.value.next_court_session,
    case_price: formData.value.case_price,
    announcement_type: formData.value.announcement_type,
    case_roll: formData.value.case_roll,
    case_url: formData.value.case_url,
    advisor_name: formData.value.advisor_name,
    court: formData.value.court,
    note: formData.value.note,
    decisions: formData.value.decisions,
    case_status: formData.value.case_status,
    client: formData.value.client,
    is_active: formData.value.is_active,
    is_important: formData.value.is_important,
    decision: formData.value.decision,
    case_type_relation: formData.value.case_type_relation
  };

  try {
    const jwt = localStorage.getItem("jwt");
    await axios.post('https://backend.eyhadvocates.com/api/cases?populate=*', {
      data: requestData
    }, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });
    showDialog.value = false;
    EventBus.value.updateCases = true;
    alert('تمت إضافة القضية بنجاح');
  } catch (error) {
    console.error('حدث خطأ:', error);
  }
};

const roleId = ref()
onMounted(() => {
  roleId.value = localStorage.getItem('roleId')
});

</script>

<style scoped>
.field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.field label {
  margin-bottom: 0.5rem;
}

.field input,
.field textarea,
.field .p-dropdown {
  width: 100%;
  box-sizing: border-box;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

</style>
