import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        cream: '#F7F2EA',
        'warm-white': '#FDFAF5',
        'deep-brown': '#1C1208',
        'rich-brown': '#3B2A14',
        amber: '#C4832A',
        gold: '#E2A94B',
        sage: '#6B7E5A',
        terra: '#B85C38',
        muted: '#8A7B68',
        sky: '#3E7EA6',
        forest: '#2E6B52',
      },
    },
  },
  plugins: [],
}
export default config
