"use client"

class SessionToken {
  private token = ""
  private _expiresAt = new Date().toISOString()

  get value() {
    return this.token
  }

  set value(token: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side")
    }

    this.token = token
  }

  get expiresAt() {
    return this._expiresAt
  }

  set expiresAt(expiresAt: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side")
    }

    this._expiresAt = expiresAt
  }
}

export const clientSessionToken = new SessionToken()
