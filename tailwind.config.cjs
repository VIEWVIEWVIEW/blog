const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	safelist: [	],
	theme: {
		extend: {
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						code: {
							// overflow-wrap will only create a break if an entire word cannot be placed on its own line without overflowing.
							overflowWrap: 'anywhere', // 
							// disable scroll bar
							overflow: 'visible',
							// indent code to line before
							whiteSpace: 'pre-wrap',
							// break words if necessary. Btw, "brea-word" is deprecated. See https://developer.mozilla.org/en-US/docs/Web/CSS/word-break
							wordBreak: 'break-all'
						}
					}
				}
			}),
			fontFamily: {
				sans: ["inter", "Arial"], // ...defaultTheme.fontFamily.sans],
				serif: [...defaultTheme.fontFamily.serif],
			},
			colors: {
				'sea-pink': {
					'50': '#fdf3f4',
					'100': '#fbe8eb',
					'200': '#f6d5da',
					'300': '#ea9daa',
					'400': '#e58799',
					'500': '#d75c77',
					'600': '#c13d60',
					'700': '#a22e4f',
					'800': '#882947',
					'900': '#752642',
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
