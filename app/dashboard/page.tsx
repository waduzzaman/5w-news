'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';

interface News {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  category: string;
  createdAt: string;
}

interface Ad {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  placement: string;
  active: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [news, setNews] = useState<News[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'ads'>('news');
  
  const [isOpen, setIsOpen] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('General');
  
  // Ad Form state
  const [adTitle, setAdTitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adLinkUrl, setAdLinkUrl] = useState('');
  const [adPlacement, setAdPlacement] = useState('sidebar');
  
  const [formLoading, setFormLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/auth/me', { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        fetchNews();
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data);
      } else {
        setNews([]);
      }
      
      const adsRes = await fetch('/api/ads');
      if (adsRes.ok) {
        const adsData = await adsRes.json();
        if (Array.isArray(adsData)) setAds(adsData);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data', err);
      setNews([]);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setImageFile(null);
    setAuthor('');
    setCategory('General');
    setEditingId(null);
  };

  const handleEdit = (item: News) => {
    setTitle(item.title);
    setContent(item.content);
    setImageUrl(item.imageUrl || '');
    setImageFile(null);
    setAuthor(item.author);
    setCategory(item.category || 'General');
    setEditingId(item._id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    try {
      const res = await fetch(`/api/news/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setNews(news.filter((n) => n._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({ image: reader.result }),
          });
          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    let finalImageUrl = imageUrl;
    if (imageFile) {
      try {
        finalImageUrl = await uploadImage(imageFile);
      } catch (err) {
        alert('Failed to upload image');
        setFormLoading(false);
        return;
      }
    }

    const payload = { title, content, imageUrl: finalImageUrl, author, category };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/news/${editingId}` : '/api/news';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsOpen(false);
        resetForm();
        fetchNews();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save news');
      }
    } catch (err) {
      console.error('Failed to save', err);
      alert('Failed to save news');
    } finally {
      setFormLoading(false);
    }
  };

  const resetAdForm = () => {
    setAdTitle('');
    setAdImageUrl('');
    setAdLinkUrl('');
    setAdPlacement('sidebar');
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    let finalAdImageUrl = adImageUrl;
    if (adImageFile) {
      try {
        finalAdImageUrl = await uploadImage(adImageFile);
      } catch (err) {
        alert('Failed to upload ad image');
        setFormLoading(false);
        return;
      }
    }

    try {
      const payload = { title: adTitle, imageUrl: finalAdImageUrl, linkUrl: adLinkUrl, placement: adPlacement, active: true };
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save ad');
      
      await fetchNews();
      setIsAdOpen(false);
      resetAdForm();
    } catch (err) {
      console.error('Failed to save ad', err);
      alert('Failed to save ad');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    try {
      const res = await fetch(`/api/ads/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setAds(ads.filter((a) => a._id !== id));
      } else {
        alert('Failed to delete ad');
      }
    } catch (err) {
      console.error('Failed to delete ad', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">News Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b pb-2">
        <button 
          onClick={() => setActiveTab('news')} 
          className={`font-semibold pb-2 px-2 ${activeTab === 'news' ? 'border-b-2 border-black text-black' : 'text-slate-500 hover:text-black'}`}
        >
          Manage News
        </button>
        <button 
          onClick={() => setActiveTab('ads')} 
          className={`font-semibold pb-2 px-2 ${activeTab === 'ads' ? 'border-b-2 border-black text-black' : 'text-slate-500 hover:text-black'}`}
        >
          Manage Ads
        </button>
      </div>

      {activeTab === 'news' ? (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Manage Articles</h2>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Business">Business</option>
            <option value="Arts">Arts</option>
            <option value="Sports">Sports</option>
            <option value="World">World</option>
          </select>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" /> Add News</Button>} />
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit News Article' : 'Add News Article'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="General">General</option>
                  <option value="Technology">Technology</option>
                  <option value="Science">Science</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="World">World</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Image (Optional)</Label>
                <div className="flex flex-col gap-2">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                  />
                  <div className="text-sm text-muted-foreground text-center">OR</div>
                  <Input 
                    id="imageUrl" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    placeholder="Paste image URL here (https://...)" 
                    disabled={!!imageFile}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required 
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="button" variant="outline" className="mr-2" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Article'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {news.filter(item => filterCategory === 'All' || item.category === filterCategory).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>No news articles found{filterCategory !== 'All' ? ` in ${filterCategory}` : ''}.</p>
            </CardContent>
          </Card>
        ) : (
          news.filter(item => filterCategory === 'All' || item.category === filterCategory).map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {item.imageUrl && (
                  <div className="w-full sm:w-48 h-32 bg-muted shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.title} className="object-contain w-full h-full" />
                  </div>
                )}
                <div className="flex-grow p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                      {item.category || 'General'}
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {item.author} • {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm line-clamp-2 text-muted-foreground">{item.content}</p>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
        </>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Ads</h2>
            <Dialog open={isAdOpen} onOpenChange={(open) => {
              setIsAdOpen(open);
              if (!open) resetAdForm();
            }}>
              <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" /> Add Ad</Button>} />
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Custom Advertisement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="adTitle">Ad Title</Label>
                    <Input id="adTitle" value={adTitle} onChange={(e) => setAdTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <div className="flex flex-col gap-2">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setAdImageFile(e.target.files?.[0] || null)} 
                      />
                      <div className="text-sm text-muted-foreground text-center">OR</div>
                      <Input 
                        id="adImageUrl" 
                        value={adImageUrl} 
                        onChange={(e) => setAdImageUrl(e.target.value)} 
                        placeholder="Paste image URL here (https://...)" 
                        disabled={!!adImageFile}
                        required={!adImageFile}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adLinkUrl">Destination Link URL</Label>
                    <Input id="adLinkUrl" value={adLinkUrl} onChange={(e) => setAdLinkUrl(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adPlacement">Placement</Label>
                    <select
                      id="adPlacement"
                      value={adPlacement}
                      onChange={(e) => setAdPlacement(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="sidebar">Sidebar (Vertical)</option>
                      <option value="header">Header (Horizontal)</option>
                      <option value="in-article">In-Article</option>
                    </select>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="button" variant="outline" className="mr-2" onClick={() => setIsAdOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={formLoading}>
                      {formLoading ? 'Saving...' : 'Save Ad'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {ads.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <p>No custom ads found.</p>
                </CardContent>
              </Card>
            ) : (
              ads.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {item.imageUrl && (
                      <div className="sm:w-48 h-32 bg-muted shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 border border-slate-200 px-2 py-1 rounded">
                            {item.placement}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.linkUrl || 'No link provided'}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground">
                          Added {format(new Date(item.createdAt), 'MMM d, yyyy')}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteAd(item._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
