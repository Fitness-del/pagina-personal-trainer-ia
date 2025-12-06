"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Imagens para o carrossel (usando URLs públicas do Unsplash)
const carouselImages = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=800&fit=crop"
];

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  // Carrossel automático de imagens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        
        if (data.user) {
          setSuccess("Login realizado com sucesso!");
          setTimeout(() => router.push("/dashboard"), 1000);
        }
      } else {
        // Registro
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Verificar se precisa de confirmação de email
          if (data.user.identities && data.user.identities.length === 0) {
            setError("Este email já está registado. Tenta fazer login.");
          } else {
            setSuccess("Conta criada com sucesso! A redirecionar...");
            setTimeout(() => router.push("/dashboard"), 2000);
          }
        }
      }
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      
      // Mensagens de erro mais claras
      if (error.message.includes("Invalid login credentials")) {
        setError("Email ou password incorretos.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Por favor, confirma o teu email antes de fazer login.");
      } else if (error.message.includes("User already registered")) {
        setError("Este email já está registado. Tenta fazer login.");
      } else if (error.message.includes("Password should be at least")) {
        setError("A password deve ter pelo menos 6 caracteres.");
      } else {
        setError(error.message || "Erro ao processar. Tenta novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Botão de Voltar */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-[#00ff88] transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>

      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-[#00d4ff]/5"></div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Lado Esquerdo - Carrossel de Imagens */}
        <div className="hidden md:block">
          <div className="relative h-[600px] rounded-3xl overflow-hidden border border-[#00ff88]/20 shadow-2xl">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image}
                  alt={`Fitness ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
            ))}
            
            {/* Overlay com texto */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                PersonalFIT
              </h2>
              <p className="text-xl text-gray-200">
                Transforma o teu corpo com inteligência artificial
              </p>
            </div>

            {/* Indicadores do carrossel */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-[#00ff88] w-8"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <Card className="w-full bg-[#1a1a1a]/80 backdrop-blur-lg border-[#00ff88]/20 p-8 md:p-10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Dumbbell className="w-8 h-8 text-[#00ff88]" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              PersonalFIT
            </span>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2">
            {isLogin ? "Bem-vindo de Volta" : "Criar Conta"}
          </h2>
          <p className="text-gray-400 text-center mb-8">
            {isLogin
              ? "Entra para continuar o teu treino"
              : "Começa a tua jornada fitness hoje"}
          </p>

          {/* Mensagens de erro e sucesso */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="O teu nome"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="pl-10 bg-[#0a0a0a] border-[#00ff88]/20 text-white placeholder:text-gray-500 focus:border-[#00ff88]/50"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="teu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 bg-[#0a0a0a] border-[#00ff88]/20 text-white placeholder:text-gray-500 focus:border-[#00ff88]/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 bg-[#0a0a0a] border-[#00ff88]/20 text-white placeholder:text-gray-500 focus:border-[#00ff88]/50"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 transition-all py-6 text-lg"
            >
              {loading ? "A processar..." : isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="text-[#00ff88] hover:text-[#00d4ff] transition-colors"
            >
              {isLogin
                ? "Não tens conta? Regista-te"
                : "Já tens conta? Entra aqui"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
