import Header from "./header"
import Footer from "./footer"
import Loading from "./loading-wrapper"
import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {

  return (
    <>
      <Header />
        <main>{children}</main>
      <Footer />
    </>
  )
}
