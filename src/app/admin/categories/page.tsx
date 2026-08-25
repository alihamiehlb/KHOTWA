'use client';

import React, { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  bookCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAdding(true);
    setError('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (res.ok) {
        setNewCategoryName('');
        fetchCategories(); // Refresh list
      } else {
        const data = await res.json();
        setError(data.message || 'فشل إضافة التصنيف');
      }
    } catch (err) {
      setError('حدث خطأ أثناء الإضافة');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (id: string, bookCount: number) => {
    if (bookCount > 0) {
      alert('لا يمكن حذف تصنيف يحتوي على كتب. يرجى نقل أو حذف الكتب أولاً.');
      return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'فشل الحذف');
      }
    } catch (err) {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <div>
      <div className="admin-card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>إضافة تصنيف جديد</h3>
        {error && <div className="admin-error" style={{ marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '15px' }}>
          <input
            type="text"
            className="admin-input"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="اسم التصنيف..."
            style={{ maxWidth: '400px' }}
            required
          />
          <button type="submit" className="admin-btn" disabled={adding}>
            {adding ? 'جاري الإضافة...' : 'إضافة'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>التصنيفات الحالية</h3>
        {loading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>اسم التصنيف</th>
                  <th>عدد الكتب</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.bookCount}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteCategory(category.id, category.bookCount)}
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          title={category.bookCount > 0 ? "لا يمكن حذف تصنيف يحتوي على كتب" : "حذف التصنيف"}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>لا توجد تصنيفات</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
