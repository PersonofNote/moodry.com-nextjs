import Link from "next/link"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          ©Aminorstudio 2023
        </li>
        <li><Link href="/worklog">Work List</Link></li>
      </ul>
    </footer>
  )
}
