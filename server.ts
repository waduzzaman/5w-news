import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import next from 'next';
import { parse } from 'url';
import { connectDB } from './lib/db';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  // Middleware for local parsing
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Connect to MongoDB on startup
  try {
    await connectDB();
    console.log('Database connection initialized via server.ts');
  } catch (err) {
    console.error('Initial MongoDB connection failed:', err);
  }

  // Next.js handles ALL routes now, including /api/*
  // because you moved them to the app/api folder.
  server.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`> Local Dev Server Ready on http://${hostname}:${port}`);
  });
});