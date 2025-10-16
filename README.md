# Book Catalog App BookLab6

A React app that displays a list of books with their covers, authors, and links to details.  
Users can add new books, select one book at a time, and delete the selected book.  
Includes a responsive grid layout, sticky footer, and a modal form for adding books.

---

## Features

- Header with logo and app title
- Reusable Book component to display each book’s cover, title, and price
- "View More" link opens the book's page in a new browser tab
- Add button opens a modal dialog for entering new book details
- Update button (currently a no-op placeholder)
- Delete button removes the currently selected book
- Clicking a book highlights it (only one can be selected at a time)
- Responsive grid layout for displaying books
- Sticky footer at the bottom of the page
- Modal form includes:
  - Title
  - Author
  - Cover URL
