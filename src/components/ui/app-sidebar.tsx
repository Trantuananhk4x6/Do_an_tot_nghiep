"use client";
import {
  FileQuestion,
  LaptopMinimal,
  CircleUser,
  LaptopMinimalCheck,
  FileText,
  ChevronUp,
  BookOpen,
  FileEdit,
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
    <Sidebar className="border-r border-white/10 bg-black/40 backdrop-blur-2xl">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="p-6 pb-4">
            {/* Modern Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                {/* Icon container */}
                <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h1 className="text-xl font-bold gradient-text">
                  AI Interview
                </h1>
                <p className="text-xs text-gray-500">Powered by Gemini</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a
                        href={item.url}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 relative overflow-hidden ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"></div>
                        )}
                        
                        {/* Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                              : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-purple-400"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        
                        {/* Text */}
                        <span
                          className={`text-sm font-medium transition-colors ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-white"
                          }`}
                        >
                          {item.title}
                        </span>
                        
                        {/* Hover glow effect */}
                        {!isActive && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl"></div>
                        )}
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
        <div className="border-t border-white/10 p-4 bg-black/20">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-sm opacity-0 group-hover:opacity-75 transition-opacity"></div>
              <UserButton />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              {isLoaded ? (
                <>
                  <span className="text-sm font-medium text-white truncate">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {user.emailAddresses[0].emailAddress}
                  </span>
                </>
              ) : (
                <Loading />
              )}
            </div>
            <ChevronUp className="ml-auto h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
