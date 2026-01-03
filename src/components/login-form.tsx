'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { loginAction } from '@/lib/actions';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border-white/20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-gray-300">Login to continue tracking your funds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <p className="mt-6 text-center text-gray-300">
                Don't have an account?{' '}
                <Link href="/signup" className="text-purple-400 hover:underline">
                    Sign up
                </Link>
            </p>
        </Card>
    );
}
