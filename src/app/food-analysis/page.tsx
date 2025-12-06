"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Loader2, Sparkles, AlertCircle, RefreshCw, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/custom/navbar";
import Image from "next/image";
import Link from "next/link";

interface NutritionInfo {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
  suggestions: string[];
}

// Limites de análises por plano
const ANALYSIS_LIMITS = {
  free: 1, // 1 análise por dia
  plus: -1, // ilimitado
  premium: -1 // ilimitado
};

export default function FoodAnalysisPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [userPlan, setUserPlan] = useState<"free" | "plus" | "premium">("free");
  const [analysisCount, setAnalysisCount] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      loadAnalysisCount();
    }
  }, [userId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
    setUserId(user.id);
    
    // Buscar plano do usuário (por enquanto assume free, depois integrar com sistema de pagamento)
    setUserPlan("free");
  };

  const loadAnalysisCount = async () => {
    try {
      const { data, error } = await supabase
        .from("user_analysis_count")
        .select("count, last_reset")
        .eq("user_id", userId)
        .single();

      if (data) {
        // Verificar se precisa resetar (novo dia)
        const lastReset = new Date(data.last_reset);
        const now = new Date();
        const isNewDay = lastReset.getDate() !== now.getDate() || 
                        lastReset.getMonth() !== now.getMonth() ||
                        lastReset.getFullYear() !== now.getFullYear();

        if (isNewDay) {
          // Resetar contador
          await supabase
            .from("user_analysis_count")
            .update({ count: 0, last_reset: now.toISOString() })
            .eq("user_id", userId);
          setAnalysisCount(0);
        } else {
          setAnalysisCount(data.count);
        }
      } else {
        // Criar registro inicial
        await supabase
          .from("user_analysis_count")
          .insert({ user_id: userId, count: 0, last_reset: new Date().toISOString() });
      }
    } catch (error) {
      console.log("Erro ao carregar contador de análises");
    }
  };

  const incrementAnalysisCount = async () => {
    const newCount = analysisCount + 1;
    setAnalysisCount(newCount);
    
    try {
      await supabase
        .from("user_analysis_count")
        .update({ count: newCount })
        .eq("user_id", userId);
    } catch (error) {
      console.log("Erro ao atualizar contador");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar limite de análises para plano free
    const limit = ANALYSIS_LIMITS[userPlan];
    if (limit !== -1 && analysisCount >= limit) {
      setShowUpgradePrompt(true);
      return;
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor seleciona uma imagem válida");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter menos de 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFood = async () => {
    if (!selectedImage) return;

    // Verificar limite novamente antes de analisar
    const limit = ANALYSIS_LIMITS[userPlan];
    if (limit !== -1 && analysisCount >= limit) {
      setShowUpgradePrompt(true);
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Chamar nossa API unificada
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "food-analysis",
          image: selectedImage
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao analisar a imagem");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as NutritionInfo);
      await incrementAnalysisCount();

      // Verificar se atingiu o limite após esta análise
      if (limit !== -1 && analysisCount + 1 >= limit) {
        setShowUpgradePrompt(true);
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Não foi possível analisar a imagem. Por favor verifica se a chave da OpenAI está configurada e tenta novamente.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  const remainingAnalyses = ANALYSIS_LIMITS[userPlan] === -1 
    ? "Ilimitadas" 
    : Math.max(0, ANALYSIS_LIMITS[userPlan] - analysisCount);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                      Análise de Comida
                    </span>
                  </h1>
                  <p className="text-sm text-gray-400">
                    {userPlan === "free" 
                      ? `${remainingAnalyses} análise${remainingAnalyses === 1 ? '' : 's'} restante${remainingAnalyses === 1 ? '' : 's'} hoje` 
                      : "Análises ilimitadas"}
                  </p>
                </div>
              </div>
              {userPlan === "free" && (
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black font-semibold hover:opacity-90">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>
            <p className="text-gray-400">
              Tira uma foto da tua refeição e descobre as calorias e informação nutricional detalhada
            </p>
          </div>

          {/* Upgrade Prompt */}
          {showUpgradePrompt && (
            <Card className="bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c00]/20 border-[#ffd700]/50 p-6 mb-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-[#ffd700] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-[#ffd700]">
                    Atingiste o Limite Diário!
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Esgotaste a {ANALYSIS_LIMITS.free} análise diária do plano Free. 
                    Quer continuar a analisar as tuas refeições e ter acesso ilimitado?
                  </p>
                  <div className="flex gap-3">
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 green-button-animate">
                        <Crown className="w-4 h-4 mr-2" />
                        Ver Planos
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-[#ffd700]/30 text-white hover:bg-[#ffd700]/10"
                      onClick={() => setShowUpgradePrompt(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Upload Section */}
          {!selectedImage && (
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-[#00ff88]" />
                </div>
                
                <h2 className="text-2xl font-bold mb-3">Carrega uma Foto</h2>
                <p className="text-gray-400 mb-6">
                  Seleciona uma imagem da tua refeição para análise nutricional completa
                </p>

                <label htmlFor="image-upload">
                  <Button
                    className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90"
                    asChild
                    disabled={ANALYSIS_LIMITS[userPlan] !== -1 && analysisCount >= ANALYSIS_LIMITS[userPlan]}
                  >
                    <span className="cursor-pointer">
                      <Upload className="w-5 h-5 mr-2" />
                      Selecionar Imagem
                    </span>
                  </Button>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={ANALYSIS_LIMITS[userPlan] !== -1 && analysisCount >= ANALYSIS_LIMITS[userPlan]}
                />

                <p className="text-xs text-gray-500 mt-4">
                  Formatos suportados: JPG, PNG, WEBP (máx 5MB)
                </p>
              </div>
            </Card>
          )}

          {/* Image Preview & Analysis */}
          {selectedImage && (
            <div className="space-y-6">
              <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={selectedImage}
                    alt="Comida selecionada"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={analyzeFood}
                    disabled={analyzing || (ANALYSIS_LIMITS[userPlan] !== -1 && analysisCount >= ANALYSIS_LIMITS[userPlan])}
                    className="flex-1 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        A Analisar...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analisar Comida
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Nova Foto
                  </Button>
                </div>
              </Card>

              {/* Error Message */}
              {error && (
                <Card className="bg-red-500/10 border-red-500/30 p-4">
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                </Card>
              )}

              {/* Results */}
              {result && (
                <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-[#00ff88]" />
                    <h2 className="text-2xl font-bold">Análise Nutricional</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Food Name */}
                    <div>
                      <h3 className="text-xl font-bold text-[#00ff88] mb-2">
                        {result.food_name}
                      </h3>
                      <p className="text-gray-400">{result.description}</p>
                    </div>

                    {/* Macros Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-[#0f0f0f] rounded-lg p-4 text-center border border-[#00ff88]/10">
                        <p className="text-3xl font-bold text-[#00ff88]">
                          {result.calories}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Calorias</p>
                      </div>
                      <div className="bg-[#0f0f0f] rounded-lg p-4 text-center border border-[#00d4ff]/10">
                        <p className="text-3xl font-bold text-[#00d4ff]">
                          {result.protein}g
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Proteína</p>
                      </div>
                      <div className="bg-[#0f0f0f] rounded-lg p-4 text-center border border-[#00ff88]/10">
                        <p className="text-3xl font-bold text-[#00ff88]">
                          {result.carbs}g
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Carboidratos</p>
                      </div>
                      <div className="bg-[#0f0f0f] rounded-lg p-4 text-center border border-[#00d4ff]/10">
                        <p className="text-3xl font-bold text-[#00d4ff]">
                          {result.fat}g
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Gordura</p>
                      </div>
                      <div className="bg-[#0f0f0f] rounded-lg p-4 text-center border border-[#00ff88]/10">
                        <p className="text-3xl font-bold text-[#00ff88]">
                          {result.fiber}g
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Fibra</p>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <h4 className="font-bold mb-3 text-lg flex items-center gap-2">
                        <span className="text-2xl">💡</span>
                        Sugestões do Personal Trainer
                      </h4>
                      <ul className="space-y-3">
                        {result.suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-gray-300 bg-[#0f0f0f] p-3 rounded-lg border border-[#00ff88]/10"
                          >
                            <span className="text-[#00ff88] font-bold mt-0.5">{index + 1}.</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={resetAnalysis}
                      className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90"
                      disabled={ANALYSIS_LIMITS[userPlan] !== -1 && analysisCount >= ANALYSIS_LIMITS[userPlan]}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Analisar Outra Refeição
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">📸</span>
                Qualidade da Foto
              </h3>
              <p className="text-sm text-gray-400">
                Para melhores resultados, tira fotos com boa iluminação e mostra toda a refeição claramente
              </p>
            </Card>
            <Card className="bg-[#1a1a1a] border-[#00d4ff]/20 p-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Precisão
              </h3>
              <p className="text-sm text-gray-400">
                Os valores são estimativas profissionais baseadas em análise visual. Podem variar conforme porções reais
              </p>
            </Card>
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">💪</span>
                Dica Pro
              </h3>
              <p className="text-sm text-gray-400">
                Usa esta ferramenta regularmente para acompanhar a tua alimentação e atingir os teus objetivos fitness
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
