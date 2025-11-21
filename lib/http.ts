import envConfig from "@/config"
import { clientSessionToken } from "@/lib/client-session-token"
import { normalizePath } from "@/lib/utils"
import { LoginResType } from "@/schemaValidations/auth.schema"
import { redirect } from "next/navigation"

/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomRequestInit = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }

  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error")
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: 422
  payload: EntityErrorPayload

  constructor(payload: EntityErrorPayload) {
    super({
      status: ENTITY_ERROR_STATUS,
      payload,
    })

    this.status = ENTITY_ERROR_STATUS
    this.payload = payload
  }
}

let clientLogoutRequest: null | Promise<any> = null

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: CustomRequestInit | undefined,
) => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined
  const baseHeaders =
    body instanceof FormData
      ? {
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        }
      : {
          "Content-Type": "application/json",
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        }

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl

  const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: { ...baseHeaders, ...options?.headers } as any,
    body,
    method,
  })
  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload,
  }

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(data.payload as EntityErrorPayload)
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({
              force: true,
            }),
            headers: {
              ...baseHeaders,
            } as any,
          })
          await clientLogoutRequest
          clientSessionToken.value = ""
          clientSessionToken.expiresAt = new Date().toISOString()

          clientLogoutRequest = null
          location.href = "/login"
        }
      } else {
        const sessionToken = (options?.headers as any).Authorization.split(
          "Bearer ",
        )[1]
        redirect(`/logout?sessionToken=${sessionToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }

  if (typeof window !== "undefined") {
    if (
      ["/auth/login", "/auth/register"].some(
        (path) => path === normalizePath(path),
      )
    ) {
      clientSessionToken.value = (payload as LoginResType).data.token
      clientSessionToken.expiresAt = (payload as LoginResType).data.expiresAt
    } else if ("auth/logout" === normalizePath(url)) {
      clientSessionToken.value = ""
      clientSessionToken.expiresAt = new Date().toISOString()
    }
  }

  return data
}

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomRequestInit, "body"> | undefined,
  ) {
    return request<Response>("GET", url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomRequestInit, "body"> | undefined,
  ) {
    return request<Response>("POST", url, { ...options, body })
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomRequestInit, "body"> | undefined,
  ) {
    return request<Response>("PUT", url, { ...options, body })
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomRequestInit, "body"> | undefined,
  ) {
    return request<Response>("DELETE", url, { ...options, body })
  },
}

export default http
