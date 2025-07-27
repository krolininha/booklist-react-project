import { useState, useEffect } from 'react'
import './App.css'

// Main App component
function App() {
// State for books from API
const [apiBooks, setApiBooks] = useState([]);

// State for API search
const [searchTerm, setSearchTerm] = useState('');
const [isLoading, setIsLoading] = useState(false);

// State for manually added books
const [myBooks, setMyBooks] = useState([]);

const [bookTitle, setBookTitle] = useState('');
const [bookAuthor, setBookAuthor] = useState('');
const [bookYear, setBookYear] = useState('');
const [bookDescription, setBookDescription] = useState('');

// State to track reading status of books
const [bookStatus, setBookStatus] = useState({});

// Function to load random books
const loadInitialBooks = async () => {
setIsLoading(true);

try {
const response = await fetch(
'https://www.googleapis.com/books/v1/volumes?q=programming&maxResults=6'
);
const data = await response.json();

if (data.items) {
const formattedBooks = data.items.map(book => ({
id: book.id,
title: book.volumeInfo.title || 'No Title',
author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
year: book.volumeInfo.publishedDate || 'Unknown Year',
description: book.volumeInfo.description || 'No description available',
coverImage: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'
}));

setApiBooks(formattedBooks);
}
} catch (error) {
console.error('Error loading initial books:', error);
}

setIsLoading(false);
};

// Function to search books from Google Books API
const searchBooks = async (e) => {
e.preventDefault();

if (!searchTerm.trim()) {
alert('Please enter a search term!');
return;
}

setIsLoading(true);

try {
const response = await fetch(
`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=6`
);
const data = await response.json();

if (data.items) {
const formattedBooks = data.items.map(book => ({
id: book.id,
title: book.volumeInfo.title || 'No Title',
author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
year: book.volumeInfo.publishedDate || 'Unknown Year',
description: book.volumeInfo.description || 'No description available',
coverImage: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'
}));

setApiBooks(formattedBooks);
}
} catch (error) {
console.error('Error fetching books:', error);
alert('Error searching books. Please try again.');
}

setIsLoading(false);
};

// Function to add API book to personal list
const addApiBookToMyList = (book) => {
  // Check if book already exists in myBooks
  const bookExists = myBooks.some(myBook => myBook.id === book.id);
  
  if (!bookExists) {
    setMyBooks([...myBooks, book]);
    alert('Book added to your personal list!');
  } else {
    alert('Book already in your list!');
  }
};

// Function to toggle book reading status
const toggleBookStatus = (bookId) => {
setBookStatus(prev => ({
...prev,
[bookId]: prev[bookId] === 'read' ? 'want-to-read' : 'read'
}));
};

// Function to add new book
const addNewBook = (e) => {
e.preventDefault();

if (bookTitle && bookAuthor) {
const newBook = {
id: Date.now(),
title: bookTitle,
author: bookAuthor,
year: bookYear || 'Not specified',
description: bookDescription || 'No description',
coverImage: 'https://via.placeholder.com/150'
};

setMyBooks([...myBooks, newBook]);

// Clear form fields
setBookTitle('');
setBookAuthor('');
setBookYear('');
setBookDescription('');
} else {
alert('Please fill in Title and Author!');
}
};

// Load initial books when page starts
useEffect(() => {
loadInitialBooks();
}, []);

return (
  <div className="App">
    <header>
      <h1>📖 My BookList 📖</h1>
      <p>Welcome to my reading collection!</p>
    </header>

    <main>
      <section>
        <h2>Books from API</h2>

        {/* Search form */}
        <form onSubmit={searchBooks} className="search-form">
          <input 
            type="text" 
            placeholder="Search for books..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" disabled={isLoading} className="search-button">
            {isLoading ? 'Searching...' : 'Search Books'}
          </button>
        </form>

        {/* Books results */}
        <div className="books-container">
          {apiBooks.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.coverImage} alt={book.title} />
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Year:</strong> {book.year}</p>
              <p className="description">
              <strong>Description:</strong> {
                book.description && book.description.length > 100 
                  ? book.description.substring(0, 100) + '...' 
                  : book.description || 'No description available'
              }
            </p>

              {/* Reading Status Button */}
              <button 
                onClick={() => toggleBookStatus(book.id)}
                className={`status-button ${bookStatus[book.id] || 'want-to-read'}`}
              >
                {bookStatus[book.id] === 'read' ? '✅ Already Read' : '📖 Want to Read'}
              </button>

              {/* NEW: Add to My List Button */}
              <button 
                onClick={() => addApiBookToMyList(book)}
                className="add-to-list-button"
              >
                ➕ Add to My List
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>My Books</h2>
        <div className="books-container">
          {myBooks.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.coverImage} alt={book.title} />
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Year:</strong> {book.year}</p>
              <p className="description">
                <strong>Description:</strong> {
                  book.description && book.description.length > 100 
                    ? book.description.substring(0, 100) + '...' 
                    : book.description || 'No description available'
                }
              </p>
              
              {/* Reading Status Button */}
              <button 
                onClick={() => toggleBookStatus(book.id)}
                className={`status-button ${bookStatus[book.id] || 'want-to-read'}`}
              >
                {bookStatus[book.id] === 'read' ? '✅ Already Read' : '📖 Want to Read'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Add New Book</h2>
        <form className="add-book-form" onSubmit={addNewBook}>
          <input 
            type="text" 
            placeholder="Book Title"
            className="form-input"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Author Name"
            className="form-input"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Year (optional)"
            className="form-input"
            value={bookYear}
            onChange={(e) => setBookYear(e.target.value)}
          />
          <textarea 
            placeholder="Description (optional)"
            className="form-input"
            rows="3"
            value={bookDescription}
            onChange={(e) => setBookDescription(e.target.value)}
          />
          <button type="submit" className="form-button">
            Add Book
          </button>
        </form>
      </section>
    </main>
  </div>
)
}

export default App