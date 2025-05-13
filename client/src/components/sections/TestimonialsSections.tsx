import { useState, useEffect } from "react";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  const goToPrevious = () => {
    if (!testimonials) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    if (!testimonials) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToSpecificSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials]);

  if (isLoading) {
    return (
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold mb-2 text-center">What Readers Say</h2>
          <p className="text-gray-600 text-center mb-12">Discover why people love our digital book collection</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-6 w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-5/6 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-full"></div>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-24"></div>
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold mb-2 text-center">What Readers Say</h2>
        <p className="text-gray-600 text-center mb-12">Discover why people love our digital book collection</p>
        
        {testimonials && testimonials.length > 0 && (
          <div className="testimonial-carousel relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  isActive={index === currentIndex}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-gray-300 hover:bg-primary"
                  }`}
                  onClick={() => goToSpecificSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="testimonial-prev absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4 text-gray-500" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="testimonial-next absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4 text-gray-500" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
