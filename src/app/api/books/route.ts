import { db } from '@/db';
import { books, categories } from '@/db/schema';
import { eq, and, gt, ilike, or, desc, asc, sql, count } from 'drizzle-orm';
import { searchRateLimit, checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { sanitizeText, errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = sanitizeText(searchParams.get('search') || '');
    
    if (search) {
      const ip = getClientIP(request);
      const { success } = await checkRateLimit(searchRateLimit, ip);
      if (!success) {
        return errorResponse('تم تجاوز حد البحث المسموح به', 429);
      }
    }

    const categoryId = parseInt(searchParams.get('category') || '0', 10);
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '0');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '12', 10)));
    const sort = searchParams.get('sort') || 'newest';

    const conditions = [];
    if (search) {
      conditions.push(or(ilike(books.title, `%${search}%`), ilike(books.author, `%${search}%`)));
    }
    if (categoryId > 0) {
      conditions.push(eq(books.categoryId, categoryId));
    }
    if (minPrice > 0) {
      conditions.push(gt(books.price, minPrice.toString()));
    }
    if (maxPrice > 0) {
      conditions.push(sql`${books.price} <= ${maxPrice}`);
    }
    // Only available books for public API
    conditions.push(eq(books.available, true));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause;
    if (sort === 'price_asc') {
      orderByClause = asc(books.price);
    } else if (sort === 'price_desc') {
      orderByClause = desc(books.price);
    } else {
      orderByClause = desc(books.createdAt);
    }

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
    .orderBy(orderByClause)
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
    console.error('Error fetching books:', error);
    return errorResponse('حدث خطأ أثناء جلب الكتب', 500);
  }
}
