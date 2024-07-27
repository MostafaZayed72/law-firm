<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height w-100 " style="direction: rtl;"
   >
    <v-card class="pa-5 w-100 rounded-lg" style="direction: rtl; text-align: right;" >
      <v-card-title>
        <span class="text-h5">أدخل إيميل المستخدم</span>
      </v-card-title>
      <v-text-field  v-model="userEmail" label="إيميل المستخدم" required></v-text-field>
      <v-card-title>
        <span class="text-h5">اختر الصلاحيات</span>
      </v-card-title>
      <v-card-text>
        <v-form style="direction: rtl;">
          <v-select v-model="selectedRole" :items="roles" label="اختر الصلاحية" required></v-select>
          <v-btn color="primary" block @click="assignRole">تعيين الصلاحية</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const roles = ref(["تحكم كامل", "إضافة وحذف وتعديل", "إضافة وحذف", "إضافة وتعديل", "تعديل وحذف", "إضافة فقط", "حذف فقط", "تعديل فقط", "مشاهد فقط"])
const selectedRole = ref(null)
const userEmail = ref('')
const userId = ref(null)
const router = useRouter()
const roleNumber = ref(null)

watch(selectedRole, (newVal) => {
  switch (newVal) {
    case 'إضافة وحذف وتعديل':
      roleNumber.value = 7
      break
    case 'تحكم كامل':
      roleNumber.value = 13
      break
    case 'إضافة وحذف':
      roleNumber.value = 11
      break
    case 'إضافة وتعديل':
      roleNumber.value = 6
      break
    case 'تعديل وحذف':
      roleNumber.value = 10
      break
    case 'مشاهد فقط':
      roleNumber.value = 1
      break
    case 'إضافة فقط':
      roleNumber.value = 8
      break
    case 'حذف فقط':
      roleNumber.value = 9
      break
    case 'تعديل فقط':
      roleNumber.value = 5
      break
    default:
      roleNumber.value = null
  }
})

const assignRole = async () => {
  if (!selectedRole.value || !userEmail.value) {
    alert('يرجى إدخال إيميل المستخدم واختيار صلاحية')
    return
  }

  try {
    const jwt = localStorage.getItem("jwt")
    const userResponse = await axios.get('https://backend.eyhadvocates.com/api/users?populate=*', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    const user = userResponse.data.find(u => u.email.toLowerCase() === userEmail.value.toLowerCase().trim())
    console.log(user)
    if (!user) {
      alert('لم يتم العثور على المستخدم بهذا الإيميل')
      return
    }

    userId.value = user.id

    await axios.put(`https://backend.eyhadvocates.com/api/users/${userId.value}?populate=*`, {
      "role": {
        "connect": [
          {
            "id": roleNumber.value
          }
        ],
        "disconnect": [
          {
            "id": 1
          }
        ]
      }
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    alert('تم تعيين الصلاحية بنجاح')
  } catch (error) {
    console.error('خطأ في تعيين الصلاحية:', error)
    alert(error.response.data.error.message)
  }
}


const showTable = ref(false)

onMounted(() => {
  const roleId = localStorage.getItem('roleId')
  if (roleId !== '13') {
    router.push('/')
  }
})

</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
