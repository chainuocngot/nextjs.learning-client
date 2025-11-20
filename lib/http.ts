import envConfig from "@/config"
import { clientSessionToken } from "@/lib/client-session-token"
import { LoginResType } from "@/schemaValidations/auth.schema"

/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomRequestInit = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422

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

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: CustomRequestInit | undefined,
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders = {
    "Content-Type": "application/json",
  }

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl

  const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: { ...baseHeaders, ...options?.headers },
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
    } else {
      throw new HttpError(data)
    }
  }

  if (["/auth/login", "/auth/register"].includes(url)) {
    clientSessionToken.value = (payload as LoginResType).data.token
  } else if ("/auth/logout".includes(url)) {
    clientSessionToken.value = ""
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
