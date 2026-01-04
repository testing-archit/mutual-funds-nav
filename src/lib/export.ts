import type { Favorite, SearchHistory } from './db/schema';
import type { Fund } from './amfi';

/**
 * Export data to CSV file and trigger download
 */
export function exportToCSV(data: any[], filename: string) {
    if (typeof window === 'undefined') return;

    // Use papaparse for CSV generation
    const Papa = require('papaparse');

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Export favorites to CSV
 */
export function exportFavorites(favorites: Favorite[]) {
    const data = favorites.map(fav => ({
        'Serial Number': fav.fundSerialNumber,
        'Fund Name': fav.fundName,
        'Fund House': fav.fundHouse,
        'Added On': new Date(fav.addedAt).toLocaleDateString(),
    }));

    const filename = `favorites-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(data, filename);
}

/**
 * Export search history to CSV
 */
export function exportSearchHistory(history: SearchHistory[]) {
    const data = history.map(item => ({
        'Search Term': item.searchTerm,
        'Searched At': new Date(item.searchedAt).toLocaleString(),
    }));

    const filename = `search-history-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(data, filename);
}

/**
 * Export search results to CSV
 */
export function exportSearchResults(results: Fund[]) {
    const data = results.map(fund => ({
        'Serial Number': fund.serial_number,
        'Fund House': fund.fund_house,
        'Scheme Name': fund.scheme_name,
        'Scheme Code': fund.scheme_code,
        'NAV': fund.nav || 'N/A',
        'NAV Date': fund.nav_date || 'N/A',
        'Scheme Type': fund.scheme_type,
        'Category': fund.scheme_category,
    }));

    const filename = `search-results-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(data, filename);
}
