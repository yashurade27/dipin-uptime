import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import { memo } from "react";

const app = express();

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
    },
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
