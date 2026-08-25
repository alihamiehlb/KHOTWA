// LBP conversion rate
export const LBP_RATE = 90000;

// Format price in USD
export function formatUSD(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `$${num.toFixed(2)}`;
}

// Format price in LBP
export function formatLBP(priceUSD: number | string): string {
  const num = typeof priceUSD === 'string' ? parseFloat(priceUSD) : priceUSD;
  const lbp = num * LBP_RATE;
  return `${lbp.toLocaleString('ar-LB')} ل.ل`;
}

// Generate WhatsApp URL with order message
export function generateWhatsAppUrl(
  phone: string,
  items: Array<{ title: string; price: number; quantity: number }>,
  total: number,
  customerName?: string,
  customerPhone?: string,
  notes?: string,
): string {
  let message = '';

  if (customerName) {
    message += `الاسم: ${customerName}\n`;
  }
  if (customerPhone) {
    message += `رقم الهاتف: ${customerPhone}\n`;
  }
  if (notes) {
    message += `ملاحظات:\n${notes}\n`;
  }
  if (customerName || customerPhone || notes) {
    message += '\n---\n\n';
  }

  message += 'مرحبا، أريد طلب الكتب التالية من Khotwa:\n\n';

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.title}\n`;
    message += `   السعر: $${item.price.toFixed(2)}\n`;
    message += `   الكمية: ${item.quantity}\n\n`;
  });

  message += '---\n';
  message += `إجمالي الطلب: $${total.toFixed(2)}\n\n`;
  message += 'يرجى التواصل معي لتأكيد الطلب.';

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

// Debounce function for search
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
