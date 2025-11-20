"use client"

import { clientSessionToken } from "@/lib/client-session-token"
import { PropsWithChildren, useState } from "react"

export default function AppProvider({
  children,
  initialSessionToken = "",
}: PropsWithChildren & {
  initialSessionToken?: string
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = initialSessionToken
    }
  })

  return children
}
