// klaro-config.js (placed at your project root) don't understand why I had to put this at the root (will reserch)
var klaroConfig = {
    version: 1,
    elementID: 'klaro',
    storageMethod: 'cookie',
    cookieExpiresAfterDays: 365,
    default: false, // no consent by default
    mustConsent: false,
    acceptAll: true,
    hideDeclineAll: false,
    translations: {
      en: {
        privacyPolicyUrl: '/privacy-policy',
      },
    },
    services: [
      {
        name: 'google-analytics',
        purposes: ['analytics'],
        cookies: ['_ga', '_gid', '_gat'],
        required: false,
      },
      {
        name: 'google-ads',
        purposes: ['advertising'],
        required: false,
      },
    ],
  };
  