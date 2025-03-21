'use client';

import { useEffect } from 'react';
import klaroConfig from '@/klaro-config';

declare global {
  interface Window {
    klaroConfig: any;
  }
}

export default function ConsentProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.klaroConfig = klaroConfig;
      import('klaro').then((klaro: any) => {
        klaro.setup(klaroConfig);
        klaro.show();
      });
    }
  }, []);

  return null;
}
