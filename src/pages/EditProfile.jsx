import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  User, 
  Upload,
  Loader2,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    avatar_url: "",
    about_me: "",
    signature: "",
    discord_username: "",
    twitter_username: "",
    twitch_username: ""
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
      setFormData({
        avatar_url: userData.avatar_url || "",
        about_me: userData.about_me || "",
        signature: userData.signature || "",
        discord_username: userData.discord_username || "",
        twitter_username: userData.twitter_username || "",
        twitch_username: userData.twitch_username || ""
      });
    }
    setIsLoading(false);
  };

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      toast.success("Profile updated successfully!");
    }
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, avatar_url: result.file_url }));
      toast.success("Avatar uploaded!");
    } catch (error) {
      toast.error("Failed to upload avatar");
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

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
        <p className="text-gray-400 mb-6">Please sign in to edit your profile.</p>
        <NeonButton onClick={() => base44.auth.redirectToLogin()}>
          Sign In
        </NeonButton>
      </GlassCard>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to={createPageUrl("Profile")} className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Profile
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-8 text-center" glow>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
          <p className="text-gray-400">Customize your forum presence</p>
        </GlassCard>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-8" glow>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div>
              <Label className="text-gray-300 mb-2 block">Profile Avatar</Label>
              <div className="flex items-center gap-4">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-xl object-cover border-2 border-purple-500/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                    {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <label htmlFor="avatar">
                    <NeonButton variant="secondary" type="button" as="span">
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Avatar
                        </>
                      )}
                    </NeonButton>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max 2MB)</p>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div>
              <Label className="text-gray-300 mb-2 block">About Me</Label>
              <Textarea
                value={formData.about_me}
                onChange={(e) => setFormData(prev => ({ ...prev, about_me: e.target.value }))}
                placeholder="Tell the community about yourself..."
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
              />
            </div>

            {/* Signature */}
            <div>
              <Label className="text-gray-300 mb-2 block">Forum Signature</Label>
              <Textarea
                value={formData.signature}
                onChange={(e) => setFormData(prev => ({ ...prev, signature: e.target.value }))}
                placeholder="This will appear at the end of your posts..."
                rows={2}
                maxLength={200}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.signature.length}/200 characters</p>
            </div>

            {/* Social Links */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300 mb-2 block">Discord</Label>
                <Input
                  value={formData.discord_username}
                  onChange={(e) => setFormData(prev => ({ ...prev, discord_username: e.target.value }))}
                  placeholder="username#1234"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block">Twitter</Label>
                <Input
                  value={formData.twitter_username}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitter_username: e.target.value }))}
                  placeholder="@username"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block">Twitch</Label>
                <Input
                  value={formData.twitch_username}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitch_username: e.target.value }))}
                  placeholder="username"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Link to={createPageUrl("Profile")}>
                <NeonButton variant="secondary" type="button">
                  Cancel
                </NeonButton>
              </Link>
              <NeonButton type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}