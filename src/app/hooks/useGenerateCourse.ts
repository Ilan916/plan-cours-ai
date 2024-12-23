import { useState } from 'react';

interface Course {
  topic: string;
  level: string;
  duration: number;
  sections: Array<{
    title: string;
    description: string;
    objectives: string[];
  }>;
}

interface UseGenerateCourseReturn {
  generateCourse: (topic: string, level: string, duration: number) => Promise<void>;
  course: Course | null;
  loading: boolean;
  error: string | null;
}

export default function useGenerateCourse(): UseGenerateCourseReturn {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCourse = async (topic: string, level: string, duration: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generateCours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, level, duration }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du cours');
      }

      const data: Course = await response.json(); // Typage strict des données de réponse
      setCourse(data); // Met à jour les données du cours
    } catch (err: unknown) {
      // Vérification du type de l'erreur
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return { generateCourse, course, loading, error };
}
