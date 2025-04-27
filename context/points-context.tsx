"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type PointsContextType = {
  totalPoints: number
  addPoints: (points: number) => void
  resetPoints: () => void
}

const PointsContext = createContext<PointsContextType | undefined>(undefined)

export function PointsProvider({ children }: { children: ReactNode }) {
  const [totalPoints, setTotalPoints] = useState(0)

  // Cargar puntos del localStorage al iniciar
  useEffect(() => {
    const savedPoints = localStorage.getItem("ecokids-points")
    if (savedPoints) {
      setTotalPoints(Number.parseInt(savedPoints, 10))
    }
  }, [])

  // Guardar puntos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("ecokids-points", totalPoints.toString())
  }, [totalPoints])

  const addPoints = (points: number) => {
    setTotalPoints((prev) => prev + points)
  }

  const resetPoints = () => {
    setTotalPoints(0)
  }

  return <PointsContext.Provider value={{ totalPoints, addPoints, resetPoints }}>{children}</PointsContext.Provider>
}

export function usePoints() {
  const context = useContext(PointsContext)
  if (context === undefined) {
    throw new Error("usePoints must be used within a PointsProvider")
  }
  return context
}

