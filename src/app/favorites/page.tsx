import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { favorites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function FavoritesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const userFavorites = await db.query.favorites.findMany({
        where: eq(favorites.userId, session.user.id),
        orderBy: (favorites, { desc }) => [desc(favorites.addedAt)],
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">My Favorites</h1>
                    <Link href="/dashboard">
                        <Button variant="outline">← Back to Search</Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {userFavorites.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">You haven't saved any favorites yet.</p>
                            <Link href="/dashboard">
                                <Button>Start Searching</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">{userFavorites.length} saved fund{userFavorites.length !== 1 ? 's' : ''}</p>
                            {userFavorites.map((favorite) => (
                                <Card key={favorite.id} className="p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline">#{favorite.fundSerialNumber}</Badge>
                                        <span className="text-sm text-gray-600">{favorite.fundHouse}</span>
                                    </div>
                                    <h3 className="font-semibold text-lg">{favorite.fundName}</h3>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Saved on {new Date(favorite.addedAt).toLocaleDateString()}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
