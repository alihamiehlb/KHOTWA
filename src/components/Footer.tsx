import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href="/" className="header__logo" style={{ marginBottom: "1rem" }}>
              <Image src="/logo.jpeg" alt="Khotwa Logo" width={40} height={40} className="header__logo-img" />
              <span>خطوة</span>
            </Link>
            <p className="footer__text">
              متجرك الأول للكتب الرقمية والمنتجات الثقافية. نهدف إلى نشر المعرفة والثقافة في متناول الجميع.
            </p>
          </div>
          
          <div>
            <h3 className="footer__title">روابط سريعة</h3>
            <ul className="footer__links">
              <li><Link href="/" className="footer__link">الرئيسية</Link></li>
              <li><Link href="/books" className="footer__link">الكتب</Link></li>
              <li><Link href="/contact#about" className="footer__link">من نحن</Link></li>
              <li><Link href="/contact" className="footer__link">تواصل معنا</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer__title">تواصل معنا</h3>
            <ul className="footer__links">
              <li>
                <a href="https://wa.me/9613578260" target="_blank" rel="noopener noreferrer" className="footer__link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span dir="ltr">+961 3 578 260</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer__bottom">
          <p>© 2024 خطوة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
