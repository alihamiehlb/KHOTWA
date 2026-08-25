import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { sanitizeText, validateId, errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (!validateId(id)) {
      return errorResponse('معرف الطلب غير صالح', 400);
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            book: true
          }
        }
      }
    });

    if (!order) {
      return errorResponse('الطلب غير موجود', 404);
    }

    return successResponse(order);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error fetching admin order:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    
    if (!validateId(id)) {
      return errorResponse('معرف الطلب غير صالح', 400);
    }

    const body = await request.json();
    const status = sanitizeText(body.status || '');

    const validStatuses = ['جديد', 'تم التواصل', 'مكتمل', 'ملغي'];
    if (!validStatuses.includes(status)) {
      return errorResponse('حالة الطلب غير صالحة', 400);
    }

    const [updatedOrder] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();

    if (!updatedOrder) {
      return errorResponse('الطلب غير موجود', 404);
    }

    return successResponse(updatedOrder);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error updating order:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}
