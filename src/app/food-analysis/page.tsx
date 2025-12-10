"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Loader2, Sparkles, AlertCircle, RefreshCw, Crown, History, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/custom/navbar";
import { AdminBadge, AdminPanel } from "@/components/AdminBadge";
import { useProfile } from "@/hooks/useProfile";
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

interface FoodHistoryItem {
  id: string;
  image_url: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
  suggestions: string[];
  created_at: string;
}

export default function FoodAnalysisPage() {
  const router = useRouter();
  const { user, profile, isAdmin, isUnlimited, canAnalyze, decrementCredits, loading: profileLoading } = useProfile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<FoodHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    if (!profileLoading && !user) {
      router.push("/login");
    }
  }, [user, profileLoading, router]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("food_analysis_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setHistory(data);
      }
    } catch (error) {
      console.log("Erro ao carregar histórico");
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveToHistory = async (imageUrl: string, nutritionInfo: NutritionInfo) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("food_analysis_history")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          food_name: nutritionInfo.food_name,
          calories: nutritionInfo.calories,
          protein: nutritionInfo.protein,
          carbs: nutritionInfo.carbs,
          fat: nutritionInfo.fat,
          fiber: nutritionInfo.fiber,
          description: nutritionInfo.description,
          suggestions: nutritionInfo.suggestions
        })
        .select();
      
      if (error) {
        console.error("Erro ao salvar no histórico:", error);
        throw error;
      }
      
      console.log("✅ Análise salva no histórico com sucesso!", data);
      
      // Recarregar histórico
      await loadHistory();
    } catch (error) {
      console.error("❌ Falha ao salvar no histórico:", error);
      // Não bloquear a análise se falhar ao salvar
    }
  };

  const deleteFromHistory = async (id: string) => {
    try {
      await supabase
        .from("food_analysis_history")
        .delete()
        .eq("id", id);
      
      // Recarregar histórico
      await loadHistory();
    } catch (error) {
      console.log("Erro ao deletar do histórico");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se pode analisar (créditos ou ilimitado)
    if (!canAnalyze) {
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
    if (!selectedImage || !user) return;

    // Verificar se pode analisar
    if (!canAnalyze) {
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
      
      // Salvar no histórico
      await saveToHistory(selectedImage, data as NutritionInfo);
      
      // Decrementar créditos (se não for ilimitado)
      if (!isUnlimited) {
        await decrementCredits();
        
        // Verificar se acabaram os créditos
        if (profile && profile.credits_remaining <= 1) {
          setShowUpgradePrompt(true);
        }
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

  const viewHistoryItem = (item: FoodHistoryItem) => {
    setSelectedImage(item.image_url);
    setResult({
      food_name: item.food_name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
      description: item.description,
      suggestions: item.suggestions
    });
    setShowHistory(false);
  };

  if (profileLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  const creditsDisplay = isUnlimited 
    ? "Ilimitadas" 
    : `${profile?.credits_remaining || 0} créditos`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <AdminBadge />

      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Admin Panel */}
          {isAdmin && <AdminPanel />}

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
                    {creditsDisplay} disponíveis
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  className="border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
                >
                  <History className="w-4 h-4 mr-2" />
                  Histórico ({history.length})
                </Button>
                {!isUnlimited && (
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black font-semibold hover:opacity-90">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <p className="text-gray-400">
              Tira uma foto da tua refeição e descobre as calorias e informação nutricional detalhada
            </p>
          </div>

          {/* History Modal */}
          {showHistory && (
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <History className="w-6 h-6 text-[#00ff88]" />
                  Histórico de Análises
                </h2>
                <Button
                  onClick={() => setShowHistory(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {loadingHistory ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin mx-auto" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Ainda não tens análises no histórico</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {history.map((item) => (
                    <Card 
                      key={item.id}
                      className="bg-[#0f0f0f] border-[#00ff88]/10 overflow-hidden hover:border-[#00ff88]/30 transition-all cursor-pointer group"
                    >
                      <div className="relative h-40">
                        <Image
                          src={item.image_url}
                          alt={item.food_name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            onClick={() => viewHistoryItem(item)}
                            size="sm"
                            className="bg-[#00ff88] text-black hover:bg-[#00d4ff]"
                          >
                            Ver Detalhes
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Tens certeza que queres eliminar esta análise?")) {
                                deleteFromHistory(item.id);
                              }
                            }}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#00ff88] mb-2">{item.food_name}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>{item.calories} cal</span>
                          <span>{new Date(item.created_at).toLocaleDateString('pt-PT')}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Upgrade Prompt */}
          {showUpgradePrompt && !isUnlimited && (
            <Card className="bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c00]/20 border-[#ffd700]/50 p-6 mb-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-[#ffd700] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-[#ffd700]">
                    Sem Créditos Disponíveis!
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Esgotaste os teus créditos. Quer continuar a analisar as tuas refeições e ter acesso ilimitado?
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
                    disabled={!canAnalyze}
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
                  disabled={!canAnalyze}
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
                    disabled={analyzing || !canAnalyze}
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
                      disabled={!canAnalyze}
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
            <Card className="bg-[#1a1a1a] border-[#00d4ff]/20 p-6">
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
