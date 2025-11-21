"use client"

import authApiRequest from "@/api-requests/auth"
import productApiRequest from "@/api-requests/product"
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
import { Textarea } from "@/components/ui/textarea"
import { handleErrorApi } from "@/lib/utils"
import { CreateProductBody } from "@/schemaValidations/product.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function ProductAddForm() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof CreateProductBody>>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
  })

  async function onSubmit(values: z.infer<typeof CreateProductBody>) {
    if (loading) return

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file as Blob)
      const uploadImageResult = await productApiRequest.uploadImage(formData)
      const imageUrl = uploadImageResult.payload.data
      const result = await productApiRequest.create({
        ...values,
        image: imageUrl,
      })

      toast.success(result.payload.message)

      router.push("/products")
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
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input placeholder="Giá" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <Input
                  placeholder="Hình ảnh"
                  type="file"
                  accept="image/*"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={(e: any) => (e.target.value = null)}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFile(file)
                      field.onChange("http://localhost:3000/" + file.name)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {file && (
          <div>
            <Image
              src={URL.createObjectURL(file)}
              alt="preview"
              className="size-32 object-cover"
              width={128}
              height={128}
            />
            <Button
              type="button"
              className="cursor-pointer"
              variant="destructive"
              size="sm"
              onClick={() => {
                setFile(null)
                form.setValue("image", "")
              }}
            >
              Xóa
            </Button>
          </div>
        )}

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
