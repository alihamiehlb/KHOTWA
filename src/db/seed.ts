import { db } from './index';
import { books, categories, admins } from './schema';
import { hash } from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  // Create categories
  const categoryData = [
    { name: 'تكنولوجيا' },
    { name: 'تسويق رقمي' },
    { name: 'أمن سيبراني' },
    { name: 'برمجة' },
    { name: 'صحة ولياقة' },
  ];

  console.log('Creating categories...');
  const insertedCategories: { id: number; name: string }[] = [];
  for (const cat of categoryData) {
    const result = await db.insert(categories).values(cat).onConflictDoNothing().returning();
    if (result.length > 0) {
      insertedCategories.push({ id: result[0].id, name: result[0].name });
    }
  }

  // If categories already existed, fetch them
  if (insertedCategories.length === 0) {
    const existing = await db.select().from(categories);
    insertedCategories.push(...existing.map(c => ({ id: c.id, name: c.name })));
  }

  const getCategoryId = (name: string) => {
    const cat = insertedCategories.find(c => c.name === name);
    return cat ? cat.id : null;
  };

  // Create books from assets data
  const booksData = [
    {
      title: 'الذكاء الاصطناعي من الفهم الى الاحتراف',
      author: 'Khotwa',
      categoryId: getCategoryId('تكنولوجيا'),
      price: '22.00',
      description: 'كتاب عالي الجودة يقدم لكم ماهو عالم الذكاء الاصطناعي ومفاهيمه بشكل كامل. دليلك الشامل لفهم الذكاء الاصطناعي وتطبيقاته والانتقال من الأساسيات إلى الاحتراف بثقة.',
      imageUrl: '/books/ai-book.jpeg',
      available: true,
      publisher: 'Khotwa Digital Products',
    },
    {
      title: 'الشفرة السرية لصناعة المحتوى',
      author: 'Khotwa',
      categoryId: getCategoryId('تسويق رقمي'),
      price: '22.00',
      description: 'صعوبتك بفهم صناعة المحتوى وتتبع الخوارزميات تجد مفاهيمها هنا مع كل شي تحتاجه لبناء صفحات سوشيال ميديا ناجحة ومؤثرة. دليل شامل ومفصل لبناء محتوى ذكي يحقق الانتشار ويبني جمهورا مخلصا ويحول المشاهدات إلى أصول ومبيعات.',
      imageUrl: '/books/content-book.jpeg',
      available: true,
      publisher: 'Khotwa Digital Products',
    },
    {
      title: 'الأمن السيبراني',
      author: 'Khotwa',
      categoryId: getCategoryId('أمن سيبراني'),
      price: '25.00',
      description: 'تغطية كاملة داخل هذا الكتاب تطرح كل المفاهيم التي يجب أن تعرفها نقطة بنقطة. دليل احترافي متكامل للحماية والاختراق الأخلاقي. استكشف المبادئ الأساسية وتقنيات الحماية المتقدمة واستراتيجيات الدفاع في عصر التهديدات الرقمية المتطورة.',
      imageUrl: '/books/cyber-book.jpeg',
      available: true,
      publisher: 'Khotwa Digital Products',
    },
    {
      title: 'فهم البرمجة من الألف الى الياء',
      author: 'Khotwa',
      categoryId: getCategoryId('برمجة'),
      price: '22.00',
      description: 'كتاب الكتروني بمقدار احترافي يقدم لكم بالتفصيل ماهو عالم البرمجة وتفاصيله بشكل حرفي. رحلتك الشاملة لتعلم البرمجة من الصفر حتى الاحتراف وبناء مشاريع حقيقية.',
      imageUrl: '/books/programming-book.jpeg',
      available: true,
      publisher: 'Khotwa Digital Products',
    },
    {
      title: 'خطوتك نحو فهم خسارة الوزن',
      author: 'Khotwa',
      categoryId: getCategoryId('صحة ولياقة'),
      price: '22.00',
      description: 'كتاب الكتروني فريد في نوعه يجمع اقوى واعلى المعايير والأسرار في فهم خسارة الوزن وكيفية عمل الجسم بشكل كامل. تأتي هذه النسخة مع نسخة آخرى مجانية تحمل تفاصيل اكتر عن خسارة الوزن والتعامل مع الجسم. دليل علمي وعملي متقدم لفهم الوزن والدهون والشهية والطعام والحركة والنوم والعادات.',
      imageUrl: '/books/weight-loss-book.jpeg',
      available: true,
      publisher: 'Khotwa Digital Products',
    },
  ];

  console.log('Creating books...');
  for (const book of booksData) {
    await db.insert(books).values(book).onConflictDoNothing();
  }

  // Create default admin
  console.log('Creating admin account...');
  const passwordHash = await hash('ibrahim2009', 12);
  await db.insert(admins).values({
    email: 'ibrahimhershi@gmail.com',
    passwordHash,
    role: 'admin',
  }).onConflictDoNothing();

  console.log('Seed completed successfully!');
}

seed().catch(console.error);
