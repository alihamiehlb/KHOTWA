import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { books, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddToCartSection } from "./AddToCartSection";

const LBP_RATE = 90000;

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const bookId = parseInt(resolvedParams.id, 10);
  let book = null;
  
  if (isNaN(bookId)) {
    notFound();
  }

  try {
    const result = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        price: books.price,
        description: books.description,
        imageUrl: books.imageUrl,
        available: books.available,
        category: categories.name,
        isbn: books.isbn,
        publisher: books.publisher,
        pages: books.pages
      })
      .from(books)
      .leftJoin(categories, eq(books.categoryId, categories.id))
      .where(eq(books.id, bookId));

    if (result.length > 0) {
      book = result[0];
    }
  } catch (error) {
    console.error("Database error:", error);
    // Dummy fallback
    if (resolvedParams.id === "1") {
      book = {
        id: 1,
        title: "كتاب تجريبي",
        author: "مؤلف تجريبي",
        price: "10.00",
        imageUrl: "/placeholder.jpg",
        category: "رواية",
        available: true,
        description: "هذا نص تجريبي لوصف الكتاب. يمكن أن يحتوي على تفاصيل حول القصة، الشخصيات، والأحداث الرئيسية."
      };
    }
  }

  if (!book) {
    notFound();
  }

  const priceNum = Number(book.price);

  return (
    <div className="container section">
      <nav className="breadcrumb">
        <Link href="/">الرئيسية</Link> &gt;
        <Link href="/books">الكتب</Link> &gt;
        <span>{book.title}</span>
      </nav>

      <div className="book-details">
        <div className="book-details__image-wrapper">
          <Image
            src={book.imageUrl || "/placeholder.jpg"}
            alt={book.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="book-details__info">
          <span className="book-card__badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
            {book.category}
          </span>
          <h1 className="book-details__title">{book.title}</h1>
          <h2 className="book-details__author">{book.author}</h2>
          
          <div className="book-card__price-container" style={{ marginBottom: '2rem' }}>
            <div className="price-usd" style={{ fontSize: '2rem' }}>${priceNum.toFixed(2)}</div>
            <div className="price-lbp" style={{ fontSize: '1.2rem' }}>
              {(priceNum * LBP_RATE).toLocaleString()} ل.ل
            </div>
          </div>

          <p className="book-details__description">
            {book.description || "لا يوجد وصف متاح لهذا الكتاب."}
          </p>

          <div className="book-details__meta">
            <div className="book-details__meta-label">حالة التوفر:</div>
            <div className="book-details__meta-value" style={{ color: book.available ? 'var(--gold)' : 'var(--error)' }}>
              {book.available ? 'متوفر' : 'غير متوفر'}
            </div>
            
            <div className="book-details__meta-label">الفئة:</div>
            <div className="book-details__meta-value">{book.category}</div>
          </div>

          {book.available ? (
            <AddToCartSection book={{
              id: book.id,
              title: book.title,
              price: priceNum,
              imageUrl: book.imageUrl || "/placeholder.jpg"
            }} />
          ) : (
            <button className="btn btn--primary" disabled style={{ width: 'fit-content' }}>
              المنتج غير متوفر حالياً
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
