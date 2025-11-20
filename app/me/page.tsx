import accountApiRequest from "@/api-requests/account"
import Profile from "@/app/me/profile"
import ProfileForm from "@/app/me/profile-form"
import { cookies } from "next/headers"

export default async function Me() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("sessionToken")

  const result = await accountApiRequest.me(sessionToken?.value ?? "")

  return (
    <div>
      <h1>Profile</h1>
      <Profile />
      <ProfileForm profile={result.payload.data} />
    </div>
  )
}
