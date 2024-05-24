<template>
  <div class="min-h-screen py-10 page">
    <div class="main-grid gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-lg border-2 border-color p-6 overflow-x-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-color">Manage Students</h2>
        </div>
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="border-b-2 border-color">
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Name</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Student ID</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Email</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrowed Books</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in rowData" :key="student.id" class="border-b border-color hover:bg-gray-100 transition-colors duration-300">
              <td class="px-4 py-4 font-medium text-color">{{ student.name }}</td>
              <td class="px-4 py-4 text-color">{{ student.student_id }}</td>
              <td class="px-4 py-4 text-color">{{ student.email }}</td>
              <td class="px-4 py-4 text-color">{{ student.borrowed_books_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet } from '@/plugins/http'
import Swal from 'sweetalert2'

interface Student {
  id: number
  name: string
  student_id: string
  email: string
  remember_token: string | null
  created_at: string
  updated_at: string
  borrowed_books_count: number
}

const rowData = ref<Student[]>([])

const fetchStudents = async () => {
  try {
    const response = await userGet('/admin-view-students')
    if (response.status === 200) {
      rowData.value = response.data.students
    } else {
      throw new Error(`Failed to fetch students: ${response.status}`)
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'Failed to fetch students', 'error')
  }
}

onMounted(() => {
  fetchStudents()
})
</script>

<style lang="scss" scoped>
:root {
  --text-color: #1f2937;
  --bg-color: #fff;
  --border-color: #4b5563;
  --icon-bg-color: #4b5563;
  --icon-text-color: #fff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #f3f4f6;
    --bg-color: #1f2937;
    --border-color: #6b7280;
    --icon-bg-color: #6b7280;
    --icon-text-color: #fff;
  }
}

.page {
  color: var(--text-color);
}

.welcome-message {
  border-color: var(--border-color);
  background-color: rgba(var(--border-color), 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

.stat-card {
  border-color: var(--border-color);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .icon-container {
    background-color: var(--icon-bg-color);
    color: var(--icon-text-color);
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
}

table {
  thead {
    tr {
      border-bottom-color: var(--border-color);
    }
  }

  tbody {
    tr {
      border-bottom-color: var(--border-color);

      &:hover {
        background-color: rgba(var(--border-color), 0.1);
      }
    }
  }

  .text-color {
    color: var(--text-color);
  }
}

.border-color {
  border-color: var(--border-color);
}
</style>
