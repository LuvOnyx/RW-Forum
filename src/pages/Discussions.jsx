import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
"@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import {
  MessageSquare,
  Plus,
  Eye,
  Clock,
  User,
  Pin,
  Lock,
  Search,
  Loader2,
  ChevronRight } from
"lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Discussions() {
  const [user, setUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category_id: ""
  });

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

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.ForumCategory.list('order')
  });

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.ForumPost.list('-created_date')
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => base44.entities.ForumPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setIsDialogOpen(false);
      setNewPost({ title: "", content: "", category_id: "" });
    }
  });

  const handleCreatePost = () => {
    createPostMutation.mutate({
      ...newPost,
      author_name: user?.full_name || "Anonymous",
      author_email: user?.email
    });
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat?.name || "General";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Discussions</h1>
          <p className="text-gray-400">Connect with the community</p>
        </div>
        
        {user &&
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <NeonButton>
                <Plus className="w-4 h-4 mr-2" />
                New Topic
              </NeonButton>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter topic title"
                  className="bg-white/5 border-white/10 text-white mt-1" />

                </div>
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <Select
                  value={newPost.category_id}
                  onValueChange={(value) => setNewPost((prev) => ({ ...prev, category_id: value }))}>

                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10">
                      {categories.map((cat) =>
                    <SelectItem key={cat.id} value={cat.id} className="text-white">
                          {cat.name}
                        </SelectItem>
                    )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Content</Label>
                  <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your topic content..."
                  rows={6}
                  className="bg-white/5 border-white/10 text-white mt-1 resize-none" />

                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <NeonButton variant="secondary" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </NeonButton>
                  <NeonButton
                  onClick={handleCreatePost}
                  disabled={!newPost.title || !newPost.content || createPostMutation.isPending}>

                    {createPostMutation.isPending ?
                  <Loader2 className="w-4 h-4 animate-spin" /> :

                  "Create Topic"
                  }
                  </NeonButton>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}>

        <GlassCard className="p-4" hover={false}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions..."
                className="pl-10 bg-white/5 border-white/10 text-white" />

            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all" className="text-white">All Categories</SelectItem>
                {categories.map((cat) =>
                <SelectItem key={cat.id} value={cat.id} className="text-white">
                    {cat.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>
      </motion.div>

      {/* Posts List */}
      <div className="space-y-3">
        {loadingPosts ?
        <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div> :
        filteredPosts.length === 0 ?
        <GlassCard className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No discussions yet</h3>
            <p className="text-gray-400 mb-6">Be the first to start a conversation!</p>
            {user &&
          <NeonButton onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Topic
              </NeonButton>
          }
          </GlassCard> :

        filteredPosts.map((post, i) =>
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}>

              <Link to={createPageUrl(`Post?id=${post.id}`)}>
                <GlassCard className="p-5 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20 shrink-0">
                      <span className="text-lg font-bold text-purple-400">
                        {post.author_name?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.is_pinned &&
                    <Pin className="w-4 h-4 text-purple-400" />
                    }
                        {post.is_locked &&
                    <Lock className="w-4 h-4 text-red-400" />
                    }
                        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                          {post.title}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author_name}
                        </span>
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {getCategoryName(post.category_id)}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(post.created_date), "MMM d")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.replies || 0}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
        )
        }
      </div>
    </div>);

}