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
    // Wait for gtag to be available
    if (typeof window !== 'undefined') {
      const updateConsent = () => {
        if (typeof window.gtag === 'function') {
          const analyticsConsent = consents['google-analytics'];
          const adsConsent = consents['google-ads'];
  
          window.gtag('consent', 'update', {
            ad_storage: adsConsent ? 'granted' : 'denied',
            analytics_storage: analyticsConsent ? 'granted' : 'denied',
            ad_user_data: adsConsent ? 'granted' : 'denied',
            ad_personalization: adsConsent ? 'granted' : 'denied',
          });
  
          console.log('[Klaro] Consent update sent:', {
            ad_storage: adsConsent,
            analytics_storage: analyticsConsent,
          });
        } else {
          console.warn('[Klaro] gtag not ready, retrying...');
          setTimeout(updateConsent, 200); // Retry until gtag is defined
        }
      };
  
      updateConsent();
    }
  }
  
};

export default klaroConfig;
