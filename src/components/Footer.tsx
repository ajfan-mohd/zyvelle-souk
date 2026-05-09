import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const sections = [
    {
      title: 'Collections',
      links: [
        { name: 'All Collections', path: '/collections' },
        { name: 'New Arrivals', path: '/new-arrivals' },
        { name: 'Bestsellers', path: '/bestsellers' },
        { name: 'Bespoke Services', path: '/bespoke' },
      ],
    },
    {
      title: 'Shop By Category',
      links: [
        { name: 'Necklaces', path: '/category/necklaces' },
        { name: 'Earrings', path: '/category/earrings' },
        { name: 'Rings', path: '/category/rings' },
        { name: 'Bracelets', path: '/category/bracelets' },
      ],
    },
    {
      title: 'Client Services',
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'Shipping & Returns', path: '/shipping' },
        { name: 'Size Guide', path: '/size-guide' },
        { name: 'Gift Cards', path: '/gift-cards' },
      ],
    },
    {
      title: 'About Us',
      links: [
        { name: 'Our Story', path: '/about' },
        { name: 'Sustainability', path: '/sustainability' },
        { name: 'Materials', path: '/materials' },
        { name: 'Stores', path: '/stores' },
      ],
    },
  ];

  return (
    <footer className="bg-[#FAF7F0] border-t border-olive-deep/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20 text-center md:text-left">
          {/* Brand Info */}
          <div className="lg:col-span-1 flex flex-col items-center md:items-start">
            <Link to="/" className="inline-block mb-6">
              <h2 className="text-2xl font-serif tracking-widest">ZYVELLE SOUK</h2>
              <span className="text-[9px] tracking-[0.4em] uppercase block text-center md:text-left opacity-70">
                Fine Jewellery
              </span>
            </Link>
            <p className="text-sm text-olive-deep/70 mb-8 max-w-xs leading-relaxed">
              Curating moments of elegance through artisanal craftsmanship and timeless design.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/zyvellesouk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-olive-deep/5 rounded-full hover:bg-gold-muted hover:text-white transition-all duration-300"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com/zyvellesouk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-olive-deep/5 rounded-full hover:bg-gold-muted hover:text-white transition-all duration-300"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '+971522437123'}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-olive-deep/5 rounded-full hover:bg-gold-muted hover:text-white transition-all duration-300"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 text-olive-dark">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-sm text-olive-deep/60 hover:text-gold-muted transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter & Bottom */}
        <div className="border-t border-olive-deep/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row gap-8 items-center text-[10px] uppercase tracking-widest text-olive-deep/50">
            <span>&copy; {new Date().getFullYear()} Zyvelle Souk. All rights reserved.</span>
            <Link to="/privacy" className="hover:text-olive-dark">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-olive-dark">Terms of Service</Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-olive-deep/70">
              <Mail className="w-4 h-4" />
              <span className="text-xs">concierge@zyvelle.com</span>
            </div>
            <div className="flex items-center gap-2 text-olive-deep/70">
              <Phone className="w-4 h-4" />
              <span className="text-xs">+971 0522437123</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
