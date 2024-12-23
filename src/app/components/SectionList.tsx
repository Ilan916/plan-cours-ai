import { useState } from 'react';

interface Section {
  title: string;
  description: string;
  objectives: string[];
}

interface SectionListProps {
  sections: Section[];
  onGenerateQuiz: (objectives: string[], sectionTitle: string) => Promise<void>; // Callback pour générer un quiz
}

export default function SectionList({ sections, onGenerateQuiz }: SectionListProps) {
  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]); // Gérer les sections en cours de génération

  const handleGenerateQuiz = async (objectives: string[], sectionTitle: string, index: number) => {
    setLoadingIndexes((prev) => [...prev, index]); // Marquer l'index comme en cours de chargement
    try {
      await onGenerateQuiz(objectives, sectionTitle);
    } catch (error) {
      alert(`Erreur lors de la génération du quiz pour "${sectionTitle}"`);
    } finally {
      setLoadingIndexes((prev) => prev.filter((i) => i !== index)); // Retirer l'index après la génération
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Liste des Sections</h2>
      <ul className="space-y-4">
        {sections.map((section, index) => (
          <li key={index} className="p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold text-blue-600">{section.title}</h3>
            <p className="text-gray-700 mt-2">{section.description}</p>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {section.objectives.map((objective, i) => (
                <li key={i}>{objective}</li>
              ))}
            </ul>
            <button
              onClick={() => handleGenerateQuiz(section.objectives, section.title, index)}
              disabled={loadingIndexes.includes(index)} // Désactiver le bouton si en cours de génération
              className={`mt-4 px-4 py-2 text-white font-semibold rounded-md flex items-center justify-center ${
                loadingIndexes.includes(index)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loadingIndexes.includes(index) ? (
                <span className="loader mr-2 border-t-white"></span> // Loader visuel
              ) : (
                'Générer Quiz'
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
