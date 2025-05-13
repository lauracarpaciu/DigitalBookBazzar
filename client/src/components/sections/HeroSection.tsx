import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { scrollToElement } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Your Next Great Read is Just a Click Away
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Discover thousands of digital books from bestselling authors and emerging voices. Read anywhere, anytime.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-secondary hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium text-center transition-colors"
                onClick={() => scrollToElement("featured")}
              >
                Explore Books
              </Button>
              <Button
                variant="outline" 
                className="bg-white hover:bg-gray-100 text-dark py-3 px-6 rounded-lg font-medium text-center transition-colors"
                onClick={() => scrollToElement("subscription")}
              >
                Get Updates
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&h=768" 
              alt="Digital books on tablet" 
              className="rounded-xl shadow-2xl transform md:translate-y-8 md:scale-110"
            />
            <div className="absolute -bottom-4 -right-4 bg-accent text-dark py-2 px-4 rounded-lg font-serif font-bold shadow-lg">
              New Releases Weekly!
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
