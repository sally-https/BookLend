<template>
  <div class="library-container">
    <div class="header">
      <h1 class="library-title">Library</h1>
      <div class="search-bar">
        <input v-model="searchQuery" type="text" placeholder="Explore books..." class="search-input" @keyup.enter="searchBooks" />
        <button class="scan-button" @click="startScan">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="cursor: pointer; margin-right: 0.5rem">
            <path
              fill="currentColor"
              d="M4 6h2v12H4zm3 0h1v12H7zm2 0h3v12H9zm4 0h1v12h-1zm3 0h2v12h-2zm3 0h1v12h-1zM2 4v4H0V4a2 2 0 0 1 2-2h4v2zm20-2a2 2 0 0 1 2 2v4h-2V4h-4V2zM2 16v4h4v2H2a2 2 0 0 1-2-2v-4zm20 4v-4h2v4a2 2 0 0 1-2 2h-4v-2z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="loading-spinner">
      <div class="book-spinner"></div>
    </div>
    <div v-else class="book-shelf">
      <div v-for="book in paginatedBooks" :key="book.id" class="book-card" @click="showBookDetails(book)">
        <div class="book-cover">
          <img :src="book.book_image_url" alt="Book Cover" class="cover-image" />
          <div class="borrow-button" @click.stop="borrowBook(book)" :disabled="book.quantity === 0">
            {{ book.quantity === 0 ? 'Out of Stock' : 'Borrow' }}
          </div>
        </div>
        <div class="book-details">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">by {{ book.author }}</p>
          <div class="book-meta">
            <span class="book-quantity">Quantity: {{ book.quantity }}</span>
            <span class="book-borrows">Borrows: {{ book.borrowed_count }}</span>
          </div>
          <button class="share-button" @click.stop="shareBook(book)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-if="totalPages > 1" class="pagination">
      <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="{ active: currentPage === page }">
        {{ page }}
      </button>
    </div>
    <div v-if="showBarcodeReader" class="barcode-reader-overlay">
      <div class="barcode-reader-container">
        <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
        <button class="close-button" @click="closeBarcodeReader">Close</button>
      </div>
    </div>
    <div v-if="selectedBook" class="book-details-overlay" @click.self="closeBookDetails">
      <div class="book-details-container">
        <div class="book-details-cover">
          <img :src="selectedBook.book_image_url" alt="Book Cover" class="details-cover-image" />
        </div>
        <div class="book-details-content">
          <h2 class="book-details-title">{{ selectedBook.title }}</h2>
          <p class="book-details-author">by {{ selectedBook.author }}</p>
          <p class="book-details-description">{{ selectedBook.description }}</p>
          <div class="book-details-meta">
            <span class="book-details-quantity">Quantity: {{ selectedBook.quantity }}</span>
            <span class="book-details-borrows">Borrows: {{ selectedBook.borrowed_count }}</span>
          </div>
          <div class="book-details-actions">
            <button class="borrow-button" @click="borrowBook(selectedBook)" :disabled="selectedBook.quantity === 0">
              {{ selectedBook.quantity === 0 ? 'Out of Stock' : 'Borrow' }}
            </button>
            <button class="share-button" @click="shareBook(selectedBook)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
                />
              </svg>
            </button>
          </div>
        </div>
        <button class="close-button" @click="closeBookDetails">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userGet, userPost } from '@/plugins/http'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import Swal from 'sweetalert2'

interface Book {
  id: number
  title: string
  author: string
  description: string
  quantity: number
  book_image_url: string
  barcode: string
  borrowed_count: number
}

const searchQuery = ref('')
const isLoading = ref(true)
const books = ref<Book[]>([])
const showBarcodeReader = ref(false)
const selectedBook = ref<Book | null>(null)
const currentPage = ref(1)
const perPage = 12

const filteredBooks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (query === '') {
    return books.value
  } else {
    return books.value.filter(
      (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query) || book.id.toString().includes(query)
    )
  }
})

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / perPage))

const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * perPage
  const endIndex = startIndex + perPage
  return filteredBooks.value.slice(startIndex, endIndex)
})

const searchBooks = () => {
  currentPage.value = 1
}

const startScan = () => {
  showBarcodeReader.value = true
}

const onDecode = (result: string) => {
  searchQuery.value = result
  showBarcodeReader.value = false
}

const onLoaded = () => {
  console.log('Barcode scanner loaded')
}

const closeBarcodeReader = () => {
  showBarcodeReader.value = false
}

const showBookDetails = (book: Book) => {
  selectedBook.value = book
}

const closeBookDetails = () => {
  selectedBook.value = null
}

const shareBook = (book: Book) => {
  const barcodeDataUri = book.barcode ? `data:image/png;base64,${book.barcode}` : null

  Swal.fire({
    title: 'Share Book',
    text: `Scan the barcode to share "${book.title}":`,
    imageUrl: barcodeDataUri,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'Book Barcode',
  })
}

const borrowBook = async (book: Book) => {
  if (book.quantity === 0) {
    Swal.fire('Out of Stock', 'This book is currently out of stock.', 'warning')
    return
  }

  const result = await Swal.fire({
    title: 'Confirm Borrow',
    text: `Are you sure you want to borrow "${book.title}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, borrow it!',
    cancelButtonText: 'Cancel',
  })

  if (result.isConfirmed) {
    const { value: days } = await Swal.fire({
      title: 'Select Borrow Duration',
      input: 'number',
      inputLabel: 'Number of days',
      inputPlaceholder: 'Enter the number of days',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter the number of days'
        }
      },
    })

    if (days) {
      try {
        Swal.fire({
          title: 'Borrowing...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const response = await userPost('/student-borrow-book', {
          book_id: book.id,
          days: parseInt(days),
        })

        if (response.data.success) {
          await fetchBooks()
          Swal.fire('Borrowed!', response.data.message, 'success')
        } else {
          Swal.fire('Error', response.data.message, 'error')
        }
      } catch (error) {
        console.error('Error borrowing book:', error)
        Swal.fire('Error', 'An error occurred while borrowing the book.', 'error')
      }
    }
  }
}

onMounted(async () => {
  await fetchBooks()
  isLoading.value = false
})

async function fetchBooks() {
  try {
    const response = await userGet('/view-book-library')
    books.value = response.data.books
  } catch (error) {
    console.error('Error fetching books:', error)
    Swal.fire('Error', 'Failed to fetch books. Please try again later.', 'error')
  }
}
</script>

<style lang="scss" scoped>
.library-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  .library-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .search-bar {
    @media (max-width: 480px) {
      .search-bar {
        flex-direction: column;
        align-items: flex-start;

        .scan-button {
          margin-left: 0;
          margin-top: 0.5rem;
        }
      }
    }
    display: flex;
    align-items: center;

    .search-input {
      width: 100%;
      max-width: 300px; // Set a maximum width
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border: 2px solid #ccc;
      border-radius: 30px;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #007bff;
      }
    }

    .scan-button {
      margin-left: 1rem;
      padding: 0.75rem;
      font-size: 1rem;
      border: none;
      border-radius: 50%;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: darken(#007bff, 10%);
      }
    }
  }
}

.book-shelf {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  perspective: 1000px;
}

.book-card {
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
  animation: bookEntrance 0.8s ease-out;

  &:hover {
    transform: translateY(-5px) rotateX(5deg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  .book-cover {
    position: relative;
    height: 250px;
    overflow: hidden;

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover .cover-image {
      transform: scale(1.05);
    }

    .borrow-button {
      position: absolute;
      bottom: 0.5rem;
      left: 0.5rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      border: none;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: darken(#007bff, 10%);
      }

      &:disabled {
        background-color: #ccc;
        color: #666;
        cursor: not-allowed;
      }
    }
  }

  .book-details {
    padding: 1rem;

    .book-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .book-author {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .book-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .share-button {
      padding: 0.25rem;
      border: none;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #007bff;
      }
    }
  }
}

.barcode-reader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .barcode-reader-container {
    position: relative;
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    animation: fadeIn 0.3s ease-out;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken(#007bff, 10%);
    }
  }
}

.book-details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .book-details-container {
    position: relative;
    background-color: #fff;
    color: #333;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 90%;
    max-height: 90%;
    overflow: auto;
    display: flex;
    gap: 2rem;
    animation: fadeIn 0.3s ease-out;

    @media (prefers-color-scheme: dark) {
      background-color: #333;
      color: #fff;
    }

    .book-details-cover {
      flex: 1;

      .details-cover-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 8px;
      }
    }

    .book-details-content {
      flex: 2;

      .book-details-title {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .book-details-author {
        color: #fff;
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }

      .book-details-description {
        font-size: 1rem;
        line-height: 1.5;
        margin-bottom: 1.5rem;
      }

      .book-details-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
      }

      .book-details-actions {
        display: flex;
        gap: 1rem;

        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: darken(#007bff, 10%);
          }

          @media (prefers-color-scheme: dark) {
            background-color: #60a5fa;

            &:hover {
              background-color: darken(#60a5fa, 10%);
            }
          }
        }
      }
    }
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken(#007bff, 10%);
    }

    @media (prefers-color-scheme: dark) {
      background-color: #60a5fa;

      &:hover {
        background-color: darken(#60a5fa, 10%);
      }
    }
  }
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  .book-spinner {
    width: 80px;
    height: 80px;
    border: 4px solid #ccc;
    border-top-color: #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bookEntrance {
  from {
    opacity: 0;
    transform: translateY(20px) rotateX(-20deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;

  button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken(#007bff, 10%);
    }
  }
}
</style>
