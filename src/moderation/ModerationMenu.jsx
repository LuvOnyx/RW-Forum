import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import NeonButton from "@/components/ui/NeonButton";
import { MoreVertical, Pin, Lock, Edit, Trash2, Shield } from "lucide-react";

export default function ModerationMenu({ post, user, type = "post" }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const queryClient = useQueryClient();

  const isAdmin = user?.role === 'admin';
  const isAuthor = post?.author_email === user?.email;

  if (!isAdmin && !isAuthor) return null;

  const logAction = async (action, targetType, targetId, reason = "") => {
    await base44.entities.ModerationLog.create({
      moderator_email: user.email,
      moderator_name: user.full_name || user.email,
      action,
      target_type: targetType,
      target_id: targetId,
      target_title: post.title || post.content?.substring(0, 50),
      reason,
      details: JSON.stringify({ timestamp: new Date().toISOString() })
    });
  };

  const pinMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.ForumPost.update(post.id, { is_pinned: !post.is_pinned });
      await logAction(post.is_pinned ? 'unpin' : 'pin', 'post', post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['post']);
    }
  });

  const lockMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.ForumPost.update(post.id, { is_locked: !post.is_locked });
      await logAction(post.is_locked ? 'unlock' : 'lock', 'post', post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['post']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const entity = type === 'post' ? 'ForumPost' : 'Reply';
      await base44.entities[entity].delete(post.id);
      await logAction(`delete_${type}`, type, post.id, deleteReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['post']);
      queryClient.invalidateQueries(['replies']);
      setShowDeleteDialog(false);
    }
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900 border-white/10" align="end">
          {isAdmin && type === 'post' && (
            <>
              <DropdownMenuItem 
                onClick={() => pinMutation.mutate()}
                className="text-white hover:bg-white/5 cursor-pointer"
              >
                <Pin className="w-4 h-4 mr-2" />
                {post.is_pinned ? 'Unpin' : 'Pin'} Post
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => lockMutation.mutate()}
                className="text-white hover:bg-white/5 cursor-pointer"
              >
                <Lock className="w-4 h-4 mr-2" />
                {post.is_locked ? 'Unlock' : 'Lock'} Thread
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
            </>
          )}
          
          {(isAdmin || isAuthor) && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-400 hover:bg-red-500/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete {type}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete {type}?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              This action cannot be undone. The {type} will be permanently deleted.
            </p>
            {isAdmin && (
              <div>
                <Label className="text-gray-300">Reason (optional)</Label>
                <Textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Reason for deletion..."
                  className="bg-white/5 border-white/10 text-white mt-2"
                  rows={3}
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <NeonButton variant="secondary" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </NeonButton>
              <NeonButton 
                onClick={() => deleteMutation.mutate()}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </NeonButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}