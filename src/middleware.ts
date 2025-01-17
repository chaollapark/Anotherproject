import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  redirectUri: process.env.WORKOS_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
});

// Match against pages that require authentication
export const config = {
  matcher: [
    // Paths that require authentication
    '/dashboard',
    '/new-listing',
    '/new-listing/form',
    '/new-company',
    '/jobs/edit/:jobId*', 
    '/jobs/edit/[id]',
    '/user',
    '/checkout',
    '/list-prices',
    '/job-listings',
    '/job-cancel',
    '/job-success',
    '/blog/:path*',
    
    '/api/jobs/:path*',
    '/api/jobs/[id]',
    '/api/:path*',

    // Exclude public routes like '/', '/blog', etc.
    '/((?!api|blog|_next/static|_next/image|favicon.ico).*)', // Auth applied to everything except public routes
  ],
};
