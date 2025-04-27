"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Award, Check, X } from "lucide-react"

// Definir las preguntas del quiz sobre reciclaje
const recyclingQuestions = [
  {
    id: 1,
    question: "¿De qué color es el contenedor para el papel y cartón?",
    options: ["Verde", "Amarillo", "Azul", "naranja"],
    correctAnswer: 2,
    explanation: "El contenedor azul es para papel y cartón, como periódicos, revistas, cajas y envases de cartón.",
    image: "/images/cardboard-box.png",
    
  },
  {
    id: 2,
    question: "¿Dónde debes tirar una botella de plástico?",
    options: ["Contenedor azul", "Contenedor amarillo", "Contenedor verde", "Contenedor naranja"],
    correctAnswer: 1,
    explanation: "Las botellas de plástico van en el contenedor amarillo, junto con latas y briks.",
    image: "/images/plastic-bottle.png",
  },
  {
    id: 3,
    question: "¿Qué material si se puede reciclar?",
    options: ["comida residual", "Latas de refresco", "Botellas de vidrio", "Todos los anteriores"],
    correctAnswer: 3,
    explanation:
      "Todos se pueden reciclar",
    image: "/images/recycle.png",
  },
  {
    id: 4,
    question: "¿Dónde debes tirar una cáscara de plátano?",
    options: ["Contenedor amarillo", "Contenedor azul", "Contenedor verde", "Contenedor naranja"],
    correctAnswer: 3,
    explanation: "Los restos de comida como cáscaras de fruta van en el contenedor marrón para residuos orgánicos.",
    image: "/images/banana-peel.png",
  },
  {
    id: 5,
    question: "¿Cuál de estos objetos NO va en el contenedor amarillo?",
    options: ["Botella de plástico", "Lata de refresco", "Botella de vidrio", "Envase de yogur"],
    correctAnswer: 2,
    explanation: "Las botellas de vidrio van en el contenedor verde, no en el amarillo.",
    image: "/images/glass-bottle.png",
  },
]

interface QuizGameProps {
  onComplete: (points: number) => void
  onClose: () => void
}

export default function QuizGame({ onComplete, onClose }: QuizGameProps) {
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)

  const currentQuestion = recyclingQuestions[currentQuestionIndex]

  // Verificar respuesta
  const checkAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    if (answerIndex === currentQuestion.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1)
      toast({
        title: "¡Respuesta correcta!",
        description: "¡Muy bien! Esa es la respuesta correcta.",
      })
    } else {
      toast({
        title: "Respuesta incorrecta",
        description: "No es correcto. Lee la explicación para aprender más.",
        variant: "destructive",
      })
    }
  }

  // Pasar a la siguiente pregunta
  const nextQuestion = () => {
    if (currentQuestionIndex < recyclingQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Quiz completado
      setGameCompleted(true)

      // Calcular puntos: 10 puntos por cada respuesta correcta
      const points = correctAnswers * 10

      toast({
        title: "¡Quiz completado!",
        description: `Has respondido correctamente ${correctAnswers} de ${recyclingQuestions.length} preguntas.`,
      })

      // Notificar al componente padre
      setTimeout(() => {
        onComplete(points)
      }, 2000)
    }
  }

  // Reiniciar el quiz
  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCorrectAnswers(0)
    setGameCompleted(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-4xl border-4 border-green-400 bg-white/95 shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-700">Quiz de Reciclaje</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-green-500 px-3 py-1 text-white">
                <Award className="h-5 w-5" />
                <span className="font-bold">
                  {correctAnswers}/{recyclingQuestions.length} correctas
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
                  src={currentQuestion.image || "/placeholder.svg"}
                  alt="Imagen de la pregunta"
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </div>

              <h3 className="mb-4 text-center text-xl font-bold text-green-700">
                Pregunta {currentQuestionIndex + 1}: {currentQuestion.question}
              </h3>

              <div className="mb-6 space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => selectedAnswer === null && checkAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full justify-start rounded-lg p-3 text-left ${
                      selectedAnswer === null
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : selectedAnswer === index
                          ? index === currentQuestion.correctAnswer
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          : index === currentQuestion.correctAnswer
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedAnswer !== null && (
                        <>
                          {index === currentQuestion.correctAnswer ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : selectedAnswer === index ? (
                            <X className="h-5 w-5 text-red-500" />
                          ) : null}
                        </>
                      )}
                      {option}
                    </div>
                  </Button>
                ))}
              </div>

              {showExplanation && (
                <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-700">
                  <p className="font-bold">Explicación:</p>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}

              {selectedAnswer !== null && (
                <div className="flex justify-center">
                  <Button onClick={nextQuestion} className="rounded-full bg-green-500 hover:bg-green-600">
                    {currentQuestionIndex < recyclingQuestions.length - 1 ? "Siguiente Pregunta" : "Finalizar Quiz"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h3 className="mb-4 text-2xl font-bold text-green-700">¡Quiz completado!</h3>
              <p className="mb-2 text-lg text-green-600">
                Has respondido correctamente {correctAnswers} de {recyclingQuestions.length} preguntas.
              </p>
              <p className="mb-6 text-lg text-green-600">Puntuación: {correctAnswers * 10} puntos</p>
              <Button onClick={resetQuiz} className="rounded-full bg-green-500 hover:bg-green-600">
                Reiniciar Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

