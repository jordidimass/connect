import { Html, Head, Main, NextScript } from 'next/document';
import Particles from "@/components/ui/particles";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>connect with me</title>
      <body className='bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
        <Main />
        <NextScript />
        <Particles className="absolute inset-0 z-50" />
      </body>
    </Html>
  );
}
