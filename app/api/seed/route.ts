import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { News, Ad, User } from '@/models/Schema';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();

    // Clear existing data
    await News.deleteMany({});
    await Ad.deleteMany({});
    
    // Create admin user if not exists
    const existingUser = await User.findOne({ email: 'admin@news.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@news.com',
        password: hashedPassword,
      });
      console.log('Admin user created');
    }

    // Seed news articles
    const sampleNews = [
      {
        title: 'Global Tech Summit Announces Breakthrough in AI Development',
        content: 'In a landmark announcement at this year\'s Global Tech Summit, researchers unveiled a revolutionary AI system that demonstrates unprecedented capabilities in natural language understanding and problem-solving. The system, developed by a consortium of leading technology companies and academic institutions, represents a significant leap forward in artificial intelligence research.\n\nIndustry experts have praised the development as a potential game-changer for various sectors, including healthcare, education, and environmental science. The AI system showcases remarkable abilities to reason across different domains and provide nuanced solutions to complex problems.\n\n"This is the kind of breakthrough we\'ve been waiting for," said Dr. Sarah Chen, a leading AI researcher at MIT. "The implications for society are immense."',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        author: 'Michael Roberts',
        category: 'Technology',
      },
      {
        title: 'World Markets Rally on Economic Recovery Signs',
        content: 'Stock markets around the world surged today following positive economic indicators from major economies. The S&P 500 reached new highs, while European and Asian markets also posted significant gains.\n\nAnalysts attribute the rally to strong employment data, improved consumer confidence, and signs of easing inflation. Central banks have signaled a more cautious approach to interest rate hikes, further boosting investor sentiment.\n\n"This marks a turning point for the global economy," noted Chief Economist James Wilson. "We\'re seeing the fruits of careful monetary policy and structural reforms."',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        author: 'Emily Parker',
        category: 'Business',
      },
      {
        title: 'Climate Scientists Discover New Ocean Current Pattern',
        content: 'A team of international climate scientists has identified a previously unknown ocean current pattern that could significantly impact our understanding of climate change. The discovery was made using advanced satellite data and deep-sea monitoring equipment.\n\nThe new current, dubbed the "Deep Meridian Flow," appears to play a crucial role in transporting heat and nutrients across ocean basins. Researchers believe understanding this pattern could improve climate models and predictions.\n\n"This finding reshapes our understanding of ocean circulation," said Dr. Maria Santos, lead researcher on the project. "It could be key to predicting future climate scenarios."',
        imageUrl: 'https://images.unsplash.com/photo-1468476396571-4d6f2a427ee7?w=800',
        author: 'David Kim',
        category: 'Science',
      },
      {
        title: 'International Art Exhibition Opens in Paris',
        content: 'The highly anticipated "Voices of the World" exhibition opened today at the Louvre, featuring works from over 100 contemporary artists representing 50 countries. The exhibition aims to showcase the diversity of global artistic expression in the 21st century.\n\nHighlights include interactive installations, digital art, and traditional mediums reimagined for modern audiences. Visitors can experience immersive virtual reality pieces alongside classical sculptures.\n\n"This exhibition celebrates the universal language of art," said curator Isabelle Moreau. "It\'s about connecting people across boundaries."',
        imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
        author: 'Sophie Laurent',
        category: 'Arts',
      },
      {
        title: 'Historic Peace Agreement Signed in Geneva',
        content: 'Representatives from rival factions gathered in Geneva today to sign a landmark peace agreement, ending years of conflict in the region. The agreement was brokered by international mediators and witnessed by world leaders.\n\nKey provisions include territorial compromises, power-sharing arrangements, and international guarantees. The deal also includes economic development packages funded by multiple nations.\n\n"This peace opens a new chapter for our people," said one of the signatories. "We look forward to building a future together."',
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
        author: 'Robert Chen',
        category: 'World',
      },
      {
        title: 'Revolutionary Battery Technology Promises Week-Long Phone Charge',
        content: 'Researchers at Stanford University have developed a new battery technology that could allow smartphones to run for an entire week on a single charge. The breakthrough uses a novel solid-state design that significantly increases energy density.\n\nThe new batteries are also safer than current lithium-ion designs, with a lower risk of overheating. Manufacturers are already expressing interest in licensing the technology.\n\n"Imagine charging your phone once and forgetting about it for a week," said Professor Jennifer Liu, who led the research team.',
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69056954?w=800',
        author: 'Tech Desk',
        category: 'Technology',
      },
      {
        title: 'Space Agency Announces Plans for Mars Colony',
        content: 'In an ambitious announcement, the International Space Agency revealed detailed plans for establishing the first permanent human settlement on Mars by 2040. The multi-phase project will involve hundreds of scientists and engineers.\n\nThe initial phase will focus on building infrastructure and life support systems. A rotating crew of 12 astronauts will maintain the colony, with regular resupply missions from Earth.\n\n"This is humanity\'s next great adventure," said Agency Director Thomas Anderson. "Mars isn\'t just a destination—it\'s our future home."',
        imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
        author: 'Space Correspondent',
        category: 'Science',
      },
      {
        title: 'Major Merger Creates Entertainment Giant',
        content: 'Two of Hollywood\'s largest studios announced a merger today, creating the world\'s biggest entertainment company. The $45 billion deal will reshape the media landscape and create new streaming and production opportunities.\n\nThe combined entity will control a significant portion of global film and television content, with synergies expected in technology and distribution. Analysts predict the merger will accelerate industry consolidation.\n\n"Together, we can create content at a scale never before possible," said the new CEO in a joint press conference.',
        imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
        author: 'Entertainment Reporter',
        category: 'Business',
      },
    ];

    await News.insertMany(sampleNews);
    console.log('News articles seeded');

    // Seed sample ads
    const sampleAds = [
      {
        title: 'Premium Tech Gadgets',
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69056954?w=400',
        linkUrl: 'https://example.com/tech',
        placement: 'sidebar',
        active: true,
      },
      {
        title: 'Luxury Travel Destinations',
        imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
        linkUrl: 'https://example.com/travel',
        placement: 'banner',
        active: true,
      },
    ];

    await Ad.insertMany(sampleAds);
    console.log('Ads seeded');

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      adminCredentials: {
        email: 'admin@news.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
