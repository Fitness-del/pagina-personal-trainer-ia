"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell, Check, Crown, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForcaDeterminacao() {
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 mb-6">
                <Dumbbell className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-sm text-[#00d4ff]">Força e Determinação</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
                Cada Rep
                <br />
                <span className="bg-gradient-to-r from-[#00d4ff] to-[#0088ff] bg-clip-text text-transparent">
                  Conta
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8">
                Constrói força real e massa muscular com treinos focados em hipertrofia. 
                Cada repetição é um passo mais perto do teu objetivo.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Treinos de força e hipertrofia progressivos",
                  "Ganha massa muscular de forma consistente",
                  "Técnicas avançadas de musculação",
                  "Planos de 8-12 semanas com progressão",
                  "Exercícios compostos e isolados"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#00d4ff] flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/20 to-[#0088ff]/20 blur-3xl rounded-full"></div>
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#00d4ff]/30 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=1000&fit=crop"
                  alt="Força e Determinação"
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
              Escolhe o Teu <span className="text-[#00d4ff]">Plano</span>
            </h2>
            <p className="text-xl text-gray-400">
              Começa a construir força verdadeira hoje
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
                  <span className="text-gray-300">3 treinos força/semana</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Exercícios básicos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Guia de execução</span>
                </div>
              </div>
              
              <Link href="/login">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white py-6 text-lg">
                  Começar Grátis
                </Button>
              </Link>
            </Card>

            {/* Plus Plan */}
            <Card className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#00d4ff]/50 p-8 hover:scale-105 transition-all ring-2 ring-[#00d4ff]/30 shadow-xl shadow-[#00d4ff]/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-[#00d4ff] to-[#0088ff] text-white text-sm font-bold px-4 py-2 rounded-full">
                  Mais Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#0088ff] mb-4">
                  <Dumbbell className="w-8 h-8 text-white" />
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
                  <span className="text-gray-300">Treinos força ilimitados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Progressão automática</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Técnicas avançadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Registro de cargas</span>
                </div>
              </div>
              
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-[#00d4ff] to-[#0088ff] text-white hover:opacity-90 font-semibold py-6 text-lg green-button-animate">
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
                  <span className="text-gray-300">Periodização inteligente</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Análise de composição</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-gray-300">Suplementação IA</span>
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
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#00d4ff]/10 to-[#0088ff]/10 border-y border-[#00d4ff]/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Pronto Para Construir Força Real?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Cada rep conta. Começa hoje e vê os resultados em semanas.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-[#00d4ff] to-[#0088ff] text-white font-semibold hover:opacity-90 transition-all text-lg px-10 py-7 green-button-animate">
              <Dumbbell className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
