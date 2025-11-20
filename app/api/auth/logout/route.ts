import authApiRequest from "@/api-requests/auth"
import { HttpError } from "@/lib/http"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const req = await request.json()
  const force = req.force as boolean | undefined

  if (force) {
    return Response.json(
      {
        message: "Buộc đăng xuất thành công",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `sessionToken=; path=/; httpOnly`,
        },
      },
    )
  }

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("sessionToken")

  if (!sessionToken) {
    return Response.json(
      {
        message: "Không nhận được token",
      },
      {
        status: 401,
      },
    )
  }

  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value,
    )

    return Response.json(result.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; path=/; httpOnly`,
      },
    })
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      })
    } else {
      return Response.json(
        {
          message: "Lỗi ko xác định",
        },
        {
          status: 500,
        },
      )
    }
  }
}
