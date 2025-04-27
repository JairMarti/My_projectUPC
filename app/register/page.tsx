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

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!username || !password || !confirmPassword) {
      setError("Por favor completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    // For demo purposes, accept any registration
    // In a real app, you would send this to a database
    router.push("/dashboard")
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
              src="/images/register.png"
              alt="Register Character"
              width={80}
              height={80}
              className="rounded-full border-4 border-yellow-400 object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">¡Únete a EcoKids!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-green-700">
                Nombre de usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-full border-2 border-green-300 bg-green-50 text-lg"
                placeholder="Elige un nombre de usuario"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full border-2 border-green-300 bg-green-50 text-lg"
                placeholder="Crea una contraseña"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-700">
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-full border-2 border-green-300 bg-green-50 text-lg"
                placeholder="Repite tu contraseña"
              />
            </div>

            {error && <p className="text-center text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-full bg-green-500 text-lg font-bold text-white hover:bg-green-600"
            >
              ¡Registrarme!
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-blue-500 hover:underline">
                ¿Ya tienes cuenta? ¡Inicia sesión aquí!
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
          ¡Sabías que plantar un árbol ayuda a limpiar el aire y proporciona hogar a muchos animales!
        </p>
      </div>
    </div>
  )
}

