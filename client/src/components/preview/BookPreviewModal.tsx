import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookDetail } from "@/types";
import { createContext, useContext, useState, ReactNode } from "react";
import { formatCurrency, generateStarRating } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Heart, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookPreviewContextType {
  isOpen: boolean;
  openPreview: () => void;
  closePreview: () => void;
  previewBookId: number | null;
  setPreviewBook: (id: number) => void;
}

const BookPreviewContext = createContext<BookPreviewContextType>({
  isOpen: false,
  openPreview: () => {},
  closePreview: () => {},
  previewBookId: null,
  setPreviewBook: () => {},
});

export function useBookPreview() {
  return useContext(BookPreviewContext);
}

export function BookPreviewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewBookId, setPreviewBookId] = useState<number | null>(null);
  
  const openPreview = () => setIsOpen(true);
  const closePreview = () => setIsOpen(false);
  const setPreviewBook = (id: number) => setPreviewBookId(id);
  
  return (
    <BookPreviewContext.Provider value={{ 
      isOpen, 
      openPreview, 
      closePreview, 
      previewBookId, 
      setPreviewBook 
    }}>
      {children}
      <BookPreviewModal />
    </BookPreviewContext.Provider>
  );
}

function BookPreviewModal() {
  const { isOpen, closePreview, previewBookId } = useBookPreview();
  const { toast } = useToast();

  // Fetch book details when previewBookId is available
  const { data: book, isLoading } = useQuery<BookDetail>({
    queryKey: ['/api/books', previewBookId],
    enabled: !!previewBookId && isOpen,
  });
  
  const handleWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "The book has been added to your wishlist.",
    });
  };
  
  const handleShare = () => {
    if (book && navigator.share) {
      navigator
        .share({
          title: book.title,
          text: `Check out ${book.title} by ${book.author} on BookHub`,
          url: window.location.origin + `/book/${book.id}`,
        })
        .catch((error) => console.log("Error sharing", error));
    } else if (book) {
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

  if (!book && !isLoading) return null;
  
  const stars = book ? generateStarRating(book.rating) : [];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePreview()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="font-serif font-bold text-2xl">
              {isLoading ? "Loading..." : book?.title}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closePreview}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogHeader>
        
        {isLoading ? (
          <div className="p-6 flex justify-center items-center h-64">
            <p>Loading book details...</p>
          </div>
        ) : book ? (
          <>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={book.coverImage} 
                      alt={`${book.title} - Book Cover`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="font-serif font-bold text-xl mb-1">{book.title}</h4>
                  <p className="text-gray-600 mb-3">By {book.author}</p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex text-accent mr-2">
                      {stars.map((type, i) => (
                        <span key={i}>
                          {type === "full" && <i className="fa-solid fa-star"></i>}
                          {type === "half" && <i className="fa-solid fa-star-half-stroke"></i>}
                          {type === "empty" && <i className="fa-regular fa-star"></i>}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({book.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="mb-6">
                    <h5 className="font-medium mb-2">About this book:</h5>
                    <p className="text-gray-700">{book.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-500">Publisher</span>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-500">Publication Date</span>
                      <p className="font-medium">{book.publicationDate}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-500">Pages</span>
                      <p className="font-medium">{book.pages}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-500">Language</span>
                      <p className="font-medium">{book.language}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">{formatCurrency(book.price)}</span>
                      {book.originalPrice && (
                        <span className="text-sm line-through text-gray-500">
                          {formatCurrency(book.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button className="bg-secondary hover:bg-green-600 text-white">
                      Add to Cart
                    </Button>
                    <Button className="bg-primary hover:bg-blue-600 text-white">
                      Read Sample
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-serif font-bold text-xl mb-4">Sample Chapter</h4>
                <div className="prose max-w-none">
                  {book.sampleText.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  <p className="text-center italic">[End of Sample]</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="bg-gray-50 p-6 flex justify-between items-center border-t">
              <div className="flex items-center">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-700 mr-4" onClick={handleWishlist}>
                  <Heart className="h-4 w-4 mr-2" />
                  <span>Add to Wishlist</span>
                </Button>
                <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Share</span>
                </Button>
              </div>
              <Button 
                variant="outline"
                onClick={closePreview}
              >
                Close Preview
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
