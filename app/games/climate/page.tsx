// app/games/climate/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

const questions = [
  {
    question: '¿Cuál gas es el principal responsable del calentamiento global?',
    options: ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Hidrógeno'],
    answer: 'Dióxido de carbono',
  },
  {
    question: '¿Qué electrodoméstico consume más energía?',
    options: ['Refrigerador', 'Televisor', 'Microondas', 'Lámpara LED'],
    answer: 'Refrigerador',
  },
  {
    question: '¿Qué actividad humana contribuye más al cambio climático?',
    options: ['Pesca', 'Deforestación', 'Reciclaje', 'Ciclismo'],
    answer: 'Deforestación',
  },
  {
    question: '¿Qué energía es renovable?',
    options: ['Carbón', 'Energía solar', 'Petróleo', 'Gas natural'],
    answer: 'Energía solar',
  },
  {
    question: '¿Qué se debe hacer para ahorrar agua?',
    options: ['Dejar la llave abierta', 'Bañarse rápido', 'Regar al mediodía', 'Usar lavadoras llenas'],
    answer: 'Bañarse rápido',
  },
];

export default function ClimateGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (showAnswer) return;

    setSelectedOption(option);
    setShowAnswer(true);

    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowAnswer(false);
      setSelectedOption('');
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowModal(true);
      }
    }, 1500);
  };

  const getButtonStyle = (option: string) => {
    if (!showAnswer) return 'bg-gray-200 hover:bg-gray-300';
    if (option === currentQuestion.answer) return 'bg-green-500 text-white';
    if (option === selectedOption) return 'bg-red-500 text-white';
    return 'bg-gray-300 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/dashboard">
          <button className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600">
            ← Volver
          </button>
        </Link>
        <h1 className="text-3xl font-bold text-green-800">Juego del Clima 🌞🌍</h1>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-300 h-3 rounded-full mb-4">
        <div
          className="h-3 bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Tarjeta de la pregunta */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-6">🧠 {currentQuestion.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-3 font-semibold rounded-lg transition-colors ${getButtonStyle(
                option
              )}`}
              disabled={showAnswer}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showAnswer && selectedOption !== currentQuestion.answer && (
          <div className="mt-4 text-red-600 font-semibold text-lg">
            ❌ Incorrecto. La respuesta era: <strong>{currentQuestion.answer}</strong>
          </div>
        )}
      </div>

      {/* Modal al finalizar */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">🎉 ¡Juego terminado!</h2>
            <p className="text-lg mb-6">Puntaje final: {score} / {questions.length}</p>
            <button
              onClick={() => {
                setShowModal(false);
                setCurrentIndex(0);
                setScore(0);
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Jugar de nuevo 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
