import forms from '@tailwindcss/forms'
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {

    darkMode: ['selector', '[data-theme="night"]'],

    content: [
		'./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
		 './storage/framework/views/*.php',
		 './resources/views/**/*.blade.php',
		 './resources/js/**/*.{js,jsx,vue}',
		 "./vendor/robsontenorio/mary/src/View/Components/**/*.php"
	],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [
        forms,
		require("daisyui")
	],

    daisyui: {
        // themes: false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
        themes: [
            {
                corporate: {
                    "color-scheme": "light",
                    "primary": "oklch(60.39% 0.228 269.1)",
                    "secondary": "#7b92b2",
                    "accent": "#67cba0",
                    "neutral": "#181a2a",
                    "neutral-content": "#edf2f7",
                    "base-100": "oklch(100% 0 0)",
                    "base-content": "#181a2a",
                    // "base-content": "#181a2a",
                    "--rounded-box": "0.25rem",
                    "--rounded-btn": ".325rem",
                    "--rounded-badge": ".125rem",
                    "--tab-radius": "0.25rem",
                    "--animation-btn": "0",
                    "--animation-input": "0",
                    "--btn-focus-scale": "1",
                },
            },
        ],
        darkTheme: "dark", // name of one of the included themes for dark mode
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
        themeRoot: ":root", // The element that receives theme color CSS variables
    },

}
