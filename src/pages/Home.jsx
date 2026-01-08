import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import {
  Gamepad2,
  Users,
  MessageSquare,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  TrendingUp } from
"lucide-react";
import { motion } from "framer-motion";

const features = [
{
  icon: Zap,
  title: "High Performance",
  description: "Optimized server running at 144 tick rate for smooth gameplay"
},
{
  icon: Shield,
  title: "Active Staff",
  description: "24/7 moderation team ensuring fair and enjoyable RP"
},
{
  icon: Globe,
  title: "Custom Scripts",
  description: "Unique features and systems built from the ground up"
},
{
  icon: Users,
  title: "Growing Community",
  description: "Join thousands of players in immersive roleplay"
}];


const stats = [
{ value: "2,458", label: "Members", icon: Users },
{ value: "128", label: "Online Now", icon: Gamepad2 },
{ value: "12.4K", label: "Forum Posts", icon: MessageSquare },
{ value: "4.9", label: "Rating", icon: Star }];


export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>

        <GlassCard className="p-8 md:p-12 overflow-hidden relative" hover={false} glow>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-white shadow-lg shadow-purple-500/25">🎮 NOW LIVE

              </span>
              <span className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-gray-400">Season 1

              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Real-Wrld
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-2xl mb-8 leading-relaxed">
              Experience the most immersive FiveM roleplay server with a passionate community, 
              custom scripts, and endless possibilities. Your story starts here.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("Apply")}>
                <NeonButton size="lg" className="group">
                  Apply Now
                  <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </NeonButton>
              </Link>
              <Link to={createPageUrl("Rules")}>
                <NeonButton variant="secondary" size="lg">
                  View Server Rules
                </NeonButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={i} className="p-6 text-center">
              <Icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </GlassCard>);

        })}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Why Choose Us?</h2>
          <TrendingUp className="w-6 h-6 text-purple-400" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={i} className="p-6 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-500/20 flex items-center justify-center shrink-0 border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </GlassCard>);

          })}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}>

        <GlassCard className="p-8 text-center relative overflow-hidden" glow>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-purple-600/10" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Join our community today and become part of something special. 
              Applications are now open for Season 4!
            </p>
            <Link to={createPageUrl("Apply")}>
              <NeonButton size="lg">
                <Star className="inline mr-2 w-5 h-5" />
                Submit Your Application
              </NeonButton>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>);

}