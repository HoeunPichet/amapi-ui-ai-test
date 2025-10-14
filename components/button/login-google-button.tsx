"use client"

import { signIn } from "next-auth/react"

export function LoginGoogleButton() {
  return (
    <button
      onClick={() => signIn("keycloak", { callbackUrl: "/dashboard" })}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Sign in with Keycloak
    </button>
  )
}
