'use client';
import useGenerateCourse from '@/app/hooks/useGenerateCourse';
import CourseForm from '@/app/components/coursForm';
import InfoBar from '@/app/components/InfoBar';
import SectionList from '@/app/components/SectionList';

export default function Home() {
  const { generateCourse, course, loading, error } = useGenerateCourse();

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

      {/* Afficher les informations du cours si disponible */}
      {course && (
        <>
          <div className="max-w-4xl mx-auto mt-6">
            <InfoBar
              topic={course.topic}
              level={course.level}
              duration={course.duration}
              courseData={course} // Données complètes pour l'export
            />
          </div>

          <div className="max-w-4xl mx-auto mt-4">
            <SectionList sections={course.sections} />
          </div>
        </>
      )}
    </main>
  );
}
