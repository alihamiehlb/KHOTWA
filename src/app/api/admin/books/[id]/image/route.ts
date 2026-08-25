import { db } from '@/db';
import { books } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { validateId, validateImageFile, errorResponse, successResponse } from '@/lib/security';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (!validateId(id)) {
      return errorResponse('معرف الكتاب غير صالح', 400);
    }

    const book = await db.query.books.findFirst({ where: eq(books.id, id) });
    if (!book) {
      return errorResponse('الكتاب غير موجود', 404);
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    
    if (!file) {
      return errorResponse('لم يتم اختيار صورة', 400);
    }

    if (!validateImageFile(file)) {
      return errorResponse('نوع الملف غير صالح أو الحجم كبير جداً (الحد الأقصى 5 ميغابايت)', 400);
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    await db.update(books).set({ imageUrl: dataUrl, updatedAt: new Date() }).where(eq(books.id, id));

    return successResponse({ imageUrl: dataUrl });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error uploading image:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}
