const klaroConfig = {
  version: 1,
  elementID: 'klaro',
  storageMethod: 'cookie',
  cookieName: 'klaro',
  cookieExpiresAfterDays: 365,
  default: false, // No consent by default
  mustConsent: false,
  acceptAll: true,
  hideDeclineAll: false,
  privacyPolicy: '/privacy-policy',
  translations: {
    en: {
      privacyPolicyUrl: '/privacy-policy',
    },
  },
  services: [
    {
      name: 'google-analytics',
      default: false,
      purposes: ['analytics'],
      required: false,
      cookies: [/^_ga/, /^_gid/, /^_gat/],
    },
    {
      name: 'google-ads',
      default: false,
      purposes: ['advertising'],
      required: false,
    },
  ],
  callback: function (consents: any) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      if (consents['google-analytics']) {
        window.gtag('consent', 'update', {
          ad_storage: 'granted',
          analytics_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      } else {
        window.gtag('consent', 'update', {
          ad_storage: 'denied',
          analytics_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  },
};

export default klaroConfig;
