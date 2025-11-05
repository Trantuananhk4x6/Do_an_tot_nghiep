"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AnimatedStars } from "@/components/ui/animated-stars";

export default function FeaturesLayout({ children }) {
  return (
    <SidebarProvider>
      {/* Animated stars background */}
      <AnimatedStars />
      
      {/* Gradient mesh background */}
      <div className="gradient-mesh" />
      
      <div className="flex h-screen w-screen relative z-10">
        <AppSidebar />
        <main className="flex-1 flex flex-col h-screen">
          <div className="glass-effect border-b border-white/5 backdrop-blur-xl">
            <SidebarTrigger />
          </div>
          <div className="relative flex-1 flex flex-col gap-3 p-4 lg:gap-4 lg:p-6 pb-0 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
