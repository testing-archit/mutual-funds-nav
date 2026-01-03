import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { favorites } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userFavorites = await db.query.favorites.findMany({
            where: eq(favorites.userId, session.user.id),
            orderBy: (favorites, { desc }) => [desc(favorites.addedAt)],
        });

        return NextResponse.json({ favorites: userFavorites });
    } catch (error) {
        console.error('Get favorites error:', error);
        return NextResponse.json({ error: 'Failed to get favorites' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { fundSerialNumber, fundName, fundHouse } = body;

        if (!fundSerialNumber || !fundName || !fundHouse) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [favorite] = await db.insert(favorites).values({
            userId: session.user.id,
            fundSerialNumber,
            fundName,
            fundHouse,
        }).returning();

        return NextResponse.json({ favorite });
    } catch (error: any) {
        if (error?.code === '23505') {
            return NextResponse.json({ error: 'Already in favorites' }, { status: 409 });
        }
        console.error('Add favorite error:', error);
        return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const fundSerialNumber = parseInt(searchParams.get('serial') || '0');

        if (!fundSerialNumber) {
            return NextResponse.json({ error: 'Serial number required' }, { status: 400 });
        }

        await db.delete(favorites).where(
            and(
                eq(favorites.userId, session.user.id),
                eq(favorites.fundSerialNumber, fundSerialNumber)
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete favorite error:', error);
        return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
    }
}
