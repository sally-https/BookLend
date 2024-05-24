<template>
  <div class="min-h-screen py-10 page">
    <div class="main-grid gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-lg border-2 border-color p-6 overflow-x-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-color">Manage Returned Books</h2>
        </div>
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="border-b-2 border-color">
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrower Name</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Student ID</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Book Name</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrowed Date</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Return Date</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Return Code</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Return Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="book in rowData"
              :key="book.borrowed_book_id"
              class="border-b border-color hover:bg-gray-100 transition-colors duration-300"
            >
              <td class="px-4 py-4 font-medium text-color">{{ book.borrower_name }}</td>
              <td class="px-4 py-4 text-color">{{ book.student_id }}</td>
              <td class="px-4 py-4 text-color">{{ book.book_name }}</td>
              <td class="px-4 py-4 text-color">{{ book.borrowed_date }}</td>
              <td class="px-4 py-4 text-color">{{ book.return_date }}</td>
              <td class="px-4 py-4 text-color">
                <button @click="copyToClipboard(book.return_code)" class="text-blue-500 hover:text-blue-700">
                  {{ book.return_code }}
                </button>
              </td>
              <td class="px-4 py-4 text-color">{{ book.return_status }}</td>
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

interface ReturnedBook {
  borrower_name: string
  borrowed_book_id: number
  student_id: string
  book_name: string
  borrowed_date: string
  return_date: string
  return_code: string
  return_status: string
}

const rowData = ref<ReturnedBook[]>([])

const fetchReturnedBooks = async () => {
  try {
    const response = await userGet('/admin-view-returned-books')
    if (response.status === 200) {
      rowData.value = response.data.returnedBooks
    } else {
      throw new Error(`Failed to fetch returned books: ${response.status}`)
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'Failed to fetch returned books', 'error')
  }
}

const copyToClipboard = (text: string) => {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

onMounted(() => {
  fetchReturnedBooks()
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
