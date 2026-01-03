'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/toast-provider';
import type { Fund } from '@/lib/amfi';

export default function SearchWithAutocomplete() {
    const { showToast } = useToast();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [results, setResults] = useState<Fund[]>([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Fetch autocomplete suggestions
    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setSuggestions(data.suggestions || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Autocomplete error:', error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle search
    const handleSearch = async (searchQuery: string = query) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setShowSuggestions(false);

        try {
            // Track search in history
            fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchTerm: searchQuery }),
            }).catch(() => { }); // Fire and forget

            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
            const data = await res.json();
            setResults(data.data || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load favorites
    useEffect(() => {
        async function loadFavorites() {
            try {
                const res = await fetch('/api/favorites');
                const data = await res.json();
                const favSet = new Set<number>(data.favorites?.map((f: any) => f.fundSerialNumber) || []);
                setFavorites(favSet);
            } catch (error) {
                console.error('Load favorites error:', error);
            }
        }
        loadFavorites();
    }, []);

    // Toggle favorite
    const toggleFavorite = async (fund: Fund) => {
        const isFavorite = favorites.has(fund.serial_number);

        try {
            if (isFavorite) {
                await fetch(`/api/favorites?serial=${fund.serial_number}`, { method: 'DELETE' });
                setFavorites(prev => {
                    const next = new Set(prev);
                    next.delete(fund.serial_number);
                    return next;
                });
                showToast('Removed from favorites', 'success');
            } else {
                await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fundSerialNumber: fund.serial_number,
                        fundName: fund.scheme_name,
                        fundHouse: fund.fund_house,
                    }),
                });
                setFavorites(prev => new Set(prev).add(fund.serial_number));
                showToast('Added to favorites!', 'success');
            }
        } catch (error) {
            console.error('Favorite error:', error);
            showToast('Failed to update favorites', 'error');
        }
    };

    return (
        <div>
            {/* Search Input */}
            <div className="relative mb-6">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search mutual funds (e.g., SBI, HDFC, Equity)..."
                            className="pr-10"
                        />

                        {/* Autocomplete Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div
                                ref={suggestionsRef}
                                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            >
                                {suggestions.map((suggestion, i) => (
                                    <div
                                        key={i}
                                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                        onClick={() => {
                                            setQuery(suggestion);
                                            handleSearch(suggestion);
                                        }}
                                    >
                                        <span className="text-gray-900 dark:text-gray-100">{suggestion}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button onClick={() => handleSearch()} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </div>
            </div>

            {/* Results */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Searching funds...</p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Found {results.length} funds</p>
                    {results.map((fund) => (
                        <Card key={fund.serial_number} className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline">#{fund.serial_number}</Badge>
                                        <span className="text-sm text-gray-600">{fund.fund_house}</span>
                                    </div>
                                    <h3 className="font-semibold text-lg">{fund.scheme_name}</h3>
                                </div>
                                <Button
                                    size="sm"
                                    variant={favorites.has(fund.serial_number) ? 'default' : 'outline'}
                                    onClick={() => toggleFavorite(fund)}
                                >
                                    {favorites.has(fund.serial_number) ? '⭐ Saved' : '☆ Save'}
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">NAV</p>
                                    <p className="font-semibold text-green-600">
                                        {fund.nav ? `₹${fund.nav.toFixed(4)}` : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Date</p>
                                    <p className="font-medium">{fund.nav_date || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Type</p>
                                    <Badge variant="secondary">{fund.scheme_type}</Badge>
                                </div>
                                <div>
                                    <p className="text-gray-600">Category</p>
                                    <Badge>{fund.scheme_category}</Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && query && results.length === 0 && (
                <div className="text-center py-12 text-gray-600">
                    No funds found. Try a different search term.
                </div>
            )}
        </div>
    );
}
