import { db } from '@/db';
import { orders, orderItems, books } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { orderRateLimit, checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { sanitizeText, validatePhone, validatePositiveInt, errorResponse, successResponse } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const { success } = await checkRateLimit(orderRateLimit, ip);
    if (!success) {
      return errorResponse('تم تجاوز حد الطلبات المسموح به. يرجى المحاولة لاحقاً', 429);
    }

    const body = await request.json();
    let { customerName, customerPhone, notes, items } = body;

    customerName = sanitizeText(customerName || '').substring(0, 100);
    customerPhone = sanitizeText(customerPhone || '');
    notes = sanitizeText(notes || '').substring(0, 500);

    if (!customerName) {
      return errorResponse('الاسم مطلوب', 400);
    }
    if (!validatePhone(customerPhone)) {
      return errorResponse('رقم الهاتف غير صالح', 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse('يجب اختيار كتاب واحد على الأقل', 400);
    }

    let calculatedTotal = 0;
    const orderItemsData: {
      bookId: number;
      quantity: number;
      priceAtPurchase: string;
    }[] = [];
    const whatsappItems: {
      title: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const bookId = parseInt(item.bookId, 10);
      const quantity = parseInt(item.quantity, 10);

      if (!validatePositiveInt(bookId) || !validatePositiveInt(quantity) || quantity > 99) {
        return errorResponse('بيانات الكتب غير صالحة', 400);
      }

      const book = await db.query.books.findFirst({
        where: eq(books.id, bookId)
      });

      if (!book) {
        return errorResponse(`الكتاب رقم ${bookId} غير موجود`, 404);
      }
      if (!book.available) {
        return errorResponse(`الكتاب "${book.title}" غير متوفر حالياً`, 400);
      }

      const itemTotal = Number(book.price) * quantity;
      calculatedTotal += itemTotal;

      orderItemsData.push({
        bookId,
        quantity,
        priceAtPurchase: book.price.toString()
      });

      whatsappItems.push({
        title: book.title,
        price: Number(book.price),
        quantity
      });
    }

    const orderId = await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values({
        customerName,
        customerPhone,
        notes,
        total: calculatedTotal.toString(),
        status: 'جديد'
      }).returning({ id: orders.id });

      const itemsToInsert = orderItemsData.map(item => ({
        orderId: newOrder.id,
        ...item
      }));

      await tx.insert(orderItems).values(itemsToInsert);
      
      return newOrder.id;
    });

    return successResponse({
      orderId,
      items: whatsappItems,
      total: calculatedTotal
    }, 201);
  } catch (error) {
    console.error('Error creating order:', error);
    return errorResponse('حدث خطأ أثناء إنشاء الطلب', 500);
  }
}
