import OpenAI from "openai";
import { IcebreakerRequest } from "../types/icebreakerRequest";
import { IcebreakerResponse } from "../types/icebreakerResponse";
import { createHttpError } from "../utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OPENAI_CONFIG = {
  TEMPERATURE: 0.8,
  MAX_TOKENS: 1000,
};

const buildPrompt = ({
  senderProfile,
  recipientProfile,
  problemDescription,
  solutionDescription,
}: IcebreakerRequest): string => {
  return `Eres un experto en networking profesional y comunicación en LinkedIn. Tu objetivo es generar 3 mensajes tipo icebreaker para que ${
    senderProfile.fullName
  } inicie una conversación con ${recipientProfile.fullName}.

**OBJETIVO PRINCIPAL:**
Los mensajes deben abrir conversaciones de manera natural, alineados con el estilo de escritura del usuario que los envía, y deben ser apropiados para el perfil al que se dirigen.

## INFORMACIÓN DEL EMISOR (quien envía el mensaje):
- Nombre: ${senderProfile.fullName}
- Headline: ${senderProfile.headline || "No disponible"}
- Posición: ${senderProfile.currentPosition?.title || "No disponible"} en ${
    senderProfile.currentPosition?.company || "No disponible"
  }
- Resumen/Bio: ${senderProfile.summary || "No disponible"}

**Contexto del emisor:**
- Problema que resuelve: ${problemDescription}
- Solución que ofrece: ${solutionDescription}

## INFORMACIÓN DEL DESTINATARIO (quien recibe el mensaje):
- Nombre: ${recipientProfile.firstName}
- Headline: ${recipientProfile.headline || "No disponible"}
- Posición: ${recipientProfile.currentPosition?.title || "No disponible"} en ${
    recipientProfile.currentPosition?.company || "No disponible"
  }
- Industria: ${recipientProfile.currentPosition?.industry || "No disponible"}
- Resumen/Bio: ${recipientProfile.summary || "No disponible"}

${
  recipientProfile.posts && recipientProfile.posts.length > 0
    ? `
**Posts recientes del destinatario:**
${recipientProfile.posts
  .map(
    (post: any, idx: number) => `
Post ${idx + 1} (Fecha: ${post.postedDate}, Likes: ${post.likeCount}):
${post.text}
URL: ${post.postUrl}
`
  )
  .join("\n")}
`
    : "**No hay posts recientes disponibles.**"
}

${
  recipientProfile.certifications && recipientProfile.certifications.length > 0
    ? `
**Certificaciones/Logros recientes:**
${recipientProfile.certifications
  .map(
    (cert: any) =>
      `- ${cert.name} (${cert.authority}, ${cert.issueYear || "N/A"})`
  )
  .join("\n")}
`
    : ""
}

${
  recipientProfile.skills && recipientProfile.skills.length > 0
    ? `
**Skills del destinatario:**
${recipientProfile.skills.slice(0, 10).join(", ")}
`
    : ""
}

## TIPOS DE ICEBREAKERS DISPONIBLES:

Debes generar exactamente 3 icebreakers, eligiendo entre estos tipos según la información disponible:

1. **Pregunta sobre un post** - Si hay posts disponibles, analiza el contenido y genera una pregunta genuina que demuestre interés real
2. **Mencionar que comentaste su post** - Si hay posts, menciona que comentaste uno (asume que ya lo hiciste antes de enviar el mensaje)
3. **Mencionar que fuiste el primero en darle like** - SOLO si hay un post con "Likes: 0". Menciona que fuiste el primero en reaccionar a ese post específico
4. **Comentar sobre una charla o evento** - Si en los posts menciona participación en eventos, charlas, conferencias o webinars
5. **Felicitar por logro reciente** - Si en posts o certificaciones hay logros, premios, nuevas posiciones o colaboraciones recientes

**RESTRICCIÓN IMPORTANTE:**
- El icebreaker tipo 3 ("primer like") SOLO puede usarse si existe al menos un post con "Likes: 0"
- Si no hay posts con 0 likes, elige otro tipo

## REGLAS DE ESCRITURA:

**1. Tono y Naturalidad:**
   - Analiza el estilo de escritura de ${
     senderProfile.firstName
   } en su resumen/bio
   - Mantén un tono profesional pero humano y cercano
   - NO fuerces lenguaje coloquial si no es apropiado para el contexto
   - Adapta el nivel de formalidad según ambos perfiles (industria, posiciones, contexto)
   - Suena genuino, no robótico ni templático

**2. Estructura del mensaje:**
   - **Saludo variado:** Cada mensaje debe empezar con un saludo que incluya el nombre "${
     recipientProfile.firstName
   }", pero varía la forma entre los 3 mensajes (no uses el mismo saludo en todos)
   - Sé específico: usa nombres concretos de empresas, tecnologías, proyectos o temas mencionados
   - Haz referencia directa y precisa al contenido (post específico, logro, etc.)
   - **Finales variados:** NO todos los mensajes deben terminar con pregunta. Varía entre:
     * Pregunta abierta genuina
     * Comentario + propuesta sutil de conexión
     * Mención de interés común o punto de encuentro
   - Extensión: 3-5 líneas máximo (breve pero sustancioso)

**3. Personalización y Relevancia:**
   - Utiliza información específica y real de ambos perfiles
   - Identifica puntos en común: industria, intereses, tecnologías, desafíos
   - **Puedes mencionar MUY sutilmente** el problema que resuelve o la solución que ofrece el emisor, pero SOLO si:
     * Es relevante para los intereses del destinatario
     * Se conecta naturalmente con el contenido del mensaje
     * No suena a venta o pitch agresivo
     * Da pie a continuar la conversación
   - NO inventes información que no esté en el contexto proporcionado
   - Demuestra que el mensaje es genuino y personalizado, no automatizado

**4. Estrategia de selección y variedad:**
   - Prioriza icebreakers basados en posts si están disponibles (son más efectivos)
   - Si hay logros/certificaciones recientes (últimos 6-12 meses), considéralos
   - Si no hay posts, enfócate en puntos en común entre perfiles
   - **VARIEDAD CRÍTICA:** Los 3 icebreakers DEBEN ser diferentes:
     * Usa tipos diferentes (no repitas el mismo enfoque)
     * Al menos 1 debe terminar SIN pregunta
     * Cada uno con ángulo único y distinto final
     * Diferentes niveles de conexión con la solución del emisor (uno puede ser más directo, otros más sutiles)

## FORMATO DE RESPUESTA:

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta:
{
  "icebreakers": [
    "mensaje 1 completo",
    "mensaje 2 completo", 
    "mensaje 3 completo"
  ]
}

NO incluyas explicaciones adicionales, comentarios o texto fuera del JSON. SOLO el JSON.`;
};

/**
 * Genera icebreakers usando OpenAI
 */
export const generateIcebreakers = async (
  request: IcebreakerRequest
): Promise<IcebreakerResponse> => {
  if (!process.env.OPENAI_API_KEY) {
    throw createHttpError(
      "OPENAI_API_KEY environment variable is not set",
      500
    );
  }

  try {
    const prompt = buildPrompt(request);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en networking profesional y generación de mensajes de apertura (icebreakers) para LinkedIn. Respondes ÚNICAMENTE con JSON válido, sin explicaciones adicionales.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: OPENAI_CONFIG.TEMPERATURE,
      max_tokens: OPENAI_CONFIG.MAX_TOKENS,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message.content;

    if (!responseContent) {
      throw createHttpError("OpenAI returned empty response", 500);
    }

    const parsedResponse = JSON.parse(responseContent) as IcebreakerResponse;

    if (
      !parsedResponse.icebreakers ||
      !Array.isArray(parsedResponse.icebreakers) ||
      parsedResponse.icebreakers.length !== 3
    ) {
      throw createHttpError("Invalid icebreakers format from OpenAI", 500);
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error generating icebreakers with OpenAI:", error);
    throw createHttpError("Failed to generate icebreakers", 500);
  }
};

export default {
  generateIcebreakers,
};
