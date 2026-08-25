import { db } from '@/db';
import { books, categories } from '@/db/schema';
import { eq, and, ilike, or, desc, sql, count } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { adminRateLimit, checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { sanitizeText, validatePositiveInt, validatePrice, errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    
    const ip = getClientIP(request);
    const { success } = await checkRateLimit(adminRateLimit, ip);
    if (!success) {
      return errorResponse('تم تجاوز حد الطلبات المسموح به', 429);
    }

    const { searchParams } = new URL(request.url);
    const search = sanitizeText(searchParams.get('search') || '');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    
    const conditions = [];
    if (search) {
      conditions.push(or(ilike(books.title, `%${search}%`), ilike(books.author, `%${search}%`), ilike(books.isbn, `%${search}%`)));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * limit;

    const data = await db.select({
      id: books.id,
      title: books.title,
      author: books.author,
      categoryId: books.categoryId,
      categoryName: categories.name,
      price: books.price,
      description: books.description,
      imageUrl: books.imageUrl,
      available: books.available,
      isbn: books.isbn,
      publisher: books.publisher,
      pages: books.pages,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
    })
    .from(books)
    .leftJoin(categories, eq(books.categoryId, categories.id))
    .where(whereClause)
    .orderBy(desc(books.createdAt))
    .limit(limit)
    .offset(offset);

    const [{ value: totalCount }] = await db.select({ value: count() }).from(books).where(whereClause);

    return successResponse({
      books: data,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error in GET admin/books:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    
    const ip = getClientIP(request);
    const { success } = await checkRateLimit(adminRateLimit, ip);
    if (!success) {
      return errorResponse('تم تجاوز حد الطلبات المسموح به', 429);
    }

    const body = await request.json();
    let { title, author, categoryId, price, description, available, isbn, publisher, pages, imageUrl } = body;

    title = sanitizeText(title || '').substring(0, 200);
    author = sanitizeText(author || '').substring(0, 100);
    description = sanitizeText(description || '').substring(0, 2000);
    isbn = sanitizeText(isbn || '').substring(0, 20);
    publisher = sanitizeText(publisher || '').substring(0, 100);
    
    categoryId = parseInt(categoryId, 10);
    pages = parseInt(pages || '0', 10);
    
    if (!title || !author || !validatePositiveInt(categoryId)) {
      return errorResponse('البيانات الأساسية مطلوبة (العنوان، المؤلف، الفئة)', 400);
    }
    
    if (!validatePrice(price)) {
      return errorResponse('السعر غير صالح', 400);
    }

    const newBook = {
      title,
      author,
      categoryId,
      price: price.toString(),
      description,
      available: available === true || available === 'true',
      isbn,
      publisher,
      pages: pages > 0 ? pages : null,
      imageUrl: imageUrl || null
    };

    const [insertedBook] = await db.insert(books).values(newBook).returning();

    return successResponse(insertedBook, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error in POST admin/books:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}
