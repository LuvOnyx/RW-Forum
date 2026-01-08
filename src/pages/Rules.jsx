import GlassCard from "@/components/ui/GlassCard";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Gamepad2,
  Ban,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";

const rules = [
  {
    category: "General Rules",
    icon: Shield,
    color: "purple",
    items: [
      "Respect all players and staff members at all times",
      "No harassment, discrimination, or hate speech of any kind",
      "Do not share personal information about yourself or others",
      "English only in public channels and roleplay",
      "Follow staff instructions without argument"
    ]
  },
  {
    category: "Roleplay Rules",
    icon: Gamepad2,
    color: "blue",
    items: [
      "Always stay in character (IC) during roleplay situations",
      "No Random Deathmatch (RDM) - must have valid IC reason to attack",
      "No Vehicle Deathmatch (VDM) - do not use vehicles as weapons",
      "Fear for your life (FearRP) when threatened with weapons",
      "No metagaming - keep IC and OOC knowledge separate",
      "No powergaming - give others fair chance to respond",
      "Value your character's life at all times"
    ]
  },
  {
    category: "Communication Rules",
    icon: MessageSquare,
    color: "green",
    items: [
      "Use /ooc for out-of-character communication sparingly",
      "No toxic or disruptive behavior in voice chat",
      "Do not interrupt ongoing roleplay scenes",
      "Report rule-breakers through proper channels, not in-game"
    ]
  },
  {
    category: "Community Guidelines",
    icon: Users,
    color: "orange",
    items: [
      "Be welcoming to new players",
      "Help maintain immersion for everyone",
      "Participate in community events when possible",
      "Provide constructive feedback through forums",
      "Report bugs through proper channels"
    ]
  }
];

const punishments = [
  { offense: "Minor Offense", punishment: "Verbal Warning", severity: "low" },
  { offense: "Second Offense", punishment: "24 Hour Ban", severity: "medium" },
  { offense: "Major Offense", punishment: "7 Day Ban", severity: "high" },
  { offense: "Severe Offense", punishment: "Permanent Ban", severity: "critical" }
];

export default function Rules() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-8 text-center relative overflow-hidden" glow>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600" />
          <Shield className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Server Rules
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            These rules are essential for maintaining a positive and immersive roleplay experience. 
            All players are expected to read, understand, and follow these guidelines.
          </p>
        </GlassCard>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6 border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Important Notice</h3>
              <p className="text-gray-300">
                Ignorance of the rules is not an excuse. By playing on Real-Wrld, you agree to follow all rules. 
                Staff decisions are final. Repeated violations will result in escalating punishments up to and including permanent bans.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Rules Sections */}
      <div className="grid gap-6">
        {rules.map((section, i) => {
          const Icon = section.icon;
          const colors = {
            purple: "from-purple-600/20 to-purple-500/10 border-purple-500/20",
            blue: "from-blue-600/20 to-blue-500/10 border-blue-500/20",
            green: "from-green-600/20 to-green-500/10 border-green-500/20",
            orange: "from-orange-600/20 to-orange-500/10 border-orange-500/20"
          };
          const iconColors = {
            purple: "text-purple-400",
            blue: "text-blue-400",
            green: "text-green-400",
            orange: "text-orange-400"
          };
          
          return (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <GlassCard className={`p-6 bg-gradient-to-br ${colors[section.color]}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${iconColors[section.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.category}</h2>
                </div>
                
                <ul className="space-y-3">
                  {section.items.map((rule, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${iconColors[section.color]}`} />
                      <span className="text-gray-300">{rule}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Punishment Ladder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Punishment Ladder</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {punishments.map((item, i) => {
              const severityColors = {
                low: "border-green-500/30 bg-green-500/5",
                medium: "border-yellow-500/30 bg-yellow-500/5",
                high: "border-orange-500/30 bg-orange-500/5",
                critical: "border-red-500/30 bg-red-500/5"
              };
              const textColors = {
                low: "text-green-400",
                medium: "text-yellow-400",
                high: "text-orange-400",
                critical: "text-red-400"
              };
              
              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-xl border ${severityColors[item.severity]} text-center`}
                >
                  <p className={`text-sm font-medium ${textColors[item.severity]} mb-1`}>
                    {item.offense}
                  </p>
                  <p className="text-white font-semibold">{item.punishment}</p>
                </div>
              );
            })}
          </div>
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            * Severe offenses such as hacking, doxxing, or exploiting may result in immediate permanent bans.
          </p>
        </GlassCard>
      </motion.div>

      {/* Prohibited Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard className="p-6 border-red-500/20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <XCircle className="w-6 h-6 text-red-400" />
            Zero Tolerance Policy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Hacking, cheating, or exploiting",
              "Doxxing or sharing personal information",
              "Sexual harassment or ERP",
              "Racism, sexism, or discrimination",
              "Real-world threats or violence",
              "Impersonating staff members"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}