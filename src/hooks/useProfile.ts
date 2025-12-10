'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  subscription_tier: 'free' | 'premium' | 'unlimited';
  credits_remaining: number;
  max_daily_analyses: number;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Buscar usuário e perfil
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar usuário autenticado
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw authError;
        }

        if (!authUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(authUser);

        // Buscar perfil do usuário
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          // Se perfil não existe, criar um padrão
          if (profileError.code === 'PGRST116') {
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: authUser.id,
                email: authUser.email,
                role: 'user',
                subscription_tier: 'free',
                credits_remaining: 10,
                max_daily_analyses: 10
              })
              .select()
              .single();

            if (insertError) {
              throw insertError;
            }

            setProfile(newProfile);
          } else {
            throw profileError;
          }
        } else {
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile();
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funções auxiliares
  const isAdmin = profile?.role === 'admin';
  const isUnlimited = profile?.subscription_tier === 'unlimited';
  const hasCredits = (profile?.credits_remaining ?? 0) > 0;
  const canAnalyze = isUnlimited || hasCredits;

  // Função para decrementar créditos
  const decrementCredits = async () => {
    if (!profile || isUnlimited) return true;

    const { error } = await supabase
      .from('profiles')
      .update({ credits_remaining: Math.max(0, profile.credits_remaining - 1) })
      .eq('id', profile.id);

    if (error) {
      console.error('Erro ao decrementar créditos:', error);
      return false;
    }

    // Atualizar estado local
    setProfile({
      ...profile,
      credits_remaining: Math.max(0, profile.credits_remaining - 1)
    });

    return true;
  };

  // Função para recarregar perfil
  const refreshProfile = async () => {
    if (!user) return;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profileError && profileData) {
      setProfile(profileData);
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    isAdmin,
    isUnlimited,
    hasCredits,
    canAnalyze,
    decrementCredits,
    refreshProfile
  };
}
