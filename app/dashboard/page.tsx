"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Calendar,
  Gamepad2,
  Home,
  LogOut,
  User,
  Droplets,
  Recycle,
  Leaf,
  Zap,
  TreesIcon as Tree,
  CloudRain,
  Upload,
  X,
  Camera,
  Check,
  Clock,
  CheckCircle2,
  Lightbulb,
  Heart,
  Eye,
  Plus,
  FileText,
  Download,
} from "lucide-react"
import { usePoints } from "@/context/points-context"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { totalPoints } = usePoints()
  const { toast } = useToast()
  // Lista de posibles retos diarios
  const dailyChallenges = [
    "Ahorra agua mientras te cepillas los dientes",
    "Apaga las luces que no estés usando",
    "Usa una botella reutilizable todo el día",
    "Separa correctamente la basura hoy",
    "Camina o usa bicicleta en lugar de vehículos",
    "Recoge al menos 3 piezas de basura que veas",
    "No uses bolsas de plástico hoy",
  ]

  // Lista de retos semanales
  const [weeklyChallengesTodo, setWeeklyChallengesTodo] = useState([
    "Planta una semilla y cuídala",
    "Recoge basura en tu parque local",
    "Usa una botella reutilizable toda la semana",
    "Apaga las luces que no necesites",
    "Haz un proyecto con materiales reciclados",
    "Enseña a alguien sobre el reciclaje",
    "Reduce el uso de agua durante una semana",
  ])

  // Retos semanales completados
  const [weeklyCompletedChallenges, setWeeklyCompletedChallenges] = useState([])

  // Estado para el reto diario
  const [dailyChallenge, setDailyChallenge] = useState({
    completed: false,
    title: "",
    lastUpdated: null,
  })
  // Estados para nivel y progreso (ahora persistentes)
  const [level, setLevel] = useState(1)
  const [progress, setProgress] = useState(0)
  const [experiencePoints, setExperiencePoints] = useState(0) // XP total acumulada
  const [userPhotos, setUserPhotos] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  // Estados para proyectos PDF
  const [userProjects, setUserProjects] = useState([])
  const [isUploadingProject, setIsUploadingProject] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "reciclaje",
    difficulty: "facil",
    materials: "",
    steps: "",
    pdf: null,
  })

  // Estados para edición de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "EcoAmigo",
    email: "ecoamigo@ecokids.com",
    age: 10,
    school: "Escuela Verde",
    favoriteActivity: "reciclaje",
    avatar: "/images/avatar_tierra.png",
  })
  const [tempProfileData, setTempProfileData] = useState(profileData)

  // Función para actualizar el reto diario
  const updateDailyChallenge = () => {
    const now = new Date()
    const lastUpdated = dailyChallenge.lastUpdated ? new Date(dailyChallenge.lastUpdated) : null

    // Verificar si necesitamos un nuevo reto (si es la primera vez o si ha pasado un día)
    if (!lastUpdated || now.getDate() !== lastUpdated.getDate() || now.getMonth() !== lastUpdated.getMonth()) {
      // Seleccionar un reto aleatorio
      const randomIndex = Math.floor(Math.random() * dailyChallenges.length)
      setDailyChallenge({
        completed: false,
        title: dailyChallenges[randomIndex],
        lastUpdated: now.toISOString(),
      })

      // Guardar en localStorage
      localStorage.setItem(
        "ecokids-daily-challenge",
        JSON.stringify({
          completed: false,
          title: dailyChallenges[randomIndex],
          lastUpdated: now.toISOString(),
        }),
      )
    }
  }

  // Funciones para manejar el perfil y progreso
  const loadProfileData = () => {
    const savedProfile = localStorage.getItem("ecokids-user-profile")
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        setProfileData(parsedProfile)
        setTempProfileData(parsedProfile)
      } catch (error) {
        console.error("Error loading profile:", error)
      }
    }

    // Cargar progreso y nivel
    const savedProgress = localStorage.getItem("ecokids-user-progress")
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress)
        setLevel(parsedProgress.level || 1)
        setProgress(parsedProgress.progress || 0)
        setExperiencePoints(parsedProgress.experiencePoints || 0)
      } catch (error) {
        console.error("Error loading progress:", error)
      }
    }
  }

  const saveProfileData = () => {
    try {
      localStorage.setItem("ecokids-user-profile", JSON.stringify(tempProfileData))
      setProfileData(tempProfileData)
      setIsEditingProfile(false)

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios han sido guardados exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el perfil",
        variant: "destructive",
      })
    }
  }

  // Nueva función para manejar la experiencia y niveles
  const addExperience = (points) => {
    const newExperiencePoints = experiencePoints + points
    setExperiencePoints(newExperiencePoints)

    // Calcular nivel basado en XP (cada nivel requiere 100 XP más que el anterior)
    let newLevel = 1
    let totalXpNeeded = 0
    let xpForCurrentLevel = 100 // XP necesaria para nivel 2

    while (totalXpNeeded + xpForCurrentLevel <= newExperiencePoints) {
      totalXpNeeded += xpForCurrentLevel
      newLevel++
      xpForCurrentLevel += 50 // Cada nivel requiere 50 XP más que el anterior
    }

    // Calcular progreso en el nivel actual
    const xpInCurrentLevel = newExperiencePoints - totalXpNeeded
    const xpNeededForNextLevel = xpForCurrentLevel
    const newProgress = Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100)

    // Verificar si subió de nivel
    if (newLevel > level) {
      setLevel(newLevel)
      setProgress(newProgress)

      toast({
        title: "¡NIVEL SUBIDO! 🎉",
        description: `¡Felicidades! Ahora eres nivel ${newLevel}`,
        duration: 5000,
      })
    } else {
      setProgress(newProgress)
    }

    // Guardar progreso
    const progressData = {
      level: newLevel,
      progress: newProgress,
      experiencePoints: newExperiencePoints,
    }
    localStorage.setItem("ecokids-user-progress", JSON.stringify(progressData))
  }

  // Función para obtener XP necesaria para el siguiente nivel
  const getXpForNextLevel = () => {
    let totalXpNeeded = 0
    let xpForLevel = 100

    for (let i = 1; i < level; i++) {
      totalXpNeeded += xpForLevel
      xpForLevel += 50
    }

    return xpForLevel
  }

  // Función para obtener XP actual en el nivel
  const getCurrentLevelXp = () => {
    let totalXpNeeded = 0
    let xpForLevel = 100

    for (let i = 1; i < level; i++) {
      totalXpNeeded += xpForLevel
      xpForLevel += 50
    }

    return experiencePoints - totalXpNeeded
  }

  const cancelEditProfile = () => {
    setTempProfileData(profileData)
    setIsEditingProfile(false)
  }

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive",
      })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen es demasiado grande (máximo 2MB)",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setTempProfileData({ ...tempProfileData, avatar: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  // Cargar fotos guardadas al iniciar
  useEffect(() => {
    // Cargar reto diario
    const savedDailyChallenge = localStorage.getItem("ecokids-daily-challenge")
    if (savedDailyChallenge) {
      const parsedChallenge = JSON.parse(savedDailyChallenge)
      setDailyChallenge(parsedChallenge)
    }

    // Verificar si necesitamos actualizar el reto diario
    updateDailyChallenge()

    // Cargar retos semanales
    const savedWeeklyChallenges = localStorage.getItem("ecokids-weekly-challenges")
    if (savedWeeklyChallenges) {
      setWeeklyChallengesTodo(JSON.parse(savedWeeklyChallenges))
    }

    // Cargar retos semanales completados
    const savedCompletedChallenges = localStorage.getItem("ecokids-completed-challenges")
    if (savedCompletedChallenges) {
      setWeeklyCompletedChallenges(JSON.parse(savedCompletedChallenges))
    }

    const savedPhotos = localStorage.getItem("ecokids-user-photos")
    if (savedPhotos) {
      try {
        const parsedPhotos = JSON.parse(savedPhotos)
        setUserPhotos(parsedPhotos)
        if (parsedPhotos.length > 0) {
          toast({
            title: "Galería cargada",
            description: `${parsedPhotos.length} fotos cargadas de tu galería personal`,
            duration: 3000,
          })
        }
      } catch (error) {
        console.error("Error parsing saved photos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar tus fotos guardadas",
          variant: "destructive",
        })
      }
    }

    // Cargar proyectos del usuario
    const savedProjects = localStorage.getItem("ecokids-user-projects")
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects)
        setUserProjects(parsedProjects)
      } catch (error) {
        console.error("Error parsing saved projects:", error)
      }
    }

    // En el useEffect existente, agregar al final:
    loadProfileData()
  }, [toast])

  // Guardar fotos cuando cambien
  useEffect(() => {
    if (userPhotos.length > 0) {
      localStorage.setItem("ecokids-user-photos", JSON.stringify(userPhotos))
    }
  }, [userPhotos])

  // Guardar proyectos cuando cambien
  useEffect(() => {
    if (userProjects.length > 0) {
      localStorage.setItem("ecokids-user-projects", JSON.stringify(userProjects))
    }
  }, [userProjects])

  // Completar el reto diario
  const completeChallenge = () => {
    const updatedChallenge = { ...dailyChallenge, completed: true }
    setDailyChallenge(updatedChallenge)
    localStorage.setItem("ecokids-daily-challenge", JSON.stringify(updatedChallenge))

    // Añadir experiencia en lugar de manipular progreso directamente
    addExperience(25)

    toast({
      title: "¡Reto completado!",
      description: "Has ganado 25 puntos de experiencia.",
    })
  }

  // Completar un reto semanal
  const completeWeeklyChallenge = (index) => {
    const challenge = weeklyChallengesTodo[index]

    // Eliminar el reto de la lista de pendientes
    const updatedTodos = [...weeklyChallengesTodo]
    updatedTodos.splice(index, 1)
    setWeeklyChallengesTodo(updatedTodos)
    localStorage.setItem("ecokids-weekly-challenges", JSON.stringify(updatedTodos))

    // Añadir a completados
    const updatedCompleted = [...weeklyCompletedChallenges, challenge]
    setWeeklyCompletedChallenges(updatedCompleted)
    localStorage.setItem("ecokids-completed-challenges", JSON.stringify(updatedCompleted))

    // Añadir experiencia
    addExperience(15)

    toast({
      title: "¡Reto semanal completado!",
      description: "Has ganado 15 puntos de experiencia.",
    })
  }

  // Manejar la carga de imágenes
  const handleFileUpload = (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    // Procesar cada archivo
    Array.from(files).forEach((file) => {
      // Verificar que sea una imagen
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen",
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }

      // Verificar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen es demasiado grande (máximo 5MB)",
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }

      // Leer el archivo como URL de datos
      const reader = new FileReader()
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now(),
          src: e.target.result,
          title: file.name.split(".")[0],
          date: new Date().toLocaleDateString(),
        }

        setUserPhotos((prev) => {
          const newPhotos = [...prev, newPhoto]
          // Guardar inmediatamente en localStorage
          localStorage.setItem("ecokids-user-photos", JSON.stringify(newPhotos))
          return newPhotos
        })
        setIsUploading(false)

        toast({
          title: "¡Imagen guardada!",
          description: "Tu foto ha sido añadida y guardada en tu galería personal",
        })
      }

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "No se pudo cargar la imagen",
          variant: "destructive",
        })
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    })
  }

  // Manejar arrastrar y soltar
  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileUpload({ target: { files: event.dataTransfer.files } })
    }
  }

  // Eliminar una foto
  const deletePhoto = (id) => {
    setUserPhotos((prev) => {
      const updatedPhotos = prev.filter((photo) => photo.id !== id)
      localStorage.setItem("ecokids-user-photos", JSON.stringify(updatedPhotos))
      return updatedPhotos
    })

    toast({
      title: "Foto eliminada",
      description: "La foto ha sido eliminada de tu galería",
    })
  }

  // Funciones para proyectos PDF
  const handleProjectPdfUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Verificar que sea un PDF
    if (file.type !== "application/pdf") {
      toast({
        title: "Error",
        description: "Solo se permiten archivos PDF",
        variant: "destructive",
      })
      return
    }

    // Verificar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "El archivo PDF es demasiado grande (máximo 10MB)",
        variant: "destructive",
      })
      return
    }

    // Mostrar indicador de carga
    setIsUploadingProject(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      setNewProject({
        ...newProject,
        pdf: {
          data: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
        },
      })
      setIsUploadingProject(false)

      toast({
        title: "PDF cargado",
        description: `Archivo ${file.name} listo para subir`,
      })
    }

    reader.onerror = () => {
      toast({
        title: "Error",
        description: "No se pudo cargar el archivo PDF",
        variant: "destructive",
      })
      setIsUploadingProject(false)
    }

    reader.readAsDataURL(file)
  }

  const submitProject = () => {
    // Validar campos obligatorios
    if (!newProject.title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      })
      return
    }

    if (!newProject.description.trim()) {
      toast({
        title: "Error",
        description: "La descripción es obligatoria",
        variant: "destructive",
      })
      return
    }

    if (!newProject.materials.trim()) {
      toast({
        title: "Error",
        description: "Los materiales son obligatorios",
        variant: "destructive",
      })
      return
    }

    if (!newProject.steps.trim()) {
      toast({
        title: "Error",
        description: "Los pasos son obligatorios",
        variant: "destructive",
      })
      return
    }

    if (!newProject.pdf) {
      toast({
        title: "Error",
        description: "Debes subir un archivo PDF",
        variant: "destructive",
      })
      return
    }

    setIsUploadingProject(true)

    try {
      const project = {
        id: Date.now() + Math.random(), // ID único
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        category: newProject.category,
        difficulty: newProject.difficulty,
        materials: newProject.materials.trim(),
        steps: newProject.steps.trim(),
        pdf: newProject.pdf,
        author: "EcoAmigo",
        likes: 0,
        views: 0,
        downloads: 0,
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
      }

      setUserProjects((prev) => {
        const newProjects = [project, ...prev]
        localStorage.setItem("ecokids-user-projects", JSON.stringify(newProjects))
        return newProjects
      })

      // Resetear formulario
      setNewProject({
        title: "",
        description: "",
        category: "reciclaje",
        difficulty: "facil",
        materials: "",
        steps: "",
        pdf: null,
      })

      setShowProjectForm(false)
      setIsUploadingProject(false)

      toast({
        title: "¡Proyecto subido exitosamente!",
        description: "Tu proyecto PDF ha sido añadido a la galería",
      })
    } catch (error) {
      toast({
        title: "Error al subir proyecto",
        description: "Hubo un problema al guardar tu proyecto",
        variant: "destructive",
      })
      setIsUploadingProject(false)
    }
  }

  const deleteProject = (id) => {
    setUserProjects((prev) => {
      const updatedProjects = prev.filter((project) => project.id !== id)
      localStorage.setItem("ecokids-user-projects", JSON.stringify(updatedProjects))
      return updatedProjects
    })

    toast({
      title: "Proyecto eliminado",
      description: "El proyecto ha sido eliminado de tu galería",
    })
  }

  const downloadProject = (project) => {
    if (!project.pdf || !project.pdf.data) {
      toast({
        title: "Error",
        description: "No se encontró el archivo PDF",
        variant: "destructive",
      })
      return
    }

    try {
      // Crear un enlace temporal para la descarga
      const link = document.createElement("a")
      link.href = project.pdf.data
      link.download = project.pdf.name || `${project.title}.pdf`

      // Añadir al DOM temporalmente
      document.body.appendChild(link)

      // Hacer clic programáticamente
      link.click()

      // Limpiar
      document.body.removeChild(link)

      // Incrementar contador de descargas
      setUserProjects((prev) => {
        const updatedProjects = prev.map((p) => (p.id === project.id ? { ...p, downloads: p.downloads + 1 } : p))
        localStorage.setItem("ecokids-user-projects", JSON.stringify(updatedProjects))
        return updatedProjects
      })

      toast({
        title: "¡Descarga iniciada!",
        description: `Descargando ${project.title}.pdf`,
      })
    } catch (error) {
      toast({
        title: "Error en la descarga",
        description: "No se pudo descargar el archivo PDF",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Añadir función para previsualizar PDF
  const previewProject = (project) => {
    if (project.pdf && project.pdf.data) {
      // Abrir PDF en nueva ventana
      const newWindow = window.open()
      newWindow.document.write(`
        <html>
          <head>
            <title>${project.title} - Vista previa</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .header { background: #10b981; color: white; padding: 15px; margin: -20px -20px 20px -20px; }
              .pdf-container { width: 100%; height: 80vh; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${project.title}</h2>
              <p>Por ${project.author} • ${project.date}</p>
            </div>
            <div class="pdf-container">
              <iframe src="${project.pdf.data}" type="application/pdf"></iframe>
            </div>
          </body>
        </html>
      `)

      // Incrementar contador de vistas
      setUserProjects((prev) => {
        const updatedProjects = prev.map((p) => (p.id === project.id ? { ...p, views: p.views + 1 } : p))
        localStorage.setItem("ecokids-user-projects", JSON.stringify(updatedProjects))
        return updatedProjects
      })
    }
  }

  // Lista de juegos disponibles
  const availableGames = [
    {
      id: "recycling",
      name: "Maestro del Reciclaje",
      description: "Aprende a clasificar la basura en los contenedores correctos.",
      icon: Recycle,
      color: "bg-green-100",
      textColor: "text-green-700",
      iconColor: "text-green-600",
      image: "/images/master-recycle.png",
    },
    {
      id: "water",
      name: "Guardianes del Agua",
      description: "Juego de memoria con gotas de agua.",
      icon: Droplets,
      color: "bg-blue-100",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
      image: "/images/water-game.png",
    },
    {
      id: "energy",
      name: "Energía Limpia",
      description: "Rompecabezas de energías renovables.",
      icon: Zap,
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-600",
      image: "/images/energy-game.png",
    },
    {
      id: "trees",
      name: "Protectores de Árboles",
      description: "Puzzle deslizante de árboles y bosques.",
      icon: Tree,
      color: "bg-emerald-100",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-600",
      image: "/images/tree-game.png",
    },
    {
      id: "climate",
      name: "Detectives del Clima",
      description: "Quiz sobre el cambio climático.",
      icon: CloudRain,
      color: "bg-purple-100",
      textColor: "text-purple-700",
      iconColor: "text-purple-600",
      image: "/images/clima-game.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100">
      <header className="bg-green-500 p-4 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="https://i.postimg.cc/DZSQWHPY/c842716a-6ddb-477f-8c31-d37501821d23.png"
              alt="EcoKids Logo"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
              unoptimized
            />
            <h1 className="text-2xl font-bold">EcoKids</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-green-600 px-3 py-1 cursor-pointer hover:bg-green-700 transition-colors">
              <Award className="h-5 w-5 text-yellow-300" />
              <span className="font-bold">{totalPoints} puntos</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-600 px-3 py-1 cursor-pointer hover:bg-green-700 transition-colors">
              <Leaf className="h-5 w-5 text-yellow-300" />
              <span className="font-bold">Nivel {level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={profileData.avatar || "/placeholder.svg"}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full border-2 border-white object-cover cursor-pointer hover:border-yellow-300 transition-colors"
                onClick={() => {
                  // Cambiar a la pestaña de perfil
                  const profileTab = document.querySelector('[value="profile"]')
                  if (profileTab) profileTab.click()
                }}
              />
              <span className="text-sm font-medium hidden sm:block">{profileData.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6 rounded-xl bg-white/80 p-4 shadow-md">
          <h2 className="mb-2 text-xl font-bold text-green-700">¡Hola, {profileData.name}!</h2>
          <p className="mb-3 text-green-600">Sigue avanzando para convertirte en un Superhéroe del Planeta</p>
          <div className="mb-2">
            <Progress value={progress} className="h-4 bg-gray-200" />
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>Nivel {level}</span>
            <span>Nivel {level + 1}</span>
          </div>
          <div className="mt-1 text-center text-xs text-green-500">
            {getCurrentLevelXp()}/{getXpForNextLevel()} XP • {experiencePoints} XP total
          </div>
        </div>

        <Tabs defaultValue="home" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 bg-green-100">
            <TabsTrigger value="home" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Home className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Gamepad2 className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Calendar className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Camera className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Lightbulb className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <User className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4">
            <Card className="border-4 border-yellow-400 bg-white/90 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-green-600">Reto del día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/challenges-icon.png"
                    alt="Daily Challenge"
                    width={80}
                    height={80}
                    className="rounded-full bg-blue-100 p-1 object-cover"
                    unoptimized
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-green-700">{dailyChallenge.title}</h3>
                    <p className="text-sm text-green-600">¡Completa este reto y gana 25 puntos eco!</p>
                  </div>
                  <Button
                    onClick={completeChallenge}
                    disabled={dailyChallenge.completed}
                    className="rounded-full bg-green-500 hover:bg-green-600"
                  >
                    {dailyChallenge.completed ? "¡Completado!" : "Completar"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-4 border-green-400 bg-white/90 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-600">Juegos populares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableGames.slice(0, 3).map((game) => (
                      <Link
                        key={game.id}
                        href={`/games/${game.id}`}
                        className={`flex items-center gap-3 rounded-lg ${game.color} p-3 transition-colors hover:bg-opacity-80`}
                      >
                        <game.icon className={`h-8 w-8 ${game.iconColor}`} />
                        <div>
                          <h4 className={`font-bold ${game.textColor}`}>{game.name}</h4>
                          <p className={`text-sm ${game.textColor} opacity-80`}>{game.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-blue-400 bg-white/90 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-600">Tus logros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`mb-1 rounded-full p-2 ${i <= 3 ? "bg-yellow-100" : "bg-gray-200"}`}>
                          <Award className={`h-8 w-8 ${i <= 3 ? "text-yellow-500" : "text-gray-400"}`} />
                        </div>
                        <span className="text-center text-xs font-medium">{i <= 3 ? "Logro " + i : "Bloqueado"}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Juegos Ecológicos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableGames.map((game) => (
                <Link key={game.id} href={`/games/${game.id}`}>
                  <Card className="border-4 border-green-400 bg-white/90 shadow-md transition-transform hover:scale-105">
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-center">
                        <div className={`rounded-full ${game.color} p-4`}>
                          <Image
                            src={game.image || "/placeholder.svg"}
                            alt={game.name}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                      <h3 className={`mb-2 text-center text-xl font-bold ${game.textColor}`}>{game.name}</h3>
                      <p className={`text-center ${game.textColor} opacity-80`}>{game.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Retos Ecológicos</h2>

            {/* Reto diario */}
            <Card className="border-4 border-yellow-400 bg-white/90 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-green-600">
                  <Clock className="h-5 w-5" /> Reto del día
                  <span className="ml-auto text-sm font-normal text-green-500">Cambia cada 24 horas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/challenges-icon.png"
                    alt="Daily Challenge"
                    width={80}
                    height={80}
                    className="rounded-full bg-blue-100 p-1 object-cover"
                    unoptimized
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-green-700">{dailyChallenge.title}</h3>
                    <p className="text-sm text-green-600">¡Completa este reto y gana 25 puntos eco!</p>
                  </div>
                  <Button
                    onClick={completeChallenge}
                    disabled={dailyChallenge.completed}
                    className="rounded-full bg-green-500 hover:bg-green-600"
                  >
                    {dailyChallenge.completed ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> ¡Completado!
                      </>
                    ) : (
                      "Completar"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Retos semanales */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-green-700">Retos Semanales</h3>
              <span className="text-sm text-green-600">
                {weeklyChallengesTodo.length} pendientes | {weeklyCompletedChallenges.length} completados
              </span>
            </div>

            {weeklyChallengesTodo.length > 0 ? (
              <div className="space-y-3">
                {weeklyChallengesTodo.map((challenge, index) => (
                  <Card key={index} className="bg-white/90 shadow-sm">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-full bg-green-100 p-2">
                        <Calendar className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-700">{challenge}</h4>
                        <p className="text-sm text-green-600">Completa este reto para ganar 15 puntos</p>
                      </div>
                      <Button
                        onClick={() => completeWeeklyChallenge(index)}
                        className="rounded-full bg-green-500 hover:bg-green-600"
                      >
                        Completar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/90 shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-green-600">
                    ¡Has completado todos los retos semanales! Vuelve pronto para más retos.
                  </p>
                </CardContent>
              </Card>
            )}

            {weeklyCompletedChallenges.length > 0 && (
              <>
                <h3 className="mt-6 text-xl font-bold text-green-700">Retos Completados</h3>
                <div className="space-y-3">
                  {weeklyCompletedChallenges.slice(0, 3).map((challenge, index) => (
                    <Card key={index} className="bg-green-50/90 shadow-sm">
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-full bg-green-200 p-2">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-700">{challenge}</h4>
                          <p className="text-sm text-green-600">¡Reto completado!</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {weeklyCompletedChallenges.length > 3 && (
                    <p className="text-center text-sm text-green-600">
                      Y {weeklyCompletedChallenges.length - 3} retos más completados
                    </p>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Mis Fotos Ecológicas</h2>
            <div className="flex items-center justify-center gap-2 rounded-lg bg-green-100 p-2 text-green-700 mb-4">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Tus fotos se guardan automáticamente</span>
              </div>
            </div>
            <p className="mb-4 text-green-600">
              Sube tus propias fotos de actividades ecológicas, plantas, animales o cualquier cosa relacionada con el
              medio ambiente.
            </p>

            <Card className="border-4 border-teal-400 bg-white/90 shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col items-center justify-center">
                  <label
                    htmlFor="photo-upload"
                    className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-teal-300 bg-teal-50 hover:bg-teal-100"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="mb-3 h-10 w-10 text-teal-500" />
                      <p className="mb-2 text-sm text-teal-700">
                        <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                      </p>
                      <p className="text-xs text-teal-500">PNG, JPG o GIF (máx. 5MB)</p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && (
                    <div className="mt-4 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent"></div>
                      <p className="mt-2 text-teal-600">Subiendo foto...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {userPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {userPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative overflow-hidden rounded-lg border-2 border-teal-300 bg-white shadow-sm"
                  >
                    <div className="relative h-40 w-full">
                      <Image src={photo.src || "/placeholder.svg"} alt={photo.title} fill className="object-cover" />
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-2">
                      <h4 className="truncate text-sm font-medium text-teal-700">{photo.title}</h4>
                      <p className="text-xs text-teal-600">{photo.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-100 p-8 text-center">
                <p className="text-gray-500">Aún no has subido ninguna foto. ¡Sube tu primera foto ecológica!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Proyectos Ecológicos PDF</h2>
            <p className="mb-4 text-green-600">
              Descubre proyectos increíbles en formato PDF y comparte tus propias creaciones ecológicas.
            </p>

            {/* Botón para crear nuevo proyecto */}
            <Card className="border-4 border-purple-400 bg-white/90 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-purple-700">¿Tienes un proyecto ecológico?</h3>
                    <p className="text-purple-600">Comparte tu creatividad en formato PDF</p>
                  </div>
                  <Button
                    onClick={() => setShowProjectForm(!showProjectForm)}
                    className="rounded-full bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {showProjectForm ? "Cancelar" : "Subir PDF"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Formulario para nuevo proyecto */}
            {showProjectForm && (
              <Card className="border-4 border-purple-300 bg-white/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-purple-700">Crear Nuevo Proyecto PDF</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">Título del proyecto</label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full rounded-lg border-2 border-purple-300 p-2"
                        placeholder="Ej: Maceta con botellas recicladas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">Categoría</label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                        className="w-full rounded-lg border-2 border-purple-300 p-2"
                      >
                        <option value="reciclaje">Reciclaje</option>
                        <option value="energia">Energía</option>
                        <option value="agua">Agua</option>
                        <option value="agricultura">Agricultura</option>
                        <option value="fauna">Fauna</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">Descripción</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full rounded-lg border-2 border-purple-300 p-2 h-20"
                      placeholder="Describe tu proyecto y por qué es ecológico"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">Dificultad</label>
                    <select
                      value={newProject.difficulty}
                      onChange={(e) => setNewProject({ ...newProject, difficulty: e.target.value })}
                      className="w-full rounded-lg border-2 border-purple-300 p-2"
                    >
                      <option value="facil">Fácil</option>
                      <option value="medio">Medio</option>
                      <option value="dificil">Difícil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">Materiales necesarios</label>
                    <textarea
                      value={newProject.materials}
                      onChange={(e) => setNewProject({ ...newProject, materials: e.target.value })}
                      className="w-full rounded-lg border-2 border-purple-300 p-2 h-16"
                      placeholder="Lista los materiales que necesitas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">Pasos a seguir</label>
                    <textarea
                      value={newProject.steps}
                      onChange={(e) => setNewProject({ ...newProject, steps: e.target.value })}
                      className="w-full rounded-lg border-2 border-purple-300 p-2 h-24"
                      placeholder="Explica paso a paso cómo hacer el proyecto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">Archivo PDF del proyecto *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleProjectPdfUpload}
                        className="w-full rounded-lg border-2 border-purple-300 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        disabled={isUploadingProject}
                      />
                      {isUploadingProject && (
                        <div className="absolute right-2 top-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    {newProject.pdf && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">{newProject.pdf.name}</span>
                        <span className="text-sm text-green-600">({formatFileSize(newProject.pdf.size)})</span>
                        <button
                          onClick={() => setNewProject({ ...newProject, pdf: null })}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-purple-500 mt-1">Formatos permitidos: PDF • Tamaño máximo: 10MB</p>
                  </div>

                  <Button
                    onClick={submitProject}
                    disabled={isUploadingProject}
                    className="w-full rounded-full bg-purple-500 hover:bg-purple-600"
                  >
                    {isUploadingProject ? "Subiendo..." : "Publicar Proyecto PDF"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Proyectos del usuario */}
            {userProjects.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-green-700">Mis Proyectos PDF</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {userProjects.map((project) => (
                    <Card key={project.id} className="group border-2 border-green-300 bg-white/90 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-red-600" />
                            <div>
                              <h4 className="font-bold text-green-700 text-sm">{project.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{project.category}</span>
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                  {project.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        <p className="text-sm text-green-600 mb-3 line-clamp-2">{project.description}</p>

                        {project.pdf && (
                          <div className="mb-3 text-xs text-gray-600">
                            <span>📄 {formatFileSize(project.pdf.size)}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-green-500">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{project.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{project.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{project.downloads}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => previewProject(project)}
                              size="sm"
                              variant="outline"
                              className="text-xs h-7 px-2"
                            >
                              👁️ Ver
                            </Button>
                            <Button
                              onClick={() => downloadProject(project)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-xs h-7 px-2"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="border-4 border-green-400 bg-white/90 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-700">Mi Perfil</CardTitle>
                {!isEditingProfile ? (
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-600 hover:bg-green-50"
                  >
                    Editar Perfil
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={saveProfileData} size="sm" className="bg-green-500 hover:bg-green-600">
                      Guardar
                    </Button>
                    <Button onClick={cancelEditProfile} variant="outline" size="sm" className="border-gray-300">
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {!isEditingProfile ? (
                  // Vista de solo lectura
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <Image
                        src={profileData.avatar || "/placeholder.svg"}
                        alt="Profile Avatar"
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-green-500 object-cover"
                      />
                    </div>
                    <h2 className="mb-1 text-2xl font-bold text-green-700">{profileData.name}</h2>
                    <p className="mb-4 text-green-600">Nivel {level} - Defensor del Planeta</p>

                    <div className="mb-6 space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="font-medium text-green-700">Email:</span>
                        <span className="text-green-600">{profileData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-green-700">Edad:</span>
                        <span className="text-green-600">{profileData.age} años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-green-700">Escuela:</span>
                        <span className="text-green-600">{profileData.school}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-green-700">Actividad favorita:</span>
                        <span className="text-green-600 capitalize">{profileData.favoriteActivity}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="mb-2 text-sm font-medium text-green-600">Progreso al siguiente nivel</p>
                      <Progress value={progress} className="h-4 bg-gray-200" />
                      <div className="mt-1 flex justify-between text-xs text-green-600">
                        <span>{progress}% completado</span>
                        <span>
                          {getCurrentLevelXp()}/{getXpForNextLevel()} XP
                        </span>
                      </div>
                      <p className="mt-1 text-center text-xs text-green-500">
                        Experiencia total: {experiencePoints} XP
                      </p>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4 text-center">
                      <div className="rounded-lg bg-green-100 p-4">
                        <p className="text-sm text-green-600">Puntos Eco</p>
                        <p className="text-2xl font-bold text-green-700">{totalPoints}</p>
                      </div>
                      <div className="rounded-lg bg-yellow-100 p-4">
                        <p className="text-sm text-yellow-600">Logros</p>
                        <p className="text-2xl font-bold text-yellow-700">3/12</p>
                      </div>
                    </div>

                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </Button>
                    </Link>
                  </div>
                ) : (
                  // Vista de edición
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="relative">
                          <Image
                            src={tempProfileData.avatar || "/placeholder.svg"}
                            alt="Profile Avatar"
                            width={100}
                            height={100}
                            className="rounded-full border-4 border-green-500 object-cover"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2 cursor-pointer hover:bg-green-600 transition-colors"
                          >
                            <Camera className="h-4 w-4" />
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Haz clic en la cámara para cambiar tu avatar</p>
                    </div>

                    {/* Formulario de edición */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Nombre</label>
                        <input
                          type="text"
                          value={tempProfileData.name}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                          className="w-full rounded-lg border-2 border-green-300 p-2 focus:border-green-500 focus:outline-none"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={tempProfileData.email}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                          className="w-full rounded-lg border-2 border-green-300 p-2 focus:border-green-500 focus:outline-none"
                          placeholder="tu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Edad</label>
                        <input
                          type="number"
                          min="6"
                          max="18"
                          value={tempProfileData.age}
                          onChange={(e) =>
                            setTempProfileData({ ...tempProfileData, age: Number.parseInt(e.target.value) || 10 })
                          }
                          className="w-full rounded-lg border-2 border-green-300 p-2 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Escuela</label>
                        <input
                          type="text"
                          value={tempProfileData.school}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, school: e.target.value })}
                          className="w-full rounded-lg border-2 border-green-300 p-2 focus:border-green-500 focus:outline-none"
                          placeholder="Nombre de tu escuela"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">
                        Actividad ecológica favorita
                      </label>
                      <select
                        value={tempProfileData.favoriteActivity}
                        onChange={(e) => setTempProfileData({ ...tempProfileData, favoriteActivity: e.target.value })}
                        className="w-full rounded-lg border-2 border-green-300 p-2 focus:border-green-500 focus:outline-none"
                      >
                        <option value="reciclaje">Reciclaje</option>
                        <option value="jardineria">Jardinería</option>
                        <option value="ahorro-agua">Ahorro de agua</option>
                        <option value="energia-limpia">Energía limpia</option>
                        <option value="cuidado-animales">Cuidado de animales</option>
                        <option value="limpieza-parques">Limpieza de parques</option>
                      </select>
                    </div>

                    {/* Estadísticas (solo lectura en modo edición) */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="rounded-lg bg-green-100 p-4">
                        <p className="text-sm text-green-600">Puntos Eco</p>
                        <p className="text-2xl font-bold text-green-700">{totalPoints}</p>
                      </div>
                      <div className="rounded-lg bg-yellow-100 p-4">
                        <p className="text-sm text-yellow-600">Logros</p>
                        <p className="text-2xl font-bold text-yellow-700">3/12</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

