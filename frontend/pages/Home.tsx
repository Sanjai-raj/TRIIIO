import React, { useState, useEffect } from 'react';
import HomeHero from '../components/home/HomeHero';
import PromotionalGrid from '../components/home/PromotionalGrid';
import FeaturedCarousel from '../components/featured/FeaturedCarousel';
import HomeMobile from './HomeMobile';

const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <HomeMobile />;
  }

  return (
    <div className="font-sans text-gray-900">

      {/* 
        Home Hero Slider (Framer Motion)
        Replaces static Hero or backend-driven sections
      */}
      <HomeHero />

      {/* PROMOTIONAL GRID SECTION (Curated Styles) */}
      <PromotionalGrid />

      {/* FEATURED COLLECTION CAROUSEL SECTION */}
      <FeaturedCarousel />

    </div>
  );
};

export default Home;