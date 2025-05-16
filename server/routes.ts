import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertSubscriptionSchema, insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // Get featured books
  app.get("/api/books/featured", async (req, res) => {
    try {
      const featuredBooks = await storage.getFeaturedBooks();
      res.json(featuredBooks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured books" });
    }
  });

  // Get new releases
  app.get("/api/books/new-releases", async (req, res) => {
    try {
      const category = req.query.category as string;
      const newReleases = await storage.getNewReleases(category);
      res.json(newReleases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new releases" });
    }
  });

  // Get book by ID
  app.get("/api/books/:id", async (req, res) => {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const book = await storage.getBook(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch book details" });
    }
  });
  
  // Get book categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  
  // Add email subscription
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const parsedData = insertSubscriptionSchema.parse(req.body);
      const subscription = await storage.addSubscription(parsedData);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create subscription" });
      }
    }
  });
  
  // Send contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const parsedData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.addContactMessage(parsedData);
      res.status(201).json(contactMessage);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  // Create payment intent for checkout
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, bookId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // If bookId is provided, fetch the book details
      let metadata = {};
      if (bookId) {
        const book = await storage.getBook(parseInt(bookId));
        if (book) {
          metadata = {
            bookId: book.id.toString(),
            bookTitle: book.title,
            bookAuthor: book.author
          };
        }
      }
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert dollars to cents
        currency: "usd",
        metadata
      });
      
      // Return the client secret to the client
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount: amount
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Failed to create payment intent",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Endpoint to get payment status (for confirmation pages)
  app.get("/api/payment-status/:paymentIntentId", async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.json({
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert cents to dollars
        metadata: paymentIntent.metadata
      });
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      res.status(500).json({ 
        message: "Failed to retrieve payment status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
