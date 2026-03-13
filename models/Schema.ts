import mongoose from 'mongoose';

// Helper function to create URL-friendly slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// --- NEWS MODEL ---
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: String, required: true },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now },
});

// Auto-generate slug before saving
newsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = createSlug(this.title);
  }
  next();
});

// --- AD MODEL ---
const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  placement: { type: String, default: 'sidebar' }, 
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// --- USER MODEL ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Export all models
export const News = mongoose.models.News || mongoose.model('News', newsSchema);
export const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);