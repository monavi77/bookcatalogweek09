import React, { useEffect, useState } from "react";
import Book from "./components/Book";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    url: "",
    image: "",
    price: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("books");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBooks(
          parsed.map((b) => ({
            ...b,
            selected: false,
          }))
        );
        return;
      } catch (_) {
        // ignore and fallback to fetch
      }
    }
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

  useEffect(() => {
    if (books && books.length) {
      localStorage.setItem("books", JSON.stringify(books));
    } else {
      localStorage.removeItem("books");
    }
  }, [books]);

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

    if (editingId) {
      setBooks((prev) =>
        prev.map((b) =>
          b.isbn13 === editingId
            ? {
                ...b,
                title: formData.title,
                author: formData.author,
                url: formData.url,
                image: formData.image || b.image || "https://via.placeholder.com/150x200",
                price: formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : b.price,
                selected: false,
              }
            : b
        )
      );
    } else {
      const newBook = {
        isbn13: Date.now().toString(),
        title: formData.title,
        author: formData.author,
        url: formData.url,
        image: formData.image || "https://via.placeholder.com/150x200",
        price: formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : undefined,
        selected: false,
      };
      setBooks((prev) => [...prev, newBook]);
    }

    setFormData({ title: "", author: "", url: "", image: "", price: "" });
    setEditingId(null);
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
            onClick={() => {
              const selected = books.find((b) => b.selected);
              if (!selected) {
                alert("Please select a book to update.");
                return;
              }
              setEditingId(selected.isbn13);
              setFormData({
                title: selected.title || "",
                author: selected.author || "",
                url: selected.url || "",
                image: selected.image || "",
                price: selected.price ? String(parseFloat(String(selected.price).replace(/[^0-9.]/g, ""))) : "",
              });
              setShowModal(true);
            }}
          >
            Update
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
          <div className="filters" style={{ marginBottom: 16 }}>
          <label>
            Price Filter:
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="all">All</option>
              <option value="lt10">Under $10</option>
              <option value="10to20">$10 - $20</option>
              <option value="gt20">Over $20</option>
            </select>
          </label>
        </div>

        </div>

        
        <div className="grid updt">
          {books
            .filter((book) => {
              if (priceFilter === "all") return true;
              const priceNum = book.price ? parseFloat(String(book.price).replace(/[^0-9.]/g, "")) : null;
              if (priceNum == null || Number.isNaN(priceNum)) return false;
              if (priceFilter === "lt10") return priceNum < 10;
              if (priceFilter === "10to20") return priceNum >= 10 && priceNum <= 20;
              if (priceFilter === "gt20") return priceNum > 20;
              return true;
            })
            .map((book) => (
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
            <h2>{editingId ? "Update Book" : "Add a New Book"}</h2>
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
                />
              </label>
              <label>
                Cover Image URL:
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </label>
              <label>
                Details URL:
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                />
              </label>
              <label>
                Price (number):
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
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

