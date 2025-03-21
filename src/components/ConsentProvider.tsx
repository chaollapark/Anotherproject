'use client';

import { useEffect } from 'react';
import klaroConfig from '@/klaro-config';

export default function ConsentProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('klaro').then((klaro: any) => {
        klaro.setup(klaroConfig);
      });
    }
  }, []);

  return null;
}
