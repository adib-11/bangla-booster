import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-accent rounded-2xl p-12 md:p-16 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          
          <p className="text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of Bangladesh businesses already using ShopBot to grow their sales and serve customers better.
          </p>

          <Link to="/auth">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-10 text-lg font-medium shadow-xl"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="text-sm text-accent-foreground/70 mt-6">
            14-day free trial • No credit card required • Setup in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
};
