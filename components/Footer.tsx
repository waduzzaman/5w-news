import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'All News', href: '/' },
    { name: 'World', href: '/category/world' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Business', href: '/category/business' },
    { name: 'Science', href: '/category/science' },
    { name: 'Arts', href: '/category/arts' },
    { name: 'Sports', href: '/category/sports' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 py-12 mt-12">
      <div className="container mx-auto px-4">
        {/* Category Navigation Menu */}
        <div className="border-t border-slate-800 py-8">
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm font-bold uppercase tracking-widest">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                href={category.href} 
                className="text-slate-400 hover:text-white transition-colors pb-1"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-bold text-white mb-4 block">
              The Daily Chronicle
            </Link>
            <p className="text-sm text-slate-400 max-w-sm mb-4">
              Delivering independent, high-quality journalism to millions of readers around the globe. 
              Stay informed with our daily updates on breaking news, politics, business, technology, and more.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                Editor Login
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    href={category.href} 
                    className="hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">
              &copy; {currentYear} The Daily Chronicle. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <Link href="/" className="text-slate-500 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/" className="text-slate-500 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/" className="text-slate-500 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
