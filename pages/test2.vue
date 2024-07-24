<template>
  <div class="card rtl">
    <DataTable v-model:filters="filters" :value="customers" paginator :rows="10" dataKey="id" filterDisplay="row" :loading="loading"
              :globalFilterFields="['case_title', 'claimant', 'defendant', 'case_status']">
      <template #header>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="بحث عن كلمة" />
          </IconField>
        </div>
      </template>

      <Column field="case_title" header="عنوان القضية" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.case_title }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالعنوان" />
        </template>
      </Column>
      <Column header="المدعي" filterField="claimant" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.claimant }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالمدعي" />
        </template>
      </Column>
      <Column header="المدعى عليه" filterField="defendant" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.defendant }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالمدعى عليه" />
        </template>
      </Column>
      <Column header="الحالة" filterField="case_status" style="min-width: 12rem">
        <template #body="{ data }">
          <Tag :value="data.case_status" :severity="getSeverity(data.case_status)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="اختر واحدة" style="min-width: 12rem" :showClear="true">
            <template #option="slotProps">
              <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
            </template>
          </Select>
        </template>
      </Column>
      <Column field="verified" header="تم التحقق" dataType="boolean" style="min-width: 6rem">
        <template #body="{ data }">
          <i class="pi" :class="{ 'pi-check-circle text-green-500': data.verified, 'pi-times-circle text-red-400': !data.verified }"></i>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary @change="filterCallback()" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FilterMatchMode } from '@primevue/core/api';

const customers = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  case_title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  claimant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  defendant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  case_status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const representatives = ref([
  { name: 'Amy Elsner', image: 'amyelsner.png' },
  { name: 'Anna Fali', image: 'annafali.png' },
  { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
  { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
  { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
  { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
  { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
  { name: 'Onyama Limba', image: 'onyamalimba.png' },
  { name: 'Stephen Shaw', image: 'stephenshaw.png' },
  { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);
const statuses = ref(['منتهي', 'نشط']);
const loading = ref(true);

onMounted(() => {
  fetchCases();
});

const fetchCases = async () => {
  try {
    const jwt = localStorage.getItem("jwt");
    // تفعيل الـ loading قبل الاستدعاء
    loading.value = true;

    const response = await axios.get(
      "https://backend.eyhadvocates.com/api/cases?populate=*",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    customers.value = response.data.data
      .map((item) => {
        const decisions = item.attributes.decisions.data;
        const lastDecision = decisions.slice(-1)[0]?.attributes.decision;

        return {
          case_title: item.attributes.case_title,
          case_number: item.attributes.case_number,
          id: item.id,
          claimant: item.attributes.claimant,
          defendant: item.attributes.defendant, // إصلاح اسم الخاصية
          case_type: item.attributes.case_type,
          case_degree: item.attributes.case_degree,
          case_price: item.attributes.case_price,
          previous_session: item.attributes.registration_date,
          next_session: item.attributes.next_court_session,
          decision: lastDecision,
          case_status: item.attributes.case_status,
          announcement_type: item.attributes.announcement_type, // إصلاح اسم الخاصية
          invitation_link: item.attributes.case_url,
          role: item.attributes.case_roll, // إصلاح اسم الخاصية
          court: item.attributes.court,
          consultant: item.attributes.advisor_name,
          notes: item.attributes.note,
        };
      })
      .sort((a, b) => a.id - b.id); // ترتيب العناصر تصاعدياً حسب id

    // تعطيل الـ loading بعد الاستجابة الناجحة
    loading.value = false;
  } catch (error) {
    console.error("Error fetching cases:", error);
    // تعطيل الـ loading في حالة الخطأ أيضًا
    loading.value = false;
  }
};

const getSeverity = (status) => {
  switch (status) {
    case 'منتهي':
      return 'danger';
    case 'نشط':
      return 'success';
   
  }
};
</script>

<style>
.rtl {
  direction: rtl;
  text-align: right;
}

.rtl .p-datatable .p-datatable-thead > tr > th,
.rtl .p-datatable .p-datatable-tbody > tr > td {
  text-align: right;
}
</style>
