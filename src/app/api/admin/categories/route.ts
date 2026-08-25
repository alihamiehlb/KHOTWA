import { db } from '@/db';
import { categories, books } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { sanitizeText, errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    
    // Join categories with books to get counts
    const data = await db.select({
      id: categories.id,
      name: categories.name,
      createdAt: categories.createdAt,
      bookCount: sql<number>`count(${books.id})::int`
    })
    .from(categories)
    .leftJoin(books, eq(categories.id, books.categoryId))
    .groupBy(categories.id)
    .orderBy(categories.name);

    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error in GET admin/categories:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    let { name } = body;
    
    name = sanitizeText(name || '').substring(0, 50);
    if (!name) {
      return errorResponse('اسم الفئة مطلوب', 400);
    }

    // Check for existing category with same name
    const existing = await db.query.categories.findFirst({ where: eq(categories.name, name) });
    if (existing) {
      return errorResponse('اسم الفئة موجود مسبقاً', 400);
    }

    const [inserted] = await db.insert(categories).values({ name }).returning();
    return successResponse(inserted, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error in POST admin/categories:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0', 10);
    
    if (id <= 0) {
      return errorResponse('معرف الفئة غير صالح', 400);
    }

    // Check if category has books
    const booksCount = await db.select({ value: sql<number>`count(*)::int` }).from(books).where(eq(books.categoryId, id));
    if (booksCount[0].value > 0) {
      return errorResponse('لا يمكن حذف هذه الفئة لأنها تحتوي على كتب', 400);
    }

    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    if (!deleted) {
      return errorResponse('الفئة غير موجودة', 404);
    }

    return successResponse({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error in DELETE admin/categories:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}
