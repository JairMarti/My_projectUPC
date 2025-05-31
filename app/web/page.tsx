"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { id: "todos", name: "Todos" },
  { id: "reciclaje", name: "Reciclaje" },
  { id: "agua", name: "Agua" },
  { id: "energia", name: "Energía" },
  { id: "naturaleza", name: "Naturaleza" },
];

const webImages = [
  {
    id: 1,
    title: "Niños cuidando el planeta",
    description: "Niños de diferentes culturas unidos para cuidar nuestro planeta",
    src: "https://i.postimg.cc/N0XBg7yq/1.jpg",
    categories: ["todos", "naturaleza"],
  },
  {
    id: 2,
    title: "Niños sosteniendo la Tierra",
    description: "Dos niños sostienen juntos nuestro planeta",
    src: "https://i.postimg.cc/QC83k2fh/descarga.jpg",
    categories: ["todos", "naturaleza"],
  },
  {
    id: 3,
    title: "Planeta en forma de corazón",
    description: "Nuestro planeta Tierra en forma de corazón, mostrando el amor por la naturaleza",
    src: "https://i.postimg.cc/1tcSFmcv/images.jpg",
    categories: ["todos", "naturaleza"],
  },
  {
    id: 4,
    title: "Niños limpiando el parque",
    description: "Grupo de niños recogiendo basura y manteniendo limpio el medio ambiente",
    src: "https://i.postimg.cc/L4DR6ssX/maxresdefault.jpg",
    categories: ["todos", "reciclaje"],
  },
  {
    id: 5,
    title: "Niños curando el planeta",
    description: "Niños poniendo curitas al planeta Tierra, simbolizando la recuperación del medio ambiente",
    src: "https://i.postimg.cc/TYPxyXyc/medio-ambiente.jpg",
    categories: ["todos", "naturaleza"],
  },
  {
    id: 6,
    title: "Niños alrededor del mundo",
    description: "Niños de diferentes culturas tomados de la mano alrededor del planeta",
    src: "https://i.postimg.cc/2y0fH0tv/65946347-ni-os-globe-para-el-medio-ambiente-verde-d-a-de-la-tierra-d-a-de-reciclaje.jpg",
    categories: ["todos", "naturaleza"],
  },
  {
    id: 7,
    title: "Planeta verde",
    description: "Un planeta Tierra verde y saludable con elementos naturales",
    src: "https://i.postimg.cc/rFYkxYx2/nin-os.jpg",
    categories: ["todos", "naturaleza"],
  },
  {
    id: 8,
    title: "Reciclaje de plástico",
    description: "Aprende a reciclar correctamente los envases de plástico",
    src: "/images/plastic-bottle.png",
    categories: ["todos", "reciclaje"],
  },
  {
    id: 9,
    title: "Reciclaje de papel",
    description: "El papel y cartón deben ir al contenedor azul",
    src: "/images/newspaper.png",
    categories: ["todos", "reciclaje"],
  },
  {
    id: 10,
    title: "Ahorro de agua",
    description: "Cerrar el grifo mientras te cepillas los dientes",
    src: "/images/water-action1.png",
    categories: ["todos", "agua"],
  },
  {
    id: 11,
    title: "Recoger agua de lluvia",
    description: "El agua de lluvia es perfecta para regar las plantas",
    src: "/images/water-action3.png",
    categories: ["todos", "agua"],
  },
  {
    id: 12,
    title: "Energía limpia",
    description: "Las energías renovables son el futuro para un planeta más limpio",
    src: "/images/energy-game.png",
    categories: ["todos", "energia"],
  },
];

type ImageData = {
  id: number;
  title: string;
  description: string;
  src: string;
  categories: string[];
};

export default function WebGallery() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const filteredImages = webImages.filter((image) =>
    image.categories.includes(selectedCategory)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-green-700 hover:text-green-800">
            <ChevronLeft className="h-5 w-5" />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="https://i.postimg.cc/DZSQWHPY/c842716a-6ddb-477f-8c31-d37501821d23.png"
              alt="EcoKids Logo"
              width={32}
              height={32}
              className="rounded-full"
              unoptimized
            />
            <h1 className="text-xl font-bold text-green-600">EcoKids</h1>
          </div>
        </header>

        <Card className="mb-6 border-4 border-green-400 bg-white/90 shadow-lg">
          <CardContent className="p-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-green-700">Galería de Imágenes</h1>
            <p className="text-lg text-green-600">
              Explora estas imágenes para aprender más sobre cómo cuidar nuestro planeta
            </p>
          </CardContent>
        </Card>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 bg-green-100">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden border-2 border-green-300 bg-white/90 shadow-md transition-transform hover:scale-105"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized={image.src.startsWith("http")}
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-bold text-green-700">{image.title}</h3>
                <p className="text-sm text-green-600 line-clamp-2">{image.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-lg text-green-600">No hay imágenes en esta categoría</p>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full p-0"
                variant="outline"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
              <div className="relative h-[70vh] w-[80vw] max-w-4xl">
                <Image
                  src={selectedImage.src || "/placeholder.svg"}
                  alt={selectedImage.title}
                  fill
                  sizes="80vw"
                  className="object-contain"
                  unoptimized={selectedImage.src.startsWith("http")}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-green-700">{selectedImage.title}</h2>
                <p className="text-green-600">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
