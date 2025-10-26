import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary mb-6 text-balance">
          Turn Your Facebook Shop Into a{' '}
          <span className="text-accent">Professional Website</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          Get a beautiful website to showcase your products professionally. Built specifically for Bangladesh businesses.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-8 h-12 text-base shadow-sm"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-border hover:bg-secondary h-12 px-8 text-base"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Demo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          No credit card required • 14-day free trial • Setup in 5 minutes
        </p>
      </div>
    </section>
  );
};
