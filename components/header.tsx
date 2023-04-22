import { useState } from 'react';
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.scss"
import { IoSettingsSharp } from "react-icons/io5"
import { GiHamburgerMenu } from "react-icons/gi";



export default function Header() {
  const { data: session, status } = useSession()
  const [ menuOpen, setMenuOpen ] = useState(false)

  const loading = status === "loading"

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <nav>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <a
                href={`/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign in
              </a>
            </>
          )}
        </p>
      </div>
      {session?.user && (
        <div className={styles.navBarFlex}>
          <ul className={styles.navItems}>
            <li className={styles.navItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/dashboard">Moods</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/charts">Charts</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/calendar">Calendar</Link>
            </li>
          </ul>
          <div className={styles.menuWrapper}>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <GiHamburgerMenu  />
          </button>
            <ul className={styles.hamburgerMenu + (menuOpen ? styles.open : '')}>
              <li >
                <Link href="/settings"><IoSettingsSharp size={'32px'}/></Link>
              </li>
              <li>
                <a
                href={`/api/auth/signin`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out
              </a>
            </li>
          </ul>
        </div>
        </div>
      )}
      </nav>
    </header>
  )
}
