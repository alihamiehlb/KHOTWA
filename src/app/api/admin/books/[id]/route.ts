import { db } from '@/db';
import { books, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { sanitizeText, validatePositiveInt, validatePrice, validateId, errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
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
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error fetching admin book:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (!validateId(id)) {
      return errorResponse('معرف الكتاب غير صالح', 400);
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

    const updatedData = {
      title,
      author,
      categoryId,
      price: price.toString(),
      description,
      available: available === true || available === 'true',
      isbn,
      publisher,
      pages: pages > 0 ? pages : null,
      imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      updatedAt: new Date()
    };

    const [updatedBook] = await db.update(books)
      .set(updatedData)
      .where(eq(books.id, id))
      .returning();

    if (!updatedBook) {
      return errorResponse('الكتاب غير موجود', 404);
    }

    return successResponse(updatedBook);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error updating book:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (!validateId(id)) {
      return errorResponse('معرف الكتاب غير صالح', 400);
    }

    const [deletedBook] = await db.delete(books).where(eq(books.id, id)).returning({ id: books.id });

    if (!deletedBook) {
      return errorResponse('الكتاب غير موجود', 404);
    }

    return successResponse({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error deleting book:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}
