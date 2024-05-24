<template>
  <div class="min-h-screen py-10">
    <div class="main-grid gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- main col -->
      <div class="main-col">
        <div class="flex flex-col gap-8 h-full">
          <!-- welcome message -->
          <div class="rounded-lg border-2 p-6 bg-opacity-10 text-color welcome-message">
            <h1 class="text-3xl font-bold">Welcome, {{ studentData?.name }}! 📚</h1>
            <p class="mt-2 text-lg">Manage your borrowed books and stay on top of your reading list.</p>
          </div>

          <!-- four cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 four-cards-wrap">
            <div class="rounded-lg border-2 p-6 stat-card">
              <div class="flex items-center justify-center h-16 w-16 rounded-full icon-container mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-color" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                  />
                </svg>
              </div>
              <div class="card-content">
                <h3 class="text-xl font-semibold text-color">Total Borrowed</h3>
                <p class="text-3xl font-bold text-color mt-2">{{ stats.totalBorrowedBooks }}</p>
              </div>
            </div>
            <div class="rounded-lg border-2 p-6 stat-card">
              <div class="flex items-center justify-center h-16 w-16 rounded-full icon-container mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-color" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="card-content">
                <h3 class="text-xl font-semibold text-color">Pending Return</h3>
                <p class="text-3xl font-bold text-color mt-2">{{ stats.pendingReturnBooks }}</p>
              </div>
            </div>
            <div class="rounded-lg border-2 p-6 stat-card">
              <div class="flex items-center justify-center h-16 w-16 rounded-full icon-container mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-color" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="card-content">
                <h3 class="text-xl font-semibold text-color">Returned</h3>
                <p class="text-3xl font-bold text-color mt-2">{{ stats.returnedBooks }}</p>
              </div>
            </div>
            <div class="rounded-lg border-2 p-6 stat-card">
              <div class="flex items-center justify-center h-16 w-16 rounded-full icon-container mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-color" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <div class="card-content">
                <h3 class="text-xl font-semibold text-color" :class="{ 'text-red-500': stats.deadlineStatus === 'Overdue' }">
                  {{ stats.deadlineStatus }} Deadline: {{ stats.incomingBookName }}
                </h3>
                <p class="text-lg text-color mt-2">{{ stats.returnDeadline }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- table -->
      <div class="rounded-lg border-2 border-color p-6 mt-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-color">Book Lending Details</h2>
          <router-link
            to="/library"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 uppercase tracking-wider font-semibold text-sm inline-block"
            style="text-decoration: none"
          >
            <span class="flex items-center">
              <i class="fas fa-book mr-2"></i>
              <span>Visit Library</span>
            </span>
          </router-link>
        </div>
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="border-b-2 border-color">
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Book Title</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrow Date</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Return Deadline</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="book in bookLendingDetails"
              :key="book.title"
              class="border-b border-color hover:bg-gray-100 transition-colors duration-300"
            >
              <td class="px-4 py-4 font-medium text-color">{{ book.title }}</td>
              <td class="px-4 py-4 text-color">{{ book.borrowDate }}</td>
              <td class="px-4 py-4 text-color">{{ book.returnDeadline }}</td>
              <td class="px-4 py-4">
                <span
                  class="px-4 py-2 inline-flex items-center text-sm leading-5 font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                  :class="{
                    'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700':
                      book.status === 'returned',
                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700':
                      book.status === 'borrowed',
                    'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700':
                      book.status === 'Overdue',
                  }"
                >
                  <span
                    class="mr-2"
                    :class="{
                      'text-green-500': book.status === 'returned',
                      'text-yellow-500': book.status === 'borrowed',
                      'text-red-500': book.status === 'Overdue',
                    }"
                  >
                    <template v-if="book.status === 'returned'">&#10004;</template>
                    <template v-else-if="book.status === 'borrowed'">&#9888;</template>
                    <template v-else-if="book.status === 'Overdue'">&#10006;</template>
                  </span>
                  <span>{{ book.status }}</span>
                </span>
              </td>
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

interface Book {
  title: string
  borrowDate: string
  returnDeadline: string
  status: 'returned' | 'borrowed' | 'Overdue'
}

interface StudentData {
  name: string
  email: string
}

const stats = ref({
  totalBorrowedBooks: 0,
  pendingReturnBooks: 0,
  returnedBooks: 0,
  incomingBookName: '',
  returnDeadline: '',
  deadlineStatus: '',
  incomingBookStatus: '',
})
const bookLendingDetails = ref<Book[]>([])
const studentData = ref<StudentData | null>(null)

onMounted(async () => {
  try {
    const savedStudentData = localStorage.getItem('StudentData')
    if (savedStudentData) {
      studentData.value = JSON.parse(savedStudentData)
    }
    const response = await userGet('/student-dashboard')
    stats.value = response.data

    const currentDate = new Date().toISOString().slice(0, 10)

    const bookLendingResponse = await userGet('/student-view-borrowed-books')
    if (bookLendingResponse.data && Array.isArray(bookLendingResponse.data.borrowedBooks)) {
      bookLendingDetails.value = bookLendingResponse.data.borrowedBooks.map((book: any) => ({
        title: book.book_title,
        borrowDate: book.borrowed_date,
        returnDeadline: book.return_date,
        status: book.return_status === 'borrowed' && new Date(book.return_date) < new Date(currentDate) ? 'Overdue' : book.return_status,
      }))

      // Find the most overdue book among borrowed books
      const overdueBooks = bookLendingDetails.value.filter((book) => book.status === 'Overdue')
      if (overdueBooks.length > 0) {
        const mostOverdueBook = overdueBooks.reduce((prev, current) =>
          new Date(prev.returnDeadline) < new Date(current.returnDeadline) ? prev : current
        )
        stats.value.incomingBookName = mostOverdueBook.title
        stats.value.returnDeadline = mostOverdueBook.returnDeadline
        stats.value.deadlineStatus = 'Overdue'
      } else {
        // Find the upcoming deadline among borrowed books
        const borrowedBooks = bookLendingDetails.value.filter((book) => book.status === 'borrowed')
        if (borrowedBooks.length > 0) {
          const upcomingBook = borrowedBooks.reduce((prev, current) =>
            new Date(prev.returnDeadline) > new Date(current.returnDeadline) ? prev : current
          )
          stats.value.incomingBookName = upcomingBook.title
          stats.value.returnDeadline = upcomingBook.returnDeadline
          stats.value.deadlineStatus = 'Upcoming'
        } else {
          stats.value.incomingBookName = ''
          stats.value.returnDeadline = ''
          stats.value.deadlineStatus = ''
        }
      }
    } else {
      console.error('Invalid response data format for /student-view-borrowed-books')
    }
  } catch (error) {
    console.error('Error fetching book lending stats:', error)
  }
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
  background-color: var(--bg-color);
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
