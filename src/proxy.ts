import { auth } from '@/lib/auth';

export default auth;

export const config = {
    matcher: ['/dashboard/:path*', '/favorites/:path*', '/history/:path*', '/api/favorites/:path*', '/api/history/:path*'],
};
