import { useRef, useState, useEffect } from "react";

export const useCarousel = (itemCount: number, cardWidth: number) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Initialize activeIndex to center after mount or when itemCount changes
    useEffect(() => {
        if (itemCount > 0) {
            setActiveIndex(Math.floor(itemCount / 2));
        }
    }, [itemCount]);

    const startX = useRef(0);

    const onTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        const diff = startX.current - e.changedTouches[0].clientX;

        if (diff > 50 && activeIndex < itemCount - 1) {
            setActiveIndex(prev => prev + 1);
        } else if (diff < -50 && activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
        }
    };

    // We need to center the active card.
    // The formula for centering an item with index `i` of width `w` in a container:
    // translateX = (ContainerCenter) - (ItemPosition)
    // ItemPosition (center) = i * w + w/2
    // We want to simulate the container moving, so we apply negative translateX?
    // User's formula: translateX(calc(50% - ${activeIndex * cardWidth + cardWidth / 2}px))
    // This assumes the strip starts at the left edge of the screen/container.
    // container center = 50%
    // item center relative to start of strip = activeIndex * cardWidth + cardWidth/2
    // So shifting the strip by (50% - itemCenter) puts the itemCenter at 50%.

    // Note: We need to account for margins if they exist. 
    // In the user's `FeaturedCarousel`, the map has `mx-4` which is 16px on each side = 32px extra width effectively per item?
    // Or is cardWidth including margin? 
    // User passed `CARD_WIDTH = 280` and in the map `style={{ width: CARD_WIDTH }}` and `mx-4`.
    // So total width per item is 280 + 32 = 312.
    // The hook takes `cardWidth`. I should probably pass the effective width or handle it here.
    // The user's snippet passed `CARD_WIDTH` (280) to the hook.
    // But correct calculation depends on the spacing.
    // standard margin mx-4 is 1rem left + 1rem right = 32px.
    const effectiveWidth = cardWidth + 32;

    const translateX = `translateX(calc(50% - ${activeIndex * effectiveWidth + cardWidth / 2
        }px))`;

    return {
        activeIndex,
        setActiveIndex,
        translateX,
        onTouchStart,
        onTouchEnd,
    };
};
