import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Trang chủ",
}

export default function Home() {
  return (
    <main>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
      </ul>
    </main>
  )
}
