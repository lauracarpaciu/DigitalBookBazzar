import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookDetail } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { formatCurrency, generateStarRating } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useBookPreview } from "@/components/preview/BookPreviewModal";
import { Heart, Share2 } from "lucide-react";

export default function BookDetails() {
  const [match, params] = useRoute<{ id: string }>("/book/:id");
  const [, navigate] = useLocation();
  const bookId = match ? parseInt(params.id) : null;
  const { toast } = useToast();
  const { setPreviewBook, openPreview } = useBookPreview();
  
  const { data: book, isLoading, error } = useQuery<BookDetail>({
    queryKey: [`/api/books/${bookId}`],
    enabled: bookId !== null,
  });
  
  useEffect(() => {
    if (book) {
      document.title = `${book.title} by ${book.author} | BookHub`;
      
      // Set meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', book.description.substring(0, 160) + '...');
      
      // Set Open Graph meta tags
      const ogTags = [
        { property: 'og:title', content: `${book.title} by ${book.author} | BookHub` },
        { property: 'og:description', content: book.description.substring(0, 160) + '...' },
        { property: 'og:type', content: 'book' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:image', content: book.coverImage },
      ];
      
      ogTags.forEach(tag => {
        let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', tag.property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', tag.content);
      });
    }
  }, [book]);
  
  const handlePreview = () => {
    if (bookId) {
      setPreviewBook(bookId);
      openPreview();
    }
  };
  
  const handleShare = () => {
    if (book && navigator.share) {
      navigator
        .share({
          title: book.title,
          text: `Check out ${book.title} by ${book.author} on BookHub`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Book link copied to clipboard.",
      });
    }
  };
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: book ? `${book.title} has been added to your cart.` : "Book added to cart",
    });
  };
  
  const handleBuyNow = () => {
    if (book) {
      navigate(`/checkout?bookId=${book.id}`);
    }
  };
  
  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: book ? `${book.title} has been added to your wishlist.` : "Book added to wishlist",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-8 w-1/3"></div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="bg-gray-200 rounded-lg aspect-[2/3]"></div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-32 bg-gray-200 rounded w-full"></div>
                  <div className="flex space-x-4">
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Book Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the book you're looking for.</p>
            <Button 
              onClick={() => window.history.back()}
              variant="default"
            >
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const stars = generateStarRating(book.rating);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src={book.coverImage} 
                    alt={`${book.title} - Book Cover`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 flex flex-col space-y-3">
                  <Button 
                    onClick={handlePreview}
                    variant="outline"
                    className="w-full"
                  >
                    Read Sample
                  </Button>
                  <Button 
                    onClick={handleAddToWishlist}
                    variant="outline"
                    className="w-full"
                  >
                    <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h1 className="font-serif text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl mb-4">By {book.author}</p>
              
              <div className="flex items-center mb-6">
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
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold mr-3">{formatCurrency(book.price)}</span>
                  {book.originalPrice && (
                    <span className="text-xl line-through text-gray-500">
                      {formatCurrency(book.originalPrice)}
                    </span>
                  )}
                  {book.originalPrice && (
                    <span className="ml-3 bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                      Save {Math.round((1 - book.price / book.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row gap-3">
                  <Button 
                    onClick={handleBuyNow}
                    className="w-full md:w-auto bg-primary hover:bg-blue-600 text-white"
                    size="lg"
                  >
                    Buy Now
                  </Button>
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full md:w-auto bg-secondary hover:bg-green-600 text-white"
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-bold mb-4">About this Book</h2>
                <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded">
                  <span className="text-sm text-gray-500">Publisher</span>
                  <p className="font-medium">{book.publisher}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <span className="text-sm text-gray-500">Publication Date</span>
                  <p className="font-medium">{book.publicationDate}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <span className="text-sm text-gray-500">Pages</span>
                  <p className="font-medium">{book.pages}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <span className="text-sm text-gray-500">Language</span>
                  <p className="font-medium">{book.language}</p>
                </div>
              </div>
              
              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Sample Chapter</h2>
                <div className="prose max-w-none border p-6 rounded-lg bg-gray-50">
                  {book.sampleText.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  <p className="text-center italic">[End of Sample]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
