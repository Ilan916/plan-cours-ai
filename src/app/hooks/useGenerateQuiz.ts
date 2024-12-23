import { useState } from 'react';

interface Quiz {
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export default function useGenerateQuiz() {
  const [quizzes, setQuizzes] = useState<{ [key: string]: Quiz }>({});
  const [loadingSections, setLoadingSections] = useState<string[]>([]);

  // Fonction pour générer un quiz
  const generateQuiz = async (objectives: string[], sectionTitle: string) => {
    try {
      setLoadingSections((prev) => [...prev, sectionTitle]); // Indique que cette section est en cours de génération

      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectives,
          sectionTitle,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération du quiz pour "${sectionTitle}"`);
      }

      const data = await response.json();
      setQuizzes((prev) => ({ ...prev, [sectionTitle]: data })); // Stocker le quiz par section
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoadingSections((prev) => prev.filter((title) => title !== sectionTitle)); // Retirer de la liste en cours de chargement
    }
  };

  return {
    quizzes,
    generateQuiz,
    loadingSections, // Indique les sections en cours de génération
  };
}
