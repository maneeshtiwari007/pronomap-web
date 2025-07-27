import 'server-only'
import { cookies } from 'next/headers'
import { isJson } from './CustomeHelper';
import { USER_SESSION } from './Constant';

export async function createSession(userId: any) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session: any = JSON.stringify({ data: userId, expiresAt });
    const cookieStore = await cookies();
    cookieStore.set(USER_SESSION.KEY, session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}
export async function updateSession() {
    const session: any = (await cookies()).get(USER_SESSION.KEY)?.value
    const payload = JSON.parse(session);
    if (!session || !payload) {
        return null
    }
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const cookieStore = await cookies()
    cookieStore.set(USER_SESSION.KEY, session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}
export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(USER_SESSION.KEY);
}

export async function getSession() {
    const session: any = (await cookies()).get(USER_SESSION.KEY)?.value
    const payload = (await isJson(session)) ? JSON.parse(session) : undefined;
    return payload;
}

