'use client';

import React, { useState, useEffect } from 'react';

interface OrderItem {
  bookTitle: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  date: string;
  items: OrderItem[];
  notes?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('فشل تحديث حالة الطلب');
      }
    } catch (error) {
      alert('حدث خطأ أثناء التحديث');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'جديد': return 'status-new';
      case 'تم التواصل': return 'status-contacted';
      case 'مكتمل': return 'status-completed';
      case 'ملغي': return 'status-cancelled';
      default: return '';
    }
  };

  const filteredOrders = filterStatus === 'الكل' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontWeight: 'bold' }}>تصفية حسب الحالة:</span>
        <select 
          className="admin-select" 
          style={{ width: '200px' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="الكل">الكل</option>
          <option value="جديد">جديد</option>
          <option value="تم التواصل">تم التواصل</option>
          <option value="مكتمل">مكتمل</option>
          <option value="ملغي">ملغي</option>
        </select>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>جاري التحميل...</div>
        ) : (
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
                  <th>التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr>
                        <td>#{order.id}</td>
                        <td>{order.customerName}</td>
                        <td dir="ltr" style={{ textAlign: 'right' }}>{order.phone}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          <select
                            className={`admin-select ${getStatusBadgeClass(order.status)}`}
                            style={{ 
                              padding: '4px 8px', 
                              height: 'auto', 
                              border: 'none', 
                              fontWeight: 'bold',
                              color: 'inherit',
                              width: '120px'
                            }}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          >
                            <option value="جديد" style={{ color: '#1A1A1A' }}>جديد</option>
                            <option value="تم التواصل" style={{ color: '#1A1A1A' }}>تم التواصل</option>
                            <option value="مكتمل" style={{ color: '#1A1A1A' }}>مكتمل</option>
                            <option value="ملغي" style={{ color: '#1A1A1A' }}>ملغي</option>
                          </select>
                        </td>
                        <td>{new Date(order.date).toLocaleDateString('ar-EG')}</td>
                        <td>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="admin-btn admin-btn-outline"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            {expandedOrder === order.id ? 'إخفاء' : 'عرض التفاصيل'}
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                          <td colSpan={7} style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                              <div>
                                <h4 style={{ color: '#D4AF37', marginTop: 0 }}>محتويات الطلب</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                      <th style={{ textAlign: 'right', padding: '8px' }}>الكتاب</th>
                                      <th style={{ textAlign: 'center', padding: '8px' }}>الكمية</th>
                                      <th style={{ textAlign: 'left', padding: '8px' }}>السعر</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, idx) => (
                                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '8px' }}>{item.bookTitle}</td>
                                        <td style={{ textAlign: 'center', padding: '8px' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'left', padding: '8px' }}>${(item.price * item.quantity).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div>
                                <h4 style={{ color: '#D4AF37', marginTop: 0 }}>معلومات إضافية</h4>
                                {order.notes ? (
                                  <p style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '4px' }}>
                                    {order.notes}
                                  </p>
                                ) : (
                                  <p style={{ color: '#AAAAAA' }}>لا توجد ملاحظات من العميل.</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                      لا توجد طلبات مطابقة
                    </td>
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
