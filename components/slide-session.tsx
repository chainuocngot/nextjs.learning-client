"use client"

import authApiRequest from "@/api-requests/auth"
import { clientSessionToken } from "@/lib/client-session-token"
import { useEffect } from "react"
import { differenceInHours } from "date-fns"

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date()
      const expiresAt = new Date(clientSessionToken.expiresAt)

      if (differenceInHours(expiresAt, now) < 1) {
        const res =
          await authApiRequest.sliceSessionFromNextClientToNextServer()

        clientSessionToken.expiresAt = res.payload.data.expiresAt
      }
    }, 60 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return null
}
