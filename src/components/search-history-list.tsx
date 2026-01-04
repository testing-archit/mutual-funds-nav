'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { exportSearchHistory } from '@/lib/export';
import { useToast } from '@/components/toast-provider';
import type { SearchHistory } from '@/lib/db/schema';
import Link from 'next/link';
import { Download } from 'lucide-react';

interface SearchHistoryListProps {
    history: SearchHistory[];
}

export function SearchHistoryList({ history }: SearchHistoryListProps) {
    const { showToast } = useToast();

    if (history.length === 0) {
        return null; // Handled by parent
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                    {history.length} recent search{history.length !== 1 ? 'es' : ''}
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        exportSearchHistory(history);
                        showToast('Search history exported to CSV', 'success');
                    }}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
            </div>
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
    );
}
