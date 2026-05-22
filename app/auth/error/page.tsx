"use client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The sign in link is no longer valid.",
  OAuthSignin: "Could not sign in with this provider.",
  OAuthCallback: "Could not complete sign in.",
  OAuthCreateAccount: "Could not create account.",
  EmailCreateAccount: "Could not create account.",
  Callback: "Could not complete sign in.",
  OAuthAccountNotLinked: "This email is already linked to another account.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An error occurred during sign in.",
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") ?? "Default"
  const message = errorMessages[error] ?? errorMessages.Default

  return (
    <div className="max-w-md w-full mx-auto p-8 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Sign in error</h1>
      <p className="text-muted-foreground">{message}</p>
      <Button asChild>
        <Link href="/auth/login">Back to sign in</Link>
      </Button>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
}
