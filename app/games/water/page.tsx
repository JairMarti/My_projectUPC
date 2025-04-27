"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Award, Droplets } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePoints } from "@/context/points-context"

type MemoryCard = {
  id: number
  type: string
  image: string
  matched: boolean
  description: string
}

const memoryCards: MemoryCard[] = [
  { id: 1, type: "drop1", image: "/images/water-action1.png", matched: false, description: "Cierra el grifo mientras te cepillas los dientes" },
  { id: 2, type: "drop1", image: "/images/water-action1.png", matched: false, description: "Cierra el grifo mientras te cepillas los dientes" },
  { id: 3, type: "drop2", image: "/images/water-action2.png", matched: false, description: "Ducharse rápido ahorra mucha agua" },
  { id: 4, type: "drop2", image: "/images/water-action2.png", matched: false, description: "Ducharse rápido ahorra mucha agua" },
  { id: 5, type: "drop3", image: "/images/water-action3.png", matched: false, description: "Recoge agua de lluvia para las plantas" },
  { id: 6, type: "drop3", image: "/images/water-action3.png", matched: false, description: "Recoge agua de lluvia para las plantas" },
  { id: 7, type: "drop4", image: "/images/water-action4.png", matched: false, description: "Arregla los grifos que gotean" },
  { id: 8, type: "drop4", image: "/images/water-action4.png", matched: false, description: "Arregla los grifos que gotean" },
  { id: 9, type: "drop5", image: "/images/water-action5.png", matched: false, description: "Usa un vaso para enjuagarte" },
  { id: 10, type: "drop5", image: "/images/water-action5.png", matched: false, description: "Usa un vaso para enjuagarte" },
  { id: 11, type: "drop6", image: "/images/water-action6.png", matched: false, description: "Lavar el auto con baldes y no con manguera" },
  { id: 12, type: "drop6", image: "/images/water-action6.png", matched: false, description: "Lavar el auto con baldes y no con manguera" },
]

export default function WaterGame() {
  const { toast } = useToast()
  const { addPoints } = usePoints()

  const [cards, setCards] = useState<MemoryCard[]>([])
  const [turns, setTurns] = useState(0)
  const [firstChoice, setFirstChoice] = useState<MemoryCard | null>(null)
  const [secondChoice, setSecondChoice] = useState<MemoryCard | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [score, setScore] = useState(0)
  const [waterSaved, setWaterSaved] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [currentTip, setCurrentTip] = useState("")

  const shuffleCards = () => {
    const shuffled = [...memoryCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

    setCards(shuffled)
    setFirstChoice(null)
    setSecondChoice(null)
    setTurns(0)
    setMatchedPairs(0)
    setGameCompleted(false)
    setScore(0)
    setWaterSaved(0)
    setCurrentTip("")
  }

  useEffect(() => {
    shuffleCards()
  }, [])

  useEffect(() => {
    if (!firstChoice || !secondChoice) return

    setDisabled(true)

    if (firstChoice.type === secondChoice.type) {
      setCards((prev) =>
        prev.map((card) =>
          card.type === firstChoice.type ? { ...card, matched: true } : card
        )
      )
      setMatchedPairs((prev) => prev + 1)
      setCurrentTip(firstChoice.description)

      toast({
        title: "¡Par encontrado! 💧",
        description: firstChoice.description,
      })

      setTimeout(() => {
        resetTurn()
      }, 1000)
    } else {
      setTimeout(() => {
        resetTurn()
      }, 1000)
    }
  }, [firstChoice, secondChoice])

  useEffect(() => {
    if (matchedPairs === memoryCards.length / 2 && !gameCompleted) {
      setGameCompleted(true)

      const basePoints = 120
      const penaltyPerExtraTurn = 5
      const minTurns = 12
      const finalScore = Math.max(12, basePoints - Math.max(0, turns - minTurns) * penaltyPerExtraTurn)

      setScore(finalScore)
      setWaterSaved(finalScore * 12)

      addPoints(finalScore)

      toast({
        title: "¡JUEGO COMPLETADO! 🎉",
        description: `¡Has completado el juego en ${turns} turnos y ganado ${finalScore} puntos!`,
      })
    }
  }, [matchedPairs])

  const handleChoice = (card: MemoryCard) => {
    if (disabled) return
    if (firstChoice && secondChoice) return
    if (!firstChoice) {
      setFirstChoice(card)
    } else if (card.id !== firstChoice.id) {
      setSecondChoice(card)
    }
  }

  const resetTurn = () => {
    setFirstChoice(null)
    setSecondChoice(null)
    setTurns((prev) => prev + 1)
    setDisabled(false)
  }

  const resetGame = () => {
    shuffleCards()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center space-x-1">
              <ChevronLeft className="w-4 h-4" />
              <span>Volver</span>
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Award className="text-yellow-500" />
            <span className="font-bold text-lg">{score} pts</span>
            <Droplets className="text-blue-500" />
            <span className="text-blue-800 font-semibold">{waterSaved} ml</span>
          </div>
        </div>

        <Progress value={(matchedPairs / (memoryCards.length / 2)) * 100} />

        {currentTip && (
          <div className="bg-white p-4 rounded-xl shadow text-blue-800 font-medium text-center">
            💡 {currentTip}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              onClick={() => handleChoice(card)}
              className={`cursor-pointer transition-transform duration-200 ${
                card === firstChoice || card === secondChoice || card.matched
                  ? "bg-white"
                  : "bg-blue-300"
              }`}
            >
              <CardContent className="flex justify-center items-center p-2 h-24">
                {(card === firstChoice || card === secondChoice || card.matched) ? (
                  <Image src={card.image} alt="card image" width={80} height={80} />
                ) : (
                  <div className="w-20 h-20 bg-blue-200 rounded-lg" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {gameCompleted && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-700">¡Juego completado! 🎉</h2>
            <p>Has ganado {score} puntos y ahorrado {waterSaved} ml de agua.</p>
            <Button onClick={resetGame}>Jugar de nuevo</Button>
          </div>
        )}
      </div>
    </div>
  )
}
