import { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

export function TestimonialCard({ testimonial, isActive }: TestimonialCardProps) {
  return (
    <div className={`testimonial-slide w-full flex-shrink-0 px-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-gray-50 rounded-xl p-8 shadow-sm relative">
        <div className="text-5xl text-primary opacity-20 absolute top-4 left-4">
          <i className="fa-solid fa-quote-left"></i>
        </div>
        <div className="relative z-10">
          <p className="text-lg text-gray-700 mb-6">{testimonial.content}</p>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img 
                src={testimonial.image} 
                alt={`${testimonial.name} profile`} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h4 className="font-serif font-bold">{testimonial.name}</h4>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
