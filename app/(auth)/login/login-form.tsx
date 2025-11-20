"use client"

import authApiRequest from "@/api-requests/auth"
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
import { clientSessionToken } from "@/lib/client-session-token"
import { handleErrorApi } from "@/lib/utils"
import { LoginBody } from "@/schemaValidations/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof LoginBody>>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof LoginBody>) {
    if (loading) return

    try {
      setLoading(true)
      const result = await authApiRequest.login(values)

      toast.success(result.payload.message)

      await authApiRequest.auth({
        sessionToken: result.payload.data.token,
      })

      clientSessionToken.value = result.payload.data.token
      // setSessionToken(result.payload.data.token)
      router.push("/me")
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="password" {...field} />
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
