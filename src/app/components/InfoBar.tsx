interface InfoBarProps {
  topic: string;
  level: string;
  duration: number;
  courseData: any; // Les données complètes du cours à exporter
}

export default function InfoBar({ topic, level, duration, courseData }: InfoBarProps) {
  // Fonction pour exporter le JSON
  const handleExport = () => {
    const jsonString = JSON.stringify(courseData, null, 2); // Convertit les données en JSON formaté
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic}-course.json`; // Nom du fichier basé sur le sujet
    link.click();

    // Libérer l'URL après le téléchargement
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-blue-500 text-white p-4 rounded-md shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">{topic}</h2>
        <p>
          Niveau : <span className="font-medium">{level}</span> | Durée :{' '}
          <span className="font-medium">{duration} minutes</span>
        </p>
        <p className="text-sm text-gray-200 mt-1">
          Généré le {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <button
        onClick={handleExport}
        className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-md hover:bg-blue-100"
      >
        Exporter en JSON
      </button>
    </div>
  );
}
