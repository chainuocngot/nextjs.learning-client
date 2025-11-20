import authApiRequest from "@/api-requests/auth"
import { HttpError } from "@/lib/http"
import { cookies } from "next/headers"

export async function POST() {
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
