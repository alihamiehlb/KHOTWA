"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";

type MinimalBook = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
};

export function AddToCartSection({ book }: { book: MinimalBook }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAdd = () => {
    addToCart({
      bookId: String(book.id),
      title: book.title,
      price: book.price,
      quantity,
      imageUrl: book.imageUrl,
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div>
      <div className="quantity-selector">
        <span className="book-details__meta-label">الكمية:</span>
        <button className="quantity-btn" onClick={handleDecrease}>-</button>
        <span className="quantity-display">{quantity}</span>
        <button className="quantity-btn" onClick={handleIncrease}>+</button>
      </div>

      <button className="btn btn--primary" onClick={handleAdd} style={{ width: '100%', maxWidth: '300px' }}>
        إضافة إلى السلة
      </button>

      {showSuccess && (
        <div style={{ marginTop: '1rem', color: 'var(--gold)', fontWeight: '500' }}>
          تمت إضافة الكتاب إلى السلة بنجاح!
        </div>
      )}
    </div>
  );
}
