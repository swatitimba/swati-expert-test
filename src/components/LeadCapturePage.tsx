import { LeadCaptureForm } from './LeadCaptureForm';
import { SuccessMessage } from './SuccessMessage';
import { useLeadStore } from '@/lib/lead-store';
import { Rocket, Star, Users } from 'lucide-react';
import backgroundAnimation from '@/assets/background-animation.jpg';

export const LeadCapturePage = () => {
  const { submitted } = useLeadStore();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundAnimation}
          alt="Background animation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80"></div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Rocket className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">StartupName</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            The Future of
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Innovation</span>
            <br />
            Starts Here
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of forward-thinking individuals who are shaping tomorrow's technology. 
            Be the first to experience revolutionary solutions that will transform how we work, 
            create, and connect.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">10,000+ Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Launching Soon</span>
            </div>
          </div>
        </div>

        {/* Form or Success Message */}
        {submitted ? <SuccessMessage /> : <LeadCaptureForm />}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 StartupName. Building the future, one innovation at a time.
          </p>
        </div>
      </div>
    </div>
  );
};