import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLeadStore } from '@/lib/lead-store';
import { Rocket, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Sanitize input to prevent XSS attacks
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/[&]/g, '&amp;') // Escape ampersand
    .replace(/['"]/g, '') // Remove quotes
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .trim();
};

// Validate name format
const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-'.]{1,50}$/; // Only letters, spaces, hyphens, apostrophes, periods
  return nameRegex.test(name) && name.length >= 1 && name.length <= 50;
};

export const LeadCaptureForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setSubmitted } = useLeadStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.trim();
    const sanitizedIndustry = sanitizeInput(industry);
    
    // Validate inputs
    if (!sanitizedName || !sanitizedEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in both name and email.",
        variant: "destructive",
      });
      return;
    }

    if (!validateName(sanitizedName)) {
      toast({
        title: "Invalid name",
        description: "Name can only contain letters, spaces, hyphens, apostrophes, and periods (1-50 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save lead to database
      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: sanitizedName,
          email: sanitizedEmail,
          industry: sanitizedIndustry || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-confirmation', {
        body: {
          name: sanitizedName,
          email: sanitizedEmail,
          industry: sanitizedIndustry || 'General',
        },
      });

      if (emailError) {
        console.warn('Email sending failed:', emailError);
        // Don't throw error here - lead was saved successfully
      }

      setSubmitted(true);
      
      toast({
        title: "Welcome aboard! 🎉",
        description: "Thanks for joining! Check your email for confirmation.",
      });
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-card p-8 rounded-2xl shadow-card border border-border backdrop-blur-sm animate-slide-up">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow animate-glow">
              <Rocket className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Join the Revolution</h2>
            <p className="text-muted-foreground">Be the first to experience the future of innovation</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50 border-border focus:border-primary transition-smooth"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border focus:border-primary transition-smooth"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-foreground">Industry (Optional)</Label>
              <Input
                id="industry"
                type="text"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-background/50 border-border focus:border-primary transition-smooth"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                  Joining...
                </div>
              ) : (
                <div className="flex items-center">
                  Get Early Access
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                </div>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Join thousands of innovators already on board</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
        </div>
      </form>
    </div>
  );
};