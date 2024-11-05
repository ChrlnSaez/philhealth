/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

const config = withMT({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
});

export default config;
