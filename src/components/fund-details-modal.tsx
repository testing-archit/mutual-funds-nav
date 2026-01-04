'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Fund } from '@/lib/amfi';
import { Star, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface FundDetailsModalProps {
    fund: Fund | null;
    isOpen: boolean;
    onClose: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export function FundDetailsModal({
    fund,
    isOpen,
    onClose,
    isFavorite,
    onToggleFavorite,
}: FundDetailsModalProps) {
    const [copied, setCopied] = useState(false);

    if (!fund) return null;

    const copySchemeCode = () => {
        navigator.clipboard.writeText(fund.scheme_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getNavChangeIndicator = () => {
        // This would require historical data, returning neutral for now
        return { color: 'text-gray-600', text: 'No change data' };
    };

    const navChange = getNavChangeIndicator();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{fund.scheme_name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* NAV Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current NAV</p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-4xl font-bold text-gray-900 dark:text-white">
                                {fund.nav ? `₹${fund.nav.toFixed(4)}` : 'N/A'}
                            </p>
                            <span className={`text-sm ${navChange.color}`}>
                                {navChange.text}
                            </span>
                        </div>
                        {fund.nav_date && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                As of {new Date(fund.nav_date).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {/* Fund Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Fund House</p>
                            <p className="font-semibold text-lg">{fund.fund_house}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Serial Number</p>
                            <p className="font-semibold text-lg">#{fund.serial_number}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Scheme Type</p>
                            <Badge variant="outline" className="mt-1">
                                {fund.scheme_type}
                            </Badge>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                            <Badge className="mt-1">{fund.scheme_category}</Badge>
                        </div>

                        <div className="col-span-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Scheme Code</p>
                            <div className="flex items-center gap-2">
                                <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded font-mono text-sm">
                                    {fund.scheme_code}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={copySchemeCode}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ISIN Codes */}
                    {(fund.isin_payout || fund.isin_reinvest) && (
                        <div className="border-t pt-4">
                            <p className="text-sm font-semibold mb-3">ISIN Codes</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {fund.isin_payout && (
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Dividend Payout
                                        </p>
                                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                            {fund.isin_payout}
                                        </code>
                                    </div>
                                )}
                                {fund.isin_reinvest && (
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Growth/Reinvestment
                                        </p>
                                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                            {fund.isin_reinvest}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            onClick={onToggleFavorite}
                            variant={isFavorite ? 'default' : 'outline'}
                            className="flex-1"
                        >
                            <Star className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(fund.scheme_name)}`, '_blank')}
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Search Online
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
