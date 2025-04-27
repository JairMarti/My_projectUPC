"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Award, ArrowUp, ArrowDown, Check } from "lucide-react"

const waterSavingActions = [
  {
    id: 1,
    title: "Reparar un grifo que gotea",
    description: "Un grifo que gotea puede desperdiciar hasta 11.000 litros de agua al año.",
    impact: 5,
    image: "/images/water-action4.png",
  },
  {
    id: 2,
    title: "Ducharse en lugar de bañarse",
    description: "Una ducha de 5 minutos gasta unos 100 litros, mientras que un baño puede gastar hasta 300 litros.",
    impact: 4,
    image: "/images/water-action2.png",
  },
  {
    id: 3,
    title: "Cerrar el grifo mientras te cepillas los dientes",
    description: "Puedes ahorrar hasta 12 litros de agua cada vez que te cepillas los dientes.",
    impact: 3,
    image: "/images/water-action1.png",
  },
  {
    id: 4,
    title: "Recoger agua de lluvia para las plantas",
    description: "El agua de lluvia es perfecta para regar las plantas y no consume agua potable.",
    impact: 2,
    image: "/images/water-action3.png",
  },
  {
    id: 5,
    title: "Usar un vaso para enjuagarse al cepillarse",
    description: "En lugar de dejar correr el agua, usa un vaso para enjuagarte.",
    impact: 1,
    image: "/images/water-action5.png",
  },
]

interface RankingGameProps {
  onComplete: (points: number) => void
  onClose: () => void
}

export default function RankingGame({ onComplete, onClose }: RankingGameProps) {
  const { toast } = useToast()
  const [actions, setActions] = useState([])
  const [selectedActionIndex, setSelectedActionIndex] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    shuffleActions()
  }, [])

  const shuffleActions = () => {
    const shuffled = [...waterSavingActions].sort(() => Math.random() - 0.5)
    setActions(shuffled)
    setSelectedActionIndex(null)
    setAttempts(0)
    setGameCompleted(false)
    setShowResults(false)
  }

  const selectAction = (index: number) => {
    if (showResults) return
    setSelectedActionIndex(index)
  }

  const moveUp = (index: number) => {
    if (index === 0 || showResults) return
    const newActions = [...actions]
    ;[newActions[index - 1], newActions[index]] = [newActions[index], newActions[index - 1]]
    setActions(newActions)
    setSelectedActionIndex(index - 1)
    setAttempts((prev) => prev + 1)
  }

  const moveDown = (index: number) => {
    if (index === actions.length - 1 || showResults) return
    const newActions = [...actions]
    ;[newActions[index], newActions[index + 1]] = [newActions[index + 1], newActions[index]]
    setActions(newActions)
    setSelectedActionIndex(index + 1)
    setAttempts((prev) => prev + 1)
  }

  const checkOrder = () => {
    if (showResults || gameCompleted) return
    setShowResults(true)

    const correctOrder = [...actions].sort((a, b) => b.impact - a.impact)
    const isCorrectOrder = actions.every((action, i) => action.id === correctOrder[i].id)

    if (isCorrectOrder) {
      setGameCompleted(true)

      const basePoints = 50
      const penaltyPerExtraAttempt = 5
      const minAttempts = 5
      const points = Math.max(10, basePoints - Math.max(0, attempts - minAttempts) * penaltyPerExtraAttempt)

      toast({
        title: "¡Orden correcto!",
        description: `Has ordenado correctamente las acciones de ahorro de agua y ganado ${points} puntos.`,
      })

      setTimeout(() => {
        onComplete(points)
      }, 2000)
    } else {
      toast({
        title: "Orden incorrecto",
        description: "El orden no es correcto. Revisa el impacto de cada acción y vuelve a intentarlo.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-4xl border-4 border-blue-400 bg-white/95 shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-700">Ranking de Ahorro de Agua</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-blue-500 px-3 py-1 text-white">
                <Award className="h-5 w-5" />
                <span className="font-bold">Movimientos: {attempts}</span>
              </div>
              <Button onClick={onClose} variant="outline" className="rounded-full">
                Cerrar
              </Button>
            </div>
          </div>

          <p className="mb-4 text-center text-blue-600">
            Ordena estas acciones de ahorro de agua de mayor a menor impacto. Selecciona una acción y usa las flechas
            para moverla.
          </p>

          <div className="mb-6 space-y-3">
            {actions.map((action, index) => (
              <div
                key={action.id}
                className={`relative flex cursor-pointer items-center gap-4 rounded-lg border-2 p-3 ${
                  selectedActionIndex === index
                    ? "border-blue-500 bg-blue-50"
                    : showResults
                      ? index === actions.findIndex((a) => a.id === waterSavingActions.sort((a, b) => b.impact - a.impact)[index].id)
                        ? "border-green-500 bg-green-50"
                        : "border-red-300 bg-red-50"
                      : "border-blue-200 bg-white"
                }`}
                onClick={() => selectAction(index)}
              >
                <div className="flex-shrink-0">
                  <Image
                    src={action.image || "/placeholder.svg"}
                    alt={action.title}
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-700">{action.title}</h3>
                  <p className="text-sm text-blue-600">{action.description}</p>
                </div>
                {showResults && (
                  <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="font-bold text-blue-700">{action.impact}</span>
                  </div>
                )}
                {selectedActionIndex === index && !showResults && (
                  <div className="flex flex-col gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveUp(index)
                      }}
                      disabled={index === 0}
                      className="h-8 w-8 rounded-full"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveDown(index)
                      }}
                      disabled={index === actions.length - 1}
                      className="h-8 w-8 rounded-full"
                    >
                      <ArrowDown className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                {showResults &&
                  index ===
                    actions.findIndex((a) => a.id === waterSavingActions.sort((a, b) => b.impact - a.impact)[index].id) && (
                    <Check className="h-6 w-6 text-green-500" />
                  )}
              </div>
            ))}
          </div>

          {!showResults ? (
            <div className="flex justify-center">
              <Button onClick={checkOrder} className="rounded-full bg-blue-500 hover:bg-blue-600">
                Verificar Orden
              </Button>
            </div>
          ) : !gameCompleted ? (
            <div className="flex justify-center">
              <Button onClick={shuffleActions} className="rounded-full bg-blue-500 hover:bg-blue-600">
                Intentar de Nuevo
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-2 text-xl font-bold text-green-700">
                ¡Felicidades! Has ordenado correctamente las acciones de ahorro de agua.
              </p>
              <p className="text-green-600">Completaste el juego en {attempts} movimientos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
