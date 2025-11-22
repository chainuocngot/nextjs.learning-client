"use client"

import authApiRequest from "@/api-requests/auth"
import { useEffect } from "react"
import { differenceInHours } from "date-fns"

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const sessionTokenExpiresAt = localStorage.getItem(
        "sessionTokenExpiresAt",
      )

      const now = new Date()
      const expiresAt = sessionTokenExpiresAt
        ? new Date(sessionTokenExpiresAt)
        : new Date()

      if (differenceInHours(expiresAt, now) < 1) {
        const res =
          await authApiRequest.sliceSessionFromNextClientToNextServer()

        localStorage.setItem(
          "sessionTokenExpiresAt",
          res.payload.data.expiresAt,
        )
      }
    }, 60 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return null
}
