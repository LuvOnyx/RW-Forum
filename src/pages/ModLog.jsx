import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import GlassCard from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Pin, 
  Lock, 
  Trash2,
  Edit,
  Ban,
  Clock,
  User,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const actionIcons = {
  pin: Pin,
  unpin: Pin,
  lock: Lock,
  unlock: Lock,
  delete_post: Trash2,
  delete_reply: Trash2,
  edit_post: Edit,
  edit_reply: Edit,
  ban_user: Ban,
  unban_user: Ban
};

const actionColors = {
  pin: "text-purple-400 bg-purple-500/20",
  unpin: "text-purple-400 bg-purple-500/20",
  lock: "text-orange-400 bg-orange-500/20",
  unlock: "text-green-400 bg-green-500/20",
  delete_post: "text-red-400 bg-red-500/20",
  delete_reply: "text-red-400 bg-red-500/20",
  edit_post: "text-blue-400 bg-blue-500/20",
  edit_reply: "text-blue-400 bg-blue-500/20",
  ban_user: "text-red-400 bg-red-500/20",
  unban_user: "text-green-400 bg-green-500/20"
};

export default function ModLog() {
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

  const { data: logs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['modLogs'],
    queryFn: () => base44.entities.ModerationLog.list('-created_date', 100),
    enabled: user?.role === 'admin'
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <GlassCard className="p-12 text-center" glow>
        <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">Only administrators can view the moderation log.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-8 text-center" glow>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Moderation Log</h1>
          <p className="text-gray-400">Track all moderation actions taken on the forum</p>
        </GlassCard>
      </motion.div>

      {/* Logs */}
      <div className="space-y-3">
        {loadingLogs ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No actions yet</h3>
            <p className="text-gray-400">Moderation actions will appear here</p>
          </GlassCard>
        ) : (
          logs.map((log, i) => {
            const Icon = actionIcons[log.action] || Shield;
            const colorClass = actionColors[log.action] || "text-gray-400 bg-gray-500/20";
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 capitalize">
                          {log.action.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">on</span>
                        <Badge variant="outline" className="border-white/10 text-gray-400 capitalize">
                          {log.target_type}
                        </Badge>
                      </div>
                      
                      {log.target_title && (
                        <p className="text-white font-medium mb-1 truncate">
                          {log.target_title}
                        </p>
                      )}
                      
                      {log.reason && (
                        <p className="text-sm text-gray-400 mb-2">
                          <span className="text-gray-500">Reason:</span> {log.reason}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.moderator_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}