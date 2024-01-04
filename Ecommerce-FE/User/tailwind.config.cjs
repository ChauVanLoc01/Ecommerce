/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        phone: '425px'
      },
      colors: {
        primary: '#ee4d2d',
        header: '#d0011b',
        blue: '#05a',
        red: '#d0011b',
        rate: '#FFBB1C',
        product: '#FFFFFF',
        backg: '#F5F5F5',
        footer: '#FBFBFB',
        sort: '#EDEDED'
      },
      backgroundColor: {
        primary: '#ee4d2d',
        header: '#d0011b',
        red: '#d0011b'
      },
      backgroundImage: {
        bgPrimary: 'url("/public/BackgroundPrimary.png")'
      },
      maxWidth: {
        primary: '1200px'
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))'
      },
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))'
      },
      flexBasis: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
        '8/8': '100%'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
}
