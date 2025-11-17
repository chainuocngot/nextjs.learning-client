import envConfig from "@/config"
import { cookies } from "next/headers"

export default async function Me() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("sessionToken")

  const response = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    },
  )

  const payload = await response.json()
  const data = {
    status: response.status,
    payload,
  }

  if (!response.ok) {
    throw data
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>Xin chào {data.payload.data.name}</div>
    </div>
  )
}
