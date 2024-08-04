<template>
  <div style="direction: rtl;">
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <i class="pi pi-spin pi-spinner text-4xl"></i>
    </div>

    <div v-else style="direction: rtl;" class="text-center">
      <div class="flex justify-start mr-10  gap-4">
        <Button label="طباعة" icon="pi pi-print" class="print" @click="printTable" />

  <Button label="إضافة مهمة جديدة" icon="pi pi-plus" class="text-white" @click="openAddDialog" />
</div>

      <DataTable :value="tasks" class="p-datatable-gridlines rtl-table rtl text-center" style="direction: rtl;">
        <Column class="text-start" field="attributes.title" header="العنوان" :body="data => data.attributes.title"></Column>
        <Column class="text-start" field="attributes.description" header="الوصف" :body="data => data.attributes.description"></Column>
        <Column class="text-start" field="attributes.days_required" header="الأيام المطلوبة" :body="data => data.attributes.days_required"></Column>
        <Column class="text-start" field="attributes.due_date" header="تاريخ الإنشاء" :body="data => formatDate(data.attributes.due_date)"></Column>
        <Column class="text-start" header="المكلفون">
          <template #body="{ data }">
            <div v-for="assignee in data.attributes.assignees.data" :key="assignee.id">
              {{ assignee.attributes.username }}
            </div>
          </template>
        </Column>
        <Column class="text-start" header="حالة المهمة">
          <template #body="{ data }">
            <select
              class="w-full rounded-lg py-1 text-center cursor-pointer"
              :class="data.attributes.is_done ? 'bg-green-400' : 'bg-red-400'"
              style="border: 1px solid;"
              v-model="data.attributes.is_done"
              @change="updateTaskStatus(data.id, data.attributes.is_done)"
            >
              <option :value="true" selected>منجز</option>
              <option :value="false">غير منجز</option>
            </select>
          </template>
        </Column>
        <Column class="text-start" header="إجراءات" v-if="roleId == 13">
          <template #body="{ data }">
            <div class="flex gap-2 justify-center">
              <v-btn @click="openEditDialog(data)" color="warning" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="prepareDelete(data.id)" color="red" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog for adding or editing a task -->
    <Dialog v-model:visible="showDialog" header="إضافة أو تعديل مهمة" :style="{ width: '50vw' }" style="direction: rtl;" :closable="true">
      <div class="p-4">
        <form @submit.prevent="submitTask">
          <div class="field mb-4">
            <label for="title" class="block">العنوان</label>
            <InputText id="title" v-model="newTask.title" class="w-full" />
          </div>
          <div class="field mb-4">
            <label for="description" class="block">الوصف</label>
            <InputText id="description" v-model="newTask.description" class="w-full" />
          </div>
          <div class="field mb-4">
            <label for="days_required" class="block">الأيام المطلوبة</label>
            <InputNumber id="days_required" v-model="newTask.days_required" class="w-full" />
          </div>
          <div class="field mb-4">
            <label for="due_date" class="block">تاريخ الإنشاء</label>
            <Calendar id="due_date" v-model="newTask.due_date" class="w-full" />
          </div>
          <div class="field mb-4">
            <label for="assignees" class="block">المكلفون</label>
            <UserSelect
              reverse
              style="direction: rtl;"
              v-model="newTask.assignees"
              :options="users"
              option-label="username"
              option-value="id"
              multiple
              @focus="fetchUsersOnFocus"
              placeholder="اختر المكلفين"
              class="w-full text-center"
            />
          </div>
          <Button type="submit" label="حفظ" icon="pi pi-save" class="p-button-success text-center" />
        </form>
      </div>
    </Dialog>

    <!-- Dialog for delete confirmation -->
    <Dialog v-model:visible="confirmDeleteDialog" header="تأكيد الحذف" :style="{ width: '40vw' }" :closable="true">
      <div class="p-4 text-center">
        <p>هل أنت متأكد أنك تريد حذف هذه المهمة؟</p>
        <div class="flex justify-center gap-2 mt-4">
          <Button label="نعم" icon="pi pi-check" class="p-button-danger" @click="deleteTask(taskToDelete)" />
          <Button label="لا" icon="pi pi-times" class="p-button-secondary" @click="confirmDeleteDialog = false" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'

const tasks = ref([])
const users = ref([])
const loading = ref(true)
const showDialog = ref(false)
const confirmDeleteDialog = ref(false)
const taskToDelete = ref(null)
const editingTask = ref(null)
const newTask = ref({
  title: '',
  description: '',
  days_required: 0,
  due_date: null,
  assignees: []
})
const jwt = ref()
const roleId = ref()
const userId = ref()
onMounted(() => {
  jwt.value = localStorage.getItem('jwt')
  roleId.value = localStorage.getItem('roleId')
  userId.value = localStorage.getItem('userId')
  fetchTasks()
})

const fetchTasks = async () => {
  try {
    let url = 'https://backend.eyhadvocates.com/api/tasks?populate=*';
    
    // تعديل عنوان URL بناءً على roleId
    if (roleId.value !== '13') {
      url += `&filters[assignees][id][$eq]=${userId.value}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwt.value}`
      }
    })

    // Map through the tasks and format the due_date
    tasks.value = response.data.data.map(task => ({
      ...task,
      attributes: {
        ...task.attributes,
        due_date: formatDate(task.attributes.due_date), // Format date here
      }
    }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    loading.value = false
  }
}


const fetchUsers = async () => {
  try {
    const response = await axios.get('https://backend.eyhadvocates.com/api/users?populate=*', {
      headers: {
        Authorization: `Bearer ${jwt.value}`
      }
    })

    if (Array.isArray(response.data.data)) {
      users.value = response.data.data.map(user => ({
        id: user.id,
        username: user.attributes.username || 'غير متاح'
      }))
    } else {
      console.error('Data format error: ', response.data)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const fetchUsersOnFocus = () => {
  if (users.value.length === 0) { // Fetch only if users are not already loaded
    fetchUsers()
  }
}

const openAddDialog = () => {
  newTask.value = {
    title: '',
    description: '',
    days_required: 0,
    due_date: null,
    assignees: []
  }
  editingTask.value = null
  showDialog.value = true
}

const openEditDialog = (task) => {
  editingTask.value = task
  newTask.value = {
    title: task.attributes.title || '',
    description: task.attributes.description || '',
    days_required: task.attributes.days_required || 0,
    due_date: new Date(task.attributes.due_date) || null,
    assignees: (task.attributes.assignees.data && task.attributes.assignees.data.map(assignee => assignee.id)) || []
  }
  showDialog.value = true
}

const submitTask = async () => {
  try {
    const taskData = {
      title: newTask.value.title,
      description: newTask.value.description,
      days_required: newTask.value.days_required,
      due_date: newTask.value.due_date.toISOString(), // Convert to ISO string
      assignees: newTask.value.assignees
    }

    if (editingTask.value) {
      // Update existing task
      await axios.put(`https://backend.eyhadvocates.com/api/tasks/${editingTask.value.id}`, { data: taskData }, {
        headers: {
          Authorization: `Bearer ${jwt.value}`
        }
      })
alert('تم تعديل المهمة بنجاح')    } else {
      // Create new task
      await axios.post('https://backend.eyhadvocates.com/api/tasks', { data: taskData }, {
        headers: {
          Authorization: `Bearer ${jwt.value}`
        }
      })
      alert('تم إضافة المهمة بنجاح')
    }

    fetchTasks() // Refresh the data to update the table
    showDialog.value = false // Close the dialog
  } catch (error) {
    console.error('Error submitting task:', error)
alert('حدث خطأ أثناء حفظ المهمة')  }
}

const updateTaskStatus = async (taskId, isDone) => {
  try {
    // Ensure isDone is a boolean
    const isDoneBoolean = isDone === 'true' || isDone === true

    await axios.put(`https://backend.eyhadvocates.com/api/tasks/${taskId}`, { 
      data: { is_done: isDoneBoolean }
    }, {
      headers: {
        Authorization: `Bearer ${jwt.value}`
      }
    })
    alert('تم تحديث حالة المهمة بنجاح')
  } catch (error) {
    console.error('Error updating task status:', error)
   alert('هناك خطأ')
  }
}

const prepareDelete = (taskId) => {
  taskToDelete.value = taskId
  confirmDeleteDialog.value = true
}

const deleteTask = async (taskId) => {
  try {
    await axios.delete(`https://backend.eyhadvocates.com/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${jwt.value}`
      }
    })
    tasks.value = tasks.value.filter(task => task.id !== taskId)
    confirmDeleteDialog.value = false
    alert('تم حذف المهمة بنجاح')
  } catch (error) {
    console.error('Error deleting task:', error)
alert('حدث خطأ أثناء الحذف')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const printTable = () => {
  // إنشاء نافذة جديدة للطباعة
  const printWindow = window.open('', '', 'height=600,width=800');

  // إنشاء محتوى HTML للنافذة
  let printContent = `
    <html>
    <head>
      <title>.</title>
      <style>
        body {
          direction: rtl;
          text-align: right;
          margin: 0;
          padding: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          direction: rtl;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: right;
        }
        th {
          background-color: #f2f2f2;
        }
        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .header img {
          width: 30px; /* حجم الشعار */
          margin-right: 10px; /* مسافة بين الشعار والعنوان */
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://www.eyhadvocates.com/_nuxt/logo.C97GQIbF.png" alt="شعار مكتب البلوشي للمحاماة" />
        <p style="margin-right: 10px"> مكتب البلوشي والمراشدة للمحاماة والإستشارات القانونية (المهام)</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>العنوان</th>
            <th>الوصف</th>
            <th>الأيام المطلوبة</th>
            <th>تاريخ الإنشاء</th>
            <th>المكلفون</th>
            <th>حالة المهمة</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.value.map(task => `
            <tr>
              <td>${task.attributes.title}</td>
              <td>${task.attributes.description}</td>
              <td>${task.attributes.days_required}</td>
              <td>${formatDate(task.attributes.due_date)}</td>
              <td>${task.attributes.assignees.data.map(assignee => assignee.attributes.username).join(', ')}</td>
              <td>${task.attributes.is_done ? 'منجز' : 'غير منجز'}</td>
            </tr>
          `).reverse().join('')} <!-- عكس ترتيب الصفوف -->
        </tbody>
      </table>
    </body>
    </html>
  `;

  // كتابة المحتوى في نافذة الطباعة
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

</script>

<style scoped>
/* Add your custom styles here if needed */
</style>
