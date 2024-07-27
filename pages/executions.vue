<template>
    <div class="card rtl">
      <DataTable v-model:filters="filters"  @click:row="editCase" :value="customers" paginator :rows="10" dataKey="id" filterDisplay="row"
        :loading="loading"
        :globalFilterFields="['id', 'client', 'cas_status','is_active','is_important','case_number', 'case_title', 'claimant', 'defendant', 'is_active', 'case_type', 'case_degree', 'case_price', 'registration_date', 'next_court_session', 'decision', 'announcement_type', 'case_url', 'case_roll', 'court', 'advisor_name', 'note']"
        id="cases-table">
  
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
        <div class="flex"><Button label="طباعة" icon="pi pi-print" @click="printTable" class="mr-4 print " />
          <Button label="تحميل كملف DOC" icon="pi pi-download" @click="exportToDoc" class="mx-4 doc " />
          <AddCaseDialog />
        </div>
  
        <Column field="id" header="id" :filter="true" :filterPlaceholder="'ابحث بالـid'"
          style="width: fit-content; max-width: 14rem">
          <template #body="{ data }">
            <router-link :to="`/case/${data.id}`">{{ data.id }}</router-link>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالـ id" />
          </template>
        </Column>
        <Column field="case_title" header="عنوان القضية" :filter="true" :filterPlaceholder="'ابحث بالعنوان'"
          style="width: fit-content; max-width: 14rem">
          <template #body="{ data }">
            <router-link :to="`/case/${data.id}`">{{ data.case_title }}</router-link>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالعنوان" />
          </template>
        </Column>
        <Column field="case_number" header="رقم القضية" :filter="true" :filterPlaceholder="' بحث برقم القضية'"
          style="width: fit-content; max-width: 14rem">
          <template #body="{ data }">
            {{ data.case_number }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder=" بحث برقم القضية" />
          </template>
        </Column>
        <Column field="case_type" header="نوع القضية" :filter="true" :filterPlaceholder="'ابحث بنوع القضية'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.case_type }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بنوع القضية" />
          </template>
        </Column>
  
        <Column field="case_degree" header="درجة القضية" :filter="true" :filterPlaceholder="'ابحث بدرجة القضية'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.case_degree }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="ابحث بدرجة القضية" />
          </template>
        </Column>
        <Column field="court" header="المحكمة" :filter="true" :filterPlaceholder="'ابحث بالمحكمة'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.court }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالمحكمة" />
          </template>
        </Column>
        <Column field="is_active" header="حالة القضية" :filter="true" :filterPlaceholder="'اختر الحالة'"
    style="max-width: 12rem">
    <template #body="{ data }">
      <Tag :value="data.is_active ? 'نشط' : 'منتهي'" :severity="getSeverity(data.is_active ? 'نشط' : 'منتهي')" />
    </template>
    
  </Column>
       
  
  <Column field="is_important" header="أهمية القضية" :filter="true" :filterPlaceholder="'ابحث بالأهمية'"
    style="max-width: 12rem">
    <template #body="{ data }">
      <Tag :value="data.is_important ? 'هامة' : 'عادية'" :severity="getMySeverity(data.is_active ? 'نشط' : 'منتهي')"  :style="data.is_important? 'background : #0eba82; color: white': ''" />
        </template>
    
      <template #filter="{ filterModel, filterCallback }">
  <select style="border:1px solid grey" class="px-4 rounded" v-model="filterModel.value" @change="filterCallback()">
    <option value="true">هامة</option>
    <option value="false">عادية</option>
  </select>
</template>

  
  </Column>
  
  
  
        <Column field="case_price" header="قيمة الدعوى" :filter="true" :filterPlaceholder="'ابحث بقيمة الدعوى'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.case_price }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="ابحث بقيمة الدعوى" />
          </template>
        </Column>
  
        <Column field="claimant" header="المنفذ" :filter="true" :filterPlaceholder="'ابحث المنفذ'"
          style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.claimant }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالمنفذ" />
          </template>
        </Column>
  
        <Column field="defendant" header="المنفذ ضده" :filter="true" :filterPlaceholder="'ابحث بالمنفذ ضده'"
          style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.defendant }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="ابحث بالمنفذ ضده" />
          </template>
        </Column>
        <Column field="client" header="موكلي" :filter="true" :filterPlaceholder="'ابحث بالموكل'" style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.client }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالموكل" />
          </template>
        </Column>
  
        <Column field="advisor_name" header="المستشار المعني" :filter="true" :filterPlaceholder="'ابحث بالمستشار المعني'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.advisor_name }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="ابحث بالمستشار المعني" />
          </template>
        </Column>
        <Column field="announcement_type" header="نوع الإعلان" :filter="true" :filterPlaceholder="'ابحث بنوع الإعلان'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.announcement_type }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="ابحث بنوع الإعلان" />
          </template>
        </Column>
        <Column field="registration_date" header="الجلسة السابقة" :filter="true" :filterPlaceholder="'ابحث بالجسة السابقة'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.registration_date }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="ابحث بالجسة السابقة" />
          </template>
        </Column>
  
        <Column field="next_court_session" header="الجلسة القادمة" :filter="true" :filterPlaceholder="'ابحث بالجسة القادمة'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.next_court_session }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="ابحث بالجسة القادمة" />
          </template>
        </Column>
        <Column field="case_roll" header="الرول" :filter="true" :filterPlaceholder="'ابحث بالرول'" style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.case_roll }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالرول" />
          </template>
        </Column>
  
  
  
  
        <Column field="case_url" header="رابط الدعوة" :filter="true" :filterPlaceholder="'ابحث برابط الدعوة'"
          style="min-width: 7rem">
          <template #body="{ data }">
            <a :href="data.case_url" target="_blank">{{ data.case_url }}</a>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="ابحث برابط الدعوة" />
          </template>
        </Column>
  
  
  
        <Column field="decision" header="القرار" :filter="true" :filterPlaceholder="'ابحث بالقرار'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.decision }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالقرار" />
          </template>
        </Column>
  
  
  
        <Column field="note" header="ملاحظات" :filter="true" :filterPlaceholder="'ابحث بالملاحظات'"
          style="min-width: 7rem">
          <template #body="{ data }">
            {{ data.note }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ابحث بالملاحظات" />
          </template>
        </Column>
        <Column header="التحكم" style="width: 10rem" v-if="roleId == 13 || roleId == 7 || roleId == 6 || roleId == 10 || roleId == 5 || roleId == 9 || roleId == 11">
    <template #body="{ data }">
      <div class="flex justify-center">
        <v-btn small icon @click="editCase(data)" v-if="roleId == 13 || roleId == 7 || roleId == 6 || roleId == 10 || roleId == 5">
            <v-icon>mdi-pencil</v-icon>
  
          </v-btn>
        <v-btn small icon @click="confirmDelete(data)" v-if="roleId == 13 || roleId == 7 || roleId == 9 || roleId == 10 || roleId == 11">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
      </div>
    </template>
  </Column>
  
  
   <!-- Dialog تعديل القضية -->
   <v-dialog v-model="dialog.visible" max-width="600px" style="direction:rtl">
    <v-card>
      <v-card-title>
        <span class="headline">تعديل القضية</span>
      </v-card-title>
      <v-card-subtitle>
        <v-text-field  reverse v-model="dialog.case.case_title" label="عنوان القضية" />
        <v-text-field  reverse v-model="dialog.case.case_number" label="رقم القضية" />
        <v-text-field  reverse v-model="dialog.case.client" label="موكلي" />
        <v-text-field reverse v-model="dialog.case.claimant" label="المدعي" />
        <v-text-field reverse v-model="dialog.case.defendant" label="المدعى عليه" />
        <v-select v-model="dialog.case.is_active" :items="statuses" label="حالة القضية" />
        <v-select v-model="dialog.case.is_important" :items="myStatuses" label="أهمية القضية" />
        <v-text-field reverse v-model="dialog.case.case_type" label="نوع القضية" />
        <v-text-field reverse v-model="dialog.case.case_degree" label="درجة القضية" />
        <v-text-field reverse v-model="dialog.case.case_price" label="قيمة الدعوى" />
        <v-text-field reverse v-model="dialog.case.registration_date" label="الجلسة السابقة" />
        <v-text-field reverse v-model="dialog.case.next_court_session" label="الجلسة القادمة" />
        <v-text-field reverse v-model="dialog.case.announcement_type" label="نوع الإعلان" />
        <v-text-field reverse v-model="dialog.case.case_url" label="رابط الدعوة" />
        <v-text-field reverse v-model="dialog.case.case_roll" label="الرول" />
        <v-text-field reverse v-model="dialog.case.court" label="المحكمة" />
        <v-text-field reverse v-model="dialog.case.advisor_name" label="المستشار المعني" />
        <v-text-field reverse v-model="dialog.case.note" label="ملاحظات" />
      </v-card-subtitle>
      <v-card-actions>
        <v-btn @click="dialog.visible = false">إلغاء</v-btn>
        <v-btn @click="saveChanges">حفظ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { FilterMatchMode } from '@primevue/core/api';
  import { EventBus } from '/EventBus';
  
  onMounted(() => {
    fetchCases();
    
    watchEffect(() => {
      if (EventBus.value.updateCases) {
        fetchCases();
        EventBus.value.updateCases = false; // Reset flag
      }
    });
  });
  const dialog = reactive({
    visible: false,
    case: {}
  });
  // فتح حوار التعديل
  const editCase = (item) => {
    if (item) {
      dialog.case = { ...item }; // نسخ بيانات القضية إلى نموذج البيانات
      dialog.visible = true; // فتح الـ dialog
    } else {
      console.error('No item provided');
    }
  };
  
  // حفظ التعديلات
  const saveChanges = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const decisions = dialog.case.decisions?.data || []; // التأكد من وجود قائمة القرارات
  
      await axios.put(
        `https://backend.eyhadvocates.com/api/cases/${dialog.case.id}?populate=*`,
        {
          data: {
            case_title: dialog.case.case_title,
            case_number: dialog.case.case_number,
            client: dialog.case.client,
            claimant: dialog.case.claimant,
            defendant: dialog.case.defendant,
            is_active: dialog.case.is_active,
            case_type: dialog.case.case_type,
            case_degree: dialog.case.case_degree,
            case_price: dialog.case.case_price,
            registration_date: dialog.case.registration_date,
            next_court_session: dialog.case.next_court_session,
            announcement_type: dialog.case.announcement_type,
            case_url: dialog.case.case_url,
            case_roll: dialog.case.case_roll,
            court: dialog.case.court,
            advisor_name: dialog.case.advisor_name,
            note: dialog.case.note,
            is_important: dialog.case.is_important,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
  
      // تحديث بيانات الجدول بعد التعديل
      fetchCases();
      dialog.visible = false; // إغلاق الحوار
    } catch (error) {
      console.error("Error updating case:", error);
    }
  };
  
  const customers = ref([]);
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    client: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    case_number: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    case_title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    claimant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    defendant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
    case_type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    case_degree: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    case_price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    registration_date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    next_court_session: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    decision: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    announcement_type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    case_url: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    case_roll: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    court: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    advisor_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    note: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    is_important: { value: null, matchMode: FilterMatchMode.EQUALS },

  });
  const statuses = ref([
    { title: 'منتهي', value: false },
    { title: 'نشط', value: true }
  ]);
  const myStatuses = ref([
    { title: 'عادية', value: false },
    { title: 'هامة', value: true }
  ]);const loading = ref(true);
  
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

    const importanceOptions = ref([
      { label: 'هامة', value: true },
      { label: 'عادية', value: false }
    ]);

    customers.value = response.data.data
      .map((item) => {
        const decisions = item.attributes.decisions.data;
        const lastDecision = decisions.slice(-1)[0]?.attributes.decision;

        return {
          case_title: item.attributes.case_title,
          case_number: item.attributes.case_number,
          id: item.id,
          client: item.attributes.client,
          claimant: item.attributes.claimant,
          defendant: item.attributes.defendant,
          case_type: item.attributes.case_type,
          case_degree: item.attributes.case_degree,
          case_price: item.attributes.case_price,
          registration_date: item.attributes.registration_date,
          next_court_session: item.attributes.next_court_session,
          decision: lastDecision,
          case_status: item.attributes.case_status,
          announcement_type: item.attributes.announcement_type,
          case_url: item.attributes.case_url,
          case_roll: item.attributes.case_roll,
          court: item.attributes.court,
          advisor_name: item.attributes.advisor_name,
          note: item.attributes.note,
          is_active: item.attributes.is_active,
          is_important: item.attributes.is_important,
          case_type_relation: item.attributes.case_type_relation.data?.id

        };
      })
      .filter(item => item.is_active)
      .filter(item => item.case_type_relation == 1)
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
      default:
        return 'info';
    }
  };
  const getMySeverity = (status) => {
    switch (status) {
      case 'عادية':
        return 'danger';
      case 'هامة':
        return 'success';
      default:
        return 'info';
    }
  };
  
  const printTable = () => {
    const table = document.getElementById('cases-table');
    if (table) {
        // Create a new table element to hold only the required columns
        const printTable = document.createElement('table');
        printTable.style.width = '100%';
        printTable.style.borderCollapse = 'collapse';

        // Create the header row with only the required columns
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['عنوان القضية', 'رقم القضية', 'نوع القضية', 'درجة القضية', 'المحكمة', 'المنفذ', ' المنفذ ضده','موكلي','نوع الإعلان','تارريخ الجلسة السابقة','تاريخ الجلسة القادمة','الرول','رابط الدعوة','القرار','ملاحظات'];
        
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.style.border = '1px solid black';
            th.style.padding = '2px';
            th.style.textAlign = 'right';
            th.style.wordWrap = 'break-word'; // Ensure words wrap in the header
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        printTable.appendChild(thead);

        // Create the body rows with only the required columns
        const tbody = document.createElement('tbody');

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const newRow = document.createElement('tr');
            const cells = row.querySelectorAll('td');
            
            // Only get the index of the columns you need (e.g., Title and Number)
            const dataIndices = [1, 2, 3, 4, 5, 9, 10, 11,  13,14,15,16,17,18,19]; // Adjust indices if necessary
            
            dataIndices.forEach(index => {
                const td = document.createElement('td');
                td.style.border = '1px solid black';
                td.style.padding = '2px';
                td.style.textAlign = 'right';
                td.style.wordWrap = 'break-word'; // Ensure words wrap in the cells
                td.textContent = cells[index].textContent.trim();
                newRow.appendChild(td);
            });
            tbody.appendChild(newRow);
        });

        printTable.appendChild(tbody);

        // Open a new window and print the new table
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.open();
        printWindow.document.write('<html><head><title>•••••••••</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            table { width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed; direction: rtl; }
            th, td { border: 1px solid black; padding: 2px; text-align: right; white-space: normal; word-wrap: break-word; }
            th { background-color: #f2f2f2; }
            @media print {
                body { font-size: 10px; }
                table { width: 100%; direction: rtl; }
                th, td { white-space: normal; word-wrap: break-word; }
            }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printTable.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
};
  
  
  
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, HeadingLevel } from 'docx';
import fileSaver from 'file-saver';
const { saveAs } = fileSaver;
const exportToDoc = async () => {
  // Reverse the order of items from right to left including index+1
  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  const reversedRows = desserts.value.slice().reverse().map((item, index) => [
    item["notes"] ?? "",
    item["consultant_name"] ?? "",
    item["court_name"] ?? "",
    item["case_roll"] ?? "",
    item["case_link"] ?? "",
    item["announcement_type"] ?? "",
    item["case_status"] ?? "",
    item["decision"] ?? "",
    item["next_session"] ?? "",
    item["previous_session"] ?? "",
    item["case_price"] ?? "",
    item["case_grade"] ?? "",
    item["case_type"] ?? "",
    item["defendant"] ?? "",
    item["claimant"] ?? "",
    item["case_number"] ?? "",
    item["case_title"] ?? ""
  ]);

  // Reverse the order of rows vertically
  reversedRows.reverse();

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("ملاحظات")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("اسم المستشار")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("المحكمة المختصة")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("رول القضية")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("رابط الدعوى")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("نوع الاعلان")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("حالة القضية")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("القرار")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("تاريخ الجلسة القادمة")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("تاريخ الجلسة السابقة")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("قيمة الدعوى")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("درجة القضية")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("نوع القضية")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("المدعي عليه")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("المدعي")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("رقم القضية")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("عنوان القضية")], width: { size: 10, type: WidthType.PERCENTAGE } }),
        ],
      }),
      ...reversedRows.map(
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



  const reportTitle = new Paragraph({
    text: `تقرير أعمال اليوم - ${formattedDate}`,
    alignment: 'center',
    heading: HeadingLevel.TITLE, // يمكن تغيير مستوى العنوان حسب الحاجة
  });

  const doc = new Document({
    sections: [
      {
        children: [reportTitle, table], // إضافة عنوان التقرير قبل الجدول
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, "cases.docx");
};
  
  
  const confirmDelete = (item) => {
  if (confirm(`هل أنت متأكد أنك تريد حذف القضية ${item.case_title}?`)) {
    deleteCase(item.id);
  }
};

// دالة لحذف القضية
const deleteCase = async (id) => {
  try {
    const jwt = localStorage.getItem("jwt");
    await axios.delete(
      `https://backend.eyhadvocates.com/api/cases/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // تحديث بيانات الجدول بعد الحذف
    fetchCases();
  } catch (error) {
    console.error("Error deleting case:", error);
  }
};

const roleId = ref()
onMounted(() => {
  roleId.value = localStorage.getItem('roleId')
  const jwt = localStorage.getItem('jwt')
  if (!jwt) {
    navigateTo('/login')
  } 
});

  
  </script>
  
  <style>
  .rtl {
    direction: rtl;
    text-align: right;
  }
  
  .rtl .p-datatable .p-datatable-thead>tr>th,
  .rtl .p-datatable .p-datatable-tbody>tr>td {
    text-align: right;
  }
  
  
  </style>