'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load GA script early */}
      <Script
        strategy="beforeInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-G616KE1CWQ"
      />
      {/* Setup Consent Mode and default consent */}
      <Script
        id="google-analytics"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent to denied until user accepts via Klaro
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });

            gtag('js', new Date());
            gtag('config', 'G-G616KE1CWQ');
          `,
        }}
      />
    </>
  );
}
