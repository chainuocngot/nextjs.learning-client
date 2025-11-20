import accountApiRequest from "@/api-requests/account"
import { cookies } from "next/headers"

export default async function Me() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("sessionToken")

  const result = await accountApiRequest.me(sessionToken?.value ?? "")

  return (
    <div>
      <h1>Profile</h1>
      <div>Xin chào {result.payload.data.name}</div>
    </div>
  )
}
