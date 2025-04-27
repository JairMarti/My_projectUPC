/*"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Award } from "lucide-react"

const memoryCards = [
  { id: 1, type: "plastic", image: "/images/plastic-bottle.png", matched: false },
  { id: 2, type: "plastic-bin", image: "/images/plastic-bin.png", matched: false },
  { id: 3, type: "paper", image: "/images/newspaper.png", matched: false },
  { id: 4, type: "paper-bin", image: "/images/paper-bin.png", matched: false },
  { id: 5, type: "glass", image: "/images/glass-bottle.png", matched: false },
  { id: 6, type: "glass-bin", image: "/images/glass-bin.png", matched: false },
  { id: 7, type: "organic", image: "/images/banana-peel.png", matched: false },
  { id: 8, type: "organic-bin", image: "/images/organic-bin.png", matched: false },
]

const correctPairs = [
  ["plastic", "plastic-bin"],
  ["paper", "paper-bin"],
  ["glass", "glass-bin"],
  ["organic", "organic-bin"],
]

interface MemoryGameProps {
  onComplete: (points: number) => void
  onClose: () => void
}

export default function MemoryGame({ onComplete, onClose }: MemoryGameProps) {
  const { toast } = useToast()

  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [firstChoice, setFirstChoice] = useState(null)
  const [secondChoice, setSecondChoice] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameCompleted, setGameCompleted] = useState(false)

  const maxPairs = correctPairs.length

  useEffect(() => {
    shuffleCards()
  }, [level])

  useEffect(() => {
    const requiredPairs = Math.min(level + 1, maxPairs)
    if (matchedPairs === requiredPairs) {
      setGameCompleted(true)
      const basePoints = 20
      const penalty = 3
      const minTurns = (requiredPairs * 2)
      const points = Math.max(5, basePoints - Math.max(0, turns - minTurns) * penalty)

      toast({
        title: `¡Nivel ${level} completado!`,
        description: `Turnos: ${turns}, Puntos: ${points}`,
      })

      setTimeout(() => {
        setLevel((prev) => prev + 1)
        setMatchedPairs(0)
        setTurns(0)
        setGameCompleted(false)
        onComplete(points)
      }, 2500)
    }
  }, [matchedPairs])

  const shuffleCards = () => {
    const requiredPairs = Math.min(level + 1, maxPairs)
    const selectedPairs = correctPairs.slice(0, requiredPairs).flat()
    const selectedCards = memoryCards.filter((card) => selectedPairs.includes(card.type))
    const shuffled = [...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random(), matched: false }))

    setCards(shuffled)
    setFirstChoice(null)
    setSecondChoice(null)
    setDisabled(false)
  }

  const handleChoice = (card) => {
    if (disabled) return
    firstChoice ? setSecondChoice(card) : setFirstChoice(card)
  }

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true)
      const isCorrectPair = correctPairs.some(
        ([a, b]) =>
          (firstChoice.type === a && secondChoice.type === b) ||
          (firstChoice.type === b && secondChoice.type === a)
      )

      if (isCorrectPair) {
        setCards((prev) =>
          prev.map((card) =>
            card.type === firstChoice.type || card.type === secondChoice.type
              ? { ...card, matched: true }
              : card
          )
        )
        setMatchedPairs((prev) => prev + 1)
        resetTurn()
      } else {
        toast({
          title: "Par incorrecto",
          description: "Inténtalo de nuevo",
          variant: "destructive",
        })
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [firstChoice, secondChoice])

  const resetTurn = () => {
    setFirstChoice(null)
    setSecondChoice(null)
    setTurns((prev) => prev + 1)
    setDisabled(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-4xl border-4 border-green-400 bg-white/95 shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-700">Nivel {level}: Juego de Memoria</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-green-500 px-3 py-1 text-white">
                <Award className="h-5 w-5" />
                <span className="font-bold">Turnos: {turns}</span>
              </div>
              <Button onClick={onClose} variant="outline" className="rounded-full">
                Cerrar
              </Button>
            </div>
          </div>

          <p className="mb-4 text-center text-green-600">
            Encuentra los pares de residuos y sus contenedores.
          </p>

          <div className="mb-4 grid grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`relative aspect-square cursor-pointer rounded-lg ${
                  card.matched ? "border-4 border-green-400" : "border-2 border-green-200"
                } bg-white p-2 shadow-md transition-all duration-300 hover:shadow-lg`}
                onClick={() =>
                  !card.matched &&
                  card !== firstChoice &&
                  card !== secondChoice &&
                  handleChoice(card)
                }
              >
                {card.matched || card === firstChoice || card === secondChoice ? (
                  <div className="flex h-full items-center justify-center">
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt="Card"
                      width={80}
                      height={80}
                      className="h-auto max-h-full w-auto max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-lg bg-green-500">
                    <span className="text-4xl font-bold text-white">?</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button onClick={shuffleCards} className="rounded-full bg-green-500 hover:bg-green-600">
              Reiniciar Nivel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}*/
