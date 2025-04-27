"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Award, TreesIcon as Tree } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/context/points-context";

const levels = [
  { threshold: 0, image: "/tree-levels/level1.png", label: "Brote" },
  { threshold: 100, image: "/tree-levels/level2.png", label: "Retoño" },
  { threshold: 200, image: "/tree-levels/level3.png", label: "Arbusto" },
  { threshold: 300, image: "/tree-levels/level4.png", label: "Árbol joven" },
  { threshold: 400, image: "/tree-levels/level5.png", label: "Árbol adulto" },
  { threshold: 500, image: "/tree-levels/level6.png", label: "Árbol sabio" },
];

export default function Puntaje() {
  const context = usePoints();
  const { toast } = useToast();
  const [lastMilestone, setLastMilestone] = useState(0);

  if (!context) return <p className="text-center mt-10">Cargando puntos...</p>;

  const { points } = context;

  const currentLevel = levels.reduce((acc, level) => {
    return points >= level.threshold ? level : acc;
  }, levels[0]);

  const nextLevel = levels.find((level) => level.threshold > points);
  const progressToNextLevel = nextLevel
    ? ((points - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
    : 100;

  useEffect(() => {
    const newMilestone = Math.floor(points / 100);
    if (newMilestone > lastMilestone) {
      toast({
        title: "¡Felicidades!",
        description: `¡Has alcanzado el nivel ${currentLevel.label}!`,
      });
      setLastMilestone(newMilestone);
    }
  }, [points, lastMilestone, toast, currentLevel.label]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* 🔁 Asegúrate de que "/dashboard" sea tu ruta real al panel principal */}
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-4 flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Volver al inicio
        </Button>
      </Link>

      <Card className="text-center bg-green-50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Award className="w-12 h-12 text-yellow-500" />
            <h2 className="text-2xl font-bold">¡Tu progreso ecológico!</h2>
            <p className="text-lg">Puntos actuales: {points}</p>
            <Image
              src={currentLevel.image}
              alt={currentLevel.label}
              width={150}
              height={150}
            />
            <p className="text-xl font-semibold">{currentLevel.label}</p>
            {nextLevel ? (
              <div className="w-full">
                <Progress value={progressToNextLevel} />
                <p className="text-sm mt-2">
                  ¡Solo necesitas {nextLevel.threshold - points} puntos más
                  para alcanzar el nivel {nextLevel.label}!
                </p>
              </div>
            ) : (
              <p className="text-sm mt-2 font-semibold text-green-700">
                ¡Has alcanzado el nivel más alto! 🌳
              </p>
            )}
            <Button className="mt-4 flex items-center gap-2">
              <Tree className="w-4 h-4" />
              Ver Árbol
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
