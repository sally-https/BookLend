<template>
  <div class="min-h-screen py-10 page">
    <div class="main-grid gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- main col -->
      <div class="main-col">
        <div class="flex flex-col gap-8 h-full">
          <!-- welcome message -->
          <div class="rounded-lg border-2 p-6 bg-opacity-10 text-color welcome-message">
            <h1 class="text-3xl font-bold">Welcome, Admin! 📚</h1>
            <p class="mt-2 text-lg">Manage the library and monitor book lending activities.</p>
          </div>

          <!-- four cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 four-cards-wrap">
            <div class="rounded-lg border-2 p-6 stat-card">
              <div class="flex items-center justify-center h-16 w-16 rounded-full icon-container mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-color" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                  />
                </svg>
              </div>
              <div class="card-content">
                <h3 class="text-xl font-semibold text-color">Total Students</h3>
                <p class="text-3xl font-bold text-color mt-2">{{ totalStudents }}</p>
              </div>
            </div>
            <div class="rounded-lg border-2 p-6 stat-card">
              <div class="flex items-center justify-center h-16 w-16 rounded-full icon-container mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-color" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                  />
                </svg>
              </div>
              <div class="card-content">
                <h3 class="text-xl font-semibold text-color">Total Books</h3>
                <p class="text-3xl font-bold text-color mt-2">{{ totalBooks }}</p>
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
                <h3 class="text-xl font-semibold text-color">Total Borrowed</h3>
                <p class="text-3xl font-bold text-color mt-2">{{ totalBorrowedBooks }}</p>
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
                <h3 class="text-xl font-semibold text-color">Total Returned</h3>
                <p class="text-3xl font-bold text-color mt-2">{{ totalReturnedBooks }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- recently borrowed books table -->
      <div class="rounded-lg border-2 border-color p-6 mt-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-color">Recently Borrowed Books</h2>
        </div>
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="border-b-2 border-color">
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Users ID</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Book Title</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrow Date</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Return Deadline</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="book in recentBorrowedBooks"
              :key="book.borrowed_book_id"
              class="border-b border-color hover:bg-gray-100 transition-colors duration-300"
            >
              <td class="px-4 py-4 font-medium text-color">{{ book.student_id }}</td>
              <td class="px-4 py-4 text-color">{{ book.book_name }}</td>
              <td class="px-4 py-4 text-color">{{ book.borrowed_date }}</td>
              <td class="px-4 py-4 text-color">{{ book.return_date }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- recently returned books table -->
      <div class="rounded-lg border-2 border-color p-6 mt-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-color">Recently Returned Books</h2>
        </div>
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="border-b-2 border-color">
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrower Name</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Book Title</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrow Date</th>
              <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Return Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="book in recentReturnedBooks"
              :key="book.borrowed_book_id"
              class="border-b border-color hover:bg-gray-100 transition-colors duration-300"
            >
              <td class="px-4 py-4 font-medium text-color">{{ book.borrower_name }}</td>
              <td class="px-4 py-4 text-color">{{ book.book_name }}</td>
              <td class="px-4 py-4 text-color">{{ book.borrowed_date }}</td>
              <td class="px-4 py-4 text-color">{{ book.return_date }}</td>
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

interface BorrowedBook {
  borrowed_book_id: number
  student_id: number
  borrower_name: string
  book_name: string
  borrowed_date: string
  return_date: string
}

const totalStudents = ref(0)
const totalBooks = ref(0)
const totalBorrowedBooks = ref(0)
const totalReturnedBooks = ref(0)
const recentBorrowedBooks = ref<BorrowedBook[]>([])
const recentReturnedBooks = ref<BorrowedBook[]>([])

const fetchDashboardData = async () => {
  try {
    const response = await userGet('/admin-dashboard')
    const {
      totalStudents: students,
      totalBooks: books,
      totalBorrowedBooks: borrowedBooks,
      totalReturnedBooks: returnedBooks,
    } = response.data
    totalStudents.value = students
    totalBooks.value = books
    totalBorrowedBooks.value = borrowedBooks
    totalReturnedBooks.value = returnedBooks
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

const fetchRecentBorrowedBooks = async () => {
  try {
    const response = await userGet('/admin-view-borrowed-books')
    recentBorrowedBooks.value = response.data.borrowedBooks.slice(0, 3).map((book: any) => ({
      borrowed_book_id: book.id,
      borrower_name: book.borrower_name,
      student_id: book.student_id,
      book_name: book.book_name,
      borrowed_date: book.borrowed_date,
      return_date: book.return_date,
    }))
  } catch (error) {
    console.error('Error fetching recent borrowed books:', error)
  }
}

const fetchRecentReturnedBooks = async () => {
  try {
    const response = await userGet('/admin-view-returned-books')
    recentReturnedBooks.value = response.data.returnedBooks.slice(0, 3).map((book: any) => ({
      borrowed_book_id: book.borrowed_book_id,
      borrower_name: book.borrower_name,
      book_name: book.book_name,
      borrowed_date: book.borrowed_date,
      return_date: book.return_date,
    }))
  } catch (error) {
    console.error('Error fetching recent returned books:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
  fetchRecentBorrowedBooks()
  fetchRecentReturnedBooks()
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
