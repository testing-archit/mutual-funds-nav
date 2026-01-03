import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SearchWithAutocomplete from '@/components/search-with-autocomplete';
import Link from 'next/link';

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">FundTracker</h1>
                        <p className="text-sm text-gray-600">Welcome, {session.user?.name || session.user?.email}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link href="/history">
                            <Button variant="ghost">History</Button>
                        </Link>
                        <Link href="/favorites">
                            <Button variant="outline">My Favorites</Button>
                        </Link>
                        <form
                            action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}
                        >
                            <Button variant="ghost" type="submit">Logout</Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">Search Mutual Funds</h2>
                        <p className="text-gray-600">
                            Real-time NAV data from AMFI India. Start typing to see suggestions.
                        </p>
                    </div>

                    <SearchWithAutocomplete />
                </div>
            </main>
        </div>
    );
}
