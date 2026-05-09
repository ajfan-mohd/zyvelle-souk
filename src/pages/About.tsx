import { motion } from 'motion/react';
import { Shrub, Heart, Users, ShieldCheck, Diamond, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div className="pt-20">
      <Helmet>
        <title>About Zyvelle Souk | Our Heritage and Artisanal Excellence</title>
        <meta name="description" content="Learn about the heritage of Zyvelle Souk. Our studio is dedicated to the art of fine jewellery, ethical sourcing, and handcrafted excellence. Discover the stories behind our signature gold pieces." />
        <meta name="keywords" content="brand story, ethical jewellery, handcrafted gold, jewellery heritage, artisanal studio, sustainable luxury" />
      </Helmet>

      {/* Editorial Header */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1573408302185-9146ca634a00?auto=format&fit=crop&q=80&w=2000" 
            alt="The Artisanal Spirit of Zyvelle Souk Craftsmanship" 
            crossOrigin="anonymous"
            className="w-full h-full object-cover grayscale-[0.2] brightness-75"
          />
        </div>
        <div className="relative z-10 text-center text-cream px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] tracking-[0.5em] uppercase font-bold mb-6 block">Our Legacy</span>
            <h1 className="text-4xl md:text-8xl font-serif mb-8 leading-tight">
              Honouring the <br /> <span className="italic">Spirit of Craft</span>
            </h1>
            <div className="w-12 h-[1px] bg-gold-muted mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20 md:py-32 bg-cream px-6">
        <div className="max-w-4xl mx-auto space-y-20 md:space-y-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif text-olive-dark mb-10 leading-relaxed italic px-4 md:px-0">
              "Zyvelle Souk was born to redefine luxury — making it personal, artisanal, and timeless."
            </h2>
            <div className="w-1 px-12 bg-gold-muted/30 h-16 mx-auto mb-10" />
            <div className="space-y-6 text-olive-deep/70 text-base md:text-lg font-light leading-relaxed px-2 md:px-0">
              <p>
                Established in 2024, Zyvelle Souk began with a passion for rare artefacts and fine jewellery. What started in a small atelier has evolved into a destination for those who seek beauty with depth and authenticity.
              </p>
              <p>
                In an era of mass production, we remain committed to the slow, deliberate process of hand-crafting, creating signature treasures that transcend time and trends.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800" 
                alt="Our Master Artisan at Work in the Zyvelle Souk Atelier" 
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div className="space-y-10">
              <h3 className="text-3xl md:text-4xl font-serif text-olive-dark leading-tight">Ethically Sourced, Artistically Crafted</h3>
              <div className="space-y-6 text-olive-deep/70 leading-relaxed font-light text-sm md:text-base">
                <p>
                  Every gemstone is selected for its unique brilliance. We believe beauty cannot exist without ethical integrity, which is why our sourcing process is rigorous and transparent.
                </p>
                <p>
                  We prioritize certified suppliers who share our dedication to conflict-free diamonds and recycled metals, ensuring our legacy is one of restoration.
                </p>
              </div>
              <div className="space-y-8 pt-4">
                {[
                  { icon: Heart, title: 'Conscious Design', text: 'Pieces created with intentionality, ensuring they survive beyond seasonal fashions.' },
                  { icon: Shrub, title: 'Sustainable Practices', text: 'Minimizing waste in our studio through recycled gold and responsible production methods.' },
                  { icon: Users, title: 'Artisanal Empowerment', text: 'Collaborating with local craftsmen to preserve heritage techniques for future generations.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <item.icon className="w-6 h-6 text-gold-muted mt-1" strokeWidth={1} />
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-olive-dark">{item.title}</h4>
                      <p className="text-sm text-olive-deep/60 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deep Content Block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-10">
             <div className="space-y-4">
                <Diamond className="w-8 h-8 text-gold-muted mb-4" strokeWidth={1} />
                <h4 className="font-serif text-xl text-olive-dark">Exceptional Brilliance</h4>
                <p className="text-sm text-olive-deep/60 leading-relaxed font-light">
                   We look beyond the four Cs to find stones with exceptional luminescence and character. Each gem is chosen to reflect light in a way that is uniquely breathtaking, ensuring your piece truly stands out.
                </p>
             </div>
             <div className="space-y-4">
                <ShieldCheck className="w-8 h-8 text-gold-muted mb-4" strokeWidth={1} />
                <h4 className="font-serif text-xl text-olive-dark">Guaranteed Authenticity</h4>
                <p className="text-sm text-olive-deep/60 leading-relaxed font-light">
                   Our commitment to quality is unwavering. Every piece undergoes multiple quality checks and is accompanied by a laboratory certificate that guarantees its provenance and material purity.
                </p>
             </div>
             <div className="space-y-4">
                <Globe className="w-8 h-8 text-gold-muted mb-4" strokeWidth={1} />
                <h4 className="font-serif text-xl text-olive-dark">A Global Collective</h4>
                <p className="text-sm text-olive-deep/60 leading-relaxed font-light">
                   While our heart is in our local atelier, our community is global. We are proud to serve collectors from across the world, bringing the essence of Zyvelle Souk to every corner of the planet.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 md:py-32 bg-olive-dark text-cream px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] tracking-[0.5em] uppercase opacity-50 mb-8 block font-bold">Our Ultimate Vision</span>
          <h2 className="text-3xl md:text-6xl font-serif mb-10 leading-tight">
            To create treasures that resonate with your <span className="italic font-light">unique soul</span>.
          </h2>
          <div className="w-20 h-[1px] bg-gold-muted mx-auto mb-10" />
          <p className="text-cream/60 max-w-2xl mx-auto font-light leading-relaxed text-base md:text-lg">
             We aim to be a sanctuary of inspiration, where every visitor finds a physical manifestation of their inner elegance and grace.
          </p>
        </div>
      </section>
    </div>
  );
}
