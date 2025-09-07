import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import cors from "cors";

// Define the enum locally since we can't import it
enum WebsitesStatus {
  GOOD = 'GOOD',
  BAD = 'BAD'
}

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Add error logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Add global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Seeded data - will be used if user has no websites
const SEEDED_WEBSITES = [
  {
    url: "https://google.com",
    name: "Google"
  },
  {
    url: "https://github.com", 
    name: "GitHub"
  },
  {
    url: "https://vercel.com",
    name: "Vercel"
  }
];

// Helper function to create seeded data for new users
async function createSeededData(userId: string) {
  const existingWebsites = await prismaClient.websites.findMany({
    where: { userId, disabled: false }
  });
  
  if (existingWebsites.length === 0) {
    // Create seeded websites
    for (const seedWebsite of SEEDED_WEBSITES) {
      const website = await prismaClient.websites.create({
        data: {
          userId,
          url: seedWebsite.url,
        },
      });
      
      // Create some sample ticks for demo purposes
      const sampleTicks = [
        { status: WebsitesStatus.GOOD, latency: Math.random() * 200 + 50, minutesAgo: 2 },
        { status: WebsitesStatus.GOOD, latency: Math.random() * 200 + 50, minutesAgo: 7 },
        { status: Math.random() > 0.1 ? WebsitesStatus.GOOD : WebsitesStatus.BAD, latency: Math.random() * 300 + 50, minutesAgo: 12 },
        { status: WebsitesStatus.GOOD, latency: Math.random() * 200 + 50, minutesAgo: 17 },
        { status: WebsitesStatus.GOOD, latency: Math.random() * 200 + 50, minutesAgo: 22 },
      ];
      
      // Get or create a default validator
      let validator = await prismaClient.validator.findFirst();
      if (!validator) {
        validator = await prismaClient.validator.create({
          data: {
            publicKey: "default-validator-key",
            location: "US-East",
            ip: "127.0.0.1"
          }
        });
      }
      
      for (const tick of sampleTicks) {
        await prismaClient.websiteTick.create({
          data: {
            websiteId: website.id,
            validatorId: validator.id,
            status: tick.status,
            latency: tick.latency,
            createdAt: new Date(Date.now() - tick.minutesAgo * 60 * 1000)
          }
        });
      }
    }
  }
}

// Helper function to map database data to frontend format
function mapWebsiteData(website: any) {
  return {
    id: website.id,
    url: website.url,
    name: getWebsiteName(website.url),
    ticks: website.ticks
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((tick: any) => ({
        id: tick.id,
        status: tick.status === WebsitesStatus.GOOD ? 200 : 500,
        latency: Math.round(tick.latency),
        createdAt: tick.createdAt.toISOString()
      }))
  };
}

// Helper function to extract website name from URL
function getWebsiteName(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

app.post("/api/v1/website", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const data = await prismaClient.websites.create({
      data: {
        userId,
        url: url.trim(),
      },
    });

    res.json({
      message: "Website added successfully",
      id: data.id,
    });
  } catch (error) {
    console.error("Error adding website:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  try {
    const websiteId = req.query.websiteId as string;
    const userId = req.userId!;

    if (!websiteId) {
      return res.status(400).json({ error: "Website ID is required" });
    }

    const data = await prismaClient.websites.findFirst({
      where: {
        id: websiteId,
        userId,
        disabled: false,
      },
      include: {
        ticks: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 100 // Limit to recent ticks
        },
      },
    });

    if (!data) {
      return res.status(404).json({ error: "Website not found" });
    }

    res.json(mapWebsiteData(data));
  } catch (error) {
    console.error("Error fetching website status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/websites", authMiddleware, async (req, res) => {
  try {
    console.log('Websites endpoint hit by user:', req.userId);
    const userId = req.userId!;
    
    console.log('Creating seeded data for user:', userId);
    // Create seeded data if user has no websites
    await createSeededData(userId);
    
    console.log('Fetching websites from database...');
    const websites = await prismaClient.websites.findMany({
      where: {
        userId,
        disabled: false,
      },
      include: {
        ticks: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 100 // Limit to recent ticks per website
        }
      },
      orderBy: {
        id: 'desc' // Show newest websites first
      }
    });
    
    console.log('Found websites:', websites.length);
    console.log('Mapping website data...');
    const mappedWebsites = websites.map(mapWebsiteData);
    
    console.log('Sending response...');
    res.json({
      websites: mappedWebsites,
    });
  } catch (error: any) {
    console.error("Error fetching websites:", error);
    console.error("Error stack:", error?.stack);
    res.status(500).json({ error: "Internal server error", message: error?.message });
  }
});

app.delete("/api/v1/website/:id", authMiddleware, async (req, res) => {
  try {
    const websiteId = req.params.id;
    const userId = req.userId!;
    
    if (!websiteId) {
      return res.status(400).json({ error: "Website ID is required" });
    }
    
    const website = await prismaClient.websites.findFirst({
      where: {
        id: websiteId,
        userId,
      },
    });
    
    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }
    
    await prismaClient.websites.update({
      where: {
        id: websiteId,
      },
      data: {
        disabled: true,
      },
    });
    
    res.json({
      message: "Website disabled successfully",
    });
  } catch (error) {
    console.error("Error deleting website:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
