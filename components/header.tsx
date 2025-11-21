import accountApiRequest from "@/api-requests/account"
import ButtonLogout from "@/components/button-logout"
import { ModeToggle } from "@/components/mode-toggle"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function Header() {
  const cookieStore = await cookies()

  const sessionToken = cookieStore.get("sessionToken")?.value ?? ""

  let me = null
  if (sessionToken) {
    const data = await accountApiRequest.me(sessionToken)
    me = data.payload.data
  }
  console.log(">> Check | me:", me)

  return (
    <div>
      <ul className="flex space-x-4">
        <li>
          <Link href="/products">Sản phẩm</Link>
        </li>
        {me ? (
          <>
            <li>Xin chào {me.name}</li>
            <li>
              <ButtonLogout />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Đăng nhập</Link>
            </li>
            <li>
              <Link href="/register">Đăng ký</Link>
            </li>
          </>
        )}
      </ul>
      <ModeToggle />
    </div>
  )
}
