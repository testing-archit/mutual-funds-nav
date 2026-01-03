'use server';

import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
    } catch (error) {
        return { error: 'Invalid credentials' };
    }

    redirect('/dashboard');
}

export async function signupAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            email,
            passwordHash,
            name,
        });

        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        redirect('/dashboard');
    } catch (error: any) {
        if (error?.code === '23505') {
            return { error: 'Email already exists' };
        }
        return { error: 'Failed to create account' };
    }
}
