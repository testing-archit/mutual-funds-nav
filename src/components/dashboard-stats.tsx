import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { favorites, searchHistory } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { TrendingUp, Star, Search, Database } from 'lucide-react';
import { getAllFunds } from '@/lib/amfi';

export async function DashboardStats() {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    // Fetch stats in parallel
    const [favoritesCount, searchesCount, allFunds] = await Promise.all([
        db.query.favorites.findMany({
            where: eq(favorites.userId, session.user.id),
        }).then(f => f.length),
        db.query.searchHistory.findMany({
            where: and(
                eq(searchHistory.userId, session.user.id),
                gte(searchHistory.searchedAt, new Date(new Date().setHours(0, 0, 0, 0)))
            ),
        }).then(h => h.length),
        getAllFunds().catch(() => []),
    ]);

    const stats = [
        {
            title: 'Total Favorites',
            value: favoritesCount,
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            title: 'Searches Today',
            value: searchesCount,
            icon: Search,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: 'Available Funds',
            value: allFunds.length.toLocaleString(),
            icon: Database,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: 'Market Status',
            value: 'Live',
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.title} className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
