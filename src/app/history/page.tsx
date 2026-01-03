import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { searchHistory } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HistoryPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const history = await db.query.searchHistory.findMany({
        where: eq(searchHistory.userId, session.user.id),
        orderBy: [desc(searchHistory.searchedAt)],
        limit: 50,
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Search History</h1>
                    <Link href="/dashboard">
                        <Button variant="outline">← Back to Dashboard</Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {history.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">No search history yet.</p>
                            <Link href="/dashboard">
                                <Button>Start Searching</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 mb-4">
                                {history.length} recent search{history.length !== 1 ? 'es' : ''}
                            </p>
                            {history.map((item) => (
                                <Card key={item.id} className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.searchTerm}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(item.searchedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <Link href={`/dashboard?q=${encodeURIComponent(item.searchTerm)}`}>
                                            <Button variant="outline" size="sm">
                                                Search Again
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
