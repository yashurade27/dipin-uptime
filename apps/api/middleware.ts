import type { NextFunction, Request, Response } from "express";
import { createClerkClient } from "@clerk/backend";
import { verifyToken } from "@clerk/backend";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('Auth middleware called for:', req.path);
        const authHeader = req.headers["authorization"];
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log('Missing or invalid authorization header');
            return res.status(401).json({ error: "Missing or invalid authorization header" });
        }
        
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        console.log('Token received:', token ? 'Yes' : 'No');
        
        // Verify the JWT token with Clerk
        console.log('Verifying token with Clerk...');
        const sessionClaims = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });
        
        if (!sessionClaims || !sessionClaims.sub) {
            console.log('Invalid token or no user ID in claims');
            return res.status(401).json({ error: "Invalid token" });
        }
        
        console.log('Authentication successful for user:', sessionClaims.sub);
        req.userId = sessionClaims.sub;
        next();
    } catch (error: any) {
        console.error("Auth middleware error:", error);
        console.error("Auth error details:", error?.message);
        return res.status(401).json({ error: "Authentication failed", details: error?.message });
    }
}