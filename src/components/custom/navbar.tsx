"use client";

import { Button } from "@/components/ui/button";
import { Dumbbell, MessageSquare, Camera, User, LogOut, Crown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { href: "/personal-ia", label: "Personal IA", icon: MessageSquare },
    { href: "/food-analysis", label: "Análise de Comida", icon: Camera },
    { href: "/pricing", label: "Planos", icon: Crown },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#00ff88]/20 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-[#00ff88]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              PersonalFIT
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${
                      isActive
                        ? "text-[#00ff88] bg-[#00ff88]/10"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
