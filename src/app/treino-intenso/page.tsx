"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Check, Crown, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TreinoIntenso() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-[#00ff88]/20 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00ff88] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff4444]/10 border border-[#ff4444]/30 mb-6">
                <Zap className="w-4 h-4 text-[#ff4444]" />
                <span className="text-sm text-[#ff4444]">Treino Intenso</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
                Supera os Teus
                <br />
                <span className="bg-gradient-to-r from-[#ff4444] to-[#ff8844] bg-clip-text text-transparent">
                  Limites
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8">
                Treinos de alta intensidade que desafiam o teu corpo ao máximo. 
                Queima calorias, ganha resistência e vê resultados reais em tempo recorde.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "HIIT e treinos intervalados de alta intensidade",
                  "Queima até 500 calorias por sessão",
                  "Melhora cardiovascular e resistência",
                  "Treinos de 20-45 minutos super eficientes",
                  "Adaptável a todos os níveis de fitness"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#ff4444] flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4444]/20 to-[#ff8844]/20 blur-3xl rounded-full"></div>
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#ff4444]/30 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop"
                  alt="Treino Intenso"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Escolhe o Teu <span className="text-[#ff4444]">Plano</span>
            </h2>
            <p className="text-xl text-gray-400">
              Começa a superar os teus limites hoje mesmo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-500/30 p-8 hover:scale-105 transition-all">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="mb-3">
                  <span className="text-5xl font-bold">0€</span>
                  <span className="text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-400">Grátis para sempre</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">3 treinos intensos/semana</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Chat IA limitado</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Biblioteca básica</span>
                </div>
              </div>
              
              <Link href="/login">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white py-6 text-lg">
                  Começar Grátis
                </Button>
              </Link>
            </Card>

            {/* Plus Plan */}
            <Card className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#ff4444]/50 p-8 hover:scale-105 transition-all ring-2 ring-[#ff4444]/30 shadow-xl shadow-[#ff4444]/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-[#ff4444] to-[#ff8844] text-white text-sm font-bold px-4 py-2 rounded-full">
                  Mais Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#ff4444] to-[#ff8844] mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Plus</h3>
                <div className="mb-3">
                  <span className="text-5xl font-bold">4,99€</span>
                  <span className="text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-400">Treinos ilimitados</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Treinos HIIT ilimitados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Chat IA ilimitado</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Planos personalizados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Acompanhamento semanal</span>
                </div>
              </div>
              
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-[#ff4444] to-[#ff8844] text-white hover:opacity-90 font-semibold py-6 text-lg green-button-animate">
                  Escolher Plus
                </Button>
              </Link>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#ffd700]/50 p-8 hover:scale-105 transition-all">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#ff8c00] mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="mb-3">
                  <span className="text-5xl font-bold">9,99€</span>
                  <span className="text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-400">Experiência completa</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Tudo do Plus +</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Análise de performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Plano nutricional IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Suporte prioritário 24/7</span>
                </div>
              </div>
              
              <Link href="/login">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white py-6 text-lg">
                  Escolher Premium
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#ff4444]/10 to-[#ff8844]/10 border-y border-[#ff4444]/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Pronto Para Superar os Teus Limites?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Começa hoje e sente a diferença nos primeiros 7 dias.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-[#ff4444] to-[#ff8844] text-white font-semibold hover:opacity-90 transition-all text-lg px-10 py-7 green-button-animate">
              <Zap className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
