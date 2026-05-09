import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageCircle, Clock, ArrowRight, ShieldCheck, HeartHandshake, Loader2 } from 'lucide-react';
import { useToast } from '../components/ui/Toaster';
import { Helmet } from 'react-helmet-async';
import { useSecurity } from '../context/SecurityContext';
import { sanitize } from '../lib/security';

export default function Contact() {
  const { toast } = useToast();
  const { csrfToken } = useSecurity();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Product Inquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Client-side sanitisation
      const sanitizedData = {
        name: sanitize(formData.name),
        email: sanitize(formData.email),
        subject: sanitize(formData.subject),
        message: sanitize(formData.message)
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken || '',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      toast('Message sent successfully. Our concierge will contact you shortly.', 'success');
      setFormData({ name: '', email: '', subject: 'Product Inquiry', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
      toast('An error occurred. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const key = id === 'full-name' ? 'name' : id;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="pt-40 pb-32 bg-cream px-6">
      <Helmet>
        <title>Contact Us | Zyvelle Souk Personal Jewellery Concierge</title>
        <meta name="description" content="Reach out to the Zyvelle Souk concierge for styling advice, order assistance, or bespoke jewellery commissions. Visit our Mayfair boutique or message us on WhatsApp." />
        <meta name="keywords" content="contact jewelry boutique, jewelry customer service, bespoke jewelry inquiry, styling advice, mayfair jewelry shop" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-[10px] tracking-[0.5em] uppercase text-gold-muted font-bold mb-6 block">Get in touch</span>
          <h1 className="text-5xl md:text-7xl font-serif text-olive-dark mb-8">Boutique Concierge</h1>
          <p className="text-olive-deep/60 max-w-2xl mx-auto font-light leading-relaxed italic text-lg">
            Whether you are seeking styling advice, tracking an order, or inquiring about a bespoke commission, our dedicated team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-16">
             <div className="prose prose-olive max-w-none text-olive-deep/70 text-sm leading-loose">
                <p>
                  At Zyvelle Souk, we believe that the journey to finding the perfect piece of jewellery should be as exquisite as the piece itself. Our concierge service is designed to provide a seamless, personalized experience for every client, regardless of their location.
                </p>
                <p>
                  Our experts are well-versed in the nuances of our artisanal collections and are eager to help you navigate our selections to find something that perfectly mirrors your style. For those seeking something truly unique, we offer private consultations for bespoke commissions, where your vision meets our master craftsmanship.
                </p>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-muted mb-6">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                  <h3 className="text-xs uppercase tracking-widest font-bold">Email Us</h3>
                </div>
                <p className="text-sm text-olive-deep/70">General Enquiries:</p>
                <p className="text-olive-dark font-medium underline underline-offset-4">concierge@zyvelle-souk.com</p>
                <p className="text-sm text-olive-deep/70 pt-2">Press & Media:</p>
                <p className="text-olive-dark font-medium underline underline-offset-4">press@zyvelle-souk.com</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-muted mb-6">
                  <Phone className="w-5 h-5" strokeWidth={1.5} />
                  <h3 className="text-xs uppercase tracking-widest font-bold">Call Us</h3>
                </div>
                <p className="text-sm text-olive-deep/70">Customer Support:</p>
                <p className="text-olive-dark font-medium underline underline-offset-4">+1 (555) 123-4567</p>
                <p className="text-sm text-olive-deep/70 pt-2">WhatsApp Direct:</p>
                <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '918075775586'}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-olive-dark font-medium hover:text-green-600 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Message Us Now
                </a>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-muted mb-6">
                  <MapPin className="w-5 h-5" strokeWidth={1.5} />
                  <h3 className="text-xs uppercase tracking-widest font-bold">Visit Us</h3>
                </div>
                <p className="text-sm text-olive-deep/70">Signature Boutique:</p>
                <p className="text-olive-dark font-medium leading-relaxed italic">
                  123 Artisan Square, <br /> Mayfair, London, W1K 3AH
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-muted mb-6">
                  <Clock className="w-5 h-5" strokeWidth={1.5} />
                  <h3 className="text-xs uppercase tracking-widest font-bold">Hours</h3>
                </div>
                <p className="text-sm text-olive-deep/70">Mon - Fri: 10:00 - 18:00</p>
                <p className="text-sm text-olive-deep/70">Sat: 11:00 - 17:00</p>
                <p className="text-sm text-olive-deep/70">Sun: By Appointment</p>
              </div>
            </div>
            
            <div className="h-[400px] bg-champagne overflow-hidden grayscale brightness-90 contrast-125 rounded-sm">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
                alt="Inside the Zyvelle Souk Signature Boutique in Mayfair" 
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                <div className="flex gap-4 p-6 bg-white border border-olive-deep/5">
                   <ShieldCheck className="w-6 h-6 text-gold-muted shrink-0" strokeWidth={1} />
                   <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold mb-2">Secure Transactions</h4>
                      <p className="text-xs text-olive-deep/60 leading-relaxed">All purchases are processed through our bank-grade encrypted payment systems for your peace of mind.</p>
                   </div>
                </div>
                <div className="flex gap-4 p-6 bg-white border border-olive-deep/5">
                   <HeartHandshake className="w-6 h-6 text-gold-muted shrink-0" strokeWidth={1} />
                   <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold mb-2">Aftercare Service</h4>
                      <p className="text-xs text-olive-deep/60 leading-relaxed">We provide complimentary cleaning and inspection services for the lifetime of your Zyvelle Souk pieces.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-16 border border-olive-deep/5 shadow-2xl shadow-olive-deep/5"
          >
            <h2 className="text-3xl font-serif text-olive-dark mb-10">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label htmlFor="full-name" className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Full Name</label>
                  <input 
                    id="full-name"
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm bg-transparent"
                    placeholder="Evelyn Rose"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm bg-transparent"
                    placeholder="evelyn@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Subject</label>
                <select 
                  id="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm bg-transparent"
                >
                  <option>Product Inquiry</option>
                  <option>Order Assistance</option>
                  <option>Bespoke Commission</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] uppercase tracking-widest font-bold text-olive-deep/40">Message</label>
                <textarea 
                  id="message"
                  rows={4} 
                  required 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border-b border-olive-deep/10 py-3 outline-none focus:border-gold-muted transition-colors text-sm bg-transparent resize-none"
                  placeholder="How can we help you today?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-olive-dark text-cream uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-gold-muted transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4 transform group-hover:translate-x-3 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-16 pt-10 border-t border-olive-deep/5">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-olive-dark mb-6">Our Communication Commitment</h4>
                <div className="space-y-4 text-xs text-olive-deep/60 leading-relaxed font-light">
                   <p>
                      We value your time as much as you value our craft. Our concierge team aims to respond to all digital enquiries within four business hours. During peak seasons and celebratory holidays, we appreciate your patience as we ensure every message receives the attentive care it deserves.
                   </p>
                   <p>
                      Please note that for urgent assistance regarding an active order, we recommend reaching out via our direct WhatsApp line for the quickest resolution.
                   </p>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
