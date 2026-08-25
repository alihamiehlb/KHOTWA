'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  outOfStockBooks: number;
  newOrders: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats || { totalBooks: 0, availableBooks: 0, outOfStockBooks: 0, newOrders: 0 });
          setRecentOrders(data.recentOrders || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'جديد': return 'status-new';
      case 'تم التواصل': return 'status-contacted';
      case 'مكتمل': return 'status-completed';
      case 'ملغي': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return <div>جاري تحميل البيانات...</div>;
  }

  return (
    <div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-title">إجمالي الكتب</div>
          <div className="admin-stat-value">{stats?.totalBooks}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">كتب متوفرة</div>
          <div className="admin-stat-value">{stats?.availableBooks}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">غير متوفرة</div>
          <div className="admin-stat-value">{stats?.outOfStockBooks}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">طلبات جديدة</div>
          <div className="admin-stat-value">{stats?.newOrders}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <Link href="/admin/books/new" className="admin-btn">
          إضافة كتاب جديد
        </Link>
        <Link href="/admin/orders" className="admin-btn admin-btn-outline">
          عرض جميع الطلبات
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '18px' }}>أحدث الطلبات</h2>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>اسم العميل</th>
                <th>رقم الهاتف</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerName}</td>
                    <td dir="ltr" style={{ textAlign: 'right' }}>{order.phone}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`admin-badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.date).toLocaleDateString('ar-EG')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                    لا توجد طلبات حديثة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
