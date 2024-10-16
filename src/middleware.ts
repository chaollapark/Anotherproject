import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();

// Match against pages that require authentication
// Leave this out if you want authentication on every page in your application
export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/new-listing',
    '/new-listing/form',
    '/new-listing/:orgId*',
    '/new-company',
    '/jobs/:orgId*',
    '/jobs/edit/:jobId*',
    '/show/:jobId*',
    '/pricing',
    '/user',
    '/checkout',
    '/api/checkout_sessions',
    '/list-prices',
    '/job-listings',
    '/job-cancel',
    '/job-success',
    '/api/job/:jobId*'
  ]
};
