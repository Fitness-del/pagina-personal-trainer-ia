"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell, Zap, Brain, Target, TrendingUp, Smartphone, Mail, CheckCircle2, Sparkles, Activity, Check, Crown, LogIn, Star, Quote, Play, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-[#00ff88]/20 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-[#00ff88]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              PersonalFIT
            </span>
          </div>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 transition-all green-button-animate">
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </Link>
        </div>
      </nav>

      {/* Modal "Ver Como Funciona" */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border-2 border-[#00ff88]/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0f0f0f] border-b border-[#00ff88]/20 p-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                Como Funciona o <span className="text-[#00ff88]">PersonalFIT</span>?
              </h2>
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Video Demo Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border-2 border-[#00ff88]/30 flex items-center justify-center group cursor-pointer hover:border-[#00ff88]/60 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 rounded-2xl"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-black ml-1" />
                  </div>
                  <p className="text-xl font-semibold">Ver Demonstração em Vídeo</p>
                  <p className="text-sm text-gray-400 mt-2">2 minutos</p>
                </div>
              </div>

              {/* Passo a Passo Detalhado */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center mb-8">
                  Passo a Passo <span className="text-[#00d4ff]">Completo</span>
                </h3>

                {/* Passo 1 */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#00ff88]/30 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-black">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-3">Cria a Tua Conta</h4>
                      <p className="text-gray-400 mb-4">
                        Regista-te gratuitamente em menos de 1 minuto. Só precisas de um email e password.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Sem cartão de crédito</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Acesso imediato</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Passo 2 */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#00d4ff]/30 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00d4ff] to-[#0088ff] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-black">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-3">Configura o Teu Perfil</h4>
                      <p className="text-gray-400 mb-4">
                        Responde a algumas perguntas sobre os teus objetivos, nível de experiência e preferências.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Qual é o teu objetivo? (Perder peso, ganhar massa, definir...)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Qual é o teu nível? (Iniciante, Intermédio, Avançado)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Onde vais treinar? (Casa, Ginásio, Ar livre)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Passo 3 */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#9d4edd]/30 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#9d4edd] to-[#c77dff] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-black">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-3">A IA Cria o Teu Plano</h4>
                      <p className="text-gray-400 mb-4">
                        Em segundos, a nossa inteligência artificial analisa as tuas respostas e cria um plano de treino 100% personalizado.
                      </p>
                      <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Brain className="w-5 h-5 text-[#00ff88]" />
                          <span className="text-sm font-semibold">Algoritmo Inteligente</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Considera mais de 50 variáveis para criar o treino perfeito para ti
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Passo 4 */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#00ff88]/30 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-black">4</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-3">Começa a Treinar</h4>
                      <p className="text-gray-400 mb-4">
                        Segue os treinos diários, vê vídeos explicativos de cada exercício e regista o teu progresso.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Vídeos HD de cada exercício</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Timer integrado</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Registo automático</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#00ff88]" />
                          <span>Feedback em tempo real</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Passo 5 */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#ffd700]/30 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-black">5</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-3">Acompanha a Tua Evolução</h4>
                      <p className="text-gray-400 mb-4">
                        Vê gráficos detalhados do teu progresso, celebra conquistas e ajusta o plano conforme evoluís.
                      </p>
                      <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-5 h-5 text-[#00ff88]" />
                          <span className="text-sm font-semibold">Adaptação Contínua</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          A IA ajusta automaticamente os treinos baseado no teu desempenho
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Features Destacadas */}
              <div className="bg-gradient-to-br from-[#00ff88]/10 to-[#00d4ff]/10 border border-[#00ff88]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-center">
                  <Sparkles className="w-6 h-6 inline-block mr-2 text-[#00ff88]" />
                  Funcionalidades Exclusivas
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Chat com IA</p>
                      <p className="text-xs text-gray-400">Tira dúvidas sobre exercícios e nutrição</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Objetivos Personalizados</p>
                      <p className="text-xs text-gray-400">Define metas e acompanha o progresso</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Análise de Fotos</p>
                      <p className="text-xs text-gray-400">IA analisa a tua evolução física</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Acesso Mobile</p>
                      <p className="text-xs text-gray-400">Treina em qualquer lugar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Final */}
              <div className="text-center pt-4">
                <Link href="/login">
                  <Button size="lg" className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 transition-all text-lg px-8 py-6 green-button-animate">
                    <Zap className="w-5 h-5 mr-2" />
                    Começar Agora Gratuitamente
                  </Button>
                </Link>
                <p className="text-sm text-gray-400 mt-3">Sem cartão de crédito • Acesso imediato</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-[#00ff88]">Inteligência Artificial ao Serviço do Teu Treino</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            O Teu Personal Trainer
            <br />
            <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              Inteligente e Sempre Disponível
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Treinos personalizados, acompanhamento em tempo real e resultados garantidos. 
            Tudo isto com a tecnologia de inteligência artificial mais avançada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 transition-all text-lg px-8 py-6 green-button-animate">
                <Zap className="w-5 h-5 mr-2" />
                Começar Gratuitamente
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10 text-lg px-8 py-6"
              onClick={() => setShowHowItWorks(true)}
            >
              Ver Como Funciona
            </Button>
          </div>

          {/* Destaque para Login */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#00ff88]/20 to-[#00d4ff]/20 border border-[#00ff88]/30 mb-16">
            <span className="text-sm text-gray-300">Já tens conta?</span>
            <Link href="/login">
              <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <LogIn className="w-4 h-4 mr-2" />
                Fazer Login
              </Button>
            </Link>
          </div>

          {/* Hero Tablet with Pricing Plans */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/20 to-[#00d4ff]/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#00ff88]/30 rounded-3xl p-8 shadow-2xl">
              {/* Tablet Screen */}
              <div className="bg-[#0f0f0f] rounded-2xl border border-[#00ff88]/20 p-6 overflow-hidden">
                {/* Pricing Plans Inside Tablet */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Escolhe o Teu <span className="text-[#00ff88]">Plano</span>
                  </h2>
                  <p className="text-sm text-gray-400">Transforma o teu corpo com o plano ideal</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Free Plan */}
                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-500/30 p-5 hover:scale-105 transition-all">
                    <div className="text-center mb-4">
                      <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 mb-3">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">Free</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold">0€</span>
                      </div>
                      <p className="text-xs text-gray-400">Grátis para sempre</p>
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">5 mensagens IA/dia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">1 análise foto/dia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Treinos básicos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Acesso limitado</span>
                      </div>
                    </div>
                    <Link href="/login">
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2">
                        Começar Grátis
                      </Button>
                    </Link>
                  </Card>

                  {/* Plus Plan */}
                  <Card className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#00ff88]/50 p-5 hover:scale-105 transition-all ring-2 ring-[#00ff88]/30 shadow-xl shadow-[#00ff88]/20">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff] mb-3">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">Plus</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold">4,99€</span>
                      </div>
                      <p className="text-xs text-gray-400">por mês</p>
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Chat IA ilimitado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Análises ilimitadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Treinos personalizados</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Suporte prioritário</span>
                      </div>
                    </div>
                    <Link href="/login">
                      <Button className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black hover:opacity-90 font-semibold text-sm py-2 green-button-animate">
                        Escolher Plus
                      </Button>
                    </Link>
                  </Card>

                  {/* Premium Plan */}
                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#ffd700]/50 p-5 hover:scale-105 transition-all">
                    <div className="text-center mb-4">
                      <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#ff8c00] mb-3">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">Premium</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold">9,99€</span>
                      </div>
                      <p className="text-xs text-gray-400">por mês</p>
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Tudo do Plus</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Planos nutrição IA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Evolução inteligente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-gray-300">Acesso antecipado</span>
                      </div>
                    </div>
                    <Link href="/login">
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2">
                        Escolher Premium
                      </Button>
                    </Link>
                  </Card>
                </div>

                {/* CTA dentro do tablet */}
                <div className="mt-6 text-center">
                  <Link href="/pricing">
                    <Button variant="outline" className="border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 text-sm">
                      Ver Todos os Detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Categories Section */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Escolhe o Teu <span className="text-[#00ff88]">Estilo de Treino</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Diferentes objetivos, diferentes abordagens. Descobre qual se adapta melhor a ti.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Treino Intenso */}
            <Link href="/treino-intenso">
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#ff4444]/30 p-6 hover:border-[#ff4444]/60 hover:scale-105 transition-all cursor-pointer group">
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#ff4444] to-[#ff8844] mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Treino Intenso</h3>
                  <p className="text-gray-400 mb-4">Supera os teus limites</p>
                  <Button className="w-full bg-gradient-to-r from-[#ff4444] to-[#ff8844] text-white hover:opacity-90 green-button-animate">
                    Explorar
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Força e Determinação */}
            <Link href="/forca-determinacao">
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#00d4ff]/30 p-6 hover:border-[#00d4ff]/60 hover:scale-105 transition-all cursor-pointer group">
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#0088ff] mb-4 group-hover:scale-110 transition-transform">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Força e Determinação</h3>
                  <p className="text-gray-400 mb-4">Cada rep conta</p>
                  <Button className="w-full bg-gradient-to-r from-[#00d4ff] to-[#0088ff] text-white hover:opacity-90 green-button-animate">
                    Explorar
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Foco Total */}
            <Link href="/foco-total">
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#9d4edd]/30 p-6 hover:border-[#9d4edd]/60 hover:scale-105 transition-all cursor-pointer group">
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#9d4edd] to-[#c77dff] mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Foco Total</h3>
                  <p className="text-gray-400 mb-4">Mente e corpo em sintonia</p>
                  <Button className="w-full bg-gradient-to-r from-[#9d4edd] to-[#c77dff] text-white hover:opacity-90 green-button-animate">
                    Explorar
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Conquista */}
            <Link href="/conquista">
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#00ff88]/30 p-6 hover:border-[#00ff88]/60 hover:scale-105 transition-all cursor-pointer group">
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff] mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Conquista</h3>
                  <p className="text-gray-400 mb-4">O teu momento é agora</p>
                  <Button className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black hover:opacity-90 font-semibold green-button-animate">
                    Explorar
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              O Que É o <span className="text-[#00ff88]">PersonalFIT</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Uma aplicação revolucionária que usa inteligência artificial para criar treinos 
              totalmente personalizados, adaptar-se aos teus objetivos e acompanhar a tua evolução.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-8 hover:border-[#00ff88]/50 transition-all">
              <Brain className="w-12 h-12 text-[#00ff88] mb-4" />
              <h3 className="text-2xl font-bold mb-3">IA Avançada</h3>
              <p className="text-gray-400">
                Algoritmos inteligentes que aprendem contigo e adaptam os treinos às tuas necessidades específicas.
              </p>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#00d4ff]/20 p-8 hover:border-[#00d4ff]/50 transition-all">
              <Target className="w-12 h-12 text-[#00d4ff] mb-4" />
              <h3 className="text-2xl font-bold mb-3">100% Personalizado</h3>
              <p className="text-gray-400">
                Cada treino é único e desenhado especialmente para ti, tendo em conta o teu nível e objetivos.
              </p>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-8 hover:border-[#00ff88]/50 transition-all">
              <Activity className="w-12 h-12 text-[#00ff88] mb-4" />
              <h3 className="text-2xl font-bold mb-3">Sempre Disponível</h3>
              <p className="text-gray-400">
                Treina quando quiseres, onde quiseres. O teu personal trainer está sempre contigo, 24/7.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Como <span className="text-[#00d4ff]">Funciona</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simples, rápido e eficaz. Em apenas 3 passos começas a treinar de forma inteligente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Cria o Teu Perfil</h3>
              <p className="text-gray-400">
                Diz-nos os teus objetivos, nível de experiência e preferências de treino.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Recebe o Teu Plano</h3>
              <p className="text-gray-400">
                A IA cria um plano de treino personalizado só para ti, em segundos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Começa a Treinar</h3>
              <p className="text-gray-400">
                Segue os treinos, regista o teu progresso e vê os resultados aparecerem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Porquê Escolher o <span className="text-[#00ff88]">PersonalFIT</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Treinos adaptados ao teu nível e objetivos",
              "Acompanhamento em tempo real do teu progresso",
              "Exercícios explicados com vídeos e instruções claras",
              "Planos de treino que evoluem contigo",
              "Sem mensalidades caras de ginásio",
              "Treina em casa, no ginásio ou ao ar livre"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 bg-[#1a1a1a] p-6 rounded-xl border border-[#00ff88]/10 hover:border-[#00ff88]/30 transition-all">
                <CheckCircle2 className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              O Que Vem <span className="text-[#00d4ff]">a Seguir</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Estamos constantemente a melhorar. Estas são algumas funcionalidades que vêm aí.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#00ff88]/20 p-6 text-center">
              <TrendingUp className="w-10 h-10 text-[#00ff88] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Análise de Progresso</h3>
              <p className="text-sm text-gray-400">Gráficos detalhados da tua evolução</p>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#00d4ff]/20 p-6 text-center">
              <Brain className="w-10 h-10 text-[#00d4ff] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Planos de Nutrição</h3>
              <p className="text-sm text-gray-400">Dietas personalizadas pela IA</p>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#00ff88]/20 p-6 text-center">
              <Smartphone className="w-10 h-10 text-[#00ff88] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">App Móvel</h3>
              <p className="text-sm text-gray-400">Versão nativa para iOS e Android</p>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#00d4ff]/20 p-6 text-center">
              <Activity className="w-10 h-10 text-[#00d4ff] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Comunidade</h3>
              <p className="text-sm text-gray-400">Partilha o teu progresso com outros</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              O Que Dizem os Nossos <span className="text-[#00ff88]">Utilizadores</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Milhares de pessoas já transformaram os seus corpos com o PersonalFIT
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6 hover:border-[#00ff88]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center">
                  <span className="text-xl font-bold text-black">MC</span>
                </div>
                <div>
                  <h4 className="font-bold">Miguel Costa</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00ff88] text-[#00ff88]" />
                    ))}
                  </div>
                </div>
              </div>
              <Quote className="w-8 h-8 text-[#00ff88]/30 mb-2" />
              <p className="text-gray-300 mb-4">
                "Perdi 15kg em 4 meses! A IA adapta-se perfeitamente ao meu ritmo e os treinos são sempre desafiantes. Melhor investimento que já fiz!"
              </p>
              <p className="text-sm text-gray-500">Utilizador há 6 meses</p>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6 hover:border-[#00ff88]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
                  <span className="text-xl font-bold text-black">AS</span>
                </div>
                <div>
                  <h4 className="font-bold">Ana Silva</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00ff88] text-[#00ff88]" />
                    ))}
                  </div>
                </div>
              </div>
              <Quote className="w-8 h-8 text-[#00ff88]/30 mb-2" />
              <p className="text-gray-300 mb-4">
                "Finalmente encontrei algo que funciona! Os treinos são personalizados e a motivação da IA é incrível. Recomendo a 100%!"
              </p>
              <p className="text-sm text-gray-500">Utilizadora há 8 meses</p>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6 hover:border-[#00ff88]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center">
                  <span className="text-xl font-bold text-black">RP</span>
                </div>
                <div>
                  <h4 className="font-bold">Ricardo Pereira</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00ff88] text-[#00ff88]" />
                    ))}
                  </div>
                </div>
              </div>
              <Quote className="w-8 h-8 text-[#00ff88]/30 mb-2" />
              <p className="text-gray-300 mb-4">
                "Ganhei 8kg de massa muscular! A app é fantástica, os treinos evoluem comigo e sinto-me mais forte a cada dia. Vale cada cêntimo!"
              </p>
              <p className="text-sm text-gray-500">Utilizador há 1 ano</p>
            </Card>

            {/* Testimonial 4 */}
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6 hover:border-[#00ff88]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center">
                  <span className="text-xl font-bold text-black">JM</span>
                </div>
                <div>
                  <h4 className="font-bold">Joana Martins</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00ff88] text-[#00ff88]" />
                    ))}
                  </div>
                </div>
              </div>
              <Quote className="w-8 h-8 text-[#00ff88]/30 mb-2" />
              <p className="text-gray-300 mb-4">
                "Treino em casa e os resultados são incríveis! A IA entende exatamente o que preciso. Nunca mais volto ao ginásio tradicional!"
              </p>
              <p className="text-sm text-gray-500">Utilizadora há 5 meses</p>
            </Card>

            {/* Testimonial 5 */}
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6 hover:border-[#00ff88]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
                  <span className="text-xl font-bold text-black">PF</span>
                </div>
                <div>
                  <h4 className="font-bold">Pedro Fernandes</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00ff88] text-[#00ff88]" />
                    ))}
                  </div>
                </div>
              </div>
              <Quote className="w-8 h-8 text-[#00ff88]/30 mb-2" />
              <p className="text-gray-300 mb-4">
                "Mudou completamente a minha rotina! Os treinos são eficientes e a motivação é constante. Sinto-me no melhor shape da minha vida!"
              </p>
              <p className="text-sm text-gray-500">Utilizador há 9 meses</p>
            </Card>

            {/* Testimonial 6 */}
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6 hover:border-[#00ff88]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center">
                  <span className="text-xl font-bold text-black">CS</span>
                </div>
                <div>
                  <h4 className="font-bold">Carla Santos</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00ff88] text-[#00ff88]" />
                    ))}
                  </div>
                </div>
              </div>
              <Quote className="w-8 h-8 text-[#00ff88]/30 mb-2" />
              <p className="text-gray-300 mb-4">
                "A melhor decisão que tomei este ano! Perdi peso, ganhei confiança e os treinos são sempre variados. Adoro esta app!"
              </p>
              <p className="text-sm text-gray-500">Utilizadora há 7 meses</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#00ff88]/10 to-[#00d4ff]/10 border-y border-[#00ff88]/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Pronto Para Transformar o Teu Corpo?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Junta-te a milhares de pessoas que já estão a treinar de forma mais inteligente.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 transition-all text-lg px-10 py-7 green-button-animate">
              <Zap className="w-5 h-5 mr-2" />
              Experimentar Gratuitamente
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact/Footer */}
      <footer className="py-16 px-4 sm:px-6 bg-[#0a0a0a] border-t border-[#00ff88]/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-8 h-8 text-[#00ff88]" />
                <span className="text-2xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                  PersonalFIT
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                A revolução do fitness está aqui. Treina de forma inteligente, 
                alcança os teus objetivos mais rápido e transforma o teu corpo com tecnologia de ponta.
              </p>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-[#00ff88]" />
                <span>contato@personalfit.com</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Fica a Saber Mais</h3>
              <p className="text-gray-400 mb-6">
                Subscreve para receberes dicas de treino, novidades sobre a app e ofertas exclusivas.
              </p>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  placeholder="O teu email" 
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88]/50"
                />
                <Button className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 green-button-animate">
                  Subscrever
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#00ff88]/10 text-center text-gray-500">
            <p>© 2024 PersonalFIT. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
