"use client"

import authApiRequest from "@/api-requests/auth"
import { Button } from "@/components/ui/button"
import { handleErrorApi } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

export default function ButtonLogout() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer()
      router.push("/login")
    } catch (error) {
      handleErrorApi({
        error,
      })

      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        router.push(`/login?redirectFrom=${pathname}`)
      })
    } finally {
      router.refresh()
    }
  }

  return (
    <Button size="sm" onClick={handleLogout}>
      Đăng xuất
    </Button>
  )
}
