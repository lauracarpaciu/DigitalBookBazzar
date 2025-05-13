
import { CONTACT_INFO, FOOTER_LINKS } from "@/lib/constants";
import { Link } from "wouter";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="text-primary h-6 w-6 mr-2" />
              <span className="font-serif font-bold text-xl">BookHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your ultimate destination for digital books. Discover, read, and enjoy literature in a whole new way.
            </p>
            <div className="flex space-x-4">
              {CONTACT_INFO.social.map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`Follow us on ${platform}`}
                >
                  <i className={`fa-brands fa-${platform === 'linkedin' ? 'linkedin-in' : platform}`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BookHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
