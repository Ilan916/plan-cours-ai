'use client';
import { useState } from 'react';
import useGenerateCourse from '@/app/hooks/useGenerateCourse';
import CourseForm from '@/app/components/coursForm';
import InfoBar from '@/app/components/InfoBar';
import SectionList from '@/app/components/SectionList';

export default function Home() {
  const { generateCourse, course, loading, error } = useGenerateCourse();
  const [quizzes, setQuizzes] = useState<{ [key: string]: any }>({}); // Stocker les quiz par section

  const handleGenerateQuiz = async (objectives: string[], sectionTitle: string) => {
    try {
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
    } catch (error : any) {
      console.error(error);
      alert(`Erreur : ${error.message}`);
    }
  };

  // Fonction pour exporter un quiz en JSON
  const handleExportQuiz = (quiz: any, sectionTitle: string) => {
    const jsonBlob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${sectionTitle}-quiz.json`;
    link.click();

    URL.revokeObjectURL(url); // Libérer l'URL après utilisation
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Générateur de Cours Automatique
      </h1>

      {/* Formulaire */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-md p-6">
        <CourseForm onGenerate={generateCourse} loading={loading} />
      </div>

      {/* Afficher une erreur si présente */}
      {error && (
        <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {/* Informations du cours et liste des sections */}
      {course && (
        <>
          <div className="max-w-4xl mx-auto mt-6">
            <InfoBar
              topic={course.topic}
              level={course.level}
              duration={course.duration}
              courseData={course}
            />
          </div>

          <div className="max-w-4xl mx-auto mt-4">
            <SectionList sections={course.sections} onGenerateQuiz={handleGenerateQuiz} />
          </div>

          {/* Afficher les quiz générés */}
          <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-md p-6">
            <h2 className="text-xl font-bold text-gray-800">Quiz Générés</h2>
            {Object.entries(quizzes).map(([sectionTitle, quiz]) => (
              <div key={sectionTitle} className="mt-4">
                <h3 className="text-lg font-semibold text-blue-600">{sectionTitle}</h3>
                {quiz?.questions && Array.isArray(quiz.questions) ? (
                  <>
                    <ul className="mt-2 list-decimal list-inside">
                      {quiz.questions.map((q: any, index: number) => (
                        <li key={index} className="mb-4">
                          <p className="text-gray-800 font-medium">{q.question}</p>
                          <ul className="mt-2 list-disc list-inside pl-6">
                            {q.options.map((option: string, i: number) => (
                              <li key={i} className="text-gray-600">
                                {option}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-1 text-sm text-green-600">
                            <strong>Réponse correcte : </strong>
                            {q.correctAnswer}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {/* Bouton Exporter en JSON */}
                    <button
                      onClick={() => handleExportQuiz(quiz, sectionTitle)}
                      className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                    >
                      Exporter le Quiz en JSON
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">Aucun quiz disponible pour cette section.</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
