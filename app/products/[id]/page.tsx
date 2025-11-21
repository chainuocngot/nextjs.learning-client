import productApiRequest from "@/api-requests/product"

export default async function ProductEdit({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  let product = null
  try {
    const { id } = await params
    const { payload } = await productApiRequest.getDetail(Number(id))
    product = payload.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.message)
  }

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && <div>{product.name}</div>}
    </div>
  )
}
