'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.');
      }
    } catch {
      setError('حدث خطأ. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        color: '#F5F5F5',
        fontFamily: 'Tajawal, sans-serif',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: '#222222',
          padding: '48px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '420px',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              color: '#D4AF37',
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
            }}
          >
            خطوة
          </h1>
          <h2
            style={{
              fontSize: '16px',
              color: '#AAAAAA',
              margin: 0,
              fontWeight: 'normal',
            }}
          >
            لوحة التحكم
          </h2>
        </div>

        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(212, 175, 55, 0.25)',
            margin: '24px 0 28px 0',
            width: '100%',
          }}
        />

        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: 'rgba(220, 53, 69, 0.12)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              color: '#FF6B6B',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <input
              id="admin-email"
              type="email"
              dir="ltr"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              required
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: emailFocused ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontFamily: 'Tajawal, sans-serif',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: emailFocused ? '0 0 0 2px rgba(212, 175, 55, 0.2)' : 'none',
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              dir="ltr"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
              style={{
                width: '100%',
                padding: '14px 44px 14px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: passwordFocused ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontFamily: 'Tajawal, sans-serif',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: passwordFocused ? '0 0 0 2px rgba(212, 175, 55, 0.2)' : 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'عرض كلمة المرور'}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#AAAAAA',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontFamily: 'Tajawal, sans-serif',
              }}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#D4AF37',
              color: '#1A1A1A',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Tajawal, sans-serif',
              marginTop: '8px',
              transition: 'background-color 0.2s ease, opacity 0.2s ease',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
