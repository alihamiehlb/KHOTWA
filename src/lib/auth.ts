import { db } from '@/db';
import { admins, sessions } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'khotwa_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createSession(adminId: number): Promise<string> {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    id: sessionId,
    adminId,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });

  return sessionId;
}

export async function getSession(): Promise<{ adminId: number; email: string; role: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  const sessionResults = await db
    .select({
      adminId: sessions.adminId,
      expiresAt: sessions.expiresAt,
      email: admins.email,
      role: admins.role,
    })
    .from(sessions)
    .innerJoin(admins, eq(sessions.adminId, admins.id))
    .where(
      and(
        eq(sessions.id, sessionCookie.value),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (sessionResults.length === 0) {
    return null;
  }

  return {
    adminId: sessionResults[0].adminId,
    email: sessionResults[0].email,
    role: sessionResults[0].role,
  };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    await db.delete(sessions).where(eq(sessions.id, sessionCookie.value));
  }

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}

export async function requireAdmin(): Promise<{ adminId: number; email: string; role: string }> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export async function authenticateAdmin(email: string, password: string): Promise<{ adminId: number; email: string } | null> {
  const adminResults = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email.toLowerCase().trim()))
    .limit(1);

  if (adminResults.length === 0) {
    // Still hash to prevent timing attacks
    await hash(password, 12);
    return null;
  }

  const admin = adminResults[0];
  const valid = await verifyPassword(password, admin.passwordHash);

  if (!valid) {
    return null;
  }

  return { adminId: admin.id, email: admin.email };
}
