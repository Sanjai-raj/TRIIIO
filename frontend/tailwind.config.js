/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#008B9E', // Brand Teal
                'primary-dark': '#006D7C', // Darker Teal for hovers
                secondary: '#4b5563', // Gray 600
                brand: '#008B9E', // TRIIIO Teal
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
                fadeIn: "fadeIn 0.15s ease-out",
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                fadeIn: {
                    from: { opacity: 0, transform: "translateY(-4px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            }
        },
    },
    plugins: [],
}
