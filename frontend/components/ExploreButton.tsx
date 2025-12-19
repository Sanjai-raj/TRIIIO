import React from 'react';

interface ExploreButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}

const ExploreButton: React.FC<ExploreButtonProps> = ({ children = "Explore", className = "", ...props }) => {
    return (
        <button
            type="button"
            className={`
        relative overflow-hidden cursor-pointer
        py-3.5 px-6 min-w-[120px] min-h-[44px]
        text-base font-medium text-white
        border-none rounded-lg
        transition-all duration-700 ease-in-out
        bg-[size:280%_auto]
        hover:bg-[position:right_top]
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        ${className}
      `}
            style={{
                backgroundImage: `linear-gradient(325deg, hsla(217, 100%, 56%, 1) 0%, hsla(194, 100%, 69%, 1) 55%, hsla(217, 100%, 56%, 1) 90%)`,
                boxShadow: `
          0px 0px 20px rgba(71, 184, 255, 0.5),
          0px 5px 5px -1px rgba(58, 125, 233, 0.25),
          inset 4px 4px 8px rgba(175, 230, 255, 0.5),
          inset -4px -4px 8px rgba(19, 95, 216, 0.35)
        `
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default ExploreButton;
