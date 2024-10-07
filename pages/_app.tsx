import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import Particles from "@/components/ui/particles";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="relative z-10">
        <Particles className="absolute inset-0 -z-10" />
        <Component {...pageProps} />
      </div>
      <Analytics />
    </>
  );
}
