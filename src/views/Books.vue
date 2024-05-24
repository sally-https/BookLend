<template>
  <div class="min-h-screen py-10">
    <div class="main-grid gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Borrowed Books -->
      <div class="rounded-lg border-2 p-6 bg-opacity-10 text-color">
        <h2 class="text-2xl font-semibold text-color mb-4">Currently Borrowed Books</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left table-auto">
            <thead>
              <tr class="border-b-2 border-color">
                <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Book Title</th>
                <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrow Date</th>
                <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Return Deadline</th>
                <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Status</th>
                <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="book in currentlyBorrowedBooks"
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
                      'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700':
                        book.status === 'borrowed',
                      'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700':
                        book.status === 'Overdue',
                    }"
                  >
                    <span
                      class="mr-2"
                      :class="{
                        'text-yellow-500': book.status === 'borrowed',
                        'text-red-500': book.status === 'Overdue',
                      }"
                    >
                      <template v-if="book.status === 'borrowed'">&#9888;</template>
                      <template v-else-if="book.status === 'Overdue'">&#10006;</template>
                    </span>
                    <span>{{ book.status }}</span>
                  </span>
                </td>
                <td class="px-4 py-4">
                  <button
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 uppercase tracking-wider font-semibold text-sm"
                    @click="returnBook(book)"
                  >
                    Return Book
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Returned Books -->
      <div class="rounded-lg border-2 p-6 bg-opacity-10 text-color mt-5">
        <h2 class="text-2xl font-semibold text-color mb-4">Returned Books</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left table-auto">
            <thead>
              <tr class="border-b-2 border-color">
                <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Book Title</th>
                <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Borrow Date</th>
                <th class="px-4 py-3 uppercase tracking-wider font-semibold text-sm text-color">Return Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="book in returnedBooks"
                :key="book.title"
                class="border-b border-color hover:bg-gray-100 transition-colors duration-300"
              >
                <td class="px-4 py-4 font-medium text-color">{{ book.title }}</td>
                <td class="px-4 py-4 text-color">{{ book.borrowDate }}</td>
                <td class="px-4 py-4 text-color">{{ book.returnDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet, userPost } from '@/plugins/http'
import Swal from 'sweetalert2'

interface Book {
  id: number
  title: string
  borrowDate: string
  returnDeadline: string
  status: 'returned' | 'borrowed' | 'Overdue'
  returnDate?: string
}

const currentlyBorrowedBooks = ref<Book[]>([])
const returnedBooks = ref<Book[]>([])

const fetchBooks = async () => {
  try {
    const response = await userGet('/student-view-borrowed-books')
    if (response.data.success && Array.isArray(response.data.borrowedBooks)) {
      const currentDate = new Date().toISOString().slice(0, 10)

      currentlyBorrowedBooks.value = response.data.borrowedBooks
        .filter((book: { return_status: string }) => book.return_status !== 'returned')
        .map((book: any) => ({
          id: book.borrowed_book_id,
          title: book.book_title,
          borrowDate: book.borrowed_date,
          returnDeadline: book.return_date,
          status: new Date(book.return_date) < new Date(currentDate) ? 'Overdue' : 'borrowed',
        }))

      returnedBooks.value = response.data.borrowedBooks
        .filter((book: { return_status: string }) => book.return_status === 'returned')
        .map((book: any) => ({
          id: book.borrowed_book_id,
          title: book.book_title,
          borrowDate: book.borrowed_date,
          returnDate: book.return_date,
        }))
    } else {
      console.error('Invalid response data format for /api/books')
    }
  } catch (error) {
    console.error('Error fetching book data:', error)
  }
}

onMounted(fetchBooks)

const returnBook = async (book: Book) => {
  try {
    const { isConfirmed } = await Swal.fire({
      title: `Return Book: ${book.title}`,
      text: 'Are you sure you want to return this book?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, return it!',
    })

    if (isConfirmed) {
      const { value: returnCode } = await Swal.fire({
        title: 'Enter Return Code',
        input: 'text',
        inputPlaceholder: 'Enter the return code',
        showCancelButton: true,
        confirmButtonText: 'Submit',
      })

      if (returnCode) {
        Swal.fire({
          title: 'Returning Book...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })
        const response = await userPost('/student-return-book', {
          borrowed_book_id: book.id,
          return_code: returnCode,
        })

        if (response.data.success) {
          await fetchBooks()
          Swal.fire('Returned!', response.data.message, 'success')
        } else {
          Swal.fire('Error', response.data.message, 'error')
        }
      }
    }
  } catch (error) {
    console.error('Error returning book:', error)
    Swal.fire('Error', 'Failed to return book', 'error')
  }
}
</script>

<style lang="scss" scoped>
:root {
  --text-color: #1f2937;
  --bg-color: #fff;
  --border-color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #f3f4f6;
    --bg-color: #1f2937;
    --border-color: #6b7280;
  }
}

.page {
  color: var(--text-color);
  background-color: var(--bg-color);
}

.text-color {
  color: var(--text-color);
}

.border-color {
  border-color: var(--border-color);
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
}
</style>
