import React from 'react';

const ProductSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-4" />
            <div className="space-y-2 flex flex-col items-center">
                <div className="h-2 bg-gray-200 w-1/4 rounded-full" />
                <div className="h-4 bg-gray-200 w-3/4 rounded-sm" />
                <div className="h-4 bg-gray-200 w-1/5 mt-1 rounded-sm" />
            </div>
        </div>
    );
};

export default ProductSkeleton;
