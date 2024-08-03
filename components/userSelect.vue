<template>
  <v-select
    style="direction: rtl;"
    reverse
    v-model="selectedUser"
    :items="users"
    item-value="id"
    item-title="username"
    label="اختر مستخدمًا"
    class="w-full text-center"
    :menu-props="{ offsetY: true, maxHeight: '400' }"  
  ></v-select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'

const jwt = ref()

onMounted(() => {
  jwt.value = localStorage.getItem('jwt')
})

// Define your users data
const users = ref([])

// Fetch data from your endpoint
const fetchUsers = async () => {
  const { data } = await useFetch('https://backend.eyhadvocates.com/api/users?populate=*', {
    headers: {
      Authorization: `Bearer ${jwt.value}`
    }
  })
  users.value = data.value
}

// Call fetchUsers when the component is mounted
onMounted(fetchUsers)

const selectedUser = ref(null)
</script>

<style scoped>
.v-select {
  @apply bg-white border rounded-md;
}
</style>
