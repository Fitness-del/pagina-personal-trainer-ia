import { NextRequest, NextResponse } from "next/server";

// Tipos
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  type: "chat";
}

interface FoodAnalysisRequest {
  image: string;
  type: "food-analysis";
}

type OpenAIRequest = ChatRequest | FoodAnalysisRequest;

// Configuração da OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    // Validar API Key
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key não configurada. Por favor configura a variável OPENAI_API_KEY nas configurações do projeto." },
        { status: 500 }
      );
    }

    const body: OpenAIRequest = await request.json();

    // Processar Chat do Personal Trainer
    if (body.type === "chat") {
      const { messages } = body as ChatRequest;

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `És um Personal Trainer profissional, experiente e altamente qualificado. 

PERSONALIDADE:
- Amigável, motivador e empático
- Sempre positivo e encorajador
- Usa linguagem acessível mas profissional
- Adaptas a tua comunicação ao nível do utilizador

ESPECIALIDADES:
- Treino personalizado (hipertrofia, emagrecimento, resistência)
- Nutrição desportiva e planos alimentares
- Técnicas de exercícios e correção postural
- Motivação e psicologia do fitness
- Prevenção de lesões e recuperação

COMO RESPONDES:
- Sempre em português de Portugal
- Respostas práticas, claras e acionáveis
- Usa emojis ocasionalmente para tornar mais amigável
- Faz perguntas para personalizar melhor os conselhos
- Dá exemplos concretos quando apropriado
- Se o utilizador pedir um plano, estrutura-o de forma clara

IMPORTANTE:
- Nunca dês conselhos médicos - recomenda consultar profissionais de saúde quando necessário
- Adapta sempre os conselhos ao nível de experiência do utilizador
- Celebra as conquistas e motiva nos desafios`,
            },
            ...messages,
          ],
          temperature: 0.8,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI Error:", error);
        return NextResponse.json(
          { error: `Erro ao comunicar com a OpenAI: ${error.error?.message || 'Erro desconhecido'}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json({
        message: data.choices[0].message.content,
      });
    }

    // Processar Análise de Comida
    if (body.type === "food-analysis") {
      const { image } = body as FoodAnalysisRequest;

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analisa esta imagem de comida como um nutricionista profissional e fornece informação nutricional detalhada.

INSTRUÇÕES:
1. Identifica todos os alimentos visíveis na imagem
2. Estima as porções de cada alimento
3. Calcula os valores nutricionais totais da refeição
4. Fornece sugestões práticas e personalizadas

Responde APENAS com um objeto JSON válido (sem markdown, sem \`\`\`json) com esta estrutura EXATA:

{
  "food_name": "nome descritivo da refeição completa",
  "calories": número inteiro estimado de calorias totais,
  "protein": número inteiro de gramas de proteína,
  "carbs": número inteiro de gramas de carboidratos,
  "fat": número inteiro de gramas de gordura,
  "fiber": número inteiro de gramas de fibra,
  "description": "descrição detalhada dos ingredientes e porções visíveis",
  "suggestions": [
    "sugestão prática 1 sobre a refeição",
    "sugestão prática 2 sobre como melhorar",
    "sugestão prática 3 sobre timing ou combinações"
  ]
}

IMPORTANTE:
- Valores devem ser realistas baseados nas porções visíveis
- Sugestões devem ser práticas e motivadoras
- Se a refeição for saudável, elogia e dá dicas para manter
- Se houver espaço para melhorias, sugere de forma construtiva`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: image,
                  },
                },
              ],
            },
          ],
          max_tokens: 1200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI Error:", error);
        return NextResponse.json(
          { error: `Erro ao analisar a imagem: ${error.error?.message || 'Verifica se a chave da OpenAI está correta'}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Extrair JSON da resposta (remover markdown se existir)
      let jsonContent = content.trim();
      
      // Remover blocos de código markdown se existirem
      jsonContent = jsonContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      
      // Encontrar o objeto JSON
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("Resposta inválida:", content);
        return NextResponse.json(
          { error: "Resposta inválida da IA" },
          { status: 500 }
        );
      }

      const nutritionInfo = JSON.parse(jsonMatch[0]);
      return NextResponse.json(nutritionInfo);
    }

    return NextResponse.json(
      { error: "Tipo de requisição inválido" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
