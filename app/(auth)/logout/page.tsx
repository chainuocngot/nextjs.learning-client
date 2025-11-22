"use client"

import authApiRequest from "@/api-requests/auth"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

function LogoutLogic() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sessionToken = searchParams.get("sessionToken")

  useEffect(() => {
    const localSessionToken = localStorage.getItem("sessionToken")
    if (sessionToken === localSessionToken) {
      authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
        router.push(`/login?redirectFrom=${pathname}`)
      })
    }
  }, [router, sessionToken, pathname])

  return <div>Logout</div>
}

export default function Logout() {
  return (
    <Suspense>
      <LogoutLogic />
    </Suspense>
  )
}
