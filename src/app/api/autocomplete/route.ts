import { NextRequest, NextResponse } from 'next/server';
import { getAutocompleteSuggestions } from '@/lib/amfi';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ suggestions: [] });
        }

        const suggestions = await getAutocompleteSuggestions(query, 10);

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error('Autocomplete error:', error);
        return NextResponse.json({ suggestions: [] });
    }
}
