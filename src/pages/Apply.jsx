import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Loader2,
  Star,
  ArrowRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, title: "Basic Info", description: "Your details" },
  { id: 2, title: "Experience", description: "RP background" },
  { id: 3, title: "Character", description: "Your story" },
  { id: 4, title: "Review", description: "Submit" }
];

export default function Apply() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    discord_name: "",
    age: "",
    timezone: "",
    rp_experience: "",
    character_backstory: "",
    why_join: "",
    rules_agreement: false
  });
  const [submitted, setSubmitted] = useState(false);

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
    setIsLoading(false);
  };

  // Check if user already has an application
  const { data: existingApp, isLoading: checkingApp } = useQuery({
    queryKey: ['myApplication', user?.email],
    queryFn: () => base44.entities.Application.filter({ created_by: user.email }),
    enabled: !!user?.email
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Application.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['myApplication']);
      setSubmitted(true);
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    createMutation.mutate({
      ...formData,
      age: parseInt(formData.age)
    });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.discord_name && formData.age && formData.timezone;
      case 2:
        return formData.rp_experience;
      case 3:
        return formData.character_backstory && formData.why_join;
      case 4:
        return formData.rules_agreement;
      default:
        return false;
    }
  };

  if (isLoading || checkingApp) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <GlassCard className="p-12 text-center" glow>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Apply to Real-Wrld</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Sign in to submit your application and join our community. 
            The application process takes about 5 minutes.
          </p>
          <NeonButton onClick={() => base44.auth.redirectToLogin()}>
            Sign In to Apply
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  if (existingApp?.length > 0) {
    const app = existingApp[0];
    const statusConfig = {
      pending: { icon: Clock, color: "text-yellow-400", bg: "from-yellow-600/20 to-orange-500/20", border: "border-yellow-500/30" },
      approved: { icon: CheckCircle2, color: "text-green-400", bg: "from-green-600/20 to-emerald-500/20", border: "border-green-500/30" },
      denied: { icon: AlertCircle, color: "text-red-400", bg: "from-red-600/20 to-rose-500/20", border: "border-red-500/30" },
      interview: { icon: Star, color: "text-purple-400", bg: "from-purple-600/20 to-blue-500/20", border: "border-purple-500/30" }
    };
    const status = statusConfig[app.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <div className="max-w-2xl mx-auto">
        <GlassCard className={`p-12 text-center bg-gradient-to-br ${status.bg} ${status.border}`} glow>
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${status.bg} border ${status.border} flex items-center justify-center mx-auto mb-6`}>
            <StatusIcon className={`w-10 h-10 ${status.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Application Status</h1>
          <p className={`text-xl font-semibold ${status.color} mb-4 capitalize`}>{app.status}</p>
          <p className="text-gray-400 max-w-md mx-auto">
            {app.status === 'pending' && "Your application is being reviewed by our team. This usually takes 24-48 hours."}
            {app.status === 'approved' && "Congratulations! Your application has been approved. Welcome to Real-Wrld!"}
            {app.status === 'denied' && "Unfortunately, your application was not approved at this time. You may reapply after 30 days."}
            {app.status === 'interview' && "You've been selected for an interview! Check your Discord for details."}
          </p>
          {app.reviewer_notes && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-400">
                <span className="text-white font-medium">Staff Notes:</span> {app.reviewer_notes}
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-12 text-center" glow>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Thank you for applying to Real-Wrld! Our team will review your application within 24-48 hours. 
              You'll receive a notification on Discord once a decision has been made.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Apply to Real-Wrld
        </h1>
        <p className="text-gray-400">
          Complete the application below to join our community
        </p>
      </motion.div>

      {/* Progress Steps */}
      <GlassCard className="p-6 mb-8" hover={false}>
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${currentStep >= step.id 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-white/5 text-gray-500 border border-white/10'}
                `}>
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <div className="mt-2 text-center hidden md:block">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-full h-0.5 mx-2 md:mx-4 transition-all duration-300 ${
                  currentStep > step.id ? 'bg-gradient-to-r from-purple-600 to-blue-500' : 'bg-white/10'
                }`} style={{ width: '60px' }} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Form Content */}
      <GlassCard className="p-8" glow>
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Discord Username</Label>
                  <Input
                    value={formData.discord_name}
                    onChange={(e) => handleChange('discord_name', e.target.value)}
                    placeholder="Username#1234"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Age</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      placeholder="18+"
                      min="16"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Timezone</Label>
                    <Input
                      value={formData.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                      placeholder="EST, PST, GMT, etc."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  You must be at least 16 years old to apply. We use Discord for all communications.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Roleplay Experience</h2>
              
              <div>
                <Label className="text-gray-300 mb-2 block">Previous RP Experience</Label>
                <Textarea
                  value={formData.rp_experience}
                  onChange={(e) => handleChange('rp_experience', e.target.value)}
                  placeholder="Tell us about your previous roleplay experience. Include any servers you've played on, roles you've had, and what you enjoyed most about roleplay..."
                  rows={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">Minimum 100 characters</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Character */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Your Character & Motivation</h2>
              
              <div>
                <Label className="text-gray-300 mb-2 block">Character Backstory</Label>
                <Textarea
                  value={formData.character_backstory}
                  onChange={(e) => handleChange('character_backstory', e.target.value)}
                  placeholder="Write a brief backstory for your character. Who are they? Where do they come from? What are their goals and motivations?..."
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Why Real-Wrld?</Label>
                <Textarea
                  value={formData.why_join}
                  onChange={(e) => handleChange('why_join', e.target.value)}
                  placeholder="Tell us why you want to join Real-Wrld specifically. What makes you interested in our community?..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Review & Submit</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Discord</p>
                  <p className="text-white font-medium">{formData.discord_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-gray-500 mb-1">Age</p>
                    <p className="text-white font-medium">{formData.age}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-gray-500 mb-1">Timezone</p>
                    <p className="text-white font-medium">{formData.timezone}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Checkbox 
                  id="rules"
                  checked={formData.rules_agreement}
                  onCheckedChange={(checked) => handleChange('rules_agreement', checked)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-blue-500 border-white/20"
                />
                <div>
                  <Label htmlFor="rules" className="text-gray-300 cursor-pointer">
                    I have read and agree to the server rules
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    By checking this box, you confirm that you have read and understand our community guidelines.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <NeonButton
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Back
          </NeonButton>
          
          {currentStep < 4 ? (
            <NeonButton
              onClick={nextStep}
              disabled={!canProceed()}
              className={!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Continue
              <ArrowRight className="inline ml-2 w-4 h-4" />
            </NeonButton>
          ) : (
            <NeonButton
              onClick={handleSubmit}
              disabled={!canProceed() || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="inline mr-2 w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Star className="inline ml-2 w-4 h-4" />
                </>
              )}
            </NeonButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
}