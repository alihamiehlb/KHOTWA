import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { sanitizeText, errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const status = sanitizeText(searchParams.get('status') || '');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    
    const conditions = [];
    if (status && status !== 'all') {
      conditions.push(eq(orders.status, status));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * limit;

    const data = await db.query.orders.findMany({
      where: whereClause,
      orderBy: [desc(orders.createdAt)],
      limit,
      offset,
      with: {
        items: {
          with: {
            book: true
          }
        }
      }
    });

    const [{ value: totalCount }] = await db.select({ value: count() }).from(orders).where(whereClause);

    return successResponse({
      orders: data,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error in GET admin/orders:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}
