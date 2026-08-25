"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/books", label: "الكتب" },
    { href: "/contact#about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <header className="header">
      <div className="container header__content">
        <Link href="/" className="header__logo">
          <Image src="/logo.jpeg" alt="Khotwa Logo" width={40} height={40} className="header__logo-img" />
          <span>خطوة</span>
        </Link>

        <nav className="header__nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header__nav-link ${
                pathname === link.href ? "header__nav-link--active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <Link href="/books" className="header__action-btn" aria-label="البحث">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
          
          <Link href="/cart" className="header__action-btn" aria-label="السلة">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {getItemCount() > 0 && (
              <span className="header__cart-badge">{getItemCount()}</span>
            )}
          </Link>

          <button
            className="header__mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="القائمة"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu__overlay ${
          isMobileMenuOpen ? "mobile-menu__overlay--open" : ""
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      <div
        className={`mobile-menu ${isMobileMenuOpen ? "mobile-menu--open" : ""}`}
      >
        <button
          className="mobile-menu__close"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="إغلاق القائمة"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <nav className="mobile-menu__nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header__nav-link ${
                pathname === link.href ? "header__nav-link--active" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
