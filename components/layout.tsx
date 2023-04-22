import Header from "./header"
import Footer from "./footer"
import Loading from "./loading-wrapper"
import type { ReactNode } from "react"
import { useState, Suspense } from 'react'

export default function Layout({ children }: { children: ReactNode }) {

  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <main>{children}</main>
      </Suspense>
      <Footer />
    </>
  )
}
