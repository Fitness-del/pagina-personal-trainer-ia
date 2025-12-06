"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown, X } from "lucide-react";
import { Navbar } from "@/components/custom/navbar";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    icon: Sparkles,
    price: "0",
    period: "Grátis para sempre",
    description: "Perfeito para começar a tua jornada fitness",
    color: "from-gray-500 to-gray-600",
    borderColor: "border-gray-500/30",
    features: [
      { text: "Chat IA limitado", included: true },
      { text: "Treinos básicos", included: true },
      { text: "Calorias manualmente", included: true },
      { text: "Máximo 1 análise de foto/mês", included: true },
      { text: "Publicidade leve", included: true },
      { text: "Treinos personalizados", included: false },
      { text: "Análises ilimitadas", included: false },
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    id: "plus",
    name: "Plus",
    icon: Zap,
    price: "4,99",
    period: "por mês",
    description: "Para quem leva o fitness a sério",
    color: "from-[#00ff88] to-[#00d4ff]",
    borderColor: "border-[#00ff88]/50",
    features: [
      { text: "Chat IA ilimitado", included: true },
      { text: "Treinos personalizados", included: true },
      { text: "Calorias automáticas", included: true },
      { text: "10 análises de foto/mês", included: true },
      { text: "Zero anúncios", included: true },
      { text: "Sistema de evolução inteligente", included: false },
      { text: "Prioridade nas respostas", included: false },
    ],
    cta: "Escolher Plus",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    price: "9,99",
    period: "por mês",
    description: "A experiência completa e exclusiva",
    color: "from-[#ffd700] to-[#ff8c00]",
    borderColor: "border-[#ffd700]/50",
    features: [
      { text: "Treinos altamente personalizados", included: true },
      { text: "Análises ilimitadas", included: true },
      { text: "Sistema de evolução inteligente", included: true },
      { text: "Nutrição automática", included: true },
      { text: "Prioridade nas respostas", included: true },
      { text: "Chat IA ilimitado", included: true },
      { text: "Zero anúncios", included: true },
    ],
    cta: "Escolher Premium",
    popular: false,
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#00ff88]" />
              <span className="text-sm text-[#00ff88]">Planos e Preços</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Escolhe o Plano{" "}
              <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                Perfeito
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transforma o teu corpo e mente com o PersonalFIT. Escolhe o plano que melhor se adapta aos teus objetivos.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 ${plan.borderColor} p-8 hover:scale-105 transition-all duration-300 ${
                    plan.popular ? "ring-2 ring-[#00ff88]/50 shadow-2xl shadow-[#00ff88]/20" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black text-sm font-bold px-4 py-1 rounded-full">
                        Mais Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-5xl font-bold">{plan.price}€</span>
                    </div>
                    <p className="text-gray-400 text-sm">{plan.period}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? "text-gray-300" : "text-gray-600"}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black hover:opacity-90"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    } font-semibold text-lg py-6`}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Perguntas <span className="text-[#00ff88]">Frequentes</span>
            </h2>
            <div className="space-y-6">
              <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6">
                <h3 className="text-xl font-bold mb-3">Posso mudar de plano a qualquer momento?</h3>
                <p className="text-gray-400">
                  Sim! Podes fazer upgrade ou downgrade do teu plano a qualquer momento. As alterações entram em vigor imediatamente.
                </p>
              </Card>

              <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6">
                <h3 className="text-xl font-bold mb-3">Como funciona o plano gratuito?</h3>
                <p className="text-gray-400">
                  O plano Free é totalmente gratuito e para sempre. Tens acesso a funcionalidades básicas para começares a tua jornada fitness sem compromisso.
                </p>
              </Card>

              <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6">
                <h3 className="text-xl font-bold mb-3">Qual a diferença entre Plus e Premium?</h3>
                <p className="text-gray-400">
                  O Plus é ideal para quem quer treinos personalizados e análises regulares. O Premium oferece análises ilimitadas, sistema de evolução inteligente e prioridade nas respostas da IA.
                </p>
              </Card>

              <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6">
                <h3 className="text-xl font-bold mb-3">Posso cancelar a qualquer momento?</h3>
                <p className="text-gray-400">
                  Sim, não há contratos de fidelização. Podes cancelar a tua subscrição a qualquer momento e continuarás a ter acesso até ao final do período pago.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 border-[#00ff88]/30 p-12 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">
                Pronto para <span className="text-[#00ff88]">Transformar</span> o Teu Corpo?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Junta-te a milhares de pessoas que já estão a alcançar os seus objetivos com o PersonalFIT.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 text-lg px-8">
                  Começar Agora
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
