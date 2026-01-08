import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { 
  MessageSquare, 
  AtSign, 
  Quote, 
  Megaphone,
  CheckCheck,
  Trash2
} from "lucide-react";
import NeonButton from "@/components/ui/NeonButton";
import { cn } from "@/lib/utils";

const iconMap = {
  reply: MessageSquare,
  mention: AtSign,
  quote: Quote,
  announcement: Megaphone
};

export default function NotificationList({ notifications, onClose, onMarkAllRead }) {
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markReadMutation.mutate(notification.id);
    }
    onClose();
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-4 flex items-center justify-between z-10">
        <h3 className="font-semibold text-white">Notifications</h3>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" />
            Mark all read
          </button>
        )}
      </div>
      
      <div className="divide-y divide-white/5">
        {notifications.map(notification => {
          const Icon = iconMap[notification.type] || MessageSquare;
          
          return (
            <div
              key={notification.id}
              className={cn(
                "group relative",
                !notification.is_read && "bg-purple-500/5"
              )}
            >
              <Link
                to={notification.link || createPageUrl("Discussions")}
                onClick={() => handleNotificationClick(notification)}
                className="block p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    notification.type === 'announcement' ? "bg-purple-500/20" : "bg-blue-500/20"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      notification.type === 'announcement' ? "text-purple-400" : "text-blue-400"
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white mb-1">{notification.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })}
                    </p>
                  </div>
                  
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1" />
                  )}
                </div>
              </Link>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteMutation.mutate(notification.id);
                }}
                className="absolute top-4 right-4 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="w-3 h-3 text-gray-500 hover:text-red-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}