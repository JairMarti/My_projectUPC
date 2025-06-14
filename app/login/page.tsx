"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// IMPORTA FIREBASE
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Por favor completa todos los campos")
      return
    }
    router.push("/dashboard")
  }

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return
    setIsLoggingIn(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push("/dashboard")
    } catch (err) {
      console.error("Error al iniciar sesión con Google:", err)
      setError("No se pudo iniciar sesión con Google.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2">
        <Image
          src="https://i.postimg.cc/DZSQWHPY/c842716a-6ddb-477f-8c31-d37501821d23.png"
          alt="EcoKids Logo"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-xl font-bold text-green-600">EcoKids</span>
      </Link>

      <Card className="w-full max-w-md border-4 border-green-400 bg-white/90 shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Image
              src="/images/avatar.png"
              alt="Login Character"
              width={80}
              height={80}
              className="rounded-full border-4 border-yellow-400 object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">¡Inicia sesión en EcoKids!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-green-700">Nombre de usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-full border-2 border-green-300 bg-green-50 text-lg"
                placeholder="Tu nombre aquí"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-700">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full border-2 border-green-300 bg-green-50 text-lg"
                placeholder="Tu contraseña secreta"
              />
              <small className="text-gray-400">Nunca compartas tu contraseña con nadie.</small>
            </div>

            {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-full bg-green-500 text-lg font-bold text-white hover:bg-green-600"
            >
              ¡Entrar!
            </Button>

            <div className="my-4 flex items-center">
              <Separator className="flex-1" />
              <span className="mx-2 text-sm text-gray-500">o</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white text-lg font-medium hover:bg-gray-50"
            >
              {isLoggingIn ? (
                "Cargando..."
              ) : (
                <>
                  <Image
                    src="/images/google-logo.png"
                    alt="Google logo"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  Iniciar sesión con Google
                </>
              )}
            </Button>

            <div className="text-center">
              <Link href="/register" className="text-blue-500 hover:underline">
                ¿No tienes cuenta? ¡Regístrate aquí!
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-4">
        <Image
          src="/images/eco-tip.png"
          alt="Eco Tip"
          width={60}
          height={60}
          className="rounded-full bg-yellow-200 p-1 object-cover"
        />
        <p className="max-w-xs rounded-xl bg-white/80 p-3 text-green-700 shadow-md">
          ¡Sabías que apagar las luces cuando no las necesitas ayuda a ahorrar energía y proteger el planeta!
        </p>
      </div>
    </div>
  )
}

