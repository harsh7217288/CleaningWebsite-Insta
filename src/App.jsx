import React, { useState, useEffect, useRef, useCallback } from "react";
import './App.css';
import homeImage from "./images/homepage.jpg";
import bathroom from "./images/bathrooom.jpg"
import living from "./images/living.jpg"
import logo from "./images/ag_cleaning_logo.jpg"
import { 
  Star, 
  Shield, 
  Clock, 
  Leaf, 
  ArrowRight, 
  Check, 
  Phone, 
  Menu, 
  X,
  Sparkles,
  Home,
  Briefcase,
  Calendar,
  Droplets,
  Key,
  Wrench,
  MapPin,
  Plus,
  Minus
} from "lucide-react";

// ✅ FIXED: BeforeAfterSlider now accepts beforeImg and afterImg props
const BeforeAfterSlider = ({ label, beforeText, afterText, beforeImg, afterImg }) => {
  const [split, setSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setSplit(percent);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  useEffect(() => {
    if (isDragging) {
      const stopDrag = () => setIsDragging(false);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('mouseup', stopDrag);
        window.removeEventListener('touchend', stopDrag);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove]);

  return (
    <div className="ba-wrapper reveal">
      <h3 className="ba-label">{label}</h3>
      <div
        className="ba-container"
        ref={containerRef}
        onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
        onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
      >
        {/* ✅ AFTER layer — full width, real image as background */}
        <div
          className="ba-layer ba-after"
          style={{
            backgroundImage: `url(${afterImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
          }}
        >
          <span className="ba-badge after-badge">{afterText}</span>
        </div>

        {/* ✅ BEFORE layer — clipped width, real image as background */}
        <div
          className="ba-layer ba-before"
          style={{
            width: `${split}%`,
            backgroundImage: `url(${beforeImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <span className="ba-badge before-badge">{beforeText}</span>
        </div>

        {/* Drag handle */}
        <div className="ba-handle" style={{ left: `${split}%` }}>
          <div className="ba-handle-line"></div>
          <div className="ba-handle-circle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ — reveal removed to fix blank space bug
const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={onClick}>
      <button className="faq-question" aria-expanded={isOpen}>
        <span>{question}</span>
        {isOpen ? <Minus size={20} className="faq-icon" /> : <Plus size={20} className="faq-icon" />}
      </button>
      <div className="faq-answer-wrapper">
        <div className="faq-answer-content">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function LumiereCleanWebsite() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }, 100);
    return () => observer.disconnect();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const services = [
    { name: "Standard Cleaning", desc: "Consistent, thorough cleaning on your schedule", icon: <Sparkles size={28} strokeWidth={1.5} /> },
    { name: "Deep Cleaning", desc: "Every corner, every surface — a full reset", icon: <Droplets size={28} strokeWidth={1.5} /> },
    { name: "Recurring Cleaning", desc: "Weekly or bi-weekly — always guest-ready", icon: <Calendar size={28} strokeWidth={1.5} /> },
    { name: "Move In / Move Out", desc: "Start fresh or leave it spotless", icon: <Home size={28} strokeWidth={1.5} /> },
    { name: "Airbnb Cleaning", desc: "Turnover in hours, 5-star results every time", icon: <Key size={28} strokeWidth={1.5} /> },
    { name: "Office Cleaning", desc: "Professional spaces deserve professional care", icon: <Briefcase size={28} strokeWidth={1.5} /> },
    { name: "Eco-Friendly Cleaning", desc: "Non-toxic products, safe for kids and pets", icon: <Leaf size={28} strokeWidth={1.5} /> },
    { name: "Post-Construction", desc: "Dust, debris, done. Ready to move in", icon: <Wrench size={28} strokeWidth={1.5} /> }
  ];

  const faqs = [
    { q: "Are your cleaners background-checked?", a: "Yes. Every AG Cleaning professional undergoes a full criminal background check, identity verification, and in-person interview before their first booking. We re-screen annually." },
    { q: "Do I need to be home during the cleaning?", a: "Not at all. Most of our clients provide entry instructions and return to a clean home. We're fully insured for peace of mind." },
    { q: "What products do you use?", a: "We use professional-grade, eco-certified cleaning products that are non-toxic and safe for children, pets, and sensitive surfaces. You can also request fragrance-free options." },
    { q: "How do I pay?", a: "We accept all major credit cards, Apple Pay, and Google Pay. Payment is processed securely after your cleaning is complete." },
    { q: "What if I'm not satisfied?", a: "We offer a 24-hour happiness guarantee. If anything was missed, we'll return and re-clean that area at no charge — no questions asked." },
    { q: "How far in advance should I book?", a: "For standard cleans, we're typically available within 1–3 days. For deep cleans or move-out services, we recommend booking 5–7 days ahead." },
    { q: "Do you bring your own supplies?", a: "Yes. We bring all equipment and products. If you have specific products you prefer, let us know in advance." },
    { q: "Can I set up a recurring schedule?", a: "Absolutely. Weekly, bi-weekly, and monthly recurring plans are available with discounted rates and priority scheduling." }
  ];

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
         <a href="/" className="logo">
  <img
    src={logo}
    alt="AG Cleaning Services"
    className="logo-img"
  />
</a>
          <nav className="nav-links">
            <a href="#services" className="nav-link">Services</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#areas" className="nav-link">Areas</a>
          </nav>
          <a href="#contact" className="btn-primary nav-cta">Book Now</a>
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="nav-links-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            <a href="#services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
            <a href="#pricing" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <a href="#about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#areas" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Areas</a>
          </nav>
          <a href="#contact" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>Book Now</a>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-bg-circle"></div>
          <div className="container hero-grid">
            <div className="hero-content reveal">
              <span className="hero-eyebrow">Trusted by 500+ Households</span>
              <h1>Your Home, Spotlessly Clean. Every Time.</h1>
              <p className="hero-sub">Professional cleaning services designed for busy lives. Fully insured, background-checked, and satisfaction guaranteed.</p>
              <div className="hero-buttons">
                <a href="#contact" className="btn-primary">Get a Free Quote</a>
                <a href="#services" className="btn-secondary">See Our Services</a>
              </div>
              <div className="trust-row">
                <div className="trust-badge">
                  <Star className="trust-badge-icon" size={18} fill="currentColor" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="trust-badge">
                  <Shield className="trust-badge-icon" size={18} />
                  <span>Fully Insured</span>
                </div>
                <div className="trust-badge">
                  <Check className="trust-badge-icon" size={18} />
                  <span>200+ 5-Star Reviews</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="abstract-shape-1"></div>
              <div className="abstract-card-main">
                <img
                  src={homeImage}
                  alt="Beautifully cleaned modern living room"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: 'inherit'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(26,26,24,0.15) 0%, transparent 60%)',
                  borderRadius: 'inherit',
                  pointerEvents: 'none'
                }}></div>
              </div>
              <div className="abstract-card-floating">
                <div className="sparkle-icon">
                  <Sparkles size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>Sparkling Clean</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST INDICATORS */}
        <section className="stats-bar">
          <div className="container stats-grid">
            <div className="stat-item reveal">
              <div className="stat-number">500+</div>
              <div className="stat-label">Homes Cleaned</div>
            </div>
            <div className="stat-item reveal" style={{ transitionDelay: '100ms' }}>
              <div className="stat-number">4.9★</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-item reveal" style={{ transitionDelay: '200ms' }}>
              <div className="stat-number">100%</div>
              <div className="stat-label">Satisfaction Guarantee</div>
            </div>
            <div className="stat-item reveal" style={{ transitionDelay: '300ms' }}>
              <div className="stat-number">3 hrs</div>
              <div className="stat-label">Average Response Time</div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="services-section section-padding">
          <div className="container">
            <div className="text-center reveal">
              <h2 className="section-header">Everything Your Home Deserves</h2>
              <p className="section-subheader">From routine upkeep to deep transformations</p>
            </div>
            <div className="services-grid">
              {services.map((svc, i) => (
                <div className="card service-card reveal" style={{ transitionDelay: `${i * 50}ms` }} key={i}>
                  <div className="service-icon-wrap">{svc.icon}</div>
                  <h3>{svc.name}</h3>
                  <p>{svc.desc}</p>
                  <a href="#contact" className="service-link">Learn More <ArrowRight size={16} /></a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section id="about" className="alternating-section section-padding">
          <div className="container">
            <div className="alt-row reveal">
              <div className="alt-visual">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                  alt="Professional cleaner at work"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' }}
                />
              </div>
              <div className="alt-content">
                <Shield className="alt-icon" size={40} />
                <h3>Background-Checked Professionals</h3>
                <p>We don't send just anyone into your home. Every Lumière cleaner is rigorously vetted, professionally trained, and fully insured. We conduct thorough criminal background checks and in-person interviews before their first booking, giving you complete peace of mind.</p>
              </div>
            </div>
            <div className="alt-row reverse reveal">
              <div className="alt-visual">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Eco-friendly cleaning products"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' }}
                />
              </div>
              <div className="alt-content">
                <Leaf className="alt-icon" size={40} />
                <h3>Eco-Certified Products Only</h3>
                <p>A clean home shouldn't come at the cost of your family's health. We exclusively use premium, eco-certified cleaning products that are completely non-toxic. Safe for your family, gentle on your pets, and better for the planet—without compromising on cleaning power.</p>
              </div>
            </div>
            <div className="alt-row reveal">
              <div className="alt-visual">
                <img
                  src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80"
                  alt="Sparkling clean bathroom"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' }}
                />
              </div>
              <div className="alt-content">
                <Star className="alt-icon" size={40} fill="currentColor" />
                <h3>24-Hour Happiness Guarantee</h3>
                <p>Your satisfaction is our only metric of success. If you're not completely thrilled with your cleaning, let us know within 24 hours. We will return and re-clean any missed areas completely free of charge. No hassle, no arguments, just a spotless home.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ BEFORE/AFTER — images now actually render via backgroundImage */}
        <section className="ba-section section-padding">
          <div className="container">
            <div className="text-center reveal">
              <h2 className="section-header">AG Cleaning Difference</h2>
              <p className="section-subheader">Drag the slider to see the transformation</p>
            </div>
            <div className="ba-grid">

              {/* KITCHEN */}
              <BeforeAfterSlider
                beforeText="Before"
                afterText="After"
                beforeImg="https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=700&q=80"
                afterImg="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=700&q=80"
              />

              {/* BATHROOM */}
              <BeforeAfterSlider
                beforeText="Before"
                afterText="After"
                beforeImg="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=700&q=80"
                afterImg={bathroom}
              />

              {/* LIVING ROOM */}
              <BeforeAfterSlider
                beforeText="Before"
                afterText="After"
                beforeImg={living}
                afterImg="https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=700&q=80"
              />

            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="pricing-section section-padding">
          <div className="container">
            <div className="text-center reveal">
              <h2 className="section-header">Simple, Transparent Pricing</h2>
              <p className="section-subheader">No hidden fees. Just pristine spaces.</p>
            </div>
            <div className="pricing-grid">
              <div className="card pricing-card reveal">
                <span className="pricing-tier">Basic</span>
                <h3 className="pricing-title">Standard Clean</h3>
                <div className="pricing-price">$89<span>/from</span></div>
                <hr />
                <div className="pricing-features">
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Up to 2 bedrooms</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Kitchen & bathrooms</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Dusting & vacuuming</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Mopping floors</div>
                </div>
                <a href="#contact" className="btn-secondary">Book Now</a>
              </div>
              <div className="card pricing-card popular reveal" style={{ transitionDelay: '100ms' }}>
                <span className="popular-badge">Most Popular</span>
                <span className="pricing-tier">Recurring</span>
                <h3 className="pricing-title">Recurring Clean</h3>
                <div className="pricing-price">$149<span>/mo from</span></div>
                <hr />
                <div className="pricing-features">
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Weekly or bi-weekly</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Priority scheduling</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Same team always</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Loyalty discounts</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Free re-clean policy</div>
                </div>
                <a href="#contact" className="btn-primary">Get Started</a>
              </div>
              <div className="card pricing-card reveal" style={{ transitionDelay: '200ms' }}>
                <span className="pricing-tier">Intensive</span>
                <h3 className="pricing-title">Full Reset</h3>
                <div className="pricing-price">$199<span>/from</span></div>
                <hr />
                <div className="pricing-features">
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Inside appliances</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Baseboards & vents</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Windows interior</div>
                  <div className="pricing-feature"><Check className="pricing-feature-icon" size={18} /> Full deep scrub</div>
                </div>
                <a href="#contact" className="btn-secondary">Book Now</a>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="testimonials-section section-padding">
          <div className="container">
            <div className="text-center reveal">
              <h2 className="section-header">What Our Clients Say</h2>
              <p className="section-subheader">Don't just take our word for it</p>
            </div>
            <div className="test-grid">
              <div className="test-card reveal">
                <div className="stars">★★★★★</div>
                <p className="test-quote">"I've tried four cleaning services. Lumière is the only one I've kept. They remembered my cat's name."</p>
                <div className="test-author">Sarah M.</div>
                <div className="test-meta">Homeowner, Vancouver · Recurring Clean</div>
              </div>
              <div className="test-card reveal">
                <div className="stars">★★★★★</div>
                <p className="test-quote">"Booked same-day for an Richmond turnover. Guests left a 5-star review specifically about cleanliness."</p>
                <div className="test-author">James T.</div>
                <div className="test-meta">Airbnb Host, Austin · Coquitlam Cleaning</div>
              </div>
              <div className="test-card reveal">
                <div className="stars">★★★★★</div>
                <p className="test-quote">"They cleaned behind the refrigerator. I've lived here 6 years. No one has ever done that."</p>
                <div className="test-author">Priya K.</div>
                <div className="test-meta">Apartment Resident, Langley · Deep Clean</div>
              </div>
              <div className="test-card reveal">
                <div className="stars">★★★★★</div>
                <p className="test-quote">"Worth every penny. I get home from work to a clean house and it genuinely changes my mood."</p>
                <div className="test-author">Daniel R.</div>
                <div className="test-meta">Professional, North Vancouver · Weekly Recurring</div>
              </div>
              <div className="test-card reveal">
                <div className="stars">★★★★★</div>
                <p className="test-quote">"The eco-friendly products were important to me. My toddler plays on these floors. Lumière gets it."</p>
                <div className="test-author">Amanda L.</div>
                <div className="test-meta">Parent, Surrey · Eco-Friendly Clean</div>
              </div>
              <div className="test-card reveal">
                <div className="stars">★★★★★</div>
                <p className="test-quote">"Response was under 2 hours. They came the next morning. That kind of reliability is rare."</p>
                <div className="test-author">Marcus W.</div>
                <div className="test-meta">Property Manager, West Vancouver · Move-Out Clean</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="hiw-section section-padding">
          <div className="container">
            <div className="text-center reveal">
              <h2 className="section-header">Three Steps to a Spotless Home</h2>
              <p className="section-subheader">We've made the process as clean as the results</p>
            </div>
            <div className="steps-container reveal">
              <div className="steps-line"></div>
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-icon-wrap"><Calendar size={32} /></div>
                <h3>Book Online</h3>
                <p>Choose your service, pick a date, done in 60 seconds.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-icon-wrap"><Home size={32} /></div>
                <h3>We Show Up</h3>
                <p>Vetted professionals arrive on time with all supplies.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-icon-wrap"><Sparkles size={32} /></div>
                <h3>Enjoy Your Space</h3>
                <p>Come home to a spotless, fresh-smelling home.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE AREAS */}
        <section id="areas" className="areas-section section-padding">
          <div className="container">
            <div className="areas-layout">
              <div className="reveal">
                <h2 className="section-header" style={{ fontSize: '48px' }}>We Come to You</h2>
                <p className="section-subheader" style={{ marginBottom: '32px' }}>Proudly serving the greater metropolitan area and surrounding suburbs.</p>
                <div className="areas-grid">
                  {[
  'Vancouver',
  'Burnaby',
  'Richmond',
  'Surrey',
  'Coquitlam',
  'North Vancouver',
  'West Vancouver',
  'Delta',
  'Langley',
  'New Westminster',
  'Maple Ridge',
  'White Rock'
].map((city, i) => (
                    <div className="area-item" key={i}>
                      <MapPin className="area-icon" size={18} /> {city}
                    </div>
                  ))}
                </div>
              </div>
              <div className="reveal">
                <div className="map-placeholder">
                  <div className="map-dot"></div>
                  <div className="map-dot"></div>
                  <div className="map-dot"></div>
                  <div className="map-dot"></div>
                  <div className="map-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq-section section-padding">
          <div className="container">
            <div className="text-center reveal">
              <h2 className="section-header">Frequently Asked Questions</h2>
              <p className="section-subheader">Everything you need to know about our services.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <FaqItem 
                  key={i}
                  question={faq.q} 
                  answer={faq.a} 
                  isOpen={openFaqIndex === i}
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="cta-banner reveal">
          <div className="cta-circle"></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h2>Ready for a Cleaner Home?</h2>
            <p>Join 500+ households who trust Lumière Clean every week.</p>
            <div className="cta-buttons">
              <a href="#contact" className="btn-primary">Book Your First Clean</a>
              <a href="tel:7787889271" className="btn-secondary btn-outline-white">Call Us: 778-788-9271</a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact-section section-padding">
          <div className="container contact-layout">
            <div className="reveal">
              {isSubmitted ? (
                <div className="contact-form success-message">
                  <div className="success-icon"><Check size={32} /></div>
                  <h3>Message Sent Successfully!</h3>
                  <p style={{ marginTop: '16px' }}>Thank you for reaching out. A Lumière Clean specialist will contact you within 2 hours to confirm your booking details.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleFormSubmit}>
                  <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Request a Quote</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" placeholder="Jane Doe" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="jane@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" placeholder="(555) 000-0000" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Service Needed</label>
                      <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                        <option value="">Select a service...</option>
                        {services.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group form-full">
                      <label>Message / Special Instructions (Optional)</label>
                      <textarea rows="4" placeholder="Tell us about your home and any specific needs..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary submit-btn">Send Message</button>
                </form>
              )}
            </div>
            <div className="contact-info reveal">
              <h2 className="section-header" style={{ fontSize: '40px' }}>Get in Touch</h2>
              <p style={{ marginBottom: '40px' }}>Have a question or prefer to book over the phone? Our team is ready to assist you.</p>
              <div className="info-item">
                <Phone className="info-icon" size={24} />
                <div><h4>Call Us</h4><p>778-788-9271</p></div>
              </div>
              <div className="info-item">
                <Clock className="info-icon" size={24} />
                <div><h4>Operating Hours</h4><p>Mon–Sat: 7:00 AM – 7:00 PM<br/>Sun: 8:00 AM – 5:00 PM</p></div>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" size={24} />
                <div><h4>Headquarters</h4><p>123 Clean Street, Suite 400<br/>North Vancouver , IL 60601</p></div>
              </div>
              <div className="badge-insured">
                <Shield size={20} color="var(--accent-sage)" />
                Licensed, Bonded & Insured
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col reveal">
              <div className="logo footer-logo">
                <span className="logo-lumiere">AG</span>
                <span className="logo-clean">Cleaning</span>
              </div>
              <p style={{ maxWidth: '280px' }}>Premium residential cleaning services designed to bring luxury and peace of mind to your busy life.</p>
              <div className="footer-social">
                <a href="/" className="social-circle">F</a>
                <a href="/" className="social-circle">I</a>
                <a href="/" className="social-circle">G</a>
              </div>
            </div>
            <div className="footer-col reveal" style={{ transitionDelay: '100ms' }}>
              <h4>Services</h4>
              <ul className="footer-links">
                <li><a href="#services">Standard Cleaning</a></li>
                <li><a href="#services">Deep Cleaning</a></li>
                <li><a href="#services">Recurring Plans</a></li>
                <li><a href="#services">Move In / Out</a></li>
                <li><a href="#services">Airbnb Turnover</a></li>
              </ul>
            </div>
            <div className="footer-col reveal" style={{ transitionDelay: '200ms' }}>
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#areas">Service Areas</a></li>
                <li><a href="/">Careers</a></li>
                <li><a href="/">Blog</a></li>
              </ul>
            </div>
            <div className="footer-col reveal" style={{ transitionDelay: '300ms' }}>
              <h4>Contact</h4>
              <ul className="footer-links">
                <li>778-788-9271</li>
                <li>hello@agcleaning.com</li>
                <li>Serving Vancouver & Surrounding Areas</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom reveal">
            <div>&copy; {new Date().getFullYear()} AG Cleaning. All rights reserved.</div>
            <div className="footer-bottom-links">
              <a href="/">Privacy Policy</a>
              <a href="/">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="mobile-cta-bar">
        <div className="mobile-cta-grid">
          <a href="tel:3125550192" className="btn-secondary" style={{ padding: '12px' }}>
            <Phone size={16} style={{ marginRight: '8px' }} /> Call
          </a>
          <a href="#contact" className="btn-primary" style={{ padding: '12px' }}>Book Now</a>
        </div>
      </div>
    </>
  );
}