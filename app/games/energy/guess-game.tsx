"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Award, ThumbsUp, ThumbsDown } from "lucide-react"

// Definir los datos sobre energías renovables
const energyFacts = [
  {
    id: 1,
    fact: "La energía solar puede generar electricidad incluso en días nublados.",
    isTrue: true,
    explanation:
      "Aunque con menor eficiencia, los paneles solares pueden captar la radiación solar difusa que atraviesa las nubes.",
    image: "https://i.postimg.cc/jSwrXQ4w/4c4a6c10-cde1-4cf0-8dca-6c677e97a89c.png",
  },
  {
    id: 2,
    fact: "Los aerogeneradores eólicos necesitan vientos de al menos 100 km/h para funcionar.",
    isTrue: false,
    explanation:
      "Los aerogeneradores modernos pueden empezar a generar electricidad con vientos de tan solo 10-15 km/h.",
    image: "https://i.postimg.cc/QC83k2fh/descarga.jpg",
  },
  {
    id: 3,
    fact: "La energía hidroeléctrica es la fuente de energía renovable más utilizada en el mundo.",
    isTrue: true,
    explanation:
      "La energía hidroeléctrica representa aproximadamente el 16% de la producción mundial de electricidad, siendo la renovable más utilizada.",
    image: "https://i.postimg.cc/1tcSFmcv/images.jpg",
  },
  {
    id: 4,
    fact: "La energía geotérmica solo se puede aprovechar en zonas con volcanes activos.",
    isTrue: false,
    explanation:
      "Aunque es más eficiente en zonas volcánicas, la energía geotérmica puede aprovecharse en muchas regiones mediante sistemas de bomba de calor geotérmica.",
    image: "https://i.postimg.cc/TYPxyXyc/medio-ambiente.jpg",
  },
  {
    id: 5,
    fact: "La biomasa es una fuente de energía renovable porque las plantas pueden volver a crecer.",
    isTrue: true,
    explanation:
      "La biomasa se considera renovable porque el carbono liberado durante su combustión fue previamente absorbido por las plantas durante su crecimiento.",
    image: "https://i.postimg.cc/L4DR6ssX/maxresdefault.jpg",
  },
  {
    id: 6,
    fact: "Los paneles solares solo duran unos 5 años antes de necesitar ser reemplazados.",
    isTrue: false,
    explanation:
      "Los paneles solares modernos tienen una vida útil de 25-30 años, manteniendo al menos el 80% de su eficiencia original.",
    image: "https://i.postimg.cc/jSwrXQ4w/4c4a6c10-cde1-4cf0-8dca-6c677e97a89c.png",
  },
  {
    id: 7,
    fact: "La energía eólica puede ser más barata que la energía de combustibles fósiles.",
    isTrue: true,
    explanation:
      "En muchas regiones, la energía eólica ya es más económica que la generada con carbón o gas natural, especialmente considerando los costos a largo plazo.",
    image: "https://i.postimg.cc/QC83k2fh/descarga.jpg",
  },
  {
    id: 8,
    fact: "Las centrales hidroeléctricas no tienen ningún impacto ambiental negativo.",
    isTrue: false,
    explanation:
      "Aunque son renovables, las grandes presas pueden afectar a ecosistemas acuáticos, modificar cauces de ríos y desplazar comunidades.",
    image: "https://i.postimg.cc/1tcSFmcv/images.jpg",
  },
]

interface GuessGameProps {
  onComplete: (points: number) => void
  onClose: () => void
}

export default function GuessGame({ onComplete, onClose }: GuessGameProps) {
  const { toast } = useToast()
  const [facts, setFacts] = useState([])
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)

  // Inicializar el juego
  useEffect(() => {
    // Mezclar los datos
    const shuffled = [...energyFacts].sort(() => Math.random() - 0.5)
    setFacts(shuffled)
  }, [])

  // Verificar respuesta
  const checkAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answer)

    const isCorrect = answer === facts[currentFactIndex].isTrue

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
      toast({
        title: "¡Respuesta correcta!",
        description: facts[currentFactIndex].explanation,
      })
    } else {
      toast({
        title: "Respuesta incorrecta",
        description: facts[currentFactIndex].explanation,
        variant: "destructive",
      })
    }
  }

  // Pasar al siguiente dato
  const nextFact = () => {
    if (currentFactIndex < facts.length - 1) {
      setCurrentFactIndex((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      // Juego completado
      setGameCompleted(true)

      // Calcular puntos: 10 puntos por cada respuesta correcta
      const points = correctAnswers * 10

      toast({
        title: "¡Juego completado!",
        description: `Has adivinado correctamente ${correctAnswers} de ${facts.length} datos sobre energías renovables.`,
      })

      // Notificar al componente padre
      setTimeout(() => {
        onComplete(points)
      }, 2000)
    }
  }

  // Reiniciar el juego
  const resetGame = () => {
    const shuffled = [...energyFacts].sort(() => Math.random() - 0.5)
    setFacts(shuffled)
    setCurrentFactIndex(0)
    setSelectedAnswer(null)
    setCorrectAnswers(0)
    setGameCompleted(false)
  }

  // Si no hay datos, mostrar cargando
  if (facts.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <Card className="w-full max-w-4xl border-4 border-yellow-400 bg-white/95 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-yellow-600">Cargando juego...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentFact = facts[currentFactIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-4xl border-4 border-yellow-400 bg-white/95 shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-yellow-700">¿Verdadero o Falso? - Energías Renovables</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-yellow-500 px-3 py-1 text-white">
                <Award className="h-5 w-5" />
                <span className="font-bold">
                  {correctAnswers}/{facts.length} correctas
                </span>
              </div>
              <Button onClick={onClose} variant="outline" className="rounded-full">
                Cerrar
              </Button>
            </div>
          </div>

          {!gameCompleted ? (
            <>
              <div className="mb-6 flex items-center justify-center">
                <Image
                  src={currentFact.image || "/placeholder.svg"}
                  alt="Imagen del dato"
                  width={150}
                  height={150}
                  className="rounded-lg"
                  unoptimized
                />
              </div>

              <div className="mb-6 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4">
                <h3 className="mb-2 text-center text-xl font-bold text-yellow-700">
                  Dato {currentFactIndex + 1} de {facts.length}
                </h3>
                <p className="text-center text-lg text-yellow-600">{currentFact.fact}</p>
              </div>

              <div className="mb-6 flex justify-center gap-4">
                <Button
                  onClick={() => checkAnswer(true)}
                  disabled={selectedAnswer !== null}
                  className={`flex gap-2 rounded-full px-6 py-3 ${
                    selectedAnswer === true
                      ? selectedAnswer === currentFact.isTrue
                        ? "bg-green-500 hover:bg-green-500"
                        : "bg-red-500 hover:bg-red-500"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  <ThumbsUp className="h-5 w-5" />
                  Verdadero
                </Button>
                <Button
                  onClick={() => checkAnswer(false)}
                  disabled={selectedAnswer !== null}
                  className={`flex gap-2 rounded-full px-6 py-3 ${
                    selectedAnswer === false
                      ? selectedAnswer === currentFact.isTrue
                        ? "bg-green-500 hover:bg-green-500"
                        : "bg-red-500 hover:bg-red-500"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  <ThumbsDown className="h-5 w-5" />
                  Falso
                </Button>
              </div>

              {selectedAnswer !== null && (
                <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-700">
                  <p className="font-bold">Explicación:</p>
                  <p>{currentFact.explanation}</p>
                </div>
              )}

              {selectedAnswer !== null && (
                <div className="flex justify-center">
                  <Button onClick={nextFact} className="rounded-full bg-yellow-500 hover:bg-yellow-600">
                    {currentFactIndex < facts.length - 1 ? "Siguiente Dato" : "Finalizar Juego"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h3 className="mb-4 text-2xl font-bold text-green-700">¡Juego completado!</h3>
              <p className="mb-2 text-lg text-green-600">
                Has adivinado correctamente {correctAnswers} de {facts.length} datos sobre energías renovables.
              </p>
              <p className="mb-6 text-lg text-green-600">Puntuación: {correctAnswers * 10} puntos</p>
              <Button onClick={resetGame} className="rounded-full bg-yellow-500 hover:bg-yellow-600">
                Jugar de Nuevo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

