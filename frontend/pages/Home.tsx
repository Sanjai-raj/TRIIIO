import React from 'react';
import HomeHero from '../components/home/HomeHero';
import PromotionalGrid from '../components/home/PromotionalGrid';
import FeaturedCarousel from '../components/featured/FeaturedCarousel';

const Home: React.FC = () => {
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