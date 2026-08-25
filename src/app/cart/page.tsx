"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

const LBP_RATE = 90000;

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalUsd = getTotal();
  const totalLbp = totalUsd * LBP_RATE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);

    try {
      // In a real app, send to API first
      // const res = await fetch('/api/orders', { method: 'POST', ... })
      
      const orderSummary = items.map(item => 
        `- ${item.title} (الكمية: ${item.quantity}) = $${(item.price * item.quantity).toFixed(2)}`
      ).join('%0A');

      const message = `طلب جديد من متجر خطوة:%0A%0A` +
        `الاسم: ${name}%0A` +
        `رقم الهاتف: ${phone}%0A` +
        (notes ? `ملاحظات: ${notes}%0A%0A` : `%0A`) +
        `المنتجات:%0A${orderSummary}%0A%0A` +
        `الإجمالي: $${totalUsd.toFixed(2)} (${totalLbp.toLocaleString()} ل.ل)`;

      const whatsappUrl = `https://wa.me/9613578260?text=${message}`;
      
      window.open(whatsappUrl, '_blank');
      clearCart();
    } catch (error) {
      console.error("Error submitting order", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container section">
        <h1 className="section__title" style={{ marginBottom: "2rem" }}>السلة</h1>
        <div className="empty-state">
          <svg style={{ color: "var(--gold)", margin: "0 auto 1rem" }} width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h2 className="empty-state__title">سلة المشتريات فارغة</h2>
          <p className="empty-state__text">لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
          <Link href="/books" className="btn btn--primary">
            تصفح الكتب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section__title" style={{ marginBottom: "2rem" }}>السلة</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.bookId} className="cart-item">
              <div className="cart-item__image">
                <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="cart-item__details">
                <h3 className="cart-item__title">{item.title}</h3>
                <div className="cart-item__price">${item.price.toFixed(2)}</div>
                
                <div className="cart-item__actions">
                  <div className="quantity-selector" style={{ marginBottom: 0 }}>
                    <button className="quantity-btn" onClick={() => updateQuantity(item.bookId, item.quantity - 1)}>-</button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(item.bookId, item.quantity + 1)}>+</button>
                  </div>
                  
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.bookId)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    إزالة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary__title">ملخص الطلب</h2>
          
          <div className="cart-summary__row">
            <span>المجموع الفرعي</span>
            <span style={{ fontFamily: "var(--font-latin)" }}>${totalUsd.toFixed(2)}</span>
          </div>
          
          <div className="cart-summary__row cart-summary__row--total">
            <span>الإجمالي</span>
            <div style={{ textAlign: "left", fontFamily: "var(--font-latin)" }}>
              <div>${totalUsd.toFixed(2)}</div>
              <div style={{ fontSize: "0.9rem", color: "var(--gray)", fontWeight: "normal" }}>
                {totalLbp.toLocaleString()} ل.ل
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--gold)" }}>بيانات التواصل</h3>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">الاسم الكامل *</label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">رقم الهاتف *</label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes" className="form-label">ملاحظات (اختياري)</label>
              <textarea
                id="notes"
                className="form-input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={isSubmitting || items.length === 0}
              style={{ marginTop: "1rem", backgroundColor: "#25D366", color: "white" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem', marginLeft: '0.5rem' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              إرسال الطلب عبر واتساب
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
