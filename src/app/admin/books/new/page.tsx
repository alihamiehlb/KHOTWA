'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBookPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',
    price: '',
    description: '',
    isbn: '',
    publisher: '',
    pages: '',
    available: true
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data.categories[0].id }));
        }
      })
      .catch(err => console.error('Error fetching categories', err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          pages: formData.pages ? parseInt(formData.pages) : undefined
        }),
      });

      if (!res.ok) {
        throw new Error('فشل إضافة الكتاب');
      }

      const data = await res.json();
      const bookId = data.book.id;

      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        
        await fetch(`/api/admin/books/${bookId}/image`, {
          method: 'POST',
          body: formDataUpload
        });
      }

      router.push('/admin/books');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الكتاب');
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 style={{ color: '#D4AF37', marginTop: 0, marginBottom: '20px' }}>إضافة كتاب جديد</h2>
      
      {error && (
        <div style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#DC3545', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="admin-form-group">
            <label htmlFor="title">العنوان *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="admin-input"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="author">المؤلف *</label>
            <input
              type="text"
              id="author"
              name="author"
              className="admin-input"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="categoryId">التصنيف *</label>
            <select
              id="categoryId"
              name="categoryId"
              className="admin-select"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>اختر التصنيف</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="price">السعر ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              className="admin-input"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="isbn">رقم ISBN (اختياري)</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              className="admin-input"
              value={formData.isbn}
              onChange={handleInputChange}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="publisher">الناشر (اختياري)</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              className="admin-input"
              value={formData.publisher}
              onChange={handleInputChange}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="pages">عدد الصفحات (اختياري)</label>
            <input
              type="number"
              id="pages"
              name="pages"
              className="admin-input"
              value={formData.pages}
              onChange={handleInputChange}
              min="1"
            />
          </div>

          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="available" style={{ margin: '0 0 0 10px', cursor: 'pointer' }}>متوفر في المخزون</label>
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              style={{ width: '20px', height: '20px' }}
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="description">الوصف</label>
          <textarea
            id="description"
            name="description"
            className="admin-textarea"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>

        <div className="admin-form-group">
          <label>صورة الغلاف</label>
          <div className="admin-upload-area">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="image" style={{ cursor: 'pointer', display: 'block', margin: 0 }}>
              {imageFile ? imageFile.name : 'انقر لاختيار صورة الغلاف'}
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ الكتاب'}
          </button>
          <Link href="/admin/books" className="admin-btn admin-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
