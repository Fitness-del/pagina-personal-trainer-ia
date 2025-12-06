"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dumbbell,
  User,
  Mail,
  TrendingUp,
  Target,
  Weight,
  Ruler,
  Calendar,
  LogOut,
  Home,
  Activity,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface ProfileData {
  full_name: string;
  email: string;
  fitness_level: string;
  fitness_goal: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    email: "",
    fitness_level: "",
    fitness_goal: "",
    weight: null,
    height: null,
    age: null,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }

    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          fitness_level: profile.fitness_level,
          fitness_goal: profile.fitness_goal,
          weight: profile.weight,
          height: profile.height,
          age: profile.age,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
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
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-[#00ff88]/20 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-[#00ff88]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              Personal Trainer IA
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Início
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#00ff88] hover:text-[#00d4ff]"
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              O Teu Perfil
            </h1>
            <p className="text-xl text-gray-400">
              Mantém as tuas informações atualizadas para treinos mais eficazes
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Personal Info */}
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-[#00ff88]" />
                Informações Pessoais
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-300">
                    Nome Completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile({ ...profile, full_name: e.target.value })
                    }
                    className="bg-[#0a0a0a] border-[#00ff88]/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-[#0a0a0a] border-[#00ff88]/20 text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-300">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Idade
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        age: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    className="bg-[#0a0a0a] border-[#00ff88]/20 text-white"
                    min="10"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-gray-300">
                    <Weight className="w-4 h-4 inline mr-2" />
                    Peso (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={profile.weight || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        weight: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    className="bg-[#0a0a0a] border-[#00ff88]/20 text-white"
                    min="20"
                    max="300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-gray-300">
                    <Ruler className="w-4 h-4 inline mr-2" />
                    Altura (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={profile.height || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        height: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    className="bg-[#0a0a0a] border-[#00ff88]/20 text-white"
                    min="100"
                    max="250"
                  />
                </div>
              </div>
            </Card>

            {/* Fitness Info */}
            <Card className="bg-[#1a1a1a] border-[#00d4ff]/20 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#00d4ff]" />
                Informações de Fitness
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fitnessLevel" className="text-gray-300">
                    Nível de Fitness
                  </Label>
                  <Select
                    value={profile.fitness_level}
                    onValueChange={(value) =>
                      setProfile({ ...profile, fitness_level: value })
                    }
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#00d4ff]/20 text-white">
                      <SelectValue placeholder="Seleciona o teu nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediario">
                        Intermediário
                      </SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fitnessGoal" className="text-gray-300">
                    <Target className="w-4 h-4 inline mr-2" />
                    Objetivo Principal
                  </Label>
                  <Select
                    value={profile.fitness_goal}
                    onValueChange={(value) =>
                      setProfile({ ...profile, fitness_goal: value })
                    }
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#00d4ff]/20 text-white">
                      <SelectValue placeholder="Seleciona o teu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perder_peso">Perder Peso</SelectItem>
                      <SelectItem value="ganhar_massa">
                        Ganhar Massa Muscular
                      </SelectItem>
                      <SelectItem value="manter_forma">
                        Manter a Forma
                      </SelectItem>
                      <SelectItem value="melhorar_resistencia">
                        Melhorar Resistência
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90 transition-all"
              >
                {saving ? "A guardar..." : "Guardar Alterações"}
              </Button>
              <Link href="/dashboard">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
                >
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
