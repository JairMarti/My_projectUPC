"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Award, Zap } from "lucide-react"

interface Node {
  id: number
  type: string
  name: string
  x: number
  y: number
  connected: boolean
  image: string
}

type Connection = [number, number]

const circuitNodes: Node[] = [
  {
    id: 1,
    type: "solar",
    name: "Panel Solar",
    x: 20,
    y: 20,
    connected: false,
    image: "https://i.postimg.cc/jSwrXQ4w/4c4a6c10-cde1-4cf0-8dca-6c677e97a89c.png",
  },
  {
    id: 2,
    type: "battery",
    name: "Batería",
    x: 80,
    y: 20,
    connected: false,
    image: "https://i.postimg.cc/QC83k2fh/descarga.jpg",
  },
  {
    id: 3,
    type: "inverter",
    name: "Inversor",
    x: 20,
    y: 80,
    connected: false,
    image: "https://i.postimg.cc/1tcSFmcv/images.jpg",
  },
  {
    id: 4,
    type: "house",
    name: "Casa",
    x: 80,
    y: 80,
    connected: false,
    image: "https://i.postimg.cc/L4DR6ssX/maxresdefault.jpg",
  },
]

const validConnections: Connection[] = [
  [1, 2],
  [2, 3],
  [3, 4],
]

interface CircuitGameProps {
  onComplete: (points: number) => void
  onClose: () => void
}

export default function CircuitGame({ onComplete, onClose }: CircuitGameProps) {
  const { toast } = useToast()
  const [nodes, setNodes] = useState<Node[]>([...circuitNodes])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)

  useEffect(() => {
    if (connections.length === validConnections.length) {
      const allValid = validConnections.every((valid) =>
        connections.some(
          (conn) =>
            (conn[0] === valid[0] && conn[1] === valid[1]) ||
            (conn[0] === valid[1] && conn[1] === valid[0]),
        ),
      )

      if (allValid) {
        setGameCompleted(true)
        const basePoints = 50
        const penalty = 5
        const minAttempts = 3
        const points = Math.max(10, basePoints - Math.max(0, attempts - minAttempts) * penalty)

        toast({
          title: "¡Circuito completado!",
          description: `Has completado el circuito en ${attempts} intentos y ganado ${points} puntos.`,
        })

        setTimeout(() => {
          onComplete(points)
        }, 2000)
      }
    }
  }, [connections, attempts, toast, onComplete])

  const resetGame = () => {
    setNodes([...circuitNodes])
    setConnections([])
    setSelectedNode(null)
    setAttempts(0)
    setGameCompleted(false)
  }

  const handleSelectNode = (node: Node) => {
    if (gameCompleted) return

    if (selectedNode) {
      if (selectedNode.id === node.id) {
        setSelectedNode(null)
        return
      }

      const isValid = validConnections.some(
        (valid) =>
          (valid[0] === selectedNode.id && valid[1] === node.id) ||
          (valid[0] === node.id && valid[1] === selectedNode.id),
      )

      const connectionExists = connections.some(
        (conn) =>
          (conn[0] === selectedNode.id && conn[1] === node.id) ||
          (conn[0] === node.id && conn[1] === selectedNode.id),
      )

      if (isValid && !connectionExists) {
        setConnections((prev) => [...prev, [selectedNode.id, node.id]])
        setNodes((prev) =>
          prev.map((n) =>
            n.id === selectedNode.id || n.id === node.id ? { ...n, connected: true } : n,
          ),
        )

        toast({
          title: "¡Conexión correcta!",
          description: `Has conectado ${selectedNode.name} con ${node.name}.`,
        })
      } else if (connectionExists) {
        toast({
          title: "Conexión existente",
          description: "Estos componentes ya están conectados.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Conexión inválida",
          description: "Estos componentes no pueden conectarse directamente.",
          variant: "destructive",
        })
      }

      setSelectedNode(null)
      setAttempts((prev) => prev + 1)
    } else {
      setSelectedNode(node)
    }
  }

  const getNodePosition = (node: Node) => ({
    left: `${node.x}%`,
    top: `${node.y}%`,
  })

  const getConnectionLine = ([fromId, toId]: Connection) => {
    const from = nodes.find((n) => n.id === fromId)!
    const to = nodes.find((n) => n.id === toId)!
    return {
      x1: `${from.x + 3}%`,
      y1: `${from.y + 3}%`,
      x2: `${to.x + 3}%`,
      y2: `${to.y + 3}%`,
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-4xl border-4 border-yellow-400 bg-white/95 shadow-xl">
        <CardContent className="p-6">
          {/* Encabezado */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-yellow-700">Circuito de Energía Renovable</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-yellow-500 px-3 py-1 text-white">
                <Award className="h-5 w-5" />
                <span className="font-bold">Intentos: {attempts}</span>
              </div>
              <Button onClick={onClose} variant="outline" className="rounded-full">
                Cerrar
              </Button>
            </div>
          </div>

          {/* Instrucciones */}
          <p className="mb-4 text-center text-yellow-600">
            Conecta los componentes en el orden correcto para crear un circuito de energía renovable.
          </p>

          {/* Tablero */}
          <div className="relative mb-6 h-[400px] rounded-lg border-2 border-yellow-300 bg-yellow-50">
            <svg className="absolute h-full w-full">
              {connections.map((connection, index) => {
                const line = getConnectionLine(connection)
                return (
                  <line
                    key={index}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeDasharray={gameCompleted ? "0" : "5,5"}
                    className={gameCompleted ? "animate-pulse" : ""}
                  />
                )
              })}
            </svg>

            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute flex h-[60px] w-[60px] cursor-pointer flex-col items-center justify-center rounded-full border-4 ${
                  selectedNode?.id === node.id
                    ? "border-yellow-500 bg-yellow-100"
                    : node.connected
                    ? "border-green-500 bg-green-100"
                    : "border-gray-300 bg-white"
                } p-1 shadow-md transition-all duration-300 hover:shadow-lg`}
                style={getNodePosition(node)}
                onClick={() => handleSelectNode(node)}
              >
                <Image
                  src={node.image || "/placeholder.svg"}
                  alt={node.name}
                  width={40}
                  height={40}
                  className="h-8 w-8 rounded-full object-cover"
                  unoptimized
                />
                <span className="mt-1 text-center text-xs font-bold">{node.name}</span>
                {gameCompleted && node.type === "house" && (
                  <Zap className="absolute -right-2 -top-2 h-6 w-6 animate-pulse text-yellow-500" />
                )}
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="space-y-2">
            <h3 className="font-bold text-yellow-700">Componentes del Circuito:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-yellow-600">
              <li>
                <span className="font-bold">Panel Solar:</span> Convierte la energía del sol en electricidad.
              </li>
              <li>
                <span className="font-bold">Batería:</span> Almacena la energía para usarla cuando no hay sol.
              </li>
              <li>
                <span className="font-bold">Inversor:</span> Convierte la corriente continua en alterna.
              </li>
              <li>
                <span className="font-bold">Casa:</span> Usa la energía limpia generada.
              </li>
            </ul>
          </div>

          {/* Estado final o reinicio */}
          {gameCompleted ? (
            <div className="mt-4 text-center">
              <p className="mb-2 text-xl font-bold text-green-700">
                ¡Felicidades! Has completado el circuito.
              </p>
              <p className="text-green-600">Ahora la casa recibe energía limpia del sol.</p>
            </div>
          ) : (
            <div className="mt-4 flex justify-center">
              <Button onClick={resetGame} className="rounded-full bg-yellow-500 hover:bg-yellow-600">
                Reiniciar Circuito
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
