import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children = "Pick up!", className = "", ...props }) => {
    return (
        <button
            className={`
        w-[9em] h-[3em] rounded-full text-[15px] font-inherit border-none relative overflow-hidden z-10
        shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]
        group transition-transform active:scale-95
        ${className}
      `}
            {...props}
        >
            <span className="relative z-10 font-bold tracking-wide text-gray-700 group-hover:text-white transition-colors duration-300">
                {children}
            </span>
            <div
                className="
          absolute top-0 left-0 h-full w-0 rounded-full
          bg-gradient-to-r from-[#0fd850] to-[#f9f047]
          transition-all duration-500 ease-in-out
          group-hover:w-full
          z-0
        "
            />
        </button>
    );
};

export default AnimatedButton;
