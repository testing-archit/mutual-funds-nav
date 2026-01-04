import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SearchWithAutocomplete from '@/components/search-with-autocomplete';
import { DashboardStats } from '@/components/dashboard-stats';
import { DashboardStatsSkeleton } from '@/components/loading-skeletons';
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts';
import Link from 'next/link';
import { Suspense } from 'react';
import { Download, History, Star, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <KeyboardShortcuts />

            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">FundTracker</h1>
                        <p className="text-sm text-gray-600">Welcome, {session.user?.name || session.user?.email}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link href="/history">
                            <Button variant="ghost" size="sm">
                                <History className="mr-2 h-4 w-4" />
                                History
                            </Button>
                        </Link>
                        <Link href="/favorites">
                            <Button variant="outline" size="sm">
                                <Star className="mr-2 h-4 w-4" />
                                Favorites
                            </Button>
                        </Link>
                        <form
                            action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}
                        >
                            <Button variant="ghost" size="sm" type="submit">Logout</Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Stats Section */}
                    <Suspense fallback={<DashboardStatsSkeleton />}>
                        <DashboardStats />
                    </Suspense>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Link href="/favorites">
                            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded">
                                        <Star className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">My Favorites</p>
                                        <p className="text-sm text-gray-600">View saved funds</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/history">
                            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded">
                                        <History className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Search History</p>
                                        <p className="text-sm text-gray-600">Recent searches</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Live Data</p>
                                    <p className="text-sm text-gray-600">AMFI India NAV</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="mb-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-2">Search Mutual Funds</h2>
                            <p className="text-gray-600">
                                Real-time NAV data from AMFI India. Press <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Ctrl+K</kbd> to focus search.
                            </p>
                        </div>

                        <SearchWithAutocomplete />
                    </div>
                </div>
            </main>
        </div>
    );
}
