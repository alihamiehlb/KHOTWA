"use client";

import { useState, useEffect } from "react";
import { BookCard, Book } from "@/components/BookCard";
import { SearchBar } from "@/components/SearchBar";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (response.ok) {
          const data = await response.json();
          const booksList = (data.books || []).map((b: any) => ({
            id: String(b.id),
            title: b.title,
            author: b.author,
            price: Number(b.price),
            imageUrl: b.imageUrl || "/placeholder.jpg",
            category: b.categoryName || "تصنيف عام",
            available: b.available,
          }));
          setBooks(booksList);
          setFilteredBooks(booksList);
        } else {
          // Fallback data if API not ready
          const dummy = [
            { id: "1", title: "الذكاء الاصطناعي من الفهم الى الاحتراف", author: "Khotwa", price: 22, imageUrl: "/books/ai-book.jpeg", category: "تكنولوجيا", available: true },
            { id: "2", title: "الشفرة السرية لصناعة المحتوى", author: "Khotwa", price: 22, imageUrl: "/books/content-book.jpeg", category: "تسويق رقمي", available: true },
          ];
          setBooks(dummy);
          setFilteredBooks(dummy);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredBooks(books);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.category.toLowerCase().includes(lowerQuery)
    );
    setFilteredBooks(filtered);
  };

  return (
    <div className="container section">
      <h1 className="section__title" style={{ marginBottom: "2rem" }}>جميع الكتب</h1>
      
      <div style={{ maxWidth: "600px", marginBottom: "3rem" }}>
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading ? (
        <div className="book-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="book-card" style={{ height: "400px", animation: "pulse 1.5s infinite" }}>
              <div style={{ backgroundColor: "var(--light-gray)", height: "60%" }}></div>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ backgroundColor: "var(--light-gray)", height: "20px", marginBottom: "1rem", width: "50%" }}></div>
                <div style={{ backgroundColor: "var(--light-gray)", height: "24px", marginBottom: "1rem" }}></div>
                <div style={{ backgroundColor: "var(--light-gray)", height: "20px", width: "80%" }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2 className="empty-state__title">لم يتم العثور على كتب</h2>
          <p className="empty-state__text">لا توجد كتب مطابقة لبحثك عن "{searchQuery}"</p>
          <button className="btn btn--secondary" onClick={() => handleSearch("")}>
            عرض جميع الكتب
          </button>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}} />
    </div>
  );
}
