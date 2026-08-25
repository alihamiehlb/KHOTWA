import Link from "next/link";
import { BookCard } from "@/components/BookCard";
import { db } from "@/db";
import { books, categories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { Book } from "@/components/BookCard";

export default async function Home() {
  let featuredBooks: Book[] = [];
  try {
    const results = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        price: books.price,
        imageUrl: books.imageUrl,
        available: books.available,
        categoryName: categories.name,
      })
      .from(books)
      .leftJoin(categories, eq(books.categoryId, categories.id))
      .orderBy(desc(books.createdAt))
      .limit(8);

    featuredBooks = results.map((b) => ({
      id: String(b.id),
      title: b.title,
      author: b.author,
      price: Number(b.price),
      imageUrl: b.imageUrl || "/placeholder.jpg",
      category: b.categoryName || "عام",
      available: b.available,
    }));
  } catch (error) {
    console.error("Failed to fetch books:", error);
    featuredBooks = [];
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">
            اكتشف <span>عالم الكتب</span>
          </h1>
          <p className="hero__subtitle">
            مجموعة متنوعة من الكتب الرقمية والمنتجات الثقافية في متناول يدك
          </p>
          <div className="hero__search">
            <Link href="/books" className="btn btn--primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '30px' }}>
              تصفح الكتب
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features__grid">
            <div className="feature">
              <svg className="feature__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3 className="feature__title">دعم العملاء</h3>
            </div>
            <div className="feature">
              <svg className="feature__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <h3 className="feature__title">كتب أصلية</h3>
            </div>
            <div className="feature">
              <svg className="feature__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <h3 className="feature__title">توصيل رقمي سريع</h3>
            </div>
            <div className="feature">
              <svg className="feature__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3 className="feature__title">جودة مضمونة</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section__header">
          <h2 className="section__title">أحدث الكتب</h2>
          <Link href="/books" className="btn btn--secondary">
            عرض الكل
          </Link>
        </div>
        
        <div className="book-grid">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      
      <section className="section container" style={{ textAlign: 'center', backgroundColor: 'var(--charcoal)', padding: '4rem 2rem', borderRadius: '8px', border: '1px solid var(--dark-gold)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>هل تبحث عن كتاب محدد؟</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          إذا لم تجد ما تبحث عنه، يمكنك التواصل معنا وسنقوم بمساعدتك في العثور عليه.
        </p>
        <Link href="/contact" className="btn btn--primary">
          تواصل معنا الآن
        </Link>
      </section>
    </>
  );
}
