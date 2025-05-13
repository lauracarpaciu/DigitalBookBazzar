import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { BookPreview } from "@/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

export function NewReleasesSection() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  const { data: books, isLoading } = useQuery<BookPreview[]>({
    queryKey: ['/api/books/new-releases', selectedCategory],
  });
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <section id="bestsellers" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">New Releases</h2>
            <p className="text-gray-600">Fresh titles just added to our collection</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Self-Help">Self-Help</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[2/3] rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books?.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                isNewRelease={true} 
              />
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Button
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-primary border border-primary px-6 py-3 rounded-lg font-medium inline-flex items-center transition-colors"
          >
            View All New Releases
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
