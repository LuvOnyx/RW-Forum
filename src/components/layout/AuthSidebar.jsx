import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NeonButton from "@/components/ui/NeonButton";
import GlassCard from "@/components/ui/GlassCard";
import NotificationBell from "@/components/notifications/NotificationBell";
import { User, LogOut, Crown, MessageSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AuthSidebar() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      const userData = await base44.auth.me();
      setUser(userData);
    }
    setIsLoading(false);
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (isLoading) {
    return (
      <aside className="fixed right-0 top-0 h-full w-72 z-40">
        <div className="h-full bg-gradient-to-b from-black/80 via-blue-950/20 to-black/80 backdrop-blur-2xl border-l border-white/5 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 rounded-xl bg-white/5" />
            <div className="h-10 rounded-lg bg-white/5" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed right-0 top-0 h-full w-72 z-40 overflow-y-auto">
      <div className="h-full bg-gradient-to-b from-black/80 via-blue-950/20 to-black/80 backdrop-blur-2xl border-l border-white/5 p-6">
        {/* Notification Bell */}
        {user && (
          <div className="mb-6 flex justify-end">
            <NotificationBell user={user} />
          </div>
        )}
        
        {user ? (
          <div className="space-y-6">
            {/* User Profile Card */}
            <GlassCard className="p-5" hover={false} glow>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-900 shadow-lg shadow-green-500/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{user.full_name || "User"}</h3>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-400 font-medium capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">12</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">48</p>
                  <p className="text-xs text-gray-500">Replies</p>
                </div>
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Link to={createPageUrl("Profile")}>
                <NeonButton variant="secondary" className="w-full flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  My Profile
                </NeonButton>
              </Link>
              <NeonButton 
                variant="ghost" 
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </NeonButton>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Login Section */}
            <GlassCard className="p-6" hover={false} glow>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Welcome Back</h3>
                <p className="text-sm text-gray-400">Sign in to join the community</p>
              </div>
              
              <NeonButton 
                onClick={handleLogin}
                className="w-full"
              >
                Sign In / Register
              </NeonButton>
            </GlassCard>

            {/* Community Stats */}
            <GlassCard className="p-5" hover={false}>
              <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Community Stats</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-gray-300">Members</span>
                  </div>
                  <span className="text-xl font-bold text-white">2,458</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-gray-300">Posts</span>
                  </div>
                  <span className="text-xl font-bold text-white">12.4K</span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Recent Activity</h4>
          <div className="space-y-3">
            {[
              { user: "Marcus_RP", action: "created a new topic", time: "2m ago" },
              { user: "SkyWalker", action: "replied to a post", time: "5m ago" },
              { user: "NightRider", action: "joined the server", time: "12m ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600/50 to-blue-500/50 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {activity.user[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">
                    <span className="font-medium text-purple-400">{activity.user}</span>
                    {" "}{activity.action}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}