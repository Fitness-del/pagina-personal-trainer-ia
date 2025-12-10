'use client';

import { useProfile } from '@/hooks/useProfile';
import { Shield, Crown, Zap, TrendingUp } from 'lucide-react';

export function AdminBadge() {
  const { profile, isAdmin, isUnlimited, loading } = useProfile();

  if (loading || !profile) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {isAdmin && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-bold">ADMIN</span>
        </div>
      )}
      
      {isUnlimited && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
          <Crown className="w-4 h-4" />
          <span className="text-sm font-bold">ILIMITADO</span>
        </div>
      )}

      {!isUnlimited && profile && (
        <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">{profile.credits_remaining} créditos</span>
        </div>
      )}
    </div>
  );
}

export function AdminPanel() {
  const { profile, isAdmin, isUnlimited, loading } = useProfile();

  if (loading || !profile || !isAdmin) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white p-6 rounded-2xl shadow-2xl mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold">Painel de Administrador</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Plano</h3>
          </div>
          <p className="text-2xl font-bold capitalize">{profile.subscription_tier}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Créditos</h3>
          </div>
          <p className="text-2xl font-bold">
            {isUnlimited ? '∞ Ilimitado' : profile.credits_remaining}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Análises/Dia</h3>
          </div>
          <p className="text-2xl font-bold">
            {isUnlimited ? '∞ Ilimitado' : profile.max_daily_analyses}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
        <p className="text-sm">
          ✅ <strong>Modo Admin Ativo:</strong> Você tem acesso total a todas as funcionalidades do sistema.
        </p>
      </div>
    </div>
  );
}
