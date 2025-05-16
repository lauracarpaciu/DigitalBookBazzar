import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useLocation } from 'wouter';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// CheckoutForm component - handles the Stripe Elements
function CheckoutForm({ 
  amount,
  bookTitle
}: { 
  amount: number,
  bookTitle: string
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    
    if (submitError) {
      setIsLoading(false);
      toast({
        title: "Payment error",
        description: submitError.message || "An error occurred",
        variant: "destructive"
      });
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      toast({
        title: "Payment failed",
        description: error.message || "Something went wrong with your payment",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Payment error",
        description: "An unexpected error occurred during payment",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md bg-muted p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="flex justify-between mb-1">
          <span>{bookTitle}</span>
          <span>{formatCurrency(amount)}</span>
        </div>
        <div className="border-t border-border mt-2 pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(amount)}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <PaymentElement id="payment-element" />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-blue-600 text-white" 
        disabled={isLoading || !stripe || !elements}
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </div>
        ) : (
          `Complete Purchase • ${formatCurrency(amount)}`
        )}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        Your payment is secured by Stripe. We do not store your card details.
      </div>
    </form>
  );
}

// Main checkout page component
export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [bookDetails, setBookDetails] = useState<{
    id: number;
    title: string;
    price: number;
  } | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get the book ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('bookId');
  
  useEffect(() => {
    // Fetch book details if bookId is provided
    const fetchBookDetails = async () => {
      if (!bookId) {
        toast({
          title: "Error",
          description: "No book selected for checkout",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
      
      try {
        const response = await fetch(`/api/books/${bookId}`);
        if (!response.ok) {
          throw new Error("Book not found");
        }
        
        const book = await response.json();
        setBookDetails({
          id: book.id,
          title: book.title,
          price: book.price
        });
        
        // Create a payment intent
        const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
          amount: book.price,
          bookId: book.id
        });
        
        const paymentData = await paymentResponse.json();
        setClientSecret(paymentData.clientSecret);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load checkout",
          variant: "destructive"
        });
        navigate("/");
      }
    };
    
    fetchBookDetails();
  }, [bookId, navigate, toast]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-10">
        <div className="container max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold mb-8">Secure Checkout</h1>
          
          {clientSecret && bookDetails ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Elements stripe={stripePromise} options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#3b82f6', // primary blue color
                    colorBackground: '#ffffff',
                    colorText: '#1f2937',
                    borderRadius: '4px'
                  }
                }
              }}>
                <CheckoutForm 
                  amount={bookDetails.price} 
                  bookTitle={bookDetails.title} 
                />
              </Elements>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}