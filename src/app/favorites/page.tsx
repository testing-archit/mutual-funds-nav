import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { favorites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { FavoritesList } from '@/components/favorites-list';
import Link from 'next/link';
import Image from 'next/image';

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
                            <div className="mb-6 flex justify-center">
                                <Image
                                    src="/empty-favorites.png"
                                    alt="No favorites yet"
                                    width={200}
                                    height={200}
                                    className="w-48 h-48 opacity-80"
                                />
                            </div>
                            <p className="text-gray-600 mb-4">You haven't saved any favorites yet.</p>
                            <Link href="/dashboard">
                                <Button>Start Searching</Button>
                            </Link>
                        </div>
                    ) : (
                        <FavoritesList favorites={userFavorites} />
                    )}
                </div>
            </main>
        </div>
    );
}
