import ButtonLogout from "@/components/button-logout"
import { ModeToggle } from "@/components/mode-toggle"
import { AccountResType } from "@/schemaValidations/account.schema"
import Link from "next/link"

export default async function Header({
  me,
}: {
  me: AccountResType["data"] | null
}) {
  return (
    <div>
      <ul className="flex space-x-4">
        <li>
          <Link href="/products">Sản phẩm</Link>
        </li>
        {me ? (
          <>
            <li>
              <Link href="/me">Xin chào {me.name}</Link>
            </li>
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
