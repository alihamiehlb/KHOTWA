import { db } from '@/db';
import { books, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { validateId, errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (!validateId(id)) {
      return errorResponse('معرف الكتاب غير صالح', 400);
    }

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
    .where(eq(books.id, id))
    .limit(1);

    if (!data.length) {
      return errorResponse('الكتاب غير موجود', 404);
    }

    return successResponse(data[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    return errorResponse('حدث خطأ أثناء جلب تفاصيل الكتاب', 500);
  }
}
