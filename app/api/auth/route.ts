import { decodeJWT } from "@/lib/utils"

type PayloadJWT = {
  iat: number
  exp: number
  userId: number
  tokenType: string
}

export async function POST(request: Request) {
  const res = await request.json()
  const sessionToken = res?.sessionToken

  if (!sessionToken) {
    return Response.json(
      {
        message: "Không nhận được token",
      },
      {
        status: 400,
      },
    )
  }

  const payload = decodeJWT<PayloadJWT>(sessionToken)
  const expiresDate = new Date(payload.exp * 1000).toUTCString()

  return Response.json(res, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`,
    },
  })
}
