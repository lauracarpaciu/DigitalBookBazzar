import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedBooksSection } from "@/components/sections/FeaturedBooksSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { NewReleasesSection } from "@/components/sections/NewReleasesSection";
import { SubscriptionSection } from "@/components/sections/SubscriptionSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  // Set page title and metadata
  useEffect(() => {
    document.title = "BookHub | Digital Books Marketplace";
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Discover and purchase premium digital books from top authors worldwide. Get instant access to bestsellers, new releases, and exclusive content.');
    
    // Set Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: 'BookHub | Digital Books Marketplace' },
      { property: 'og:description', content: 'Discover and purchase premium digital books from top authors worldwide. Get instant access to bestsellers, new releases, and exclusive content.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3' },
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
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturedBooksSection />
        <CategoriesSection />
        <NewReleasesSection />
        <SubscriptionSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}
