"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

const puzzles = [
  { name: "Panel Solar", image: "/images/panelsolar.png" },
  { name: "Molino de Viento", image: "/images/molino.png" },
  { name: "Central Hidroeléctrica", image: "/images/hidro.png" },
]

const gridSize = 3

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function EnergyPuzzlePage() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [score, setScore] = useState(0)
  const [energySaved, setEnergySaved] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const [tiles, setTiles] = useState<number[]>([])
  const [selectedTile, setSelectedTile] = useState<number | null>(null)

  const currentPuzzle = puzzles[currentPuzzleIndex]
  const totalPieces = gridSize * gridSize

  useEffect(() => {
    const initialTiles = shuffle([...Array(totalPieces).keys()])
    setTiles(initialTiles)
  }, [currentPuzzleIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [startTime])

  const handleTileClick = (index: number) => {
    if (selectedTile === null) {
      setSelectedTile(index)
    } else {
      const newTiles = [...tiles]
      ;[newTiles[selectedTile], newTiles[index]] = [newTiles[index], newTiles[selectedTile]]
      setTiles(newTiles)
      setSelectedTile(null)

      const isSolved = newTiles.every((val, idx) => val === idx)
      if (isSolved) {
        setScore(score + 100)
        setEnergySaved(energySaved + 50)
      }
    }
  }

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1)
      setStartTime(Date.now())
      setElapsedTime(0)
    }
  }

  const handlePreviousPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex(currentPuzzleIndex - 1)
      setStartTime(Date.now())
      setElapsedTime(0)
    }
  }

  return (
    <div className="bg-yellow-100 min-h-screen py-10">
      <div className="bg-white max-w-4xl mx-auto p-6 rounded-xl shadow-lg">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center gap-2 text-yellow-600 hover:text-yellow-800">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
          <div className="text-sm text-gray-600 font-medium">
            ⏱️ {elapsedTime}s | 🎯 {score} pts | ⚡ {energySaved}W
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">{currentPuzzle.name}</h2>

        {/* Puzzle y Guía */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Puzzle Grid */}
          <div
            className="mx-auto w-72 h-72 grid border-2 border-yellow-300 rounded-lg overflow-hidden shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {tiles.map((tileIndex, index) => {
              const row = Math.floor(tileIndex / gridSize)
              const col = tileIndex % gridSize
              return (
                <div
                  key={index}
                  onClick={() => handleTileClick(index)}
                  className={`cursor-pointer border border-white shadow-sm transition duration-150 ease-in-out ${
                    selectedTile === index ? "ring-2 ring-yellow-500" : ""
                  }`}
                  style={{
                    backgroundImage: `url(${currentPuzzle.image})`,
                    backgroundSize: `${gridSize * 100}%`,
                    backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
                  }}
                />
              )
            })}
          </div>

          {/* Imagen Guía */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm text-gray-500 mb-2">Guía:</span>
            <Image
              src={currentPuzzle.image}
              alt={`Guía de ${currentPuzzle.name}`}
              width={200}
              height={200}
              className="rounded-lg shadow-md border border-yellow-200"
            />
          </div>
        </div>

        {/* Botones de Navegación */}
        <div className="flex justify-center gap-4 mt-8">
          {currentPuzzleIndex > 0 && (
            <Button
              onClick={handlePreviousPuzzle}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full shadow-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
          {currentPuzzleIndex < puzzles.length - 1 && (
            <Button
              onClick={handleNextPuzzle}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full shadow-md"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
