"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ConnectSection from "../ConnectSection";
import styles from "./LandingPage.module.css";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Featured", href: "#featured" },
  { label: "Reviews", href: "#reviews" },
  { label: "News", href: "#news" },
  { label: "Why", href: "#why" },
];

const featureCards = [
  {
    title: "Instant Matchmaking",
    description: "Smart filters to surface the best rooms for your budget and city.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={40}
        height={40}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Owner Messaging",
    description: "Chat directly with verified owners to ask questions and book faster.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={40}
        height={40}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 100-.75.375.375 0 000 .75zm6.75 0a.375.375 0 100-.75.375.375 0 000 .75z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c4.556 0 8.25-2.94 8.25-6.563 0-2.046-1.064-3.84-2.764-5.04a.75.75 0 00-.986.097l-1.37 1.37A7.458 7.458 0 0112 8.25a7.46 7.46 0 01-3.13.865l-1.37-1.37a.75.75 0 00-.986-.097C5.064 9.847 4 11.641 4 13.687c0 3.623 3.694 6.563 8.25 6.563z"
        />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "Protected online payments with receipts and booking confirmations.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={40}
        height={40}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 1.5v21m10.5-10.5H1.5"
        />
      </svg>
    ),
  },
  {
    title: "Verified Listings",
    description: "Every property is checked for authenticity before it goes live.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={40}
        height={40}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];
const featureSlides = [...featureCards, ...featureCards];

const featuredRooms = [
  { title: "Deluxe Suite", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { title: "Deluxe Elite", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" },
  { title: "Cozy Studio", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
  { title: "Cozy Cabin", img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" },
];

const reviews = [
  {
    name: "Ananya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Found the perfect apartment in Bandra within hours. The host was incredibly responsive and the booking process was seamless.",
    date: "2 weeks ago",
  },
  {
    name: "Rohit Kapoor",
    location: "Delhi",
    rating: 5,
    text: "We booked a heritage haveli in Jaipur for a family trip. The photos were accurate, check-in was smooth, and the rooftop views were unreal.",
    date: "1 month ago",
  },
  {
    name: "Meera Nair",
    location: "Bangalore",
    rating: 4,
    text: "Great selection of properties in Goa. Loved the filter options  - made it easy to find a villa within our budget with a pool.",
    date: "3 weeks ago",
  },
];

const blogPosts = [
  {
    title: "Top 10 Beachfront Stays in Goa",
    category: "Travel Guide",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    excerpt: "Discover the most stunning beachside properties that Goa has to offer this season.",
  },
  {
    title: "How to Be a 5-Star Host",
    category: "Hosting Tips",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    excerpt: "Essential tips from top-rated hosts to help you deliver unforgettable guest experiences.",
  },
];

const whyCards = [
  {
    title: "Verified Listings",
    description: "Each property is verified for authenticity to ensure trust and safety.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={40}
        height={40}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Owner-Tenant Chat",
    description: "Connect directly with owners for transparent and easy communication.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={40}
        height={40}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 100-.75.375.375 0 000 .75zm6.75 0a.375.375 0 100-.75.375.375 0 000 .75z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c4.556 0 8.25-2.94 8.25-6.563 0-2.046-1.064-3.84-2.764-5.04a.75.75 0 00-.986.097l-1.37 1.37A7.458 7.458 0 0112 8.25a7.46 7.46 0 01-3.13.865l-1.37-1.37a.75.75 0 00-.986-.097C5.064 9.847 4 11.641 4 13.687c0 3.623 3.694 6.563 8.25 6.563z"
        />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "Enjoy hassle-free, safe, and reliable online payment options.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={40}
        height={40}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 1.5v21m10.5-10.5H1.5"
        />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroTilt, setHeroTilt] = useState({ rotateX: 0, rotateY: 0 });
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
      setScrolled(scrollTop > 40);
      setShowTop(scrollTop > 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(`.${styles.animateIn}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const rotateY = (relX - 0.5) * 4;
    const rotateX = (0.5 - relY) * 4;
    setHeroTilt({ rotateX, rotateY });
  };

  const resetHeroTilt = () => setHeroTilt({ rotateX: 0, rotateY: 0 });

  return (
    <main className={styles.page}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <div className={styles.ambientBlob} aria-hidden />

      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
      >
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className={styles.logoTitle}>RoomBridge</h1>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.buttonGroup}>
          <Link href="/auth/signin" className={styles.primaryButton}>
            Login
          </Link>
          <Link href="/auth/signup" className={styles.primaryButton}>
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={styles.mobileMenuLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className={styles.mobileMenuButtons}>
            <Link href="/auth/signin" className={styles.primaryButton} onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
            <Link href="/auth/signup" className={styles.primaryButton} onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Link>
          </div>
        </div>
      )}

      <section
        id="home"
        className={styles.hero}
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={resetHeroTilt}
      >
        <Image
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80"
          alt="Hotel Room"
          fill
          className={styles.heroImage}
        />
        <div className={styles.heroGradient} />
        <div
          className={styles.heroContent}
          style={{
            transform: `perspective(1200px) rotateX(${heroTilt.rotateX}deg) rotateY(${heroTilt.rotateY}deg)`,
          }}
        >
          <h2 className={styles.heroTitle}>Rooms That Feel Like Home</h2>
          <p className={styles.heroText}>
            Curated spaces, verified hosts, and easy booking in minutes.
          </p>

          <Link href="/auth/signup" className={`${styles.searchButton} ${styles.heroCta}`}>
            Get Started
          </Link>
        </div>
      </section>

      <section
        id="features"
        className={`${styles.whySection} ${styles.animateIn}`}
      >
        <div className={styles.whyCardWrapperForRoomBridgeFeatures}>
          <h3 className={styles.sectionTitleForRoomBridgeFeatures}>RoomBridge Features</h3>
          <div className={styles.featureSlider}>
            <div className={styles.featureMaskLeft} aria-hidden />
            <div className={styles.featureMaskRight} aria-hidden />
            <div className={styles.featureTrack}>
              {featureSlides.map((card, idx) => (
                <div key={`${card.title}-${idx}`} className={styles.featureSlide}>
                  <div className={styles.whyCard}>
                    <div className={styles.whyCardIcon}>{card.icon}</div>
                    <h4 className={styles.whyCardTitle}>{card.title}</h4>
                    <p className={styles.whyCardText}>{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="featured"
        className={`${styles.featuredSection} ${styles.animateIn}`}
      >
        <h3 className={styles.sectionTitle}>Featured Rooms</h3>
        <div className={styles.roomsGrid}>
          {featuredRooms.map((room) => (
            <div key={room.title} className={styles.roomCard}>
              <Image
                src={room.img}
                alt={room.title}
                width={400}
                height={300}
                className={styles.roomImage}
              />
              <div className={styles.roomContent}>
                <h4 className={styles.roomTitle}>{room.title}</h4>
                <p className={styles.roomText}>
                  Experience unmatched comfort and luxury in our {room.title}.
                </p>
                <button className={styles.primaryButton}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className={`${styles.reviewsSection} ${styles.animateIn}`}>
        <h3 className={styles.sectionTitle}>What Our Guests Say</h3>
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.name} className={styles.reviewCard}>
              <div className={styles.reviewStars}>
                {"\u2605".repeat(review.rating)}
                {"\u2606".repeat(5 - review.rating)}
              </div>
              <p className={styles.reviewText}>&ldquo;{review.text}&rdquo;</p>
              <div className={styles.reviewAuthor}>
                <div className={styles.reviewAvatar}>
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className={styles.reviewName}>{review.name}</p>
                  <p className={styles.reviewLocation}>{review.location} · {review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section id="news" className={`${styles.blogSection} ${styles.animateIn}`}>
        <h3 className={styles.sectionTitle}>From Our Blog</h3>
        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <div key={post.title} className={styles.blogCard}>
              <div className={styles.blogImageWrapper}>
                <Image
                  src={post.img}
                  alt={post.title}
                  width={600}
                  height={300}
                  className={styles.blogImage}
                />
                <span className={styles.blogCategory}>{post.category}</span>
              </div>
              <div className={styles.blogContent}>
                <h4 className={styles.blogTitle}>{post.title}</h4>
                <p className={styles.blogExcerpt}>{post.excerpt}</p>
                <button type="button" className={styles.blogLink}>
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.connectSection} ${styles.animateIn}`}>
        <ConnectSection />
      </section>

      <section id="why" className={`${styles.whySection} ${styles.animateIn}`}>
        <div className={styles.whyCardWrapper}>
          <h3 className={styles.sectionTitle}>Why Choose RoomBridge?</h3>
          <div className={styles.whyCardGrid}>
            {whyCards.map((card) => (
              <div key={card.title} className={styles.whyCard}>
                <div className={styles.whyCardIcon}>{card.icon}</div>
                <h4 className={styles.whyCardTitle}>{card.title}</h4>
                <p className={styles.whyCardText}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showTop && (
        <button
          type="button"
          className={styles.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          ↑ Back to top
        </button>
      )}
    </main>
  );
}
