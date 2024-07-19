<template>
    <v-container>
      <v-card v-if="user" class="mx-auto my-12" max-width="400">
        <v-card-title>{{ user.username }}</v-card-title>
        <v-card-text>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role.name }}</p>
          <p><strong>Created At:</strong> {{ formatDate(user.createdAt) }}</p>
<p><strong>Updated At:</strong> {{ formatDate(user.updatedAt) }}</p>

        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const user = ref()
  
  onMounted(async () => {
    const userId= localStorage.getItem('userId')
    const res = await fetch(`https://backend.eyhadvocates.com/api/users/${userId}?populate=*`,{
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTcyMTQwNTM1OSwiZXhwIjoxNzIzOTk3MzU5fQ.EqxbE3K6rqoS9XFkz_wo27BLiZh6y3RtHeuA0SlZYew`,
      },
    })
    user.value = await res.json()
  })

  const formatDate = (dateString) => {
  return dateString.split('T')[0]
}

  </script>
  
  <style scoped>
  /* يمكنك إضافة بعض التنسيقات هنا إذا لزم الأمر */
  </style>
  