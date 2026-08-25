import { authenticateAdmin, createSession } from '@/lib/auth';
import { loginRateLimit, checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { validateEmail, errorResponse, successResponse } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const { success } = await checkRateLimit(loginRateLimit, ip);
    if (!success) {
      return errorResponse('تم تجاوز عدد محاولات الدخول. يرجى المحاولة لاحقاً', 429);
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || !validateEmail(email)) {
      return errorResponse('بيانات الدخول غير صحيحة', 400);
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return errorResponse('بيانات الدخول غير صحيحة', 401);
    }

    await createSession(admin.adminId);

    return successResponse({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('حدث خطأ أثناء تسجيل الدخول', 500);
  }
}
