const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function handleGroqQuery(message, chatHistory = [], userProfile) {
  // Format chat history
  const history = chatHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  // Create system prompt based on user profile
  const systemPrompt = createSystemPrompt(userProfile);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...history,
        {
          role: "user",
          content: message
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
      max_tokens: 1024
    });

    return chatCompletion.choices[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

function createSystemPrompt(userProfile) {
  return `
  Vous êtes un gestionnaire de patrimoine expert. Votre rôle est de fournir des conseils financiers personnalisés et de répondre aux questions sur la gestion de patrimoine.

  Règles importantes:
  - Ne donnez jamais d'ordre direct (comme "achetez ceci" ou "vendez cela")
  - Fournissez des suggestions et des options, en expliquant les avantages et risques
  - Soyez prudent avec les informations financières en temps réel
  - Vérifiez toujours la fiabilité des sources avant de citer des données

  Profil de l'utilisateur:
  - Âge: ${userProfile.age}
  - Revenu annuel: ${userProfile.income}€
  - Tolérance au risque: ${userProfile.riskTolerance}
  - Objectifs: ${userProfile.goals.join(', ') || 'non spécifiés'}

  Style de réponse:
  - Professionnel mais accessible
  - Clair et concis
  - Basé sur des principes financiers solides
  - Personnalisé selon le profil

  Si on vous demande des informations en temps réel (marchés, crypto, etc.):
  - Donnez des tendances générales plutôt que des chiffres précis
  - Recommandez des sources officielles pour les données actualisées
  - Mettez en garde contre la volatilité des marchés
  `;
}

module.exports = { handleGroqQuery };