import '@/styles/global.scss';
// Component styles (Next.js requires global CSS imports in _app)
import '@/components/Header/styles.scss';
import '@/components/Footer/styles.scss';
import '@/components/Menu/styles.scss';
import '@/components/Login/styles.scss';
import '@/components/Signup/styles.scss';
import '@/components/FindUsername/styles.scss';
import '@/components/FindPassword/styles.scss';
import '@/components/Home/styles.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
