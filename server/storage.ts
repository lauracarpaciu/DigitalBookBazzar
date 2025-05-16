import { 
    users, books, categories, testimonials, contactMessages, subscriptions,
    type User, type InsertUser,
    type Book, type InsertBook,
    type Category, type InsertCategory,
    type Testimonial, type InsertTestimonial,
    type ContactMessage, type InsertContactMessage,
    type Subscription, type InsertSubscription 
  } from "@shared/schema";
  import { db } from "./db";
  import { eq, like, or, and, desc } from "drizzle-orm";
  
  // Define the interface for all storage operations
  export interface IStorage {
    // User operations
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    
    // Book operations
    getBook(id: number): Promise<Book | undefined>;
    getFeaturedBooks(): Promise<Book[]>;
    getNewReleases(category?: string): Promise<Book[]>;
    getBestsellers(): Promise<Book[]>;
    searchBooks(query: string): Promise<Book[]>;
    
    // Category operations
    getCategories(): Promise<Category[]>;
    getCategory(id: number): Promise<Category | undefined>;
    
    // Testimonial operations
    getTestimonials(): Promise<Testimonial[]>;
    
    // Contact message operations
    addContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
    
    // Subscription operations
    addSubscription(subscription: InsertSubscription): Promise<Subscription>;
  }
  
  // Database storage implementation
  export class DatabaseStorage implements IStorage {
    // User operations
    async getUser(id: number): Promise<User | undefined> {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    }
    
    async getUserByUsername(username: string): Promise<User | undefined> {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    }
    
    async createUser(insertUser: InsertUser): Promise<User> {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    }
    
    // Book operations
    async getBook(id: number): Promise<Book | undefined> {
      const [book] = await db.select().from(books).where(eq(books.id, id));
      return book;
    }
    
    async getFeaturedBooks(): Promise<Book[]> {
      return await db
        .select()
        .from(books)
        .where(eq(books.isFeatured, true));
    }
    
    async getNewReleases(category?: string): Promise<Book[]> {
      if (category && category !== "All Categories") {
        return await db
          .select()
          .from(books)
          .where(
            and(
              eq(books.isNewRelease, true),
              eq(books.category, category)
            )
          );
      }
      
      return await db
        .select()
        .from(books)
        .where(eq(books.isNewRelease, true));
    }
    
    async getBestsellers(): Promise<Book[]> {
      return await db
        .select()
        .from(books)
        .where(eq(books.isBestseller, true));
    }
    
    async searchBooks(query: string): Promise<Book[]> {
      const searchPattern = `%${query}%`;
      return await db
        .select()
        .from(books)
        .where(
          or(
            like(books.title, searchPattern),
            like(books.author, searchPattern),
            like(books.description, searchPattern)
          )
        );
    }
    
    // Category operations
    async getCategories(): Promise<Category[]> {
      return await db
        .select()
        .from(categories);
    }
    
    async getCategory(id: number): Promise<Category | undefined> {
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));
      return category;
    }
    
    // Testimonial operations
    async getTestimonials(): Promise<Testimonial[]> {
      return await db
        .select()
        .from(testimonials);
    }
    
    // Contact message operations
    async addContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
      const [message] = await db
        .insert(contactMessages)
        .values(insertMessage)
        .returning();
      return message;
    }
    
    // Subscription operations
    async addSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
      // Check if email already exists
      const [existingSubscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.email, insertSubscription.email));
      
      if (existingSubscription) {
        throw new Error("This email is already subscribed");
      }
      
      const [subscription] = await db
        .insert(subscriptions)
        .values(insertSubscription)
        .returning();
      return subscription;
    }
  
    // Migration utility for one-time initial data population
    async seedInitialData() {
      try {
        // Add categories if they don't exist
        const existingCategories = await db.select().from(categories);
        
        if (existingCategories.length === 0) {
          const categoryData: InsertCategory[] = [
            { name: "Science Fiction", icon: "rocket", bookCount: 142 },
            { name: "Romance", icon: "heart", bookCount: 286 },
            { name: "Mystery", icon: "magnifying-glass", bookCount: 189 },
            { name: "Business", icon: "briefcase", bookCount: 127 },
            { name: "Self-Help", icon: "brain", bookCount: 173 },
            { name: "History", icon: "landmark", bookCount: 98 }
          ];
          
          await db.insert(categories).values(categoryData);
        }
        
        // Add testimonials if they don't exist
        const existingTestimonials = await db.select().from(testimonials);
        
        if (existingTestimonials.length === 0) {
          const testimonialData: InsertTestimonial[] = [
            { 
              name: "Jennifer Smith", 
              role: "Avid Reader", 
              image: "https://randomuser.me/api/portraits/women/17.jpg",
              content: "I've been using BookHub for the past year and it has completely transformed my reading experience. The recommendations are spot-on and I love the preview feature!"
            },
            { 
              name: "Michael Johnson", 
              role: "Book Blogger", 
              image: "https://randomuser.me/api/portraits/men/32.jpg",
              content: "As someone who reads and reviews books professionally, I can say that BookHub offers one of the best digital reading experiences out there. Their selection is outstanding."
            },
            { 
              name: "Sarah Williams", 
              role: "Entrepreneur", 
              image: "https://randomuser.me/api/portraits/women/37.jpg",
              content: "The business section on BookHub has been invaluable for my professional growth. I've discovered some amazing titles that have helped me scale my startup."
            }
          ];
          
          await db.insert(testimonials).values(testimonialData);
        }
        
        // Add books if they don't exist
        const existingBooks = await db.select().from(books);
        
        if (existingBooks.length === 0) {
          // Just add a few sample books for now
          const bookData: InsertBook[] = [
            {
              title: "The Future Is Now",
              author: "Alexandra Chen",
              description: "A thought-provoking journey into the near future where technology has transformed every aspect of human life.",
              coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200",
              price: 12.99,
              originalPrice: 15.99,
              publisher: "Horizon Press",
              publicationDate: "June 15, 2023",
              pages: 348,
              language: "English",
              category: "Science Fiction",
              rating: 4.5,
              reviewCount: 128,
              isBestseller: true,
              isNewRelease: false,
              isFeatured: true,
              sampleText: "Chapter 1: The Beginning\n\nThe alarm clock buzzed incessantly, pulling Sarah from a dream she couldn't quite remember."
            },
            {
              title: "Strategic Growth",
              author: "Michael J. Roberts",
              description: "A comprehensive guide to scaling businesses and achieving sustainable growth in competitive markets.",
              coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200",
              price: 15.99,
              originalPrice: null,
              publisher: "Business Elite Publishing",
              publicationDate: "March 22, 2023",
              pages: 412,
              language: "English",
              category: "Business",
              rating: 5.0,
              reviewCount: 247,
              isBestseller: true,
              isNewRelease: false,
              isFeatured: true,
              sampleText: "Chapter 1: Rethinking Growth\n\nMost businesses fail not because they lack good products or talented people, but because they don't understand what true growth means."
            },
            {
              title: "Mindful Living",
              author: "Sarah Johnson",
              description: "A practical guide to incorporating mindfulness into everyday activities for reduced stress and enhanced well-being.",
              coverImage: "https://images.unsplash.com/photo-1544716278-e513176f20b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200",
              price: 10.99,
              originalPrice: 13.99,
              publisher: "Serenity Books",
              publicationDate: "January 5, 2023",
              pages: 256,
              language: "English",
              category: "Self-Help",
              rating: 4.0,
              reviewCount: 189,
              isBestseller: false,
              isNewRelease: true,
              isFeatured: true,
              sampleText: "Chapter 1: The Present Moment\n\nTake a deep breath. Feel the air filling your lungs. Notice the sensation as it enters through your nostrils."
            }
          ];
          
          await db.insert(books).values(bookData);
        }
        
        console.log("Database seeded successfully");
      } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
      }
    }
  }
  
  // Export a single instance of the storage implementation
  export const storage = new DatabaseStorage();