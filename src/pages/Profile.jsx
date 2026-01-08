import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  MessageSquare, 
  Clock, 
  Crown,
  Calendar,
  ArrowLeft,
  Loader2,
  Edit,
  Twitter,
  Twitch,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Profile() {
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

  const { data: userPosts = [] } = useQuery({
    queryKey: ['userPosts', user?.email],
    queryFn: () => base44.entities.ForumPost.filter({ author_email: user.email }),
    enabled: !!user?.email
  });

  const { data: application } = useQuery({
    queryKey: ['userApplication', user?.email],
    queryFn: async () => {
      const apps = await base44.entities.Application.filter({ created_by: user.email });
      return apps?.[0];
    },
    enabled: !!user?.email
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <GlassCard className="p-12 text-center" glow>
        <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
        <p className="text-gray-400 mb-6">Please sign in to view your profile.</p>
        <NeonButton onClick={() => base44.auth.redirectToLogin()}>
          Sign In
        </NeonButton>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to={createPageUrl("Home")} className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-8 relative overflow-hidden" glow>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt="Avatar" 
                className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-500/30 shadow-xl shadow-purple-500/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-purple-500/30">
                {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </div>
            )}
            
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{user.full_name || "User"}</h1>
                <Link to={createPageUrl("EditProfile")}>
                  <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Edit className="w-4 h-4 text-gray-400 hover:text-purple-400" />
                  </button>
                </Link>
              </div>
              <p className="text-gray-400 mb-2">{user.email}</p>
              
              {user.about_me && (
                <p className="text-gray-300 text-sm mb-4 max-w-xl">{user.about_me}</p>
              )}
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 capitalize">
                  <Crown className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
                {application && (
                  <Badge className={`border ${
                    application.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  } capitalize`}>
                    Application: {application.status}
                  </Badge>
                )}
              </div>

              {/* Social Links */}
              {(user.discord_username || user.twitter_username || user.twitch_username) && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {user.discord_username && (
                    <a 
                      href={`https://discord.com/users/${user.discord_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors text-sm"
                    >
                      <MessageCircle className="w-3 h-3" />
                      {user.discord_username}
                    </a>
                  )}
                  {user.twitter_username && (
                    <a 
                      href={`https://twitter.com/${user.twitter_username.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm"
                    >
                      <Twitter className="w-3 h-3" />
                      {user.twitter_username}
                    </a>
                  )}
                  {user.twitch_username && (
                    <a 
                      href={`https://twitch.tv/${user.twitch_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm"
                    >
                      <Twitch className="w-3 h-3" />
                      {user.twitch_username}
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-white">{userPosts.length}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-white">
                  {userPosts.reduce((acc, post) => acc + (post.replies || 0), 0)}
                </p>
                <p className="text-xs text-gray-500">Replies</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* User's Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          Your Posts
        </h2>
        
        {userPosts.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400 mb-4">Start a discussion in the forums!</p>
            <Link to={createPageUrl("Discussions")}>
              <NeonButton>Go to Discussions</NeonButton>
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {userPosts.map((post, i) => (
              <Link key={post.id} to={createPageUrl(`Post?id=${post.id}`)}>
                <GlassCard className="p-5 cursor-pointer group">
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(post.created_date), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {post.replies || 0} replies
                    </span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}