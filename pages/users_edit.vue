<template>
  <div class="p-4 rounded-lg" style="direction: rtl;">
    <!-- Search Field -->
    <v-text-field reverse v-model="search" label="Search" class="mb-4" prepend-icon="mdi-magnify"></v-text-field>

    <!-- Data Table -->
    <v-data-table v-if="showTable" :headers="headers" :items="filteredEmployees" item-value="id"
      class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editEmployee(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="confirmDelete(item.id)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline" align="end">تأكيد الحذف</v-card-title>
        <v-card-text class="text-right">
          هل أنت متأكد من حذف هذا المستخدم؟
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">إلغاء</v-btn>
          <v-btn color="blue darken-1" text @click="deleteConfirmed">تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Edit Employee Dialog -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">تعديل بيانات الموظف</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field reverse v-model="editedEmployee.username" label="الإسم"></v-text-field>
            <v-text-field v-model="editedEmployee.email" label="الإيميل"></v-text-field>
            <v-text-field v-model="editedEmployee.password" label="الباسورد" type="password"></v-text-field>
            <!-- Add other fields as necessary -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveEdits">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const employees = ref([]);
const search = ref('');
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Username', value: 'username' },
  { title: 'Email', value: 'email' },
  { title: 'Role', value: 'roleNumber' },
  { title: 'Actions', value: 'actions', sortable: false }
];

const fetchEmployees = async () => {
  const jwt = localStorage.getItem("jwt");

  try {
    const response = await axios.get('https://backend.eyhadvocates.com/api/users?populate=*', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });
    employees.value = response.data.map(employee => ({
      ...employee,
      roleNumber: mapRoleToNumber(employee.role.id)
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};

const mapRoleToNumber = (roleId) => {
  switch (roleId) {
    case 7:
      return 'إضافة وحذف وتعديل';
    case 13:
      return 'تحكم كامل';
    case 11:
      return 'إضافة وحذف';
    case 6:
      return 'إضافة وتعديل';
    case 10:
      return 'تعديل وحذف';
    case 1:
    case 4:  // افتراض أن القيمة 4 تعني "مشاهد فقط" أيضًا
      return 'مشاهد فقط';
    case 8:
      return 'إضافة فقط';
    case 9:
      return 'حذف فقط';
    case 5:
      return 'تعديل فقط';
    default:
      return null;
  }
};

const roleOptions = [
  { text: 'إضافة وحذف وتعديل', value: 7 },
  { text: 'تحكم كامل', value: 13 },
  { text: 'إضافة وحذف', value: 11 },
  { text: 'إضافة وتعديل', value: 6 },
  { text: 'تعديل وحذف', value: 10 },
  { text: 'مشاهد فقط', value: 1 },
  { text: 'إضافة فقط', value: 8 },
  { text: 'حذف فقط', value: 9 },
  { text: 'تعديل فقط', value: 5 }
];

const editEmployee = (employee) => {
  editedEmployee.value = { ...employee };
  editDialog.value = true;
};

const deleteEmployee = async (id) => {
  deleteId.value = true;
  const jwt = localStorage.getItem("jwt");

  try {
    await axios.delete(`https://backend.eyhadvocates.com/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });
    console.log('Deleted employee with ID:', id);
    fetchEmployees(); // تحديث قائمة الموظفين بعد الحذف
    alert('تم حذف المستخدم بنجاح')
  } catch (error) {
    console.error('Error deleting employee:', error);
  } finally {
    deleteId.value = false;
    deleteDialog.value = false;
  }
};

const saveEdits = async () => {
  const jwt = localStorage.getItem("jwt");

  try {
    const userId = editedEmployee.value.id;
    const response = await axios.put(`https://backend.eyhadvocates.com/api/users/${userId}`, {
      username: editedEmployee.value.username,
      email: editedEmployee.value.email,
      password: editedEmployee.value.password
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });
    console.log('Saved employee:', response.data);
    editDialog.value = false;
    fetchEmployees(); // تحديث قائمة الموظفين بعد الحفظ
  } catch (error) {
    console.error('Error saving employee:', error);
    alert(error.response.data.error.message)
  }
};

const closeEditDialog = () => {
  editDialog.value = false;
};

const editedEmployee = ref({});
const editDialog = ref(false);
const deleteDialog = ref(false);

const deleteId = ref(null);

const confirmDelete = (id) => {
  deleteId.value = id;
  deleteDialog.value = true;
};

const deleteConfirmed = () => {
  deleteEmployee(deleteId.value);
};

const filteredEmployees = computed(() => {
  return employees.value.filter(employee => {
    return (
      employee.username.toLowerCase().includes(search.value.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.value.toLowerCase()) ||
      (employee.roleNumber && employee.roleNumber.includes(search.value))
    );
  });
});

onMounted(fetchEmployees);

const showTable = ref(false);
onMounted(() => {
  setTimeout(() => {
    showTable.value = true;
  });
});
onMounted(() => {
  const roleId = localStorage.getItem('roleId')
  if (roleId !== '13') {
    router.push('/')
  } 
})

</script>

<style scoped>
/* Add any custom styles here */
</style>