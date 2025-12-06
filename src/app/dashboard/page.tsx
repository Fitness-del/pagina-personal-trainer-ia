"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Target, Dumbbell, Sparkles, ArrowRight, Zap, Trophy, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/custom/navbar";
import Link from "next/link";

interface Profile {
  full_name: string;
  fitness_level: string;
  fitness_goal: string;
}

// Frases motivacionais
const motivationalQuotes = [
  {
    quote: "O único treino mau é aquele que não fizeste.",
    author: "Desconhecido"
  },
  {
    quote: "A dor que sentes hoje será a força que sentes amanhã.",
    author: "Arnold Schwarzenegger"
  },
  {
    quote: "Não contes os dias, faz os dias contarem.",
    author: "Muhammad Ali"
  },
  {
    quote: "O sucesso não é acidental. É trabalho árduo, perseverança e aprendizagem.",
    author: "Pelé"
  }
];

// Imagens inspiradoras (usando URLs públicas do Unsplash)
const inspirationalImages = [
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    title: "Treino Intenso",
    description: "Supera os teus limites"
  },
  {
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    title: "Força e Determinação",
    description: "Cada rep conta"
  },
  {
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    title: "Foco Total",
    description: "Mente e corpo em sintonia"
  },
  {
    url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop",
    title: "Conquista",
    description: "O teu momento é agora"
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    checkUser();
    
    // Rotação de frases motivacionais a cada 5 segundos
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Buscar perfil
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 text-[#00ff88] animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="container mx-auto">
          {/* Hero Welcome Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#00ff88]" />
              <span className="text-sm text-[#00ff88]">Bem-vindo ao PersonalFIT</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              Olá, <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">{profile?.full_name || "Atleta"}</span>! 👋
            </h1>
            <p className="text-2xl text-gray-400 mb-8">
              Pronto para transformar o teu corpo e mente?
            </p>

            {/* Motivational Quote */}
            <div className="max-w-3xl mx-auto mb-12 p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#00ff88]/20 rounded-2xl">
              <p className="text-2xl font-light italic text-gray-300 mb-4">
                "{motivationalQuotes[currentQuote].quote}"
              </p>
              <p className="text-sm text-[#00ff88]">
                — {motivationalQuotes[currentQuote].author}
              </p>
            </div>
          </div>

          {/* Inspirational Images Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                Inspira-te e Conquista
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {inspirationalImages.map((image, index) => (
                <Card
                  key={index}
                  className="bg-[#1a1a1a] border-[#00ff88]/20 overflow-hidden hover:border-[#00ff88]/50 transition-all group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-lg font-bold text-white mb-1">{image.title}</h3>
                      <p className="text-sm text-gray-300">{image.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-[#00ff88]/20 to-[#00ff88]/5 border-[#00ff88]/30 p-8 text-center">
              <Target className="w-12 h-12 text-[#00ff88] mx-auto mb-4" />
              <p className="text-gray-400 text-sm mb-2">Teu Objetivo</p>
              <p className="text-3xl font-bold capitalize">
                {profile?.fitness_goal?.replace("_", " ") || "Não definido"}
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 border-[#00d4ff]/30 p-8 text-center">
              <TrendingUp className="w-12 h-12 text-[#00d4ff] mx-auto mb-4" />
              <p className="text-gray-400 text-sm mb-2">Nível Atual</p>
              <p className="text-3xl font-bold capitalize">
                {profile?.fitness_level || "Não definido"}
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-[#00ff88]/20 to-[#00ff88]/5 border-[#00ff88]/30 p-8 text-center">
              <Trophy className="w-12 h-12 text-[#00ff88] mx-auto mb-4" />
              <p className="text-gray-400 text-sm mb-2">Motivação</p>
              <p className="text-3xl font-bold">100%</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Começa Agora a Tua <span className="text-[#00ff88]">Jornada</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#00ff88]/20 p-8 hover:border-[#00ff88]/50 transition-all group">
                <Zap className="w-12 h-12 text-[#00ff88] mb-4" />
                <h3 className="text-2xl font-bold mb-3">Personal IA</h3>
                <p className="text-gray-400 mb-6">
                  Conversa com o teu treinador inteligente sobre treino e nutrição
                </p>
                <Link href="/personal-ia">
                  <Button className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 group-hover:scale-105 transition-transform">
                    Iniciar Chat
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>

              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#00d4ff]/20 p-8 hover:border-[#00d4ff]/50 transition-all group">
                <Heart className="w-12 h-12 text-[#00d4ff] mb-4" />
                <h3 className="text-2xl font-bold mb-3">Análise de Comida</h3>
                <p className="text-gray-400 mb-6">
                  Descobre as calorias das tuas refeições com uma simples foto
                </p>
                <Link href="/food-analysis">
                  <Button className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-black font-semibold hover:opacity-90 group-hover:scale-105 transition-transform">
                    Analisar Agora
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>

              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#00ff88]/20 p-8 hover:border-[#00ff88]/50 transition-all group">
                <Dumbbell className="w-12 h-12 text-[#00ff88] mb-4" />
                <h3 className="text-2xl font-bold mb-3">Perfil</h3>
                <p className="text-gray-400 mb-6">
                  Atualiza os teus dados e acompanha a tua evolução
                </p>
                <Link href="/profile">
                  <Button className="w-full bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20 group-hover:scale-105 transition-transform">
                    Ver Perfil
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 border-[#00ff88]/30 p-12 text-center">
            <Sparkles className="w-16 h-16 text-[#00ff88] mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              A Tua Transformação Começa <span className="text-[#00ff88]">Hoje</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Cada dia é uma nova oportunidade para te tornares mais forte, mais saudável e mais confiante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/personal-ia">
                <Button size="lg" className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 text-lg px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Começar Agora
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
