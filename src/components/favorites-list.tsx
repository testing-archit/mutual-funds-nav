'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { exportFavorites } from '@/lib/export';
import { useToast } from '@/components/toast-provider';
import type { Favorite } from '@/lib/db/schema';
import { Download } from 'lucide-react';

interface FavoritesListProps {
    favorites: Favorite[];
}

export function FavoritesList({ favorites }: FavoritesListProps) {
    const { showToast } = useToast();

    if (favorites.length === 0) {
        return null; // Handled by parent
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    {favorites.length} saved fund{favorites.length !== 1 ? 's' : ''}
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        exportFavorites(favorites);
                        showToast('Favorites exported to CSV', 'success');
                    }}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
            </div>
            {favorites.map((favorite) => (
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
    );
}
