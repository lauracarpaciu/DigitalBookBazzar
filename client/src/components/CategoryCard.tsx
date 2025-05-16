import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <a
      href="#"
      className="category-card bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg hover:bg-primary hover:text-white transition-all duration-300 group"
    >
      <i
        className={cn(
          `fa-solid fa-${category.icon} text-4xl mb-3 text-primary group-hover:text-white transition-colors`
        )}
      ></i>
      <h3 className="font-serif font-bold">{category.name}</h3>
      <p className="text-sm text-gray-500 group-hover:text-gray-200 mt-1">
        {category.count} Books
      </p>
    </a>
  );
}
