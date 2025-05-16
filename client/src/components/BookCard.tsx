import { useLocation } from "wouter";
import { BookPreview } from "@/types";
import { formatCurrency, generateStarRating } from "@/lib/utils";
import { useBookPreview } from "./preview/BookPreviewModal";
import { Eye, Share2, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface BookCardProps {
  book: BookPreview;
  isFeatured?: boolean;
  isNewRelease?: boolean;
}

export function BookCard({ book, isFeatured, isNewRelease }: BookCardProps) {
  const [, navigate] = useLocation();
  const { setPreviewBook, openPreview } = useBookPreview();
  const { toast } = useToast();
  
  const stars = generateStarRating(book.rating);
  
  const handleViewDetails = () => {
    navigate(`/book/${book.id}`);
  };
  
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewBook(book.id);
    openPreview();
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      navigator
        .share({
          title: book.title,
          text: `Check out ${book.title} by ${book.author} on BookHub`,
          url: window.location.origin + `/book/${book.id}`,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(
        window.location.origin + `/book/${book.id}`
      );
      toast({
        title: "Link copied!",
        description: "Book link copied to clipboard.",
      });
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Added to cart!",
      description: `${book.title} has been added to your cart.`,
    });
  };
  
  return (
    <div 
      className="book-card group"
      onClick={handleViewDetails}
    >
      {isFeatured ? (
        <div className="flex-shrink-0 w-64">
          <div className="relative aspect-[2/3] mb-4 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow cursor-pointer">
            <img 
              src={book.coverImage} 
              alt={`${book.title} - Book Cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <div className="flex space-x-2">
                <Button 
                  size="icon"
                  variant="secondary"
                  className="bg-white text-foreground rounded-full"
                  onClick={handlePreview}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="secondary" 
                  className="bg-white text-foreground rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="secondary"
                  className="bg-secondary text-white rounded-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-primary transition-colors">{book.title}</h3>
          <p className="text-muted-foreground text-sm mb-2">By {book.author}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex text-accent">
                {stars.map((type, i) => (
                  <span key={i}>
                    {type === "full" && <i className="fa-solid fa-star"></i>}
                    {type === "half" && <i className="fa-solid fa-star-half-stroke"></i>}
                    {type === "empty" && <i className="fa-regular fa-star"></i>}
                  </span>
                ))}
              </div>
              <span className="ml-1 text-xs text-muted-foreground">({book.reviewCount})</span>
            </div>
            <span className="font-bold">{formatCurrency(book.price)}</span>
          </div>
        </div>
      ) : (
        <div className="book-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
          <div className="relative aspect-[2/3] mb-4">
            <img 
              src={book.coverImage} 
              alt={`${book.title} - Book Cover`} 
              className="w-full h-full object-cover"
            />
            {isNewRelease && (
              <div className="absolute top-0 left-0 bg-accent text-dark text-xs font-bold px-3 py-1 rounded-br-lg">NEW</div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-serif font-bold text-lg mb-1">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2">By {book.author}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold">{formatCurrency(book.price)}</span>
              <Button
                size="sm" 
                className="bg-primary hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
