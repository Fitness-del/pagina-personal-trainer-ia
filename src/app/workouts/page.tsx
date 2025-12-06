"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dumbbell,
  Plus,
  Clock,
  TrendingUp,
  CheckCircle2,
  LogOut,
  User,
  Home,
  Activity,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Workout {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: string;
  completed: boolean;
  created_at: string;
}

export default function WorkoutsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setWorkouts(data);
    }

    setLoading(false);
  };

  const createSampleWorkout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const sampleWorkouts = [
      {
        user_id: user.id,
        title: "Treino de Força - Parte Superior",
        description:
          "Treino focado em peito, ombros e tríceps para ganho de massa muscular",
        duration_minutes: 45,
        difficulty: "medio",
        exercises: [
          { name: "Supino Reto", sets: 4, reps: 10 },
          { name: "Desenvolvimento com Halteres", sets: 3, reps: 12 },
          { name: "Tríceps na Polia", sets: 3, reps: 15 },
        ],
      },
      {
        user_id: user.id,
        title: "Cardio HIIT",
        description:
          "Treino intervalado de alta intensidade para queima de gordura",
        duration_minutes: 30,
        difficulty: "dificil",
        exercises: [
          { name: "Burpees", sets: 5, reps: 15 },
          { name: "Mountain Climbers", sets: 5, reps: 20 },
          { name: "Jump Squats", sets: 5, reps: 15 },
        ],
      },
      {
        user_id: user.id,
        title: "Treino de Pernas",
        description: "Treino completo para quadríceps, posteriores e glúteos",
        duration_minutes: 50,
        difficulty: "medio",
        exercises: [
          { name: "Agachamento", sets: 4, reps: 12 },
          { name: "Leg Press", sets: 4, reps: 15 },
          { name: "Stiff", sets: 3, reps: 12 },
        ],
      },
    ];

    const randomWorkout =
      sampleWorkouts[Math.floor(Math.random() * sampleWorkouts.length)];

    const { error } = await supabase.from("workouts").insert(randomWorkout);

    if (!error) {
      loadWorkouts();
    }
  };

  const toggleComplete = async (workoutId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("workouts")
      .update({
        completed: !currentStatus,
        completed_at: !currentStatus ? new Date().toISOString() : null,
      })
      .eq("id", workoutId);

    if (!error) {
      loadWorkouts();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const filteredWorkouts = workouts.filter((workout) => {
    if (filter === "completed") return workout.completed;
    if (filter === "pending") return !workout.completed;
    return true;
  });

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
                className="text-gray-400 hover:text-white"
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
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Os Teus Treinos
              </h1>
              <p className="text-xl text-gray-400">
                Gere e acompanha os teus treinos personalizados
              </p>
            </div>
            <Button
              onClick={createSampleWorkout}
              className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Treino
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
              className={
                filter === "all"
                  ? "bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black"
                  : "border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
              }
            >
              Todos ({workouts.length})
            </Button>
            <Button
              onClick={() => setFilter("pending")}
              variant={filter === "pending" ? "default" : "outline"}
              className={
                filter === "pending"
                  ? "bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black"
                  : "border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
              }
            >
              Pendentes ({workouts.filter((w) => !w.completed).length})
            </Button>
            <Button
              onClick={() => setFilter("completed")}
              variant={filter === "completed" ? "default" : "outline"}
              className={
                filter === "completed"
                  ? "bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black"
                  : "border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
              }
            >
              Completos ({workouts.filter((w) => w.completed).length})
            </Button>
          </div>

          {/* Workouts Grid */}
          {filteredWorkouts.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-12 text-center">
              <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {filter === "all"
                  ? "Ainda não tens treinos"
                  : filter === "completed"
                  ? "Nenhum treino completo ainda"
                  : "Nenhum treino pendente"}
              </h3>
              <p className="text-gray-400 mb-6">
                {filter === "all"
                  ? "Cria o teu primeiro treino personalizado agora!"
                  : "Filtra por outra categoria para ver mais treinos"}
              </p>
              {filter === "all" && (
                <Button
                  onClick={createSampleWorkout}
                  className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeiro Treino
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkouts.map((workout) => (
                <Card
                  key={workout.id}
                  className={`bg-[#1a1a1a] p-6 transition-all ${
                    workout.completed
                      ? "border-[#00ff88]/50"
                      : "border-[#00ff88]/20 hover:border-[#00ff88]/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold flex-1">
                      {workout.title}
                    </h3>
                    {workout.completed && (
                      <CheckCircle2 className="w-6 h-6 text-[#00ff88] flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {workout.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00d4ff]" />
                      <span>{workout.duration_minutes} minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                      <span className="capitalize">{workout.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        toggleComplete(workout.id, workout.completed)
                      }
                      className={`flex-1 ${
                        workout.completed
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black hover:opacity-90"
                      }`}
                      size="sm"
                    >
                      {workout.completed ? "Marcar Pendente" : "Marcar Completo"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
