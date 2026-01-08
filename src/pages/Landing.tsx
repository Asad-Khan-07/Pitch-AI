import { Link } from "react-router-dom";
import { Sparkles, MessageSquare, Image, History, Zap, Target, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent to-background">
      {/* <Navbar /> */}
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent border border-accent-foreground/10 animate-fade-in">
            <span className="text-sm font-medium text-accent-foreground">
              AI-Powered Pitch Creation
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Create Winning Pitches
            <br />
            in Minutes
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Transform your business ideas into compelling presentations with AI. 
            Generate professional pitch decks, visuals, and content that captivate investors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link to="/signup">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:opacity-90 transition-opacity text-lg font-medium flex items-center gap-2">
                Start Creating Free
                <Sparkles className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/chat">
              <button className="px-8 py-3 rounded-lg border-2 border-border text-foreground hover:bg-accent transition-colors text-lg font-medium">
                Try Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need to Pitch Better
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Chat Assistant</h3>
              <p className="text-muted-foreground">
                Collaborate with AI to refine your pitch content, structure, and messaging in real-time.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual Generator</h3>
              <p className="text-muted-foreground">
                Create stunning visuals, charts, and graphics that make your pitch stand out instantly.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-foreground to-accent-foreground/80 flex items-center justify-center mb-4">
                <History className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pitch History</h3>
              <p className="text-muted-foreground">
                Access and refine all your previous pitches. Track iterations and improvements over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose PitchAI?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Create complete pitch decks in minutes, not days
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Investor-Ready</h3>
              <p className="text-muted-foreground text-sm">
                Professional quality that impresses every time
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-foreground to-accent-foreground/80 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-background" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Better Results</h3>
              <p className="text-muted-foreground text-sm">
                Data-driven insights for maximum impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="p-12 rounded-lg border border-border bg-gradient-to-br from-primary/10 via-secondary/10 to-accent">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your Perfect Pitch?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs and businesses who are closing deals faster with AI-powered pitches.
            </p>
            <Link to="/signup">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-opacity text-lg font-medium inline-flex items-center gap-2">
                Get Started Now
                <Sparkles className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 PitchAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
