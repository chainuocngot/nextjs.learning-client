"use client"

import { useRouter } from "next/navigation"

const ButtonRedirect = () => {
  const router = useRouter()

  return (
    <div>
      <button onClick={() => router.push("/login")}>Chuyển sang Login</button>
    </div>
  )
}

export default ButtonRedirect
