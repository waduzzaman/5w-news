import mongoose from 'mongoose';

// --- NEWS MODEL ---
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: String, required: true },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now },
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