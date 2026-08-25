'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  available: boolean;
  coverImage?: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; bookId: string | null }>({
    isOpen: false,
    bookId: null
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/admin/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch (error) {
      console.error('Error fetching books', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.bookId) return;

    try {
      const res = await fetch(`/api/admin/books/${deleteModal.bookId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBooks(books.filter(b => b.id !== deleteModal.bookId));
        setDeleteModal({ isOpen: false, bookId: null });
      }
    } catch (error) {
      console.error('Error deleting book', error);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.includes(searchQuery) || 
    book.author.includes(searchQuery)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="ابحث عن كتاب أو مؤلف..."
          className="admin-input admin-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Link href="/admin/books/new" className="admin-btn">
          إضافة كتاب جديد
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>جاري التحميل...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>صورة</th>
                  <th>العنوان</th>
                  <th>المؤلف</th>
                  <th>التصنيف</th>
                  <th>السعر</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <div style={{ width: '40px', height: '60px', backgroundColor: '#333' }}>
                          {book.coverImage && (
                            <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                      </td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>${book.price.toFixed(2)}</td>
                      <td>
                        <span className={`admin-badge ${book.available ? 'status-completed' : 'status-cancelled'}`}>
                          {book.available ? 'متوفر' : 'غير متوفر'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Link href={`/admin/books/${book.id}/edit`} className="admin-btn admin-btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>
                            تعديل
                          </Link>
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, bookId: book.id })}
                            className="admin-btn admin-btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                      لا توجد كتب مطابقة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteModal.isOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3 style={{ marginTop: 0, color: '#D4AF37' }}>تأكيد الحذف</h3>
            <p>هل أنت متأكد من حذف هذا الكتاب؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="admin-modal-actions">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, bookId: null })}
                className="admin-btn admin-btn-outline"
              >
                إلغاء
              </button>
              <button 
                onClick={handleDelete}
                className="admin-btn"
                style={{ backgroundColor: '#DC3545', color: '#fff' }}
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
