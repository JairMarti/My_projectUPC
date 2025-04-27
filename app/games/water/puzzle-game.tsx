"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Award, RefreshCw } from "lucide-react"

// Definir las piezas del rompecabezas del ciclo del agua
const puzzlePieces = [
  {
    id: 1,
    name: "Evaporación",
    description: "El sol calienta el agua de océanos, ríos y lagos, convirtiéndola en vapor.",
    correctPosition: 0,
    image: "https://i.postimg.cc/1tcSFmcv/images.jpg",
  },
  {
    id: 2,
    name: "Condensación",
    description: "El vapor de agua se enfría y forma nubes en el cielo.",
    correctPosition: 1,
    image: "https://i.postimg.cc/QC83k2fh/descarga.jpg",
  },
  {
    id: 3,
    name: "Precipitación",
    description: "El agua cae de las nubes en forma de lluvia, nieve o granizo.",
    correctPosition: 2,
    image: "https://i.postimg.cc/N0XBg7yq/1.jpg",
  },
  {
    id: 4,
    name: "Escorrentía",
    description: "El agua fluye sobre la tierra hacia ríos, lagos y océanos.",
    correctPosition: 3,
    image: "https://i.postimg.cc/L4DR6ssX/maxresdefault.jpg",
  },
  {
    id: 5,
    name: "Infiltración",
    description: "El agua se filtra en el suelo y recarga los acuíferos subterráneos.",
    correctPosition: 4,
    image: "https://i.postimg.cc/TYPxyXyc/medio-ambiente.jpg",
  },
]

interface PuzzleGameProps {
  onComplete: (points: number) => void
  onClose: () => void
}

export default function PuzzleGame({ onComplete, onClose }: PuzzleGameProps) {
  const { toast } = useToast()
  const [pieces, setPieces] = useState([])
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)

  // Inicializar el juego
  useEffect(() => {
    shufflePieces()
  }, [])

  // Verificar si el rompecabezas está completo
  useEffect(() => {
    if (pieces.length > 0 && pieces.every((piece, index) => piece.correctPosition === index)) {
      setGameCompleted(true)

      // Calcular puntos: máximo 50 puntos, restando 5 por cada intento por encima de 5
      const basePoints = 50
      const penaltyPerExtraAttempt = 5
      const minAttempts = 5
      const points = Math.max(10, basePoints - Math.max(0, attempts - minAttempts) * penaltyPerExtraAttempt)

      toast({
        title: "¡Rompecabezas completado!",
        description: `Has completado el ciclo del agua en ${attempts} intentos y ganado ${points} puntos.`,
      })

      // Notificar al componente padre
      setTimeout(() => {
        onComplete(points)
      }, 2000)
    }
  }, [pieces, attempts, toast, onComplete])

  // Mezclar las piezas
  const shufflePieces = () => {
    let shuffled = [...puzzlePieces].sort(() => Math.random() - 0.5)

    // Asegurarse de que no estén en el orden correcto al inicio
    while (shuffled.every((piece, index) => piece.correctPosition === index)) {
      shuffled = [...puzzlePieces].sort(() => Math.random() - 0.5)
    }

    setPieces(shuffled)
    setSelectedPiece(null)
    setAttempts(0)
    setGameCompleted(false)
  }

  // Seleccionar una pieza
  const handleSelectPiece = (piece) => {
    if (gameCompleted) return

    setSelectedPiece(piece)
  }

  // Mover una pieza a una nueva posición
  const handleMovePiece = (targetIndex) => {
    if (!selectedPiece || gameCompleted) return

    const sourceIndex = pieces.findIndex((p) => p.id === selectedPiece.id)

    if (sourceIndex === targetIndex) {
      setSelectedPiece(null)
      return
    }

    // Crear una copia del array y mover la pieza
    const newPieces = [...pieces]
    const [removed] = newPieces.splice(sourceIndex, 1)
    newPieces.splice(targetIndex, 0, removed)

    setPieces(newPieces)
    setSelectedPiece(null)
    setAttempts((prev) => prev + 1)

    // Verificar si la pieza está en la posición correcta
    if (removed.correctPosition === targetIndex) {
      toast({
        title: "¡Posición correcta!",
        description: `${removed.name} está en su lugar correcto en el ciclo del agua.`,
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-4xl border-4 border-blue-400 bg-white/95 shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-700">Rompecabezas: El Ciclo del Agua</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-blue-500 px-3 py-1 text-white">
                <Award className="h-5 w-5" />
                <span className="font-bold">Intentos: {attempts}</span>
              </div>
              <Button onClick={onClose} variant="outline" className="rounded-full">
                Cerrar
              </Button>
            </div>
          </div>

          <p className="mb-4 text-center text-blue-600">
            Ordena las piezas para completar el ciclo del agua. Selecciona una pieza y luego haz clic en la posición
            donde quieres colocarla.
          </p>

          <div className="mb-6 flex items-center justify-center">
            <div className="relative h-40 w-40 rounded-full border-4 border-blue-300 bg-blue-100 p-4">
              <RefreshCw className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-5 gap-4">
            {pieces.map((piece, index) => (
              <div
                key={piece.id}
                className={`relative cursor-pointer rounded-lg border-4 ${
                  selectedPiece?.id === piece.id
                    ? "border-yellow-400 bg-yellow-50"
                    : piece.correctPosition === index
                      ? "border-green-400 bg-green-50"
                      : "border-blue-200 bg-white"
                } p-2 shadow-md transition-all duration-300 hover:shadow-lg`}
                onClick={() => (selectedPiece ? handleMovePiece(index) : handleSelectPiece(piece))}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={piece.image || "/placeholder.svg"}
                    alt={piece.name}
                    width={80}
                    height={80}
                    className="mb-2 h-16 w-16 rounded-full object-cover"
                    unoptimized
                  />
                  <h3 className="text-center text-sm font-bold text-blue-700">{piece.name}</h3>
                </div>
                <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {pieces.map((piece) => (
              <div key={piece.id} className="rounded-lg bg-blue-50 p-3">
                <h4 className="font-bold text-blue-700">{piece.name}</h4>
                <p className="text-sm text-blue-600">{piece.description}</p>
              </div>
            ))}
          </div>

          {gameCompleted ? (
            <div className="mt-4 text-center">
              <p className="mb-2 text-xl font-bold text-green-700">¡Felicidades! Has completado el ciclo del agua.</p>
              <p className="text-green-600">Completaste el rompecabezas en {attempts} intentos.</p>
            </div>
          ) : (
            <div className="mt-4 flex justify-center">
              <Button onClick={shufflePieces} className="rounded-full bg-blue-500 hover:bg-blue-600">
                Reiniciar Rompecabezas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

