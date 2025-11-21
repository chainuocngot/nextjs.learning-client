"use client"

import productApiRequest from "@/api-requests/product"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { handleErrorApi } from "@/lib/utils"
import { ProductResType } from "@/schemaValidations/product.schema"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function DeleteProductButton({
  product,
}: {
  product: ProductResType["data"]
}) {
  const router = useRouter()

  const deleteProduct = async () => {
    try {
      const result = await productApiRequest.delete(product.id)

      toast.success(result.payload.message)
      router.refresh()
    } catch (error) {
      handleErrorApi({
        error,
      })
    }
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="cursor-pointer">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có muốn xóa sản phẩm không?</AlertDialogTitle>
            <AlertDialogDescription>
              Sản phẩm &quot;{product.name}&quot; sẽ bị xóa vĩnh viễn
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={deleteProduct}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
