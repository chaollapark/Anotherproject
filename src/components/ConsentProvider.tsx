'use client';

import { useEffect } from 'react';
import klaroConfig from '@/klaro-config';

declare global {
  interface Window {
    klaroConfig: any;
    klaro: any;
    gtag: (...args: any[]) => void;
  }
}

export default function ConsentProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.klaroConfig = klaroConfig;

      // Load Klaro and set up
      import('klaro').then((klaro: any) => {
        klaro.setup(klaroConfig);

        // 👇 Listen to consent changes and update Google Consent Mode
        klaro.on('consentChanged', (consents: any) => {
          const googleConsents = {
            analytics_storage: consents.googleAnalytics ? 'granted' : 'denied',
            ad_storage: consents.googleAds ? 'granted' : 'denied',
            ad_user_data: consents.googleAds ? 'granted' : 'denied',
            ad_personalization: consents.googleAds ? 'granted' : 'denied',
          };

          if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', googleConsents);
          }
        });

        // Optional: show Klaro modal on first load
        klaro.show();
      });
    }
  }, []);

  return null;
}
