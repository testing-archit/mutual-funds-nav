// AMFI service for fetching and parsing mutual fund data

export interface Fund {
    serial_number: number;
    fund_house: string;
    scheme_name: string;
    scheme_code: string;
    nav: number | null;
    nav_date: string | null;
    scheme_type: 'Direct' | 'Regular' | 'Unknown';
    scheme_category: 'Equity' | 'Debt' | 'Hybrid' | 'Liquid' | 'Index' | 'ELSS' | 'Others';
    isin_payout: string | null;
    isin_reinvest: string | null;
}

interface FundHouse {
    fund_house: string;
    schemes: any[];
}

// In-memory cache
let cache: { data: Fund[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Parse date string from AMFI format to ISO format
 */
function parseDate(dateStr: string): string | null {
    try {
        const months: Record<string, string> = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        const [day, monthStr, year] = dateStr.split('-');
        const month = months[monthStr];

        if (!month) return null;

        return `${year}-${month}-${day.padStart(2, '0')}`;
    } catch {
        return null;
    }
}

/**
 * Determine scheme type based on scheme name
 */
function determineSchemeType(schemeName: string): 'Direct' | 'Regular' | 'Unknown' {
    const upper = schemeName.toUpperCase();

    if (upper.includes('DIRECT') || upper.includes('DIR.')) {
        return 'Direct';
    } else if (upper.includes('REGULAR') || upper.includes('REG.')) {
        return 'Regular';
    }

    return 'Unknown';
}

/**
 * Determine scheme category based on scheme name
 */
function determineSchemeCategory(schemeName: string): string {
    const upper = schemeName.toUpperCase();

    const categories: Record<string, string[]> = {
        'Equity': ['EQUITY', 'LARGE CAP', 'MID CAP', 'SMALL CAP', 'MULTICAP', 'FLEXI CAP'],
        'Debt': ['DEBT', 'GILT', 'INCOME', 'CORPORATE BOND', 'CREDIT RISK'],
        'Hybrid': ['HYBRID', 'BALANCED', 'EQUITY SAVINGS'],
        'Liquid': ['LIQUID', 'OVERNIGHT', 'MONEY MARKET'],
        'Index': ['INDEX', 'ETF', 'NIFTY', 'SENSEX'],
        'ELSS': ['ELSS', 'TAX SAV'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => upper.includes(keyword))) {
            return category;
        }
    }

    return 'Others';
}

/**
 * Fetch and parse all funds from AMFI
 */
export async function getAllFunds(): Promise<Fund[]> {
    const now = Date.now();

    // Check cache
    if (cache && (now - cache.timestamp) < CACHE_TTL) {
        return cache.data;
    }

    try {
        const response = await fetch('https://www.amfiindia.com/spages/NAVAll.txt', {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from AMFI');
        }

        const rawData = await response.text();
        const lines = rawData.split('\n');
        const allFunds: Fund[] = [];
        let currentFundHouse: string | null = null;
        let serialNumber = 1;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            if (trimmedLine.includes('Scheme Code;ISIN Div Payout')) {
                continue;
            }

            if (!trimmedLine.includes(';')) {
                currentFundHouse = trimmedLine;
            } else {
                try {
                    const parts = trimmedLine.split(';');
                    if (parts.length >= 6 && currentFundHouse) {
                        let navValue: number | null = null;
                        try {
                            const navStr = parts[4]?.trim();
                            if (navStr && navStr.toUpperCase() !== 'N.A.') {
                                navValue = parseFloat(navStr);
                            }
                        } catch {
                            navValue = null;
                        }

                        const schemeName = parts[3]?.trim() || '';

                        allFunds.push({
                            serial_number: serialNumber++,
                            fund_house: currentFundHouse,
                            scheme_name: schemeName,
                            scheme_code: parts[0]?.trim() || '',
                            nav: navValue,
                            nav_date: parseDate(parts[5]?.trim() || '') || null,
                            scheme_type: determineSchemeType(schemeName),
                            scheme_category: determineSchemeCategory(schemeName) as any,
                            isin_payout: parts[1]?.trim() !== '-' ? parts[1]?.trim() : null,
                            isin_reinvest: parts[2]?.trim() !== '-' ? parts[2]?.trim() : null,
                        });
                    }
                } catch (error) {
                    console.warn('Error parsing line:', error);
                    continue;
                }
            }
        }

        // Update cache
        cache = {
            data: allFunds,
            timestamp: now
        };

        return allFunds;
    } catch (error) {
        console.error('Error fetching AMFI data:', error);
        throw error;
    }
}

/**
 * Search funds by query
 */
export async function searchFunds(query: string, limit: number = 100): Promise<Fund[]> {
    const allFunds = await getAllFunds();
    const searchTerm = query.toLowerCase();

    return allFunds
        .filter(fund =>
            fund.scheme_name.toLowerCase().includes(searchTerm) ||
            fund.fund_house.toLowerCase().includes(searchTerm)
        )
        .slice(0, limit);
}

/**
 * Get autocomplete suggestions
 */
export async function getAutocompleteSuggestions(query: string, limit: number = 10): Promise<string[]> {
    const allFunds = await getAllFunds();
    const searchTerm = query.toLowerCase();
    const suggestions = new Set<string>();

    for (const fund of allFunds) {
        if (suggestions.size >= limit) break;

        if (fund.scheme_name.toLowerCase().includes(searchTerm)) {
            suggestions.add(fund.scheme_name);
        } else if (fund.fund_house.toLowerCase().includes(searchTerm)) {
            suggestions.add(fund.fund_house);
        }
    }

    return Array.from(suggestions);
}
