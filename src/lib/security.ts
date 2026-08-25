// HTML escape to prevent XSS
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

// Sanitize text input - trim and limit length
export function sanitizeText(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

// Validate price is a positive number
export function validatePrice(price: unknown): number | null {
  const num = Number(price);
  if (isNaN(num) || num < 0 || num > 99999.99) return null;
  return Math.round(num * 100) / 100;
}

// Validate positive integer
export function validatePositiveInt(value: unknown, max: number = 1000): number | null {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > max) return null;
  return num;
}

// Validate ID (positive integer)
export function validateId(value: unknown): number | null {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) return null;
  return num;
}

// Validate phone number - basic format check
export function validatePhone(phone: string): boolean {
  if (typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{6,15}$/.test(cleaned);
}

// Validate email format
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimes.includes(file.type)) {
    return { valid: false, error: 'نوع الملف غير مدعوم. يرجى استخدام JPG, PNG, أو WebP' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'حجم الملف كبير جداً. الحد الأقصى 5 ميغابايت' };
  }

  return { valid: true };
}

// Generate safe filename
export function generateSafeFilename(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
  const safeExt = allowedExts.includes(ext) ? ext : 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `book_${timestamp}_${random}.${safeExt}`;
}

// Create a JSON error response
export function errorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Create a JSON success response
export function successResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
