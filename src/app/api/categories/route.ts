import { db } from '@/db';
import { categories } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { errorResponse, successResponse } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const data = await db.query.categories.findMany({
      orderBy: [asc(categories.name)]
    });
    return successResponse(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('حدث خطأ أثناء جلب الفئات', 500);
  }
}
