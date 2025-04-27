"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Award, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QuizGame from "./quiz-game"

interface WasteItem {
  id: number
  name: string
  type: string
  image: string
}

const wasteItems: WasteItem[] = [
  { id: 1, name: "", type: "plastic", image: "/images/plastic-bottle.png" },
  { id: 2, name: "", type: "paper", image: "/images/newspaper.png" },
  { id: 3, name: "", type: "metal", image: "/images/soda-can.png" },
  { id: 4, name: "", type: "glass", image: "/images/glass-bottle.png" },
  { id: 5, name: "", type: "organic", image: "/images/banana-peel.png" },
  { id: 6, name: "", type: "paper", image: "/images/cardboard-box.png" },
  { id: 7, name: "", type: "plastic", image: "/images/plastic-bag.png" },
  { id: 8, name: "", type: "organic", image: "/images/food-waste.png" },
]

const bins = [
  { id: 1, type: "plastic", name: "Plástico", color: "bg-yellow-500" },
  { id: 2, type: "paper", name: "Papel y cartón", color: "bg-blue-500" },
  { id: 3, type: "glass", name: "Vidrio", color: "bg-green-500" },
  { id: 4, type: "metal", name: "Metal", color: "bg-red-500" },
  { id: 5, type: "organic", name: "Orgánico", color: "bg-orange-500" },
]

export default function RecyclingGame() {
  const { toast } = useToast()
  const [currentItem, setCurrentItem] = useState<WasteItem | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [usedItems, setUsedItems] = useState<number[]>([])
  const [showQuizGame, setShowQuizGame] = useState(false)
  const [quizGameAvailable, setQuizGameAvailable] = useState(true)
  const [quizGameCompleted, setQuizGameCompleted] = useState(false)

  // Obtener el primer ítem al cargar
  useEffect(() => {
    const initialItems = wasteItems.filter(item => !usedItems.includes(item.id))
    if (initialItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * initialItems.length)
      setCurrentItem(initialItems[randomIndex])
    }
  }, [])

  // Elegir nuevo ítem cuando se actualiza la lista de usados
  useEffect(() => {
    if (!gameOver && !gameWon) {
      const remainingItems = wasteItems.filter(item => !usedItems.includes(item.id))
      if (remainingItems.length === 0) {
        setGameWon(true)
        setCurrentItem(null)
      } else {
        const randomIndex = Math.floor(Math.random() * remainingItems.length)
        setCurrentItem(remainingItems[randomIndex])
      }
    }
  }, [usedItems, gameOver, gameWon])

  const handleDrop = (binType: string) => {
    if (!currentItem || gameOver || gameWon) return

    if (currentItem.type === binType) {
      setScore(prev => prev + 10)
      setUsedItems(prev => [...prev, currentItem.id])
      toast({
        title: "¡Correcto!",
        description: `${currentItem.name} va en el contenedor de ${bins.find(bin => bin.type === binType)?.name}`,
      })
    } else {
      const newLives = lives - 1
      setLives(newLives)
      toast({
        title: "¡Incorrecto!",
        description: `${currentItem.name} no va en ese contenedor`,
        variant: "destructive",
      })
      if (newLives <= 0) {
        setGameOver(true)
        setCurrentItem(null)
      }
    }
  }

  const restartGame = () => {
    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameWon(false)
    setUsedItems([])
    setQuizGameAvailable(true)
    setQuizGameCompleted(false)

    const initialItems = wasteItems
    const randomIndex = Math.floor(Math.random() * initialItems.length)
    setCurrentItem(initialItems[randomIndex])
  }

  const handleQuizGameComplete = (points: number) => {
    setScore(prev => prev + points)
    setQuizGameCompleted(true)
    setShowQuizGame(false)
    toast({
      title: "¡Quiz completado!",
      description: `Has ganado ${points} puntos extra en el quiz de reciclaje.`,
    })
  }

  const handleCloseQuizGame = () => {
    setShowQuizGame(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Encabezado */}
        <header className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-green-700 hover:text-green-800">
            <ChevronLeft className="h-5 w-5" />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-green-500 px-3 py-1 text-white">
              <Award className="h-5 w-5" />
              <span className="font-bold">{score} puntos</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-5 w-5 rounded-full ${i < lives ? "bg-red-500" : "bg-gray-300"}`} />
              ))}
            </div>
          </div>
        </header>

        {/* Título */}
        <Card className="mb-6 border-4 border-green-400 bg-white/90 shadow-lg">
          <CardContent className="p-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-green-700">Maestro del Reciclaje</h1>
            <p className="text-lg text-green-600">¡Arrastra cada objeto al contenedor correcto para reciclar!</p>
          </CardContent>
        </Card>

        {/* Quiz */}
        {!gameOver && !gameWon && quizGameAvailable && (
          <Card className="mb-6 border-4 border-yellow-400 bg-white/90 shadow-lg">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-yellow-700">¡Quiz de Reciclaje!</h3>
                  <p className="text-sm text-yellow-600">Responde preguntas sobre reciclaje y gana puntos extra.</p>
                </div>
              </div>
              <Button onClick={() => setShowQuizGame(true)} className="rounded-full bg-yellow-500 hover:bg-yellow-600">
                Jugar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Estado del juego */}
        {(gameOver || gameWon) && (
          <Card className={`mb-6 border-4 ${gameOver ? "border-red-400" : "border-yellow-400"} bg-white/90 shadow-lg`}>
            <CardContent className="p-6 text-center">
              <h2 className={`mb-4 text-2xl font-bold ${gameOver ? "text-red-600" : "text-yellow-600"}`}>
                {gameOver ? "¡Juego terminado!" : "¡Felicidades! ¡Has ganado!"}
              </h2>
              <p className="mb-4 text-lg">Tu puntuación final: {score} puntos</p>
              <Button onClick={restartGame} className="rounded-full bg-green-500 px-6 py-2 text-white hover:bg-green-600">
                Jugar de nuevo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Juego activo */}
        {!gameOver && !gameWon && currentItem && (
          <div className="mb-8 flex flex-col items-center">
            <Card className="mb-4 border-4 border-blue-400 bg-white/90 shadow-md">
              <CardContent className="p-4 text-center">
                <Image
                  src={currentItem.image}
                  alt={currentItem.name}
                  width={120}
                  height={120}
                  className="mx-auto mb-2"
                />
                <h3 className="text-xl font-bold text-green-700">{currentItem.name}</h3>
                <p className="text-green-600">¿En qué contenedor va este objeto?</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {bins.map((bin) => (
                <button
                  key={bin.id}
                  onClick={() => handleDrop(bin.type)}
                  className={`flex h-32 w-24 flex-col items-center justify-center rounded-lg ${bin.color} p-2 text-white shadow-md transition-transform hover:scale-105 md:h-40 md:w-28`}
                >
                  <div className="mb-2 rounded-md bg-white/20 p-2">
                    <Image src={`/images/${bin.type}-bin.png`} alt={`Contenedor ${bin.name}`} width={40} height={40} />
                  </div>
                  <span className="font-bold">{bin.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progreso */}
        <div className="mt-4">
          <Progress value={(usedItems.length / wasteItems.length) * 100} className="h-4 bg-gray-200" />
          <p className="mt-2 text-center text-green-600">
            Progreso: {usedItems.length}/{wasteItems.length} objetos reciclados
          </p>
        </div>

        {/* Quiz Modal */}
        {showQuizGame && (
          <QuizGame onComplete={handleQuizGameComplete} onClose={handleCloseQuizGame} />
        )}
      </div>
    </div>
  )
}
