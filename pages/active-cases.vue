<template>
    <div class="card rtl">
      
      <DataTable
        v-model:filters="filters"
        :value="customers"
        paginator
        :rows="10"
        dataKey="id"
        filterDisplay="row"
        :loading="loading"
        :globalFilterFields="['case_title', 'claimant', 'defendant', 'case_status', 'case_type', 'case_degree', 'case_price', 'previous_session', 'next_session', 'decision', 'announcement_type', 'invitation_link', 'role', 'court', 'consultant', 'notes']"
        id="cases-table"
      >
      
        <template #header>
          <div class="flex justify-start">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="بحث عن كلمة" />
            </IconField>
          </div>
         
        </template>
        <Button label="طباعة" icon="pi pi-print" @click="printTable" class="mr-4 bg-yellow-300 " />
      <Button label="تحميل كملف DOC" icon="pi pi-print" @click="exportToDoc" class="mr-4 bg-blue-500 text-white" />
      <Column field="case_title" header="عنوان القضية" :filter="true" :filterPlaceholder="'ابحث بالعنوان'" style="width: fit-content; max-width: 12rem">
  <template #body="{ data }">
    <!-- استخدم <router-link> إذا كنت تستخدم Vue Router -->
    <router-link :to="`/case/${data.id}`">{{ data.case_title }}</router-link>
    
    <!-- استخدم <a> إذا كنت تستخدم روابط HTML عادية -->
    <!--
    <a :href="`/case/${data.id}`">{{ data.case_title }}</a>
    -->
  </template>
  <template #filter="{ filterModel, filterCallback }">
    <InputText
      v-model="filterModel.value"
      type="text"
      @input="filterCallback()"
      placeholder="ابحث بالعنوان"
    />
  </template>
</Column>

  
        <Column field="claimant" header="المدعي" :filter="true" :filterPlaceholder="'ابحث بالمدعي'" style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.claimant }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالمدعي"
            />
          </template>
        </Column>
  
        <Column field="defendant" header="المدعى عليه" :filter="true" :filterPlaceholder="'ابحث بالمدعى عليه'" style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.defendant }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالمدعى عليه"
            />
          </template>
        </Column>
  
        <Column field="case_status" header="الحالة" :filter="true" :filterPlaceholder="'اختر الحالة'" style="max-width: 12rem">
          <template #body="{ data }">
            <Tag :value="data.case_status" :severity="getSeverity(data.case_status)" />
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="statuses"
              placeholder="اختر الحالة"
              style="min-width: 8rem"
              :showClear="true"
            >
              <template #option="slotProps">
                <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
              </template>
            </Select>
          </template>
        </Column>
  
        <Column field="case_type" header="نوع القضية" :filter="true" :filterPlaceholder="'ابحث بنوع القضية'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.case_type }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بنوع القضية"
            />
          </template>
        </Column>
  
        <Column field="case_degree" header="درجة القضية" :filter="true" :filterPlaceholder="'ابحث بدرجة القضية'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.case_degree }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بدرجة القضية"
            />
          </template>
        </Column>
  
        <Column field="case_price" header="سعر القضية" :filter="true" :filterPlaceholder="'ابحث بسعر القضية'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.case_price }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بسعر القضية"
            />
          </template>
        </Column>
  
        <Column field="previous_session" header="الجلسة السابقة" :filter="true" :filterPlaceholder="'ابحث بالجسة السابقة'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.previous_session }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالجسة السابقة"
            />
          </template>
        </Column>
  
        <Column field="next_session" header="الجلسة القادمة" :filter="true" :filterPlaceholder="'ابحث بالجسة القادمة'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.next_session }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالجسة القادمة"
            />
          </template>
        </Column>
  
        <Column field="decision" header="قرار" :filter="true" :filterPlaceholder="'ابحث بالقرار'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.decision }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالقرار"
            />
          </template>
        </Column>
  
        <Column field="announcement_type" header="نوع الإعلان" :filter="true" :filterPlaceholder="'ابحث بنوع الإعلان'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.announcement_type }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بنوع الإعلان"
            />
          </template>
        </Column>
  
        <Column field="invitation_link" header="رابط الدعوة" :filter="true" :filterPlaceholder="'ابحث برابط الدعوة'" style="min-width: 7rem">
          <template #body="{ data }">
            <a :href="data.invitation_link" target="_blank">{{ data.invitation_link }}</a>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث برابط الدعوة"
            />
          </template>
        </Column>
  
        <Column field="role" header="الدور" :filter="true" :filterPlaceholder="'ابحث بالدور'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.role }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالدور"
            />
          </template>
        </Column>
  
        <Column field="court" header="المحكمة" :filter="true" :filterPlaceholder="'ابحث بالمحكمة'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.court }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالمحكمة"
            />
          </template>
        </Column>
  
        <Column field="consultant" header="الاستشاري" :filter="true" :filterPlaceholder="'ابحث بالاستشاري'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.consultant }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالاستشاري"
            />
          </template>
        </Column>
  
        <Column field="notes" header="ملاحظات" :filter="true" :filterPlaceholder="'ابحث بالملاحظات'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.notes }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="ابحث بالملاحظات"
            />
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
    case_type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    case_degree: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    case_price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    previous_session: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    next_session: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    decision: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    announcement_type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    invitation_link: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    role: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    court: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    consultant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    notes: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const statuses = ref(['منتهي', 'نشط']);
  const loading = ref(true);
  
  onMounted(() => {
    fetchCases();
  });
  
  const fetchCases = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
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
            defendant: item.attributes.defendant,
            case_type: item.attributes.case_type,
            case_degree: item.attributes.case_degree,
            case_price: item.attributes.case_price,
            previous_session: item.attributes.registration_date,
            next_session: item.attributes.next_court_session,
            decision: lastDecision,
            case_status: item.attributes.case_status,
            announcement_type: item.attributes.announcement_type,
            invitation_link: item.attributes.case_url,
            role: item.attributes.case_roll,
            court: item.attributes.court,
            consultant: item.attributes.advisor_name,
            notes: item.attributes.note,
          };
        })
        .sort((a, b) => a.id - b.id);
  
      loading.value = false;
    } catch (error) {
      console.error("Error fetching cases:", error);
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
  
  const printTable = () => {
  const table = document.getElementById('cases-table');
  if (table) {
    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print Table</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      table { width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed; direction: rtl; }
      th, td { border: 1px solid black; padding: 2px; text-align: right; white-space: nowrap; }
      th { background-color: #f2f2f2; }
      @media print {
        body { font-size: 10px; }
        table { width: 100%; direction: rtl; }
        th, td { white-space: nowrap; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>جدول البيانات</h2>');
    printWindow.document.write(table.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
};



import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

const exportToDoc = async () => {
  // تنسيق التاريخ الحالي
  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  // الحصول على بيانات الجدول الظاهرة فقط
  const table = document.getElementById('cases-table');
  if (!table) return;

  const visibleRows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    return cells.map(cell => cell.textContent.trim());
  });

  // إضافة الرأس للأعمدة
  const headers = [
    'عنوان القضية',
    'المدعي',
    'المدعى عليه',
    'الحالة',
    'نوع القضية',
    'درجة القضية',
    'سعر القضية',
    'الجلسة السابقة',
    'الجلسة القادمة',
    'قرار',
    'نوع الإعلان',
    'رابط الدعوة',
    'الدور',
    'المحكمة',
    'الاستشاري',
    'ملاحظات'
  ];

  // دمج الرأس مع البيانات المفلترة
  const dataToExport = [headers, ...visibleRows];

  // إنشاء الجدول
  const tableDocument = new Table({
    rows: [
      new TableRow({
        children: headers.map(header =>
          new TableCell({ children: [new Paragraph(header)], width: { size: 10, type: WidthType.PERCENTAGE } })
        ),
      }),
      ...visibleRows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  children: [new Paragraph(cell.toString())],
                  width: { size: 10, type: WidthType.PERCENTAGE },
                })
            ),
          })
      ),
    ],
  });

  // إنشاء عنوان التقرير
  const reportTitle = new Paragraph({
    text: `تقرير أعمال اليوم - ${formattedDate}`,
    alignment: 'center',
    heading: HeadingLevel.TITLE,
  });

  // إنشاء مستند DOCX
  const doc = new Document({
    sections: [
      {
        children: [reportTitle, tableDocument],
      },
    ],
  });

  // تحويل المستند إلى Blob وحفظه
  const blob = await Packer.toBlob(doc);
  saveAs(blob, "cases.docx");
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
  
  .p-datatable {
    border-collapse: collapse;
  }
  
  .p-datatable .p-datatable-thead > tr > th,
  .p-datatable .p-datatable-tbody > tr > td {
    border: 1px solid #dddddd;
    padding: 4px;
  }
  
  .p-datatable .p-datatable-thead > tr > th {
    background-color: #f2f2f2;
  }
  
  /* CSS للطباعة فقط */
  @media print {
    .p-datatable {
      border-collapse: collapse;
    }
  
    .p-datatable th, .p-datatable td {
      border: 1px solid black;
      padding: 2px;
      text-align: right;
      font-size: 8px;
      white-space: nowrap;
    }
  
    .p-datatable th {
      background-color: #f2f2f2;
    }
  }
  </style>
  