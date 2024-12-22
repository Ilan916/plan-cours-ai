import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }
);

export async function POST(req: NextRequest) {
  const { topic, level, duration } = await req.json();

  if (!topic || !level || !duration) {
    return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 });
  }

  // Schéma JSON pour le format de réponse
  const courseSchema = {
    type: "object",
    properties: {
      topic: { type: "string", description: "Le sujet principal du cours" },
      level: { type: "string", description: "Le niveau de difficulté du cours" },
      duration: { type: "integer", description: "La durée du cours en minutes" },
      sections: {
        type: "array",
        description: "Les sections structurées du cours",
        items: {
          type: "object",
          properties: {
            title: { type: "string", description: "Titre de la section" },
            description: { type: "string", description: "Description de la section" },
            objectives: {
              type: "array",
              description: "Objectifs pédagogiques de la section",
              items: { type: "string" },
            },
          },
          required: ["title", "description", "objectives"],
        },
      },
    },
    required: ["topic", "level", "duration", "sections"],
    additionalProperties: false,
  };
  

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `
            Crée un plan de cours structuré sur le sujet "${topic}".
            - Niveau: ${level}
            - Durée: ${duration} minutes
            
            Le plan de cours doit inclure:
            - Introduction avec description générale
            - 3 sections principales avec :
              - Titre
              - Description
              - Objectifs pédagogiques
            Retourne au format JSON selon le schéma spécifié.
          `,
        }
      ],
      functions: [
        {
          name: "generate_course",
          description: "Génération d'un plan de cours structuré",
          parameters: courseSchema
        }
      ],
      function_call: { name: "generate_course" }
    });

    const course = response.choices[0].message?.function_call?.arguments;
    const parsedCourse = JSON.parse(course || '{}');

    return NextResponse.json(parsedCourse);
  } catch (error) {
    console.error("Erreur lors de la génération du cours:", error);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
