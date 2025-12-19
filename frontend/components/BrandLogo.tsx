import React from 'react';

interface BrandLogoProps {
    className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "h-8 w-auto" }) => (
    <img src="/logo.png" alt="TRIIIO Logo" className={className} />
);

export default BrandLogo;
