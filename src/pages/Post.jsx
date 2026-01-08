import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import ModerationMenu from "@/components/moderation/ModerationMenu";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User,
  Eye,
  Send,
  Loader2,
  Pin,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Post() {
  const [user, setUser] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      const userData = await base44.auth.me();
      setUser(userData);
    }
  };

  const { data: post, isLoading: loadingPost } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const posts = await base44.entities.ForumPost.filter({ id: postId });
      if (posts?.[0]) {
        // Increment view count
        await base44.entities.ForumPost.update(posts[0].id, { 
          views: (posts[0].views || 0) + 1 
        });
      }
      return posts?.[0];
    },
    enabled: !!postId
  });

  const { data: replies = [], isLoading: loadingReplies } = useQuery({
    queryKey: ['replies', postId],
    queryFn: () => base44.entities.Reply.filter({ post_id: postId }),
    enabled: !!postId
  });

  const replyMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Reply.create(data);
      // Update reply count
      await base44.entities.ForumPost.update(postId, { 
        replies: (post?.replies || 0) + 1 
      });
      
      // Create notification for post author
      if (post.author_email !== user?.email) {
        await base44.entities.Notification.create({
          user_email: post.author_email,
          type: 'reply',
          title: 'New reply to your post',
          message: `${user?.full_name || user?.email} replied to "${post.title}"`,
          link: `Post?id=${postId}`,
          related_post_id: postId,
          related_user_email: user?.email
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['replies', postId]);
      queryClient.invalidateQueries(['post', postId]);
      setReplyContent("");
    }
  });

  const handleReply = () => {
    if (!replyContent.trim() || post?.is_locked) return;
    
    replyMutation.mutate({
      post_id: postId,
      content: replyContent,
      author_name: user?.full_name || "Anonymous",
      author_email: user?.email
    });
  };

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <GlassCard className="p-12 text-center">
        <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
        <p className="text-gray-400 mb-6">This post may have been deleted or doesn't exist.</p>
        <Link to={createPageUrl("Discussions")}>
          <NeonButton>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Discussions
          </NeonButton>
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to={createPageUrl("Discussions")} className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Discussions
      </Link>

      {/* Main Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-8" glow>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-purple-500/30">
              {post.author_name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {post.is_pinned && (
                  <Pin className="w-4 h-4 text-purple-400" />
                )}
                {post.is_locked && (
                  <Lock className="w-4 h-4 text-red-400" />
                )}
                <h1 className="text-2xl font-bold text-white flex-1">{post.title}</h1>
                <ModerationMenu post={post} user={user} type="post" />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {format(new Date(post.created_date), "MMMM d, yyyy 'at' h:mm a")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views || 0} views
                </span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Replies Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          Replies ({replies.length})
        </h2>

        <div className="space-y-4">
          {loadingReplies ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          ) : replies.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <p className="text-gray-400">No replies yet. Be the first to respond!</p>
            </GlassCard>
          ) : (
            replies.map((reply, i) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-500/30 flex items-center justify-center text-purple-400 font-semibold shrink-0 border border-purple-500/20">
                      {reply.author_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{reply.author_name}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(reply.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        <div className="ml-auto">
                          <ModerationMenu post={reply} user={user} type="reply" />
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Reply Form */}
      {user && !post.is_locked ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-4">Write a Reply</h3>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none mb-4"
            />
            <div className="flex justify-end">
              <NeonButton 
                onClick={handleReply}
                disabled={!replyContent.trim() || replyMutation.isPending}
              >
                {replyMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Reply
                  </>
                )}
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      ) : post?.is_locked ? (
        <GlassCard className="p-6 text-center border-red-500/30">
          <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-gray-400">This topic is locked. No new replies can be added.</p>
        </GlassCard>
      ) : (
        <GlassCard className="p-6 text-center">
          <p className="text-gray-400 mb-4">Sign in to reply to this topic</p>
          <NeonButton onClick={() => base44.auth.redirectToLogin()}>
            Sign In
          </NeonButton>
        </GlassCard>
      )}
    </div>
  );
}