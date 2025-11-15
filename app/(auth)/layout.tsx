import Link from "next/link"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <h3>Auth Layout</h3>
      <div>
        <Link href="/">Home</Link>
      </div>
      {children}
    </main>
  )
}
