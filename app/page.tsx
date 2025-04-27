import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-100 to-blue-100">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="https://i.postimg.cc/DZSQWHPY/c842716a-6ddb-477f-8c31-d37501821d23.png"
              alt="EcoKids Logo"
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
            <h1 className="text-3xl font-bold text-green-600">EcoKids</h1>
          </div>
          <Link href="/login">
            <Button className="rounded-full bg-yellow-400 text-green-800 hover:bg-yellow-500">¡Comenzar!</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto flex-1 py-12">
        <div className="grid gap-12">
          <section className="text-center">
            <h2 className="mb-6 text-4xl font-bold text-green-700">¡Aprende a cuidar el planeta jugando!</h2>
            <p className="mx-auto max-w-2xl text-xl text-green-600">
            Cuidando el planeta, jugando y aprendiendo.
            </p>
          </section>

          <section>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-4 border-green-400 bg-white/80 shadow-lg transition-transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-4">
                      <Image
                        src="/images/games-icon.png"
                        alt="Juegos"
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-green-600">Juegos Divertidos</h3>
                  <p className="text-green-700">Aprende a reciclar, ahorrar agua y más con juegos interactivos.</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-blue-400 bg-white/80 shadow-lg transition-transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-blue-100 p-4">
                      <Image
                        src="/images/challenges-icon.png"
                        alt="Retos"
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-blue-600">Retos Diarios</h3>
                  <p className="text-blue-700">Completa retos ecológicos y ayuda a salvar el planeta cada día.</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-yellow-400 bg-white/80 shadow-lg transition-transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-yellow-100 p-4">
                      <Image
                        src="/images/rewards-icon.png"
                        alt="Premios"
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-yellow-600">Recompensas</h3>
                  <p className="text-yellow-700">Gana premios y medallas por tus buenas acciones verdes.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="rounded-3xl bg-white/60 p-8 shadow-lg">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex items-center justify-center">
                <Image
                  src="/images/Amistad.png"
                  alt="Personajes EcoKids"
                  width={300}
                  height={300}
                  className="rounded-xl"
                  unoptimized
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="mb-4 text-3xl font-bold text-green-600">Conoce a nuestros amigos</h2>
                <p className="mb-6 text-lg text-green-700">
                  
                </p>
                <Link href="/login">
                  <Button className="w-full rounded-full bg-green-500 text-white hover:bg-green-600 md:w-auto">
                    ¡Comienza tu aventura!
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-green-500 py-6 text-center text-white">
        <p>© 2025 EcoKids - Aprendiendo a cuidar nuestro planeta</p>
        <p> Auth: Jair Martinez & Freddy Pontón</p>
      </footer>
    </div>
  )
}

