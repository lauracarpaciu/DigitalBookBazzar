import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUBSCRIPTION_MESSAGE } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSubscriptionSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const subscriptionSchema = insertSubscriptionSchema.extend({
  email: z.string().email("Please enter a valid email address"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

export function SubscriptionSection() {
  const { toast } = useToast();
  
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const subscription = useMutation({
    mutationFn: async (values: SubscriptionFormValues) => {
      const res = await apiRequest('POST', '/api/subscriptions', values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription successful!",
        description: "You've been added to our newsletter.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: SubscriptionFormValues) => {
    subscription.mutate(values);
  };

  return (
    <section id="subscription" className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {SUBSCRIPTION_MESSAGE.heading}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {SUBSCRIPTION_MESSAGE.description}
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Your email address" 
                          className="px-4 py-3 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-left text-white/90" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit"
                  className="bg-accent hover:bg-yellow-600 text-dark font-medium px-6 py-3 rounded-lg transition-colors"
                  disabled={subscription.isPending}
                >
                  {subscription.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <p className="text-xs mt-4 opacity-80">{SUBSCRIPTION_MESSAGE.privacy}</p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
