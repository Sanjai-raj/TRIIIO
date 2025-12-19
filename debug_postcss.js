import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import fs from 'fs';

const css = fs.readFileSync('index.css', 'utf8');

postcss([tailwindcss, autoprefixer])
    .process(css, { from: 'index.css', to: 'output.css' })
    .then(result => {
        console.log('Success!');
    })
    .catch(error => {
        console.error('PostCSS Error:', error);
    });
