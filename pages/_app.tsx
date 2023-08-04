import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from 'next-themes'
import "./styles/styles.css"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

import Loader from '../components/Loader'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <Suspense fallback={Loader}>
          <Component {...pageProps} />
        </Suspense>
      </SessionProvider>
    </ThemeProvider>
  )
}
