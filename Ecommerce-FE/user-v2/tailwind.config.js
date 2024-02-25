/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        'node_modules/preline/dist/*.js',
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                bell: 'rgb(219, 224, 229)',
                border: 'rgb(190, 200, 208)'
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
    plugins: [require('preline/plugin'), require('@tailwindcss/forms')]
}
