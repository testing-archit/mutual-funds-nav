'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl">
                {/* 404 Graphic */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-white opacity-20">404</h1>
                    <div className="-mt-20">
                        <p className="text-4xl font-bold text-white mb-4">Page Not Found</p>
                        <p className="text-xl text-gray-300">
                            The page you're looking for seems to have wandered off into the mutual funds universe.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link href="/">
                        <Button size="lg" variant="default">
                            <Home className="mr-2 h-5 w-5" />
                            Go Home
                        </Button>
                    </Link>

                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            <Search className="mr-2 h-5 w-5" />
                            Search Funds
                        </Button>
                    </Link>

                    <Button size="lg" variant="ghost" className="text-white hover:bg-white/10" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Go Back
                    </Button>
                </div>

                {/* Popular Links */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <p className="text-sm text-gray-400 mb-4">Popular pages:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/dashboard" className="text-purple-400 hover:underline">
                            Dashboard
                        </Link>
                        <span className="text-gray-600">•</span>
                        <Link href="/favorites" className="text-purple-400 hover:underline">
                            My Favorites
                        </Link>
                        <span className="text-gray-600">•</span>
                        <Link href="/history" className="text-purple-400 hover:underline">
                            Search History
                        </Link>
                        <span className="text-gray-600">•</span>
                        <Link href="/login" className="text-purple-400 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
