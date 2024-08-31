/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "rich-black": "#0d1f22",
                //prettier-ignore
                "platinum": "#d0ddd7",
                "slate-gray": "#6c809a",
                "midnight-green": "#225059",
                "blue-munsell": "#388594",
            },
            fontFamily: {
                body: ["Outfit"],
            },
        },
    },
    plugins: [],
};
