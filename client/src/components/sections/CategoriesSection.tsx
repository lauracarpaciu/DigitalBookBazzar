import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/lib/constants";
import { ChevronRight } from "lucide-react";

export function CategoriesSection() {
  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold mb-2 text-center">Browse by Category</h2>
        <p className="text-gray-600 text-center mb-10">Find your next favorite read by genre</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center text-primary hover:text-blue-700 font-medium">
            View all categories
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
