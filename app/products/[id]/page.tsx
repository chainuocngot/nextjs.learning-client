import productApiRequest from "@/api-requests/product"
import Image from "next/image"
import { Metadata, ResolvingMetadata } from "next"
import { cache } from "react"

const getDetail = cache(productApiRequest.getDetail)

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { id } = await params

  // fetch data
  const { payload } = await getDetail(Number(id))
  const product = payload.data

  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetail({ params, searchParams }: Props) {
  let product = undefined
  try {
    const { id } = await params
    const { payload } = await getDetail(Number(id))
    product = payload.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.message)
  }

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && (
        <div key={product.id} className="flex space-x-4">
          <Image
            src={product.image}
            alt={product.name}
            width={180}
            height={180}
            className="size-32 object-cover"
          />
          <h3>{product.name}</h3>
          <div>{product.price}</div>
        </div>
      )}
    </div>
  )
}
