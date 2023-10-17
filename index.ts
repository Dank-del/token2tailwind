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

figmaToken.collections.forEach((collection) => {
    const colorMap = new Map<string, any>();
    if (collection.name === 'Primitives ( Colors )') {
        collection.modes.forEach((mode) => {
            mode.variables.forEach((variable) => {
                if (variable.type === 'color') {
                    // console.log(variable.name)
                    const colorName = variable.name.split("/")[variable.name.split("/").length - 1].toLowerCase()
                    const colorValue = variable.value;
                    tailwindConfig.theme.extend.colors = {
                        ...tailwindConfig.theme.extend.colors,
                        [colorName]: colorValue,
                    };
                    colorMap.set(colorName, colorValue);
                }
            });
        });
    }
    // if collection name is Semantic ( Colors ), use this colorMap to map variables of Semantic ( Colors ) to Tailwind CSS configuration while keeping the previous colors
    if (collection.name === 'Semantic ( Colors )') {
        collection.modes.forEach((mode) => {
            mode.variables.forEach((variable) => {
                if (variable.type === 'color') {
                    // console.log(variable.name)
                    const colorName = variable.name.split("/")[variable.name.split("/").length - 1].toLowerCase();
                    // if variable.value is a string, use it as a color name to map to the colorMap, else use variable.value.name
                    const colorValue = typeof variable.value === 'string' ? variable.value : variable.name.split("/")[variable.name.split("/").length - 1].toLowerCase();
                    // console.log(colorValue)
                    tailwindConfig.theme.extend.colors = {
                        ...tailwindConfig.theme.extend.colors,
                        [colorName]: colorValue,
                    };
                }
            });
        });
    }
    // console.log(tailwindConfig.theme.extend.colors)
    // if collection name is Component ( Colors ), use this colorMap to map variables of Component ( Colors ) to Tailwind CSS configuration while keeping the previous colors
    if (collection.name === 'Component ( Colors )') {
        collection.modes.forEach((mode) => {
            mode.variables.forEach((variable) => {
                if (variable.type === 'color') {
                    const colorName = variable.name.split("/")[variable.name.split("/").length - 1].toLowerCase();
                    const colorValue = typeof variable.value === 'string' ? variable.value : variable.name.split("/")[variable.name.split("/").length - 1].toLowerCase();
                    console.log(colorValue)
                    tailwindConfig.theme.extend.colors = {
                        ...tailwindConfig.theme.extend.colors,
                        [colorName]: colorValue,
                    };
                }
            });
        });
    }

});

// Serialize the Tailwind CSS configuration to a JavaScript file
const tailwindConfigFile = 'module.exports = ' + JSON.stringify(tailwindConfig, null, 2);

// Write the configuration to 'tailwind.config.js'
fs.writeFileSync('generated/tailwind.config.js', tailwindConfigFile, 'utf-8');

console.log('tailwind.config.js generated successfully.');



console.log(figmaToken);