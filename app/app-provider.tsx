"use client"

import { AccountResType } from "@/schemaValidations/account.schema"
import { createContext, PropsWithChildren, useContext, useState } from "react"

type Me = AccountResType["data"]

const AppContext = createContext<{
  me: Me | null
  setMe: (me: Me | null) => void
}>({
  me: null,
  setMe: () => {},
})

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("Must inside AppProvider")
  }
  return context
}

export default function AppProvider({
  children,
  me: initialMe,
}: PropsWithChildren & {
  me: Me | null
}) {
  const [me, setMe] = useState<Me | null>(initialMe)

  return <AppContext value={{ me, setMe }}>{children}</AppContext>
}
