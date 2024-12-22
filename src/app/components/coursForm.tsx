'use client';
import { useState } from 'react';

interface CourseFormProps {
  onGenerate: (topic: string, level: string, duration: number) => Promise<void>;
  loading: boolean;
}

export default function CourseForm({ onGenerate, loading }: CourseFormProps) {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState(60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate(topic, level, duration); // Appelle la fonction depuis le parent
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-600">
          Sujet :
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ex. Programmation Web"
        />
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-600">
          Niveau :
        </label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Sélectionnez un niveau</option>
          {['Débutant', 'Intermédiaire', 'Avancé'].map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-600">
          Durée (minutes) :
        </label>
        <input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="1"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ex. 60"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
          loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Génération en cours...' : 'Générer le Cours'}
      </button>
    </form>
  );
}
