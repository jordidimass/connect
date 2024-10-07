import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import Particles from "@/components/ui/particles"; // adjust the path if necessary

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="relative">
        <Particles className="absolute inset-0 -z-10" />
        <Component {...pageProps} />
      </div>
      <Analytics />
    </>
  );
}
