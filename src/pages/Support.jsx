import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  MessageCircle, 
  Send, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  BookOpen,
  Users,
  Shield,
  Gamepad2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const faqs = [
  {
    category: "Getting Started",
    icon: Gamepad2,
    questions: [
      {
        q: "How do I connect to the server?",
        a: "Open FiveM, press F8 to open the console, and type 'connect play.real-wrld.com'. Make sure you have an approved application before connecting."
      },
      {
        q: "What are the minimum PC requirements?",
        a: "We recommend at least 16GB RAM, a GTX 1060 or equivalent GPU, and a quad-core CPU. SSD storage is highly recommended for faster loading times."
      },
      {
        q: "How long does the application process take?",
        a: "Applications are typically reviewed within 24-48 hours. Complex applications may take longer. You'll receive a Discord notification when a decision is made."
      }
    ]
  },
  {
    category: "Roleplay Guidelines",
    icon: Users,
    questions: [
      {
        q: "What is 'value of life'?",
        a: "Value of life means your character should fear death and act accordingly. If someone has a gun pointed at you, comply with their demands rather than trying to run or fight back."
      },
      {
        q: "What is metagaming?",
        a: "Metagaming is using out-of-character (OOC) information in-character (IC). For example, if you see someone's name tag in-game, you shouldn't know their name IC unless they introduce themselves."
      },
      {
        q: "Can I have multiple characters?",
        a: "Yes! You can create up to 3 characters per account. Each character must have a unique backstory and cannot share assets or information."
      }
    ]
  },
  {
    category: "Rules & Moderation",
    icon: Shield,
    questions: [
      {
        q: "How do I report a rule breaker?",
        a: "Use the /report command in-game or create a ticket in our Discord server. Include video evidence if possible. Do not call them out in public channels."
      },
      {
        q: "I was banned unfairly, what can I do?",
        a: "Submit a ban appeal through our Discord server in the #ban-appeals channel. Include your account name, reason for ban, and why you believe it was unfair."
      },
      {
        q: "What happens if I break a rule accidentally?",
        a: "Accidents happen! If you realize you've broken a rule, inform the affected players and offer to void the situation. Honest mistakes are treated more leniently."
      }
    ]
  }
];

const supportCategories = [
  { value: "technical", label: "Technical Issue" },
  { value: "report", label: "Report a Player" },
  { value: "appeal", label: "Ban Appeal" },
  { value: "suggestion", label: "Suggestion" },
  { value: "other", label: "Other" }
];

export default function Support() {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Support ticket submitted successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-8 text-center" glow>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Need help? Check out our FAQ below or submit a support ticket. 
            Our team typically responds within 24 hours.
          </p>
        </GlassCard>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <a 
          href="https://discord.gg/GaQf7G4KaP" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <GlassCard className="p-6 text-center h-full">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 text-purple-400" />
            <h3 className="font-semibold text-white mb-1">Discord</h3>
            <p className="text-sm text-gray-400">Join our community</p>
            <ExternalLink className="w-4 h-4 mx-auto mt-2 text-gray-500" />
          </GlassCard>
        </a>
        <a 
          href="#faq"
          className="block"
        >
          <GlassCard className="p-6 text-center h-full">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <h3 className="font-semibold text-white mb-1">FAQ</h3>
            <p className="text-sm text-gray-400">Quick answers</p>
          </GlassCard>
        </a>
        <a 
          href="#contact"
          className="block"
        >
          <GlassCard className="p-6 text-center h-full">
            <Send className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <h3 className="font-semibold text-white mb-1">Contact</h3>
            <p className="text-sm text-gray-400">Submit a ticket</p>
          </GlassCard>
        </a>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        id="faq"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {faqs.map((category, i) => {
            const Icon = category.icon;
            return (
              <GlassCard key={i} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                </div>
                
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, j) => (
                    <AccordionItem 
                      key={j} 
                      value={`${i}-${j}`}
                      className="border-white/10 bg-white/[0.02] rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left text-gray-200 hover:text-white py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400 pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </GlassCard>
            );
          })}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        id="contact"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Submit a Ticket</h2>
        
        {submitted ? (
          <GlassCard className="p-12 text-center" glow>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ticket Submitted!</h3>
            <p className="text-gray-400 mb-6">
              We've received your support request and will respond within 24 hours.
            </p>
            <NeonButton onClick={() => setSubmitted(false)}>
              Submit Another Ticket
            </NeonButton>
          </GlassCard>
        ) : (
          <GlassCard className="p-8" glow>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-300 mb-2 block">Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                    required
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10">
                      {supportCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value} className="text-white">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300 mb-2 block">Message</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe your issue in detail..."
                  required
                  rows={6}
                  className="bg-white/5 border-white/10 text-white resize-none"
                />
              </div>

              <div className="flex justify-end">
                <NeonButton
                  type="submit"
                  disabled={isSubmitting || !formData.subject || !formData.category || !formData.message}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </NeonButton>
              </div>
            </form>
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
}