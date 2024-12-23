import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { objectives, sectionTitle } = await req.json();

  if (!objectives || !sectionTitle) {
    return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 });
  }

  // Schéma JSON pour les questions de quiz
  const quizSchema = {
    type: "object",
    properties: {
      sectionTitle: { type: "string", description: "Le titre de la section du quiz" },
      questions: {
        type: "array",
        description: "Liste des questions de quiz générées",
        items: {
          type: "object",
          properties: {
            question: { type: "string", description: "La question du quiz" },
            options: {
              type: "array",
              description: "Les 4 options de réponse",
              items: { type: "string" },
              minItems: 4,
              maxItems: 4,
            },
            correctAnswer: { type: "string", description: "La réponse correcte" },
          },
          required: ["question", "options", "correctAnswer"],
        },
      },
    },
    required: ["sectionTitle", "questions"],
    additionalProperties: false,
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `
            Crée un quiz basé sur les objectifs pédagogiques suivants :
            - ${objectives.join('\n- ')}
            
            Détails requis pour chaque question :
            - La question elle-même
            - 4 propositions de réponse
            - Une réponse correcte parmi les 4 propositions
            
            Retourne un JSON structuré avec un tableau contenant 10 questions. Le JSON doit suivre ce schéma :
            - Chaque question doit inclure :
              - "question" : la question
              - "options" : un tableau de 4 propositions de réponse
              - "correctAnswer" : la réponse correcte parmi les propositions.
            Retourne le JSON complet au format spécifié.
          `,
        },
      ],
      functions: [
        {
          name: "generate_quiz",
          description: "Génération d'un quiz basé sur les objectifs pédagogiques",
          parameters: quizSchema,
        },
      ],
      function_call: { name: "generate_quiz" },
    });

    // Récupérer et parser le JSON renvoyé par OpenAI
    const quiz = response.choices[0].message?.function_call?.arguments;
    const parsedQuiz = JSON.parse(quiz || '{}');

    return NextResponse.json(parsedQuiz);
  } catch (error) {
    console.error("Erreur lors de la génération du quiz :", error);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
