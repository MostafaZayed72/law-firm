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
            <p><strong>القرار:</strong> {{ caseData.attributes.case_decision }}</p>
          </div>
          <div>
            <p><strong>نوع الإعلان:</strong> {{ caseData.attributes.announcement_type }}</p>
            <p><strong>رول القضية:</strong> {{ caseData.attributes.case_roll }}</p>
            <p><strong>رابط الدعوى:</strong> <a :href="caseData.attributes.case_url" target="_blank">{{ caseData.attributes.case_url }}</a></p>
            <p><strong>اسم المستشار:</strong> {{ caseData.attributes.advisor_name }}</p>
            <p><strong>المحكمة:</strong> {{ caseData.attributes.court }}</p>
            <p><strong>ملاحظات:</strong> {{ caseData.attributes.note }}</p>
            <p><strong>حالة القضية:</strong> {{ caseData.attributes.case_status }}</p>
            <!-- <p><strong>Created At:</strong> {{ caseData.attributes.createdAt }}</p>
            <p><strong>Updated At:</strong> {{ caseData.attributes.updatedAt }}</p> -->
          </div>
        </div>

        <!-- <h3 class="mt-4 mb-2 text-lg font-semibold">Created By</h3> -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="caseData.attributes.createdBy?.data?.attributes?.firstname">
            <p><strong>Firstname:</strong> {{ caseData.attributes.createdBy.data.attributes.firstname }}</p>
            <p><strong>Lastname:</strong> {{ caseData.attributes.createdBy.data.attributes.lastname }}</p>
          </div>
          <div v-if="caseData.attributes.createdBy?.data?.attributes?.username">
            <p><strong>Username:</strong> {{ caseData.attributes.createdBy.data.attributes.username }}</p>
            <p><strong>Email:</strong> {{ caseData.attributes.createdBy.data.attributes.email }}</p>
          </div>
        </div> -->

        <!-- <h3 v-if="caseData.attributes.createdBy?.data?.attributes?.roles?.data" class="mt-4 mb-2 text-lg font-semibold">Roles</h3>
        <ul v-if="caseData.attributes.createdBy?.data?.attributes?.roles?.data" class="list-disc pl-5">
          <li v-for="role in caseData.attributes.createdBy.data.attributes.roles.data" :key="role.id">
            <p><strong>Name:</strong> {{ role.attributes.name }}</p>
            <p><strong>Code:</strong> {{ role.attributes.code }}</p>
            <p><strong>Description:</strong> {{ role.attributes.description }}</p>
          </li>
        </ul> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const caseData = ref(null)

onMounted(async () => {
  const caseId = route.params.id
  const jwt = localStorage.getItem('jwt')

  try {
    const response = await axios.get(`https://backend.lawyerstor.com/api/cases/${caseId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    caseData.value = response.data.data
  } catch (error) {
    console.error('Error fetching case data:', error)
  }
})

const showTable = ref(false)
const colorMode = useColorMode()

onMounted(() => {
  setTimeout(() => {
    showTable.value = true
  }) // Delay in milliseconds
})

const cardClass = computed(() => {
  return colorMode.preference === 'dark' ? 'bg-grey-darken-3' : 'bg-white'
})



</script>

<style>
.container {
  max-width: 800px;
}
</style>
