import dotenv from "dotenv"; 
dotenv.config();          
import express from 'express';
import next from 'next';
import { parse } from 'url';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

console.log('DEBUG: Cloudinary Key is:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'MISSING');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// MongoDB Models
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: String, required: true },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now },
});
const News = mongoose.models.News || mongoose.model('News', newsSchema);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  placement: { type: String, default: 'sidebar' }, // 'sidebar', 'header', 'in-article'
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Realistic dummy data
const realisticDummyNews = [
  {
    _id: 'mock-1',
    title: 'Global Tech Summit Unveils Next-Gen AI Models',
    content: 'In a groundbreaking event today, leading tech giants unveiled their latest artificial intelligence models, promising unprecedented capabilities in natural language processing and computer vision.\n\nThe summit, attended by thousands of developers and researchers, highlighted the rapid pace of innovation in the field. Experts predict these new models will revolutionize industries ranging from healthcare to finance, though concerns about ethical implications and job displacement remain a topic of intense debate.\n\n"We are entering a new era of human-machine collaboration," stated Dr. Elena Rostova, lead researcher at a prominent AI lab. "The focus now must shift from capability to alignment and safety."\n\nSeveral startups also showcased innovative applications, including real-time translation devices and personalized learning assistants that adapt to a student\'s cognitive style.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
    author: 'Sarah Jenkins',
    category: 'Technology',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: 'mock-2',
    title: 'Sustainable Energy Breakthrough: New Solar Panels Double Efficiency',
    content: 'Researchers at the National Institute of Science have developed a new type of solar cell that doubles the efficiency of current market leaders. Using a novel perovskite structure, these panels can capture a wider spectrum of sunlight.\n\nThis breakthrough could significantly reduce the cost of renewable energy and accelerate the global transition away from fossil fuels. Commercial production is expected to begin within the next two years.\n\nThe research team, led by Dr. Aris Thorne, spent five years perfecting the material composition. "The challenge wasn\'t just efficiency, but stability," Thorne explained. "Previous perovskite models degraded quickly in humid conditions. Our new encapsulation technique solves that."\n\nEnergy markets reacted positively to the news, with several major green energy funds seeing a surge in investments.',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop',
    author: 'David Chen',
    category: 'Science',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    _id: 'mock-3',
    title: 'Major Market Rally as Inflation Cools Down',
    content: 'Global stock markets experienced a significant rally today following reports that inflation has cooled more than expected in the last quarter. Investors are optimistic that central banks may pause interest rate hikes.\n\nTech and consumer discretionary stocks led the surge, with major indices closing at record highs. Analysts caution that while the short-term outlook is positive, long-term economic challenges remain.\n\n"We\'re seeing a relief rally," noted financial analyst Marcus Webb. "The market had priced in a much more aggressive tightening cycle. This data provides breathing room, but we aren\'t out of the woods yet regarding supply chain vulnerabilities."\n\nRetail investors have also returned to the market in droves, driving trading volumes to their highest levels in six months.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
    author: 'Amanda Rossi',
    category: 'Business',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    _id: 'mock-4',
    title: 'New Deep Sea Species Discovered in the Mariana Trench',
    content: 'Marine biologists have announced the discovery of a new, bioluminescent species of jellyfish in the depths of the Mariana Trench. The creature, which emits a mesmerizing blue glow, was captured on video by a deep-sea submersible.\n\nThis finding highlights how much of the ocean remains unexplored and underscores the importance of deep-sea conservation efforts.\n\nThe jellyfish, tentatively named *Aurelia abyssalis*, possesses unique genetic adaptations that allow it to survive extreme pressure and near-freezing temperatures. Scientists believe studying its bioluminescence could lead to advancements in medical imaging.\n\n"Every time we send a rover down there, we find something that challenges our understanding of biology," said expedition leader Dr. Sylvia Earle.',
    imageUrl: 'https://images.unsplash.com/photo-1551464885-21348ccc8b67?q=80&w=2070&auto=format&fit=crop',
    author: 'Dr. Robert Vance',
    category: 'Science',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: 'mock-5',
    title: 'Championship Finals: Underdog Team Takes the Trophy',
    content: 'In a stunning upset, the city\'s underdog team secured victory in the national championship finals last night. Overcoming a 10-point deficit in the final quarter, they managed a buzzer-beater shot that sent the crowd into a frenzy.\n\nThe city is preparing for a massive victory parade tomorrow to celebrate this historic win. The team\'s captain, who was named MVP, dedicated the victory to the loyal fans who supported them through years of rebuilding.\n\n"Nobody believed in us but us," the captain said during the post-game press conference, tears in his eyes. "This is for every kid playing on the street corners dreaming of this moment."\n\nMerchandise sales have skyrocketed, and local businesses are reporting record profits as celebrations continue into the weekend.',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2005&auto=format&fit=crop',
    author: 'Marcus Johnson',
    category: 'Sports',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    _id: 'mock-6',
    title: 'Architectural Marvel: The New Floating City Concept',
    content: 'As sea levels continue to rise, a consortium of international architects has unveiled plans for a modular, floating city capable of housing 50,000 residents. The concept, dubbed "Oceanis," relies on hexagonal platforms that can be connected and reconfigured as needed.\n\nThe city would be entirely self-sustaining, utilizing wave and solar power, and featuring vertical farms for food production. While still in the conceptual phase, several coastal nations have expressed interest in funding a prototype.\n\nCritics argue the cost of such a project would be astronomical, making it accessible only to the ultra-wealthy. However, the designers insist that economies of scale will eventually make floating habitats a viable solution for climate refugees.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    author: 'Elena Rostova',
    category: 'World',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  }
];

// In-memory fallback state
let isDbConnected = false;
let mockNews: any[] = [...realisticDummyNews];
let mockAds: any[] = [
  {
    _id: 'ad-1',
    title: 'Premium Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop',
    linkUrl: '#',
    placement: 'sidebar',
    active: true,
    createdAt: new Date().toISOString()
  }
];

app.prepare().then(async () => {
  const server = express();

  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ limit: '10mb', extended: true }));
  server.use(cookieParser());

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      isDbConnected = true;
      console.log('Connected to MongoDB');
      
      // Create a default admin user if none exists
      const adminExists = await User.findOne({ email: 'admin@news.com' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({ email: 'admin@news.com', password: hashedPassword });
        console.log('Default admin created: admin@news.com / admin123');
      }

      // Seed dummy news if database is empty
      const newsCount = await News.countDocuments();
      if (newsCount === 0) {
        console.log('Seeding database with realistic dummy news...');
        const seedData = realisticDummyNews.map(n => {
          const { _id, ...rest } = n;
          return rest;
        });
        await News.insertMany(seedData);
        console.log('Database seeded successfully.');
      }
    } catch (err) {
      console.error('MongoDB connection error, falling back to in-memory store:', err);
      isDbConnected = false;
    }
  } else {
    console.log('No MONGODB_URI provided, using in-memory fallback store.');
    isDbConnected = false;
  }

  // API Routes
  server.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!isDbConnected) {
        if (email === 'admin@news.com' && password === 'admin123') {
          const token = jwt.sign({ userId: 'mock-admin-id' }, JWT_SECRET, { expiresIn: '1d' });
          res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
          });
          return res.json({ success: true, token });
        }
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ success: true, token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  server.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.json({ success: true });
  });

  server.get('/api/auth/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.split(' ')[1]) || req.cookies.token;
    
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      if (!isDbConnected) {
        if (decoded.userId === 'mock-admin-id') {
          return res.json({ user: { email: 'admin@news.com', _id: 'mock-admin-id' } });
        }
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      res.json({ user });
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });

  // Middleware to protect routes
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.split(' ')[1]) || req.cookies.token;
    
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      (req as any).userId = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  server.get('/api/news', async (req, res) => {
    try {
      const { category } = req.query;
      let filter = {};
      
      if (category && typeof category === 'string') {
        filter = { category: new RegExp(`^${category}$`, 'i') };
      }

      if (!isDbConnected) {
        let filteredMock = [...mockNews];
        if (category && typeof category === 'string') {
          filteredMock = filteredMock.filter(n => n.category?.toLowerCase() === category.toLowerCase());
        }
        return res.json(filteredMock.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
      
      const news = await News.find(filter).sort({ createdAt: -1 });
      res.json(news);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  server.get('/api/news/:id', async (req, res) => {
    try {
      if (!isDbConnected) {
        const news = mockNews.find(n => n._id === req.params.id);
        if (!news) return res.status(404).json({ error: 'Not found' });
        return res.json(news);
      }
      const news = await News.findById(req.params.id);
      if (!news) return res.status(404).json({ error: 'Not found' });
      res.json(news);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  server.post('/api/news', requireAuth, async (req, res) => {
    try {
      const { title, content, imageUrl, author, category } = req.body;
      
      if (!isDbConnected) {
        const newArticle = {
          _id: 'mock-' + Date.now().toString(),
          title,
          content,
          imageUrl,
          author,
          category: category || 'General',
          createdAt: new Date().toISOString()
        };
        mockNews.push(newArticle);
        return res.status(201).json(newArticle);
      }

      const news = new News({ title, content, imageUrl, author, category: category || 'General' });
      await news.save();
      res.status(201).json(news);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  server.put('/api/news/:id', requireAuth, async (req, res) => {
    try {
      const { title, content, imageUrl, author, category } = req.body;
      
      if (!isDbConnected) {
        const index = mockNews.findIndex(n => n._id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Not found' });
        mockNews[index] = { ...mockNews[index], title, content, imageUrl, author, category: category || 'General' };
        return res.json(mockNews[index]);
      }

      const news = await News.findByIdAndUpdate(
        req.params.id,
        { title, content, imageUrl, author, category: category || 'General' },
        { new: true }
      );
      if (!news) return res.status(404).json({ error: 'Not found' });
      res.json(news);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  server.delete('/api/news/:id', requireAuth, async (req, res) => {
    try {
      if (!isDbConnected) {
        const index = mockNews.findIndex(n => n._id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Not found' });
        mockNews.splice(index, 1);
        return res.json({ success: true });
      }

      const news = await News.findByIdAndDelete(req.params.id);
      if (!news) return res.status(404).json({ error: 'Not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // --- Ads API ---
  server.get('/api/ads', async (req, res) => {
    try {
      if (isDbConnected) {
        const ads = await Ad.find({ active: true }).sort({ createdAt: -1 });
        res.json(ads);
      } else {
        res.json(mockAds.filter(ad => ad.active));
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ads' });
    }
  });

  server.post('/api/ads', requireAuth, async (req, res) => {
    try {
      const { title, imageUrl, linkUrl, placement, active } = req.body;
      if (isDbConnected) {
        const newAd = new Ad({ title, imageUrl, linkUrl, placement, active });
        await newAd.save();
        res.status(201).json(newAd);
      } else {
        const newAd = {
          _id: Date.now().toString(),
          title, imageUrl, linkUrl, placement, active: active !== false,
          createdAt: new Date().toISOString(),
        };
        mockAds.unshift(newAd);
        res.status(201).json(newAd);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to create ad' });
    }
  });

  server.delete('/api/ads/:id', requireAuth, async (req, res) => {
    try {
      if (isDbConnected) {
        await Ad.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ad deleted' });
      } else {
        mockAds = mockAds.filter((a) => a._id !== req.params.id);
        res.json({ message: 'Ad deleted' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete ad' });
    }
  });

  server.post('/api/upload', requireAuth, async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }
      
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'news_portal',
      });
      
      res.json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // Next.js fallback
  server.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
