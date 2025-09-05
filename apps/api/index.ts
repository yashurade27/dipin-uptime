import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());


app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;

  const data = await prismaClient.websites.create({
    data: {
      userId,
      url,
    },
  });

  res.json({
    message: "Website added successfully",
    id: data.id,
  });
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const userId = req.userId!;

  const data = await prismaClient.websites.findFirst({
    where: {
      id: websiteId,
      userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });

  res.json(data);
});

app.get("/api/v1/websites", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const websites = await prismaClient.websites.findMany({
    where: {
      userId,
      disabled: false,
    },
    include: {
      ticks: true
    }
  });
  res.json({
    websites,
  });
});

app.delete("/api/v1/website/", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const userId = req.userId!;
  await prismaClient.websites.update({
    where: {
      id: websiteId,
      userId,
    },
    data: {
      disabled: true,
    },
  });
  res.json({
    message: "Website disabled successfully",
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

export default app;
