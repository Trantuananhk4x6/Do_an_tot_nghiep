"use client";
import Link from "next/link";
import {
  FileQuestion,
  LaptopMinimal,
  CircleUser,
  LaptopMinimalCheck,
  FileText,
  ChevronUp,
  BookOpen,
  FileEdit,
  Briefcase,
  Users,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Loading from "./loading";

// Menu items.
const items = [
  {
    title: "Live Interview",
    url: "/live-interview",
    icon: LaptopMinimalCheck,
  },
  {
    title: "Mock Interview",
    url: "/mock-interview",
    icon: LaptopMinimal,
  },
  {
    title: "Preparation Hub",
    url: "/prepare-hub",
    icon: CircleUser,
  },
  {
    title: "User Document",
    url: "/resume",
    icon: FileText,
  },
  {
    title: "Support CV",
    url: "/support-cv",
    icon: FileEdit,
  },
  {
    title: "Find Job",
    url: "/find-job",
    icon: Briefcase,
  },
  {
    title: "Consulting & Network",
    url: "/consulting",
    icon: GraduationCap,
  },
  {
    title: "Quiz",
    url: "/quiz",
    icon: FileQuestion,
  },
  {
    title: "Summarize",
    url: "/summarize",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-white/5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-2xl">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="p-6 pb-6">
            {/* Modern Logo with enhanced styling */}
            <Link href="/" className="block">
              <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500"></div>
                  {/* Icon container with shimmer */}
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:shadow-purple-500/80 transition-all duration-300">
                    <svg
                      className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                    AI Interview
                  </h1>
                </div>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarGroupContent className="px-4">
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a
                        href={item.url}
                        className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 relative overflow-hidden ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600/30 via-fuchsia-600/25 to-pink-600/30 border border-purple-500/40 shadow-lg shadow-purple-500/20"
                            : "hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 border border-transparent hover:border-white/10"
                        }`}
                      >
                        {/* Enhanced active indicator with pulse */}
                        {isActive && (
                          <>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-purple-400 via-fuchsia-500 to-pink-400 rounded-r-full shadow-lg shadow-purple-500/50"></div>
                            {/* Animated glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
                          </>
                        )}
                        
                        {/* Enhanced icon with better styling */}
                        <div
                          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-white shadow-xl shadow-purple-500/50 scale-105"
                              : "bg-white/5 text-gray-400 group-hover:bg-gradient-to-br group-hover:from-purple-600/20 group-hover:to-pink-600/20 group-hover:text-purple-300 group-hover:scale-105"
                          }`}
                        >
                          <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                          {/* Icon glow effect */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur-md opacity-50"></div>
                          )}
                        </div>
                        
                        {/* Enhanced text with better typography */}
                        <span
                          className={`text-sm font-semibold transition-all duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-gray-200"
                          }`}
                        >
                          {item.title}
                        </span>
                        
                        {/* Enhanced hover effect */}
                        {!isActive && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-purple-600/5 via-fuchsia-600/5 to-pink-600/5 rounded-2xl"></div>
                        )}
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transform duration-1000"></div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="border-t border-white/5 p-5 bg-gradient-to-b from-black/20 to-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 transition-all duration-300 cursor-pointer group border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-all duration-500"></div>
              <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                <UserButton />
              </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              {isLoaded ? (
                <>
                  <span className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors">
                    {user.emailAddresses[0].emailAddress}
                  </span>
                </>
              ) : (
                <Loading />
              )}
            </div>
            <ChevronUp className="ml-auto h-4 w-4 text-gray-500 group-hover:text-purple-400 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Link href="/abouttutorial" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
              <HelpCircle className="h-5 w-5 text-gray-300" />
              <span className="text-sm text-gray-300">Hướng dẫn</span>
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
