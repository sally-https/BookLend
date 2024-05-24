<template>
  <div class="library-container">
    <div class="header">
      <h1 class="library-title">Book Library</h1>
      <div class="search-bar">
        <input v-model="searchQuery" type="text" placeholder="Search books..." class="search-input" @keyup.enter="searchBooks" />
        <button class="add-button" @click="addBook">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Book
        </button>
        <button class="download-button" @click="downloadAllBarcodes">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
          Download All Barcodes
        </button>
      </div>
    </div>
    <div class="book-shelf">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card" @click="confirmDeleteBook(book.id)">
        <div class="book-cover">
          <img :src="book.book_image_url" alt="Book Cover" class="cover-image" />
        </div>
        <div class="book-details">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">by {{ book.author }}</p>
          <p class="book-quantity">Quantity: {{ book.quantity }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import { userGet, userPost, userDelete } from '@/plugins/http'
import { jsPDF } from 'jspdf'
import JsBarcode from 'jsbarcode'

const addBook = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Add Book',
    html:
      '<div style="display: flex; flex-direction: column; gap: 20px;">' +
      '<div style="display: flex; flex-direction: column; gap: 8px;">' +
      '<label for="swal-input1" style="font-weight: bold; color: #333;">Title</label>' +
      '<input id="swal-input1" class="swal2-input" placeholder="Enter book title" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;">' +
      '</div>' +
      '<div style="display: flex; flex-direction: column; gap: 8px;">' +
      '<label for="swal-input2" style="font-weight: bold; color: #333;">Author</label>' +
      '<input id="swal-input2" class="swal2-input" placeholder="Enter author name" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;">' +
      '</div>' +
      '<div style="display: flex; flex-direction: column; gap: 8px;">' +
      '<label for="swal-input3" style="font-weight: bold; color: #333;">Quantity</label>' +
      '<input id="swal-input3" class="swal2-input" placeholder="Enter quantity" type="number" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;">' +
      '</div>' +
      '<div style="display: flex; flex-direction: column; gap: 8px;">' +
      '<label for="swal-input4" style="font-weight: bold; color: #333;">Book Image URL</label>' +
      '<input id="swal-input4" class="swal2-input" placeholder="Enter image URL" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;">' +
      '</div>' +
      '</div>',
    focusConfirm: false,
    preConfirm: () => {
      return {
        title: document.getElementById('swal-input1').value,
        author: document.getElementById('swal-input2').value,
        quantity: parseInt(document.getElementById('swal-input3').value),
        book_image_url: document.getElementById('swal-input4').value,
      }
    },
  })

  if (formValues) {
    try {
      const response = await userPost('/admin-add-book', formValues)
      console.log(response.data)
      if (response.status === 201) {
        fetchBooks()
        Swal.fire('Success', 'Book added successfully', 'success')
      } else {
        Swal.fire('Error', 'Failed to add book', 'error')
      }
    } catch (error) {
      console.error(error)
      Swal.fire('Error', 'Failed to add book', 'error')
    }
  }
}

const books = ref([])
const searchQuery = ref('')

const fetchBooks = async () => {
  try {
    const response = await userGet('/admin-view-books')
    if (response.status === 200) {
      books.value = response.data.books
    } else {
      throw new Error(`Failed to fetch books: ${response.status}`)
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', error.message, 'error')
  }
}

const filteredBooks = computed(() => {
  if (searchQuery.value.trim() === '') {
    return books.value
  } else {
    const query = searchQuery.value.toLowerCase()
    return books.value.filter(
      (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query) || book.id.toString().includes(query)
    )
  }
})

const deleteBook = async (bookId) => {
  try {
    const response = await userDelete(`/books/${bookId}`)
    if (response.status === 200) {
      fetchBooks()
      Swal.fire('Success', 'Book deleted successfully', 'success')
    } else {
      Swal.fire('Error', 'Failed to delete book', 'error')
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'Failed to delete book', 'error')
  }
}

const confirmDeleteBook = (bookId) => {
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to delist this book?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delist it!',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteBook(bookId)
    }
  })
}

const booksWithBarcodes = computed(() => {
  return books.value.map((book) => {
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, book.id, { format: 'CODE128' })
    const barcodeDataUri = canvas.toDataURL('image/png')
    return {
      ...book,
      barcode: barcodeDataUri.split(',')[1],
    }
  })
})

const downloadAllBarcodes = () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const barcodeWidth = 80
  const barcodeHeight = 30
  const padding = 1
  const lineWidth = 0.5
  const titleMargin = 0 // Adjust this value to change the spacing between the title and barcode

  let x = padding
  let y = padding
  let columnCount = 0

  booksWithBarcodes.value.forEach((book, index) => {
    const barcodeDataUri = `data:image/png;base64,${book.barcode}`
    const barcodeImage = new Image()
    barcodeImage.src = barcodeDataUri

    barcodeImage.onload = () => {
      const imgWidth = barcodeImage.width
      const imgHeight = barcodeImage.height
      const imgRatio = imgWidth / imgHeight

      const scaledWidth = barcodeWidth
      const scaledHeight = scaledWidth / imgRatio

      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(lineWidth)
      doc.rect(x, y, barcodeWidth, barcodeHeight + 15, 'D') // Reduced height for the rectangle
      doc.setFontSize(10)
      doc.text(book.title, x + barcodeWidth / 2, y + 5, null, null, 'center') // Reduced top margin for the title
      doc.addImage(barcodeDataUri, 'PNG', x + 5, y + 6 + titleMargin, scaledWidth - 10, scaledHeight - 18) // Reduced top margin for the barcode, adjusted with titleMargin

      x += barcodeWidth + padding

      columnCount++
      if (columnCount >= Math.floor((pageWidth - padding * 2) / (barcodeWidth + padding))) {
        columnCount = 0
        x = padding
        y += barcodeHeight + padding + 15 // Reduced height for the next row
      }

      if (y + barcodeHeight + padding + 15 > pageHeight - padding) {
        // Reduced height for the new page check
        doc.addPage()
        x = padding
        y = padding
      }

      if (index === books.value.length - 1) {
        doc.save('all_barcodes.pdf')
      }
    }
  })
}

fetchBooks()
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

.header {
  .search-bar {
    .add-button,
    .download-button {
      display: flex;
      align-items: center;
      margin-left: 1rem;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: none;
      border-radius: 30px;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
      transition: background-color 0.3s ease;

      svg {
        margin-right: 0.5rem;
      }

      &:hover {
        background-color: darken(#007bff, 10%);
      }
    }
  }
}

.book-card {
  cursor: pointer;

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
  }
}
</style>
