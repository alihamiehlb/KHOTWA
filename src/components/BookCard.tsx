"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

const LBP_RATE = 90000;

export type Book = {
  id: string;
  title: string;
  author: string;
  price: number; // in USD
  imageUrl: string;
  category: string;
  available: boolean;
};

export function BookCard({ book }: { book: Book }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (book.available) {
      addToCart({
        bookId: book.id,
        title: book.title,
        price: book.price,
        quantity: 1,
        imageUrl: book.imageUrl,
      });
      // Optionally show a toast here
      alert("تمت الإضافة إلى السلة");
    }
  };

  return (
    <Link href={`/books/${book.id}`} className="book-card">
      <div className="book-card__image-container">
        <Image
          src={book.imageUrl || "/placeholder.jpg"}
          alt={book.title}
          fill
          className="book-card__image"
        />
        {!book.available && (
          <div className="book-card__overlay">غير متوفر</div>
        )}
      </div>
      
      <div className="book-card__content">
        <span className="book-card__badge">{book.category}</span>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        
        <div className="book-card__price-container">
          <div className="price-usd">${book.price.toFixed(2)}</div>
          <div className="price-lbp">
            {(book.price * LBP_RATE).toLocaleString()} ل.ل
          </div>
        </div>
        
        <div className="book-card__actions">
          <button
            className="btn btn--primary btn--block"
            onClick={handleAddToCart}
            disabled={!book.available}
          >
            إضافة إلى السلة
          </button>
          <span className="btn btn--secondary btn--block">
            عرض التفاصيل
          </span>
        </div>
      </div>
    </Link>
  );
}
