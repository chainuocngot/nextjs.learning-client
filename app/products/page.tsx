import productApiRequest from "@/api-requests/product"
import DeleteProductButton from "@/app/products/_components/delete-product-button"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Danh sách sản phẩm",
  description: "Danh sách sản phẩm của Productic được tạo bởi Tôi",
}

export default async function Products() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("sessionToken")?.value ?? ""
  const isAuth = Boolean(sessionToken)

  const { payload } = await productApiRequest.getList()
  const productList = payload.data

  return (
    <div>
      <h1>Product List</h1>
      {isAuth && (
        <Link href="/products/add">
          <Button variant="secondary">Thêm sản phẩm</Button>
        </Link>
      )}
      <div className="space-y-5">
        {productList.map((product) => (
          <div key={product.id} className="flex space-x-4">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={180}
                height={180}
                className="size-32 object-cover"
              />
            </Link>
            <h3>{product.name}</h3>
            <div>{product.price}</div>
            {isAuth && (
              <div className="flex space-x-2 items-start">
                <Link href={`/products/${product.id}/edit`}>
                  <Button variant="outline" className="cursor-pointer">
                    Edit
                  </Button>
                </Link>
                <DeleteProductButton product={product} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
