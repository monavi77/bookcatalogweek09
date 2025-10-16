import React, { useEffect, useState } from "react";
import Book from "./components/Book";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    url: "",
  });

  useEffect(() => {
    fetch("/data/books.json")
      .then((res) => res.json())
      .then((json) =>
        setBooks(
          json.map((b) => ({
            ...b,
            selected: false,
          }))
        )
      );
  }, []);

  // Handle clicking on a book → only one selected at a time
  const handleSelect = (id) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => ({
        ...b,
        selected: b.isbn13 === id ? !b.selected : false,
      }))
    );
  };

  const handleDelete = () => {
    setBooks((prevBooks) => prevBooks.filter((b) => !b.selected));
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const newBook = {
      isbn13: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      url: formData.url,
      image: formData.url || "https://via.placeholder.com/150x200",
      selected: false,
    };

    setBooks((prev) => [...prev, newBook]);
    setFormData({ title: "", author: "", url: "" });
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="app">
      <header className="header">
        <img src="logo.svg" alt="Brand Logo" className="logo" />
        <h1>Elf Book Catalog</h1>
      </header>

      <main className="content">
        <div className="button-column">
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add
          </button>
          <button
            className="update-btn"
            onClick={() => alert("Update feature coming soon!")}
          >
            Update
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>

        <div className="grid">
          {books.map((book) => (
            <Book
              key={book.isbn13}
              id={book.isbn13}
              title={book.title}
              price={book.price}
              image={book.image}
              url={book.url}
              selected={book.selected}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Elf Book Catalog. All rights reserved.</p>
      </footer>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add a New Book</h2>
            <form onSubmit={handleAdd}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Author:
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Cover URL:
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                />
              </label>

              <div className="modal-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
