const klaroConfig = {
  version: 1,
  elementID: 'klaro',
  storageMethod: 'cookie',
  cookieExpiresAfterDays: 365,
  default: false,
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

export default klaroConfig;
