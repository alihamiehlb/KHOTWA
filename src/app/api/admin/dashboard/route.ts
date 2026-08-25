import { db } from '@/db';
import { books, orders } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const session = await requireAdmin();

    const [{ value: totalBooks }] = await db.select({ value: count() }).from(books);
    const [{ value: availableBooks }] = await db.select({ value: count() }).from(books).where(eq(books.available, true));
    const outOfStockBooks = totalBooks - availableBooks;

    const [{ value: newOrders }] = await db.select({ value: count() }).from(orders).where(eq(orders.status, 'جديد'));

    const rawRecentOrders = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      limit: 5,
    });

    const recentOrders = rawRecentOrders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      phone: order.customerPhone,
      total: Number(order.total),
      status: order.status,
      date: order.createdAt,
    }));

    return successResponse({
      adminEmail: session.email,
      stats: {
        totalBooks,
        availableBooks,
        outOfStockBooks,
        newOrders,
      },
      recentOrders,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse('غير مصرح', 401);
    }
    console.error('Error fetching dashboard data:', error);
    return errorResponse('حدث خطأ في الخادم', 500);
  }
}
