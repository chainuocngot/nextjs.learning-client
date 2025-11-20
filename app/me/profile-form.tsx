"use client"

import accountApiRequest from "@/api-requests/account"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { handleErrorApi } from "@/lib/utils"
import {
  AccountResType,
  UpdateMeBody,
} from "@/schemaValidations/account.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type Profile = AccountResType["data"]

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof UpdateMeBody>>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: profile.name,
    },
  })

  async function onSubmit(values: z.infer<typeof UpdateMeBody>) {
    if (loading) return
    try {
      setLoading(true)
      const result = await accountApiRequest.updateMe(values)
      toast.success(result.payload.message)

      router.refresh()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-[400px] mx-auto"
      >
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            placeholder="Email"
            readOnly
            disabled
            type="email"
            value={profile.email}
          />
        </FormControl>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="Tên" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={loading}
          type="submit"
          className="w-full cursor-pointer"
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}
