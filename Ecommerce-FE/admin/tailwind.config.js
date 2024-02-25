/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                blue: '#3366ff',
                blue_hover: 'rgb(37, 78, 219)',
                red: 'rgb(255, 69, 40)',
                red_hover: 'rgb(219, 39, 29)',
                work: '#5b6b79',
                text_1: 'rgb(29, 38, 48)',
                text_2: 'rgb(91, 107, 121)',
                border: 'rgb(190, 200, 208)',
                bell: 'rgb(219, 224, 229)'
            },
            borderRadius: {
                6: '6px',
                8: '8px',
                12: '12px',
                16: '16px',
                22: '22px',
                24: '24px'
            },
            padding: {
                6: '6px',
                8: '8px',
                12: '12px',
                14: '14px',
                16: '16px',
                20: '20px',
                22: '22px',
                24: '24px',
                48: '48px'
            },
            gap: {
                25: '25px',
                48: '48px'
            },
            fontFamily: {
                default: 'Inter, sans-serif'
            },
            boxShadow: {
                input: '0 0 0 2px rgba(5, 145, 255, 0.1)'
            }
        }
    },
    plugins: []
}
