export default function ContactPage() {
  return (
    <div className="container section">
      <h1 className="section__title" style={{ marginBottom: "3rem" }}>تواصل معنا</h1>
      
      <div className="contact-grid">
        <div id="about" style={{ backgroundColor: "var(--charcoal)", padding: "2rem", borderRadius: "8px", border: "1px solid var(--light-gray)" }}>
          <h2 style={{ color: "var(--gold)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>من نحن</h2>
          <p style={{ color: "var(--off-white)", lineHeight: "1.8", marginBottom: "1rem" }}>
            خطوة هي منصتك الرائدة للكتب الرقمية والمنتجات الثقافية. نسعى لتوفير تجربة قراءة فريدة ومتميزة من خلال توفير مجموعة واسعة من الكتب المنتقاة بعناية.
          </p>
          <p style={{ color: "var(--off-white)", lineHeight: "1.8" }}>
            نهدف إلى نشر المعرفة وتسهيل الوصول إلى المحتوى الثقافي عالي الجودة للجميع.
          </p>
        </div>

        <div>
          <h2 style={{ color: "var(--gold)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>طرق التواصل</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="contact-card">
              <svg className="contact-card__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <h3 className="contact-card__title">واتساب</h3>
              <p className="contact-card__text" dir="ltr">+961 3 578 260</p>
              <a href="https://wa.me/9613578260" target="_blank" rel="noopener noreferrer" className="btn btn--primary" style={{ backgroundColor: "#25D366", color: "white" }}>
                مراسلة عبر واتساب
              </a>
            </div>

            <div className="contact-card">
              <svg className="contact-card__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <h3 className="contact-card__title">البريد الإلكتروني</h3>
              <p className="contact-card__text">ibrahimhershi@gmail.com</p>
              <a href="mailto:ibrahimhershi@gmail.com" className="btn btn--secondary">
                إرسال بريد إلكتروني
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
