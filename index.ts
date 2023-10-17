import fs from 'fs'
import { FigmaToken } from './types';
const figmaToken = JSON.parse(fs.readFileSync('variables.json', 'utf-8')) as FigmaToken;

const tailwindConfig = {
    purge: [],
    darkMode: false,
    theme: {
        extend: {
            colors: {},
        },
    },
    variants: {},
    plugins: [],
};

// seperate every type of collection into its own variable using iteration and name conditions
const primitiveColors = figmaToken.collections.filter((collection) => collection.name === 'Primitives ( Colors )');
const semanticColors = figmaToken.collections.filter((collection) => collection.name === 'Semantic ( Colors )');
const componentColors = figmaToken.collections.filter((collection) => collection.name === 'Component ( Colors )');
const primitiveDimensions = figmaToken.collections.filter((collection) => collection.name === 'Primitives ( Dimensions )');
const typography = figmaToken.collections.filter((collection) => collection.name === 'Typography');
const effects = figmaToken.collections.filter((collection) => collection.name === 'Effects');

// console.log(primitiveColors, semanticColors, componentColors, primitiveDimensions, typography, effects);

const primitiveMap = new Map<string, any>();
const semanticMap = new Map<string, any>();
const componentMap = new Map<string, any>();
const dimensionMap = new Map<string, any>();
const typographyMap = new Map<string, any>();
const effectsMap = new Map<string, any>();

primitiveColors.forEach((collection) => {
    collection.modes.forEach((mode) => {
        mode.variables.forEach((variable) => {
            if (variable.type === 'color') {
                // console.log(variable.name)
                const colorName = variable.name.replace(/\//g, '-').toLowerCase()
                const colorValue = variable.value;
                tailwindConfig.theme.extend.colors = {
                    ...tailwindConfig.theme.extend.colors,
                    [colorName]: colorValue,
                };
                primitiveMap.set(variable.name, colorValue);
            }
        });
    });
});

semanticColors.forEach((collection) => {
    collection.modes.forEach((mode) => {
        mode.variables.forEach((variable) => {
            if (variable.type === 'color') {
                // console.log(variable.name)
                const colorName = variable.name.split("/")[variable.name.split("/").length - 1].toLowerCase();
                // if variable.value is a string, use it as a color name to map to the colorMap, else use variable.value.name
                // @ts-ignore
                const colorValue = typeof variable.value === 'string' ? variable.value : primitiveMap.get(variable.value.name);
                // console.log(colorValue)
                tailwindConfig.theme.extend.colors = {
                    ...tailwindConfig.theme.extend.colors,
                    [colorName]: colorValue,
                };
                semanticMap.set(variable.name, colorValue);
            }
        });
    });
})

componentColors.forEach((collection) => {
    collection.modes.forEach((mode) => {
        mode.variables.forEach((variable) => {
            if (variable.type === 'color') {
                const colorName = variable.name.split("/")[variable.name.split("/").length - 1].toLowerCase();
                // @ts-ignore
                const colorValue = typeof variable.value === 'string' ? variable.value : semanticMap.get(variable.value.name);
                // console.log(colorValue)
                tailwindConfig.theme.extend.colors = {
                    ...tailwindConfig.theme.extend.colors,
                    [colorName]: colorValue,
                };
            }
        });
    });
});

// Serialize the Tailwind CSS configuration to a JavaScript file
const tailwindConfigFile = 'module.exports = ' + JSON.stringify(tailwindConfig, null, 2);

// Write the configuration to 'tailwind.config.js'
fs.writeFileSync('generated/tailwind.config.js', tailwindConfigFile, 'utf-8');

console.info('tailwind.config.js generated successfully.');