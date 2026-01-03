import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { searchHistory } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// Get search history
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const history = await db.query.searchHistory.findMany({
            where: eq(searchHistory.userId, session.user.id),
            orderBy: [desc(searchHistory.searchedAt)],
            limit: 20,
        });

        return NextResponse.json({ history });
    } catch (error) {
        console.error('Get history error:', error);
        return NextResponse.json({ error: 'Failed to get history' }, { status: 500 });
    }
}

// Add search to history
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { searchTerm } = body;

        if (!searchTerm) {
            return NextResponse.json({ error: 'Search term required' }, { status: 400 });
        }

        await db.insert(searchHistory).values({
            userId: session.user.id,
            searchTerm,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Add history error:', error);
        return NextResponse.json({ error: 'Failed to add to history' }, { status: 500 });
    }
}
