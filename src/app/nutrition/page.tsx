"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Apple, 
  Dumbbell, 
  TrendingUp, 
  Calendar,
  Flame,
  Activity,
  Target,
  Plus,
  Trash2,
  Edit,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/custom/navbar";

interface MealEntry {
  id: string;
  user_id: string;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  created_at: string;
}

interface WorkoutEntry {
  id: string;
  user_id: string;
  workout_name: string;
  duration_minutes: number;
  calories_burned: number;
  workout_type: string;
  created_at: string;
}

interface DailySummary {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  calories_burned: number;
  net_calories: number;
}

export default function NutritionPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  // Estados para refeições
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  
  // Estados para treinos
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  
  // Resumo diário
  const [dailySummary, setDailySummary] = useState<DailySummary>({
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0,
    calories_burned: 0,
    net_calories: 0
  });

  // Form states para nova refeição
  const [newMeal, setNewMeal] = useState({
    meal_name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    meal_type: "lunch" as "breakfast" | "lunch" | "dinner" | "snack"
  });

  // Form states para novo treino
  const [newWorkout, setNewWorkout] = useState({
    workout_name: "",
    duration_minutes: 0,
    calories_burned: 0,
    workout_type: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
    setUserId(user.id);
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadMeals(), loadWorkouts()]);
    setLoading(false);
  };

  const loadMeals = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("meal_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setMeals(data || []);
      calculateDailySummary(data || [], workouts);
    } catch (error) {
      console.error("Erro ao carregar refeições:", error);
    }
  };

  const loadWorkouts = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("workout_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setWorkouts(data || []);
      calculateDailySummary(meals, data || []);
    } catch (error) {
      console.error("Erro ao carregar treinos:", error);
    }
  };

  const calculateDailySummary = (mealsData: MealEntry[], workoutsData: WorkoutEntry[]) => {
    const total_calories = mealsData.reduce((sum, meal) => sum + meal.calories, 0);
    const total_protein = mealsData.reduce((sum, meal) => sum + meal.protein, 0);
    const total_carbs = mealsData.reduce((sum, meal) => sum + meal.carbs, 0);
    const total_fat = mealsData.reduce((sum, meal) => sum + meal.fat, 0);
    const calories_burned = workoutsData.reduce((sum, workout) => sum + workout.calories_burned, 0);
    
    setDailySummary({
      total_calories,
      total_protein,
      total_carbs,
      total_fat,
      calories_burned,
      net_calories: total_calories - calories_burned
    });
  };

  const addMeal = async () => {
    if (!newMeal.meal_name || newMeal.calories <= 0) {
      alert("Por favor preenche todos os campos obrigatórios");
      return;
    }

    try {
      const { error } = await supabase
        .from("meal_entries")
        .insert([{
          user_id: userId,
          ...newMeal
        }]);

      if (error) throw error;

      setNewMeal({
        meal_name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        meal_type: "lunch"
      });
      setShowAddMeal(false);
      await loadMeals();
    } catch (error) {
      console.error("Erro ao adicionar refeição:", error);
      alert("Erro ao adicionar refeição");
    }
  };

  const addWorkout = async () => {
    if (!newWorkout.workout_name || newWorkout.duration_minutes <= 0) {
      alert("Por favor preenche todos os campos obrigatórios");
      return;
    }

    try {
      const { error } = await supabase
        .from("workout_entries")
        .insert([{
          user_id: userId,
          ...newWorkout
        }]);

      if (error) throw error;

      setNewWorkout({
        workout_name: "",
        duration_minutes: 0,
        calories_burned: 0,
        workout_type: ""
      });
      setShowAddWorkout(false);
      await loadWorkouts();
    } catch (error) {
      console.error("Erro ao adicionar treino:", error);
      alert("Erro ao adicionar treino");
    }
  };

  const deleteMeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from("meal_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadMeals();
    } catch (error) {
      console.error("Erro ao deletar refeição:", error);
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const { error } = await supabase
        .from("workout_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadWorkouts();
    } catch (error) {
      console.error("Erro ao deletar treino:", error);
    }
  };

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: "Pequeno-almoço",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanche"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMealTypeEmoji = (type: string) => {
    const emojis = {
      breakfast: "🌅",
      lunch: "🍽️",
      dinner: "🌙",
      snack: "🍎"
    };
    return emojis[type as keyof typeof emojis] || "🍴";
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-full flex items-center justify-center">
                <Apple className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                    Nutrição & Treinos
                  </span>
                </h1>
                <p className="text-sm text-gray-400">
                  Acompanha as tuas calorias e treinos diários
                </p>
              </div>
            </div>
          </div>

          {/* Resumo Diário */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 border-[#00ff88]/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-8 h-8 text-[#00ff88]" />
                <span className="text-xs text-gray-400">Consumidas</span>
              </div>
              <p className="text-3xl font-bold text-[#00ff88]">{dailySummary.total_calories}</p>
              <p className="text-sm text-gray-400">Calorias</p>
            </Card>

            <Card className="bg-gradient-to-br from-[#ff4444]/20 to-[#ff8844]/20 border-[#ff4444]/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-[#ff4444]" />
                <span className="text-xs text-gray-400">Queimadas</span>
              </div>
              <p className="text-3xl font-bold text-[#ff4444]">{dailySummary.calories_burned}</p>
              <p className="text-sm text-gray-400">Calorias</p>
            </Card>

            <Card className="bg-gradient-to-br from-[#00d4ff]/20 to-[#0088ff]/20 border-[#00d4ff]/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-[#00d4ff]" />
                <span className="text-xs text-gray-400">Líquidas</span>
              </div>
              <p className="text-3xl font-bold text-[#00d4ff]">{dailySummary.net_calories}</p>
              <p className="text-sm text-gray-400">Calorias</p>
            </Card>

            <Card className="bg-gradient-to-br from-[#9d4edd]/20 to-[#c77dff]/20 border-[#9d4edd]/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-[#9d4edd]" />
                <span className="text-xs text-gray-400">Macros</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-300">P: {dailySummary.total_protein}g</p>
                <p className="text-sm text-gray-300">C: {dailySummary.total_carbs}g</p>
                <p className="text-sm text-gray-300">G: {dailySummary.total_fat}g</p>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Refeições */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Apple className="w-6 h-6 text-[#00ff88]" />
                  Refeições de Hoje
                </h2>
                <Button
                  onClick={() => setShowAddMeal(!showAddMeal)}
                  className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {/* Form Adicionar Refeição */}
              {showAddMeal && (
                <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-6 mb-4">
                  <h3 className="font-bold mb-4">Nova Refeição</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nome da Refeição</label>
                      <input
                        type="text"
                        value={newMeal.meal_name}
                        onChange={(e) => setNewMeal({ ...newMeal, meal_name: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#00ff88]/20 rounded-lg text-white"
                        placeholder="Ex: Frango com arroz"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Tipo</label>
                        <select
                          value={newMeal.meal_type}
                          onChange={(e) => setNewMeal({ ...newMeal, meal_type: e.target.value as any })}
                          className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#00ff88]/20 rounded-lg text-white"
                        >
                          <option value="breakfast">Pequeno-almoço</option>
                          <option value="lunch">Almoço</option>
                          <option value="dinner">Jantar</option>
                          <option value="snack">Lanche</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Calorias</label>
                        <input
                          type="number"
                          value={newMeal.calories}
                          onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                          className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#00ff88]/20 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Proteína (g)</label>
                        <input
                          type="number"
                          value={newMeal.protein}
                          onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                          className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#00ff88]/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Carboidratos (g)</label>
                        <input
                          type="number"
                          value={newMeal.carbs}
                          onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                          className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#00ff88]/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Gordura (g)</label>
                        <input
                          type="number"
                          value={newMeal.fat}
                          onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
                          className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#00ff88]/20 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={addMeal}
                        className="flex-1 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-semibold hover:opacity-90"
                      >
                        Adicionar Refeição
                      </Button>
                      <Button
                        onClick={() => setShowAddMeal(false)}
                        variant="outline"
                        className="border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Lista de Refeições */}
              <div className="space-y-3">
                {meals.length === 0 ? (
                  <Card className="bg-[#1a1a1a] border-[#00ff88]/20 p-8 text-center">
                    <Apple className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Ainda não registaste nenhuma refeição hoje</p>
                  </Card>
                ) : (
                  meals.map((meal) => (
                    <Card key={meal.id} className="bg-[#1a1a1a] border-[#00ff88]/20 p-4 hover:border-[#00ff88]/40 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{getMealTypeEmoji(meal.meal_type)}</span>
                            <div>
                              <h3 className="font-bold">{meal.meal_name}</h3>
                              <p className="text-xs text-gray-400">{getMealTypeLabel(meal.meal_type)}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div>
                              <p className="text-[#00ff88] font-bold">{meal.calories}</p>
                              <p className="text-xs text-gray-400">kcal</p>
                            </div>
                            <div>
                              <p className="text-[#00d4ff] font-bold">{meal.protein}g</p>
                              <p className="text-xs text-gray-400">Proteína</p>
                            </div>
                            <div>
                              <p className="text-[#00ff88] font-bold">{meal.carbs}g</p>
                              <p className="text-xs text-gray-400">Carbs</p>
                            </div>
                            <div>
                              <p className="text-[#00d4ff] font-bold">{meal.fat}g</p>
                              <p className="text-xs text-gray-400">Gordura</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => deleteMeal(meal.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Treinos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-[#ff4444]" />
                  Treinos de Hoje
                </h2>
                <Button
                  onClick={() => setShowAddWorkout(!showAddWorkout)}
                  className="bg-gradient-to-r from-[#ff4444] to-[#ff8844] text-white font-semibold hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {/* Form Adicionar Treino */}
              {showAddWorkout && (
                <Card className="bg-[#1a1a1a] border-[#ff4444]/20 p-6 mb-4">
                  <h3 className="font-bold mb-4">Novo Treino</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nome do Treino</label>
                      <input
                        type="text"
                        value={newWorkout.workout_name}
                        onChange={(e) => setNewWorkout({ ...newWorkout, workout_name: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#ff4444]/20 rounded-lg text-white"
                        placeholder="Ex: Treino de Peito"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Tipo</label>
                        <input
                          type="text"
                          value={newWorkout.workout_type}
                          onChange={(e) => setNewWorkout({ ...newWorkout, workout_type: e.target.value })}
                          className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#ff4444]/20 rounded-lg text-white"
                          placeholder="Ex: Musculação"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Duração (min)</label>
                        <input
                          type="number"
                          value={newWorkout.duration_minutes}
                          onChange={(e) => setNewWorkout({ ...newWorkout, duration_minutes: Number(e.target.value) })}
                          className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#ff4444]/20 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Calorias Queimadas</label>
                      <input
                        type="number"
                        value={newWorkout.calories_burned}
                        onChange={(e) => setNewWorkout({ ...newWorkout, calories_burned: Number(e.target.value) })}
                        className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#ff4444]/20 rounded-lg text-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={addWorkout}
                        className="flex-1 bg-gradient-to-r from-[#ff4444] to-[#ff8844] text-white font-semibold hover:opacity-90"
                      >
                        Adicionar Treino
                      </Button>
                      <Button
                        onClick={() => setShowAddWorkout(false)}
                        variant="outline"
                        className="border-[#ff4444]/30 text-white hover:bg-[#ff4444]/10"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Lista de Treinos */}
              <div className="space-y-3">
                {workouts.length === 0 ? (
                  <Card className="bg-[#1a1a1a] border-[#ff4444]/20 p-8 text-center">
                    <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Ainda não registaste nenhum treino hoje</p>
                  </Card>
                ) : (
                  workouts.map((workout) => (
                    <Card key={workout.id} className="bg-[#1a1a1a] border-[#ff4444]/20 p-4 hover:border-[#ff4444]/40 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">💪</span>
                            <div>
                              <h3 className="font-bold">{workout.workout_name}</h3>
                              <p className="text-xs text-gray-400">{workout.workout_type}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-[#ff4444] font-bold">{workout.duration_minutes} min</p>
                              <p className="text-xs text-gray-400">Duração</p>
                            </div>
                            <div>
                              <p className="text-[#ff8844] font-bold">{workout.calories_burned} kcal</p>
                              <p className="text-xs text-gray-400">Queimadas</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => deleteWorkout(workout.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
