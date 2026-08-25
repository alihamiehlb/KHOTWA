import { destroySession } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/security';

export async function POST(request: Request) {
  try {
    await destroySession();
    return successResponse({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse('حدث خطأ أثناء تسجيل الخروج', 500);
  }
}
