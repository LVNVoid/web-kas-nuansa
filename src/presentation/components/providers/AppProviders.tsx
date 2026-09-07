'use client';

import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';

export function AppProviders() {
  return (
    <>
      <NextTopLoader
        color="#0075de"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #0075de,0 0 5px #0075de"
      />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#191919',
            border: '1px solid #eae9e5',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '500',
            boxShadow: 'rgba(15, 15, 15, 0.08) 0px 4px 12px',
          },
          success: {
            iconTheme: {
              primary: '#0f7b34',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#d95700',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
}
