interface Section {
  title: string;
  description: string;
  objectives: string[];
}

interface SectionListProps {
  sections: Section[];
  onGenerateQuiz: (objectives: string[], sectionTitle: string) => Promise<void>;
  loadingSections: string[]; // Gestion des sections en cours de génération
}

export default function SectionList({ sections, onGenerateQuiz, loadingSections }: SectionListProps) {
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
              onClick={() => onGenerateQuiz(section.objectives, section.title)}
              disabled={loadingSections.includes(section.title)} // Désactiver le bouton si en cours de génération
              className={`mt-4 px-4 py-2 text-white font-semibold rounded-md ${
                loadingSections.includes(section.title)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loadingSections.includes(section.title) ? 'Génération...' : 'Générer Quiz'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
