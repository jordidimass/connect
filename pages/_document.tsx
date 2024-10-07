import { Html, Head, Main, NextScript } from 'next/document';
import Particles from "@/components/ui/particles";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>connect with me</title>
      <body className='bg-gradient-to-r from-gray-700 via-gray-900 to-black h-full'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
