import Layout from "../components/layout"
import { useSession } from "next-auth/react"

export default function IndexPage() {
  
  return (
    <Layout>
      <h1>Moodry</h1>
      <p>
        This site is a work in progress
      </p>
    </Layout>
  )
}


