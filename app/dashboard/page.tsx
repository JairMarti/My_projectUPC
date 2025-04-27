"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Calendar,
  Gamepad2,
  Home,
  LogOut,
  User,
  Droplets,
  Recycle,
  Leaf,
  ImageIcon,
  Zap,
  TreesIcon as Tree,
  CloudRain,
} from "lucide-react"
import { usePoints } from "@/context/points-context"

export default function Dashboard() {
  const { totalPoints } = usePoints()
  const [dailyChallenge, setDailyChallenge] = useState({
    completed: false,
    title: "Ahorra agua mientras te cepillas los dientes",
  })
  const [level, setLevel] = useState(2)
  const [progress, setProgress] = useState(60)

  const completeChallenge = () => {
    setDailyChallenge({ ...dailyChallenge, completed: true })
    setProgress(Math.min(progress + 20, 100))

    if (progress + 20 >= 100) {
      setLevel(level + 1)
      setProgress(0)
    }
  }

  // Imágenes de la web con enlaces externos para la vista previa
  const webImages = [
    { id: 1, src: "https://i.postimg.cc/N0XBg7yq/1.jpg", title: "Niños cuidando el planeta" },
    { id: 2, src: "https://i.postimg.cc/QC83k2fh/descarga.jpg", title: "Niños sosteniendo la Tierra" },
    { id: 3, src: "https://i.postimg.cc/1tcSFmcv/images.jpg", title: "Planeta en forma de corazón" },
    { id: 4, src: "https://i.postimg.cc/L4DR6ssX/maxresdefault.jpg", title: "Niños limpiando el parque" },
    { id: 5, src: "https://i.postimg.cc/TYPxyXyc/medio-ambiente.jpg", title: "Niños curando el planeta" },
    {
      id: 6,
      src: "https://i.postimg.cc/2y0fH0tv/65946347-ni-os-globe-para-el-medio-ambiente-verde-d-a-de-la-tierra-d-a-de-reciclaje.jpg",
      title: "Niños alrededor del mundo",
    },
    { id: 7, src: "https://i.postimg.cc/rFYkxYx2/nin-os.jpg", title: "Planeta verde" },
    { id: 8, src: "/images/plastic-bottle.png", title: "Reciclaje de plástico" },
  ]

  // Lista de juegos disponibles
  const availableGames = [
    {
      id: "recycling",
      name: "Maestro del Reciclaje",
      description: "Aprende a clasificar la basura en los contenedores correctos.",
      icon: Recycle,
      color: "bg-green-100",
      textColor: "text-green-700",
      iconColor: "text-green-600",
      image: "/images/master-recycle.png",
    },
    {
      id: "water",
      name: "Guardianes del Agua",
      description: "Juego de memoria con gotas de agua.",
      icon: Droplets,
      color: "bg-blue-100",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
      image: "/images/water-game.png",
    },
    {
      id: "energy",
      name: "Energía Limpia",
      description: "Rompecabezas de energías renovables.",
      icon: Zap,
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-600",
      image: "/images/energy-game.png",
    },
    {
      id: "trees",
      name: "Protectores de Árboles",
      description: "Puzzle deslizante de árboles y bosques.",
      icon: Tree,
      color: "bg-emerald-100",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-600",
      image: "/images/tree-game.png",
    },
    {
      id: "climate",
      name: "Detectives del Clima",
      description: "Quiz sobre el cambio climático.",
      icon: CloudRain,
      color: "bg-purple-100",
      textColor: "text-purple-700",
      iconColor: "text-purple-600",
      image: "/images/clima-game.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100">
      <header className="bg-green-500 p-4 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="https://i.postimg.cc/DZSQWHPY/c842716a-6ddb-477f-8c31-d37501821d23.png"
              alt="EcoKids Logo"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
              unoptimized
            />
            <h1 className="text-2xl font-bold">EcoKids</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-green-600 px-3 py-1">
              <Award className="h-5 w-5 text-yellow-300" />
              <span className="font-bold">{totalPoints} puntos</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-600 px-3 py-1">
              <Leaf className="h-5 w-5 text-yellow-300" />
              <span className="font-bold">Nivel {level}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6 rounded-xl bg-white/80 p-4 shadow-md">
          <h2 className="mb-2 text-xl font-bold text-green-700">¡Hola, EcoAmigo!</h2>
          <p className="mb-3 text-green-600">Sigue avanzando para convertirte en un Superhéroe del Planeta</p>
          <Progress value={progress} className="h-4 bg-gray-200" />
          <div className="mt-2 flex justify-between text-sm text-green-600">
            <span>Nivel {level}</span>
            <span>Nivel {level + 1}</span>
          </div>
        </div>

        <Tabs defaultValue="home" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-green-100">
            <TabsTrigger value="home" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Home className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Gamepad2 className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Calendar className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <ImageIcon className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <User className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4">
            <Card className="border-4 border-yellow-400 bg-white/90 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-green-600">Reto del día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/challenges-icon.png"
                    alt="Daily Challenge"
                    width={80}
                    height={80}
                    className="rounded-full bg-blue-100 p-1 object-cover"
                    unoptimized
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-green-700">{dailyChallenge.title}</h3>
                    <p className="text-sm text-green-600">¡Completa este reto y gana 25 puntos eco!</p>
                  </div>
                  <Button
                    onClick={completeChallenge}
                    disabled={dailyChallenge.completed}
                    className="rounded-full bg-green-500 hover:bg-green-600"
                  >
                    {dailyChallenge.completed ? "¡Completado!" : "Completar"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-4 border-green-400 bg-white/90 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-600">Juegos populares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableGames.slice(0, 3).map((game) => (
                      <Link
                        key={game.id}
                        href={`/games/${game.id}`}
                        className={`flex items-center gap-3 rounded-lg ${game.color} p-3 transition-colors hover:bg-opacity-80`}
                      >
                        <game.icon className={`h-8 w-8 ${game.iconColor}`} />
                        <div>
                          <h4 className={`font-bold ${game.textColor}`}>{game.name}</h4>
                          <p className={`text-sm ${game.textColor} opacity-80`}>{game.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-blue-400 bg-white/90 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-600">Tus logros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`mb-1 rounded-full p-2 ${i <= 3 ? "bg-yellow-100" : "bg-gray-200"}`}>
                          <Award className={`h-8 w-8 ${i <= 3 ? "text-yellow-500" : "text-gray-400"}`} />
                        </div>
                        <span className="text-center text-xs font-medium">{i <= 3 ? "Logro " + i : "Bloqueado"}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Juegos Ecológicos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableGames.map((game) => (
                <Link key={game.id} href={`/games/${game.id}`}>
                  <Card className="border-4 border-green-400 bg-white/90 shadow-md transition-transform hover:scale-105">
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-center">
                        <div className={`rounded-full ${game.color} p-4`}>
                          <Image
                            src={game.image || "/placeholder.svg"}
                            alt={game.name}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                      <h3 className={`mb-2 text-center text-xl font-bold ${game.textColor}`}>{game.name}</h3>
                      <p className={`text-center ${game.textColor} opacity-80`}>{game.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Retos Ecológicos</h2>
            <Card className="border-4 border-yellow-400 bg-white/90 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-green-600">Reto del día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/challenges-icon.png"
                    alt="Daily Challenge"
                    width={80}
                    height={80}
                    className="rounded-full bg-blue-100 p-1 object-cover"
                    unoptimized
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-green-700">{dailyChallenge.title}</h3>
                    <p className="text-sm text-green-600">¡Completa este reto y gana 25 puntos eco!</p>
                  </div>
                  <Button
                    onClick={completeChallenge}
                    disabled={dailyChallenge.completed}
                    className="rounded-full bg-green-500 hover:bg-green-600"
                  >
                    {dailyChallenge.completed ? "¡Completado!" : "Completar"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <h3 className="mt-4 text-xl font-bold text-green-700">Próximos retos</h3>
            <div className="space-y-3">
              {[
                "Planta una semilla y cuídala",
                "Recoge basura en tu parque local",
                "Usa una botella reutilizable todo el día",
                "Apaga las luces que no necesites",
              ].map((challenge, index) => (
                <Card key={index} className="bg-white/90 shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-full bg-gray-200 p-2">
                      <Calendar className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700">{challenge}</h4>
                      <p className="text-sm text-green-600">Disponible en {index + 1} día(s)</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Galería de Imágenes</h2>
            <p className="mb-4 text-green-600">
              Explora nuestra colección de imágenes sobre el medio ambiente y aprende mientras te diviertes.
            </p>

            <Link href="/web">
              <Card className="border-4 border-green-400 bg-white/90 shadow-md transition-transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-4">
                      <ImageIcon className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-center text-xl font-bold text-green-700">Ver Galería Completa</h3>
                  <p className="text-center text-green-600">
                    Descubre imágenes sobre reciclaje, ahorro de agua, energía y naturaleza.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {webImages.slice(0, 8).map((image) => (
                <div key={image.id} className="overflow-hidden rounded-lg border-2 border-green-300 bg-white shadow-sm">
                  <div className="relative h-32 w-full">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.title}
                      fill
                      className="object-cover"
                      unoptimized={image.src.startsWith("http")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="border-4 border-green-400 bg-white/90 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Image
                    src="/images/avatar_tierra.png"
                    alt="Profile Avatar"
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-green-500 object-cover"
                    unoptimized
                  />
                </div>
                <h2 className="mb-1 text-2xl font-bold text-green-700">EcoAmigo</h2>
                <p className="mb-4 text-green-600">Nivel {level} - Defensor del Planeta</p>

                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-green-600">Progreso al siguiente nivel</p>
                  <Progress value={progress} className="h-4 bg-gray-200" />
                  <p className="mt-1 text-xs text-green-600">{progress}% completado</p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-green-100 p-4">
                    <p className="text-sm text-green-600">Puntos Eco</p>
                    <p className="text-2xl font-bold text-green-700">{totalPoints}</p>
                  </div>
                  <div className="rounded-lg bg-yellow-100 p-4">
                    <p className="text-sm text-yellow-600">Logros</p>
                    <p className="text-2xl font-bold text-yellow-700">3/12</p>
                  </div>
                </div>

                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

