<template>
  <v-container>
    <v-text-field
      v-model="searchQuery"
      label="ابحث"
      class="mb-4"
      @input="filterRows"
    ></v-text-field>

    <v-simple-table>
      <thead>
        <tr>
          <th>الاسم</th>
          <th>البريد الإلكتروني</th>
          <th>الموضوع</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in filteredRows" :key="index">
          <td>{{ row.name }}</td>
          <td>{{ row.email }}</td>
          <td>{{ row.subject }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const rows = ref([
  { name: 'محمد', email: 'mohamed@example.com', subject: 'التنبيه' },
  { name: 'أحمد', email: 'ahmed@example.com', subject: 'التطوير' },
  { name: 'سارة', email: 'sara@example.com', subject: 'التسويق' },
])
const filteredRows = ref([...rows.value])

const filterRows = () => {
  filteredRows.value = rows.value.filter(row => !row.subject.includes(searchQuery.value))
}
</script>

<style scoped>
/* يمكنك إضافة أي تنسيقات إضافية هنا */
</style>
