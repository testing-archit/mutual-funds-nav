import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { LoginForm } from '@/components/login-form';

export default async function LoginPage() {
    const session = await auth();
    if (session) redirect('/dashboard');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <LoginForm />
        </div>
    );
}
