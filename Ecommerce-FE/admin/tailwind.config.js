/** @type {import('tailwindcss').Config} */
module.exports = {
    important: true,
    darkMode: ['class'],
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        extend: {
            colors: {
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
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
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
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
    plugins: [require('tailwindcss-animate')]
}
