export { auth as default } from '@/lib/auth';

export const config = {
    matcher: ['/dashboard/:path*', '/favorites/:path*', '/history/:path*', '/api/favorites/:path*', '/api/history/:path*'],
};
