import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  MessageSquare,
  FileText,
  Users,
  Shield,
  HelpCircle,
  Newspaper,
  Gamepad2,
  Star } from
"lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
{ name: "Home", icon: Home, page: "Home" },
{ name: "Discussions", icon: MessageSquare, page: "Discussions" },
{ name: "Announcements", icon: Newspaper, page: "Announcements" },
{ name: "Server Rules", icon: Shield, page: "Rules" },
{ name: "Apply Now", icon: Star, page: "Apply", highlight: true },
{ name: "Support", icon: HelpCircle, page: "Support" }];

const adminNavItems = [
{ name: "Mod Log", icon: Shield, page: "ModLog" }
];


export default function Sidebar({ currentPage, user }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40">
      <div className="h-full bg-gradient-to-b from-black/80 via-purple-950/20 to-black/80 backdrop-blur-2xl border-r border-white/5">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c1ea9da9f2a10d9c7f88e/366d4dd2f_RW-BlueSplash.png" 
                  alt="Real-Wrld Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Real-Wrld
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider">FIVEM COMMUNITY</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                  "group relative overflow-hidden",
                  isActive ?
                  "bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-white border border-purple-500/30" :
                  "text-gray-400 hover:text-white hover:bg-white/5",
                  item.highlight && !isActive && "text-purple-400 hover:text-purple-300"
                )}>

                {isActive &&
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full" />
                }
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "text-purple-400" : "group-hover:text-purple-400",
                  item.highlight && "text-purple-400"
                )} />
                <span>{item.name}</span>
                {item.highlight &&
                <span className="ml-auto px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-white">
                    NEW
                  </span>
                }
              </Link>);

          })}

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <>
              <div className="px-4 py-2 mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Moderation</p>
              </div>
              {adminNavItems.map((item) => {
                const isActive = currentPage === item.page;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                      "group relative overflow-hidden",
                      isActive ?
                      "bg-gradient-to-r from-red-600/20 to-orange-500/20 text-white border border-red-500/30" :
                      "text-gray-400 hover:text-white hover:bg-white/5"
                    )}>

                    {isActive &&
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-r-full" />
                    }
                    <Icon className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive ? "text-red-400" : "group-hover:text-red-400"
                    )} />
                    <span>{item.name}</span>
                  </Link>);
              })}
            </>
          )}
        </nav>

        {/* Server Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="bg-gradient-to-br p-4 rounded-[20px] from-green-500/10 to-emerald-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
              <span className="text-xs font-semibold text-green-400">SERVER ONLINE</span>
            </div>
            <p className="text-2xl font-bold text-white">128<span className="text-gray-500 text-lg">/256</span></p>
            <p className="text-xs text-gray-500">Players Online</p>
          </div>
        </div>
      </div>
    </aside>);

}