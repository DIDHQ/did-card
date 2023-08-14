import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        gradient:
          'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
      },
    },
  },
  plugins: [],
}
export default config
