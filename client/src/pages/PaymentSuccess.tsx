import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Home, Book, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState<{
    status: string;
    amount: number;
    metadata: {
      bookId: string;
      bookTitle: string;
      bookAuthor: string;
    }
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'Payment Successful | BookHub';
    
    // Extract the payment_intent and payment_intent_client_secret from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    
    if (!paymentIntentId) {
      toast({
        title: "Error",
        description: "No payment information found",
        variant: "destructive"
      });
      navigate("/");
      return;
    }
    
    // Fetch payment details
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`/api/payment-status/${paymentIntentId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }
        
        const data = await response.json();
        
        if (data.status !== 'succeeded') {
          toast({
            title: "Payment not completed",
            description: "Your payment has not been completed successfully",
            variant: "destructive"
          });
          navigate("/");
          return;
        }
        
        setPaymentDetails(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive"
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentDetails();
  }, [navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-10">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6 inline-block">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-serif font-bold mb-3">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your transaction has been completed successfully.
          </p>
          
          {paymentDetails && (
            <div className="bg-muted p-6 rounded-lg mb-8 text-left max-w-md mx-auto">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-medium">{paymentDetails.metadata.bookTitle}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Author:</span>
                  <span className="font-medium">{paymentDetails.metadata.bookAuthor}</span>
                </div>
                
                <div className="flex justify-between border-t border-border pt-3 mt-3">
                  <span>Total Amount:</span>
                  <span className="font-bold">{formatCurrency(paymentDetails.amount)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
            
            {paymentDetails && (
              <Button 
                onClick={() => navigate(`/book/${paymentDetails.metadata.bookId}`)}
                className="gap-2"
              >
                <Book className="h-4 w-4" />
                View Book Details
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}