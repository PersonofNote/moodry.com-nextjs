import Layout from "../components/layout"
import { useSession } from "next-auth/react"

export default function IndexPage() {
  
  return (
    <Layout>
      <h1>TODO:</h1>
      <ul>
        <li> Fix Suspense component to properly show loading screens </li>
        <li> Implement better charts</li>
        <li>Implement datepicker</li>
        <li> Implement calendar view for easy viewing of time chunks </li>
        <li>Fix charts page so it loads with data, instead of making you click it first</li>
        <li>Implement subscriptions with Stripe</li>
        <li>Implement push notifications, configurable by user</li>
      </ul>
    </Layout>
  )
}


