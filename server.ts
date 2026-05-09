import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  console.log("Starting server with NODE_ENV:", process.env.NODE_ENV);

  // Health check
  app.get("/api/ping", (req, res) => {
    res.json({ pong: true, env: process.env.NODE_ENV });
  });

  // 1. Technical Security: Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: [
  "'self'",
  "data:",
  "https://images.unsplash.com",
  "https://res.cloudinary.com",
  "https://www.sanity.io",
  "https://cdn.sanity.io",
  "https://*.supabase.co",
],
        connectSrc: [
  "'self'",
  "https://*.supabase.co",
  "wss://*.supabase.co",
  "https://api.upstash.com",
  "ws://localhost:*",
  "http://localhost:*",
],
        frameAncestors: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: { policy: "credentialless" },
      crossOriginOpenerPolicy: { policy: "same-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      frameguard: false, // Disable X-Frame-Options: DENY for preview
      hidePoweredBy: true,
      noSniff: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  // 2. Technical Security: CSRF Protection
  const {
    invalidCsrfTokenError,
    generateCsrfToken,
    doubleCsrfProtection,
  } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "default_secret_for_dev_only_32_chars",
    getSessionIdentifier: (req) => req.ip || "anonymous", // Simple IP-based identifier for stateless setup
    cookieName: "x-csrf-token",
    cookieOptions: {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    },
  });

  // CSRF token endpoint
  app.get("/api/csrf-token", (req, res) => {
    res.json({ token: generateCsrfToken(req, res) });
  });

  // 3. Technical Security: Rate Limiting (Upstash)
  let ratelimit: Ratelimit | null = null;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"),
      });
    } catch (e) {
      console.error("Failed to initialize Upstash Ratelimit:", e);
    }
  }

  const rateLimitMiddleware = async (req: any, res: any, next: any) => {
    if (!ratelimit) return next();
    const identifier = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const { success } = await ratelimit.limit(identifier as string);
    if (!success) {
      return res.status(429).json({ error: "Too many requests. Please try again in a minute." });
    }
    next();
  };

  // 4. Server-side Price Validation & WhatsApp Checkout
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.VITE_SUPABASE_ANON_KEY || ""
  );

  app.post("/api/order/whatsapp", rateLimitMiddleware, doubleCsrfProtection, async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid cart items" });
      }

      let total = 0;
      const validatedItems = [];

      for (const item of items) {
        // Re-fetch price from Supabase to prevent tampering
        const { data: product, error } = await supabase
          .from("products")
          .select("price, sale_price, name")
          .eq("id", item.id)
          .single();

        if (error || !product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        const currentPrice = product.sale_price !== null ? product.sale_price : product.price;
        total += currentPrice * item.quantity;
        validatedItems.push({
          name: product.name,
          quantity: item.quantity,
          price: currentPrice
        });
      }

      const orderSummary = validatedItems
        .map(i => `${i.name} x${i.quantity} (${(i.price * i.quantity).toFixed(2)})`)
        .join("\n");
      
      const message = `Hello Zyvelle Souk Concierge,\n\nI would like to place an order for:\n${orderSummary}\n\nTotal: ${total.toFixed(2)}\n\nPlease provide details.`;
      
      const whatsappNumber = process.env.VITE_WHATSAPP_NUMBER || "+971522437123";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      res.json({ whatsappUrl });
    } catch (error) {
      console.error("Order error:", error);
      res.status(500).json({ error: "Failed to process order. Please try again." });
    }
  });

  // 5. Contact & Search
  app.post("/api/contact", rateLimitMiddleware, doubleCsrfProtection, (req, res) => {
    // Sanitisation would happen here before saving to DB or sending email
    res.json({ success: true, message: "Message received" });
  });

  app.get("/api/search", rateLimitMiddleware, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.json({ products: [], categories: [] });
      }

      // 1. Clean query
      const cleanQuery = q.replace(/[^\w\s\u00C0-\u017F]/gi, '').trim();
      if (!cleanQuery) return res.json({ products: [], categories: [] });

      // 2. Search products
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${cleanQuery}%`)
        .eq("is_active", true)
        .limit(5);

      // 3. Search categories
      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .ilike("name", `%${cleanQuery}%`)
        .limit(3);

      res.json({
        products: products || [],
        categories: categories || []
      });
    } catch (error) {
      console.error("Search API error:", error);
      res.status(500).json({ error: "Failed to search" });
    }
  });

  // 6. WhatsApp Webhook Security
  app.post("/api/webhooks/whatsapp", (req, res) => {
    const signature = req.headers["x-hub-signature-256"] as string;
    const secret = process.env.WHATSAPP_WEBHOOK_SECRET;

    if (!secret) {
      console.warn("WHATSAPP_WEBHOOK_SECRET not set, allowing webhook for dev");
      return res.sendStatus(200);
    }

    if (!signature) return res.sendStatus(401);

    const hmac = crypto.createHmac("sha256", secret);
    const body = JSON.stringify(req.body);
    const digest = "sha256=" + hmac.update(body).digest("hex");

    if (signature !== digest) {
      return res.status(401).send("Invalid signature");
    }

    res.sendStatus(200);
  });

  // 7. Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Switch to custom to handle index ourselves
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        if (e instanceof Error) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
