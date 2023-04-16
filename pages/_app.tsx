import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from 'next-themes'
import "./styles/styles.scss"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  )
}
