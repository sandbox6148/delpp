export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#CA8A04', // Gold 600
                secondary: '#44403C', // Stone 700 
                accent: '#CA8A04',
                background: '#FAFAF9', // Stone 50 (Light premium background)
                surface: '#FFFFFF',
                'surface-dark': '#1C1917', // Stone 900
                border: '#E7E5E4', // Stone 200
                text: {
                    main: '#0C0A09', // Stone 950
                    muted: '#57534E', // Stone 600
                    onDark: '#FAFAF9'
                },
                status: {
                    todo: '#78716C', // Stone 500
                    progress: '#CA8A04', // Gold
                    done: '#1C1917' // Black
                }
            },
            fontFamily: {
                sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(28, 25, 23, 0.1)',
            }
        },
    },
    plugins: [],
}
