import { NextRequest, NextResponse } from 'next/server';
import { searchFunds } from '@/lib/amfi';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '100');

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter "q" is required' },
                { status: 400 }
            );
        }

        const funds = await searchFunds(query, limit);

        return NextResponse.json({
            success: true,
            data: funds,
            total: funds.length,
        });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Failed to search funds' },
            { status: 500 }
        );
    }
}
