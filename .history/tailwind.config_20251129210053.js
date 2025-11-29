/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{ejs,html,js}",
    "./public/js/**/*.js"
  ],
  theme: {
    extend: {

 fontFamily: {
        exo: ['Exo', 'sans-serif'],
        goldman: ['Goldman', 'cursive'],
        custom: ['Paytone One', 'sans-serif'],
        main: ['Open Sans', 'Exo']
      },








    },
  },
  plugins: [],
};
