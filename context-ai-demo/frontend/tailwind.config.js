/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gray: {
                    900: '#0a0a0f',
                    800: '#14141e',
                    700: '#1f1f2e',
                    600: '#2a2a3e',
                }
            }
        },
    },
    plugins: [],
}
