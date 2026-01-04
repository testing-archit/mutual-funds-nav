'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Something Went Wrong
                    </h1>

                    <p className="text-gray-600 mb-4">
                        We encountered an unexpected error. Don't worry, your data is safe.
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                Error details (dev only)
                            </summary>
                            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} size="lg">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>

                    <Link href="/dashboard">
                        <Button variant="outline" size="lg">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>

                <p className="text-sm text-gray-500 mt-8">
                    If this problem persists, please contact support.
                </p>
            </div>
        </div>
    );
}
