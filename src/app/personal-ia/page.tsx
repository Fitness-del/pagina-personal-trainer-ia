"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Loader2, Dumbbell, AlertCircle, Crown, RotateCcw, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/custom/navbar";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Limites de mensagens por plano
const MESSAGE_LIMITS = {
  free: 10,
  plus: -1, // ilimitado
  premium: -1 // ilimitado
};

export default function PersonalIAPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! 💪 Sou o teu Personal Trainer IA. Estou aqui para te ajudar com treinos personalizados, nutrição, técnicas de exercícios e motivação para alcançares os teus objetivos. Como posso ajudar-te hoje?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [userPlan, setUserPlan] = useState<"free" | "plus" | "premium">("free");
  const [messageCount, setMessageCount] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      loadChatHistory();
      loadMessageCount();
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_history")
        .select("messages")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data && data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.log("Nenhum histórico encontrado, iniciando novo chat");
    }
  };

  const loadMessageCount = async () => {
    try {
      const { data, error } = await supabase
        .from("user_message_count")
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
            .from("user_message_count")
            .update({ count: 0, last_reset: now.toISOString() })
            .eq("user_id", userId);
          setMessageCount(0);
        } else {
          setMessageCount(data.count);
        }
      } else {
        // Criar registro inicial
        await supabase
          .from("user_message_count")
          .insert({ user_id: userId, count: 0, last_reset: new Date().toISOString() });
      }
    } catch (error) {
      console.log("Erro ao carregar contador de mensagens");
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    try {
      const { data: existing } = await supabase
        .from("chat_history")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existing) {
        await supabase
          .from("chat_history")
          .update({ messages: newMessages, updated_at: new Date().toISOString() })
          .eq("user_id", userId);
      } else {
        await supabase
          .from("chat_history")
          .insert({ user_id: userId, messages: newMessages });
      }
    } catch (error) {
      console.log("Erro ao salvar histórico");
    }
  };

  const incrementMessageCount = async () => {
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    
    try {
      await supabase
        .from("user_message_count")
        .update({ count: newCount })
        .eq("user_id", userId);
    } catch (error) {
      console.log("Erro ao atualizar contador");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetChat = async () => {
    const initialMessage: Message = {
      role: "assistant",
      content: "Olá! 💪 Sou o teu Personal Trainer IA. Estou aqui para te ajudar com treinos personalizados, nutrição, técnicas de exercícios e motivação para alcançares os teus objetivos. Como posso ajudar-te hoje?"
    };
    
    setMessages([initialMessage]);
    await saveChatHistory([initialMessage]);
  };

  const handleNewChat = async () => {
    // Criar novo chat (limpar histórico atual)
    await handleResetChat();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Verificar limite de mensagens para plano free
    const limit = MESSAGE_LIMITS[userPlan];
    if (limit !== -1 && messageCount >= limit) {
      setShowUpgradePrompt(true);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    
    // Adicionar mensagem do utilizador
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // System prompt para personal trainer natural e amplo
      const systemPrompt = {
        role: "system",
        content: "És um Personal Trainer profissional, motivador e experiente. Ajudas com treinos, exercícios, nutrição desportiva, técnicas, planos de treino, motivação e bem-estar físico. Responde de forma natural, compreensiva e adaptável. Se alguém pedir 'faz me um treino', entende que quer um plano de treino personalizado. Sê flexível na interpretação das perguntas e sempre positivo e motivador. Responde a QUALQUER pergunta relacionada com fitness, saúde, exercício, nutrição e motivação de forma ampla e natural."
      };

      // Chamar API com system prompt
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "chat",
          messages: [
            systemPrompt,
            ...newMessages.map(m => ({
              role: m.role,
              content: m.content
            }))
          ]
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao comunicar com a IA");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const updatedMessages = [...newMessages, { 
        role: "assistant" as const, 
        content: data.message 
      }];
      
      setMessages(updatedMessages);
      await saveChatHistory(updatedMessages);
      await incrementMessageCount();

      // Verificar se atingiu o limite após esta mensagem
      if (limit !== -1 && messageCount + 1 >= limit) {
        setShowUpgradePrompt(true);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Desculpa, ocorreu um erro. Por favor verifica se a chave da OpenAI está configurada e tenta novamente." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  const remainingMessages = MESSAGE_LIMITS[userPlan] === -1 
    ? "Ilimitadas" 
    : Math.max(0, MESSAGE_LIMITS[userPlan] - messageCount);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="pt-24 pb-6 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                      Personal IA
                    </span>
                  </h1>
                  <p className="text-sm text-gray-400">
                    {userPlan === "free" 
                      ? `${remainingMessages} mensagens restantes hoje` 
                      : "Mensagens ilimitadas"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleResetChat}
                  variant="outline"
                  className="border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
                  title="Resetar Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNewChat}
                  variant="outline"
                  className="border-[#00d4ff]/30 text-white hover:bg-[#00d4ff]/10"
                  title="Novo Chat"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                {userPlan === "free" && (
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
              Teu personal trainer virtual - sempre disponível para te ajudar!
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
                    Esgotaste as {MESSAGE_LIMITS.free} mensagens diárias do plano Free. 
                    Quer continuar a conversa e ter acesso ilimitado ao teu Personal Trainer IA?
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

          {/* Chat Container */}
          <Card className="bg-[#1a1a1a] border-[#00ff88]/20 h-[calc(100vh-320px)] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-black" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black"
                        : "bg-[#0f0f0f] text-white border border-[#00ff88]/10"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#00ff88]" />
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-black" />
                  </div>
                  <div className="bg-[#0f0f0f] rounded-2xl px-4 py-3 border border-[#00ff88]/10">
                    <Loader2 className="w-5 h-5 text-[#00ff88] animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#00ff88]/10">
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Pergunta o que quiseres sobre treino, nutrição ou motivação... (Enter para enviar)"
                  className="flex-1 bg-[#0f0f0f] border-[#00ff88]/20 text-white placeholder:text-gray-500 focus:border-[#00ff88]/50 resize-none"
                  rows={2}
                  disabled={loading || (MESSAGE_LIMITS[userPlan] !== -1 && messageCount >= MESSAGE_LIMITS[userPlan])}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || loading || (MESSAGE_LIMITS[userPlan] !== -1 && messageCount >= MESSAGE_LIMITS[userPlan])}
                  className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 px-6 green-button-animate"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Pergunta o que quiseres! Estou aqui para te ajudar com tudo relacionado a fitness!
              </p>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <Button
              onClick={() => setInput("Faz-me um treino para ganhar massa muscular")}
              variant="outline"
              className="border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10 text-sm"
              disabled={MESSAGE_LIMITS[userPlan] !== -1 && messageCount >= MESSAGE_LIMITS[userPlan]}
            >
              💪 Plano de Treino
            </Button>
            <Button
              onClick={() => setInput("Que alimentos devo comer para emagrecer?")}
              variant="outline"
              className="border-[#00d4ff]/30 text-white hover:bg-[#00d4ff]/10 text-sm"
              disabled={MESSAGE_LIMITS[userPlan] !== -1 && messageCount >= MESSAGE_LIMITS[userPlan]}
            >
              🥗 Nutrição
            </Button>
            <Button
              onClick={() => setInput("Como melhorar a minha técnica de agachamento?")}
              variant="outline"
              className="border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10 text-sm"
              disabled={MESSAGE_LIMITS[userPlan] !== -1 && messageCount >= MESSAGE_LIMITS[userPlan]}
            >
              🎯 Técnica
            </Button>
            <Button
              onClick={() => setInput("Preciso de motivação para treinar")}
              variant="outline"
              className="border-[#00d4ff]/30 text-white hover:bg-[#00d4ff]/10 text-sm"
              disabled={MESSAGE_LIMITS[userPlan] !== -1 && messageCount >= MESSAGE_LIMITS[userPlan]}
            >
              🔥 Motivação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
