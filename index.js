const fs = require('fs');

// Load your JSON data from a file (assuming the JSON is stored in 'variables.json')
const figmaTokenData = require('./variables.json');

// Define the Tailwind CSS configuration based on your schema
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

// Map the JSON data to Tailwind CSS configuration
figmaTokenData.collections.forEach((collection) => {
    const colorMap = {};
    if (collection.name === 'Primitives ( Colors )') {
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
                    colorMap[colorName] = colorValue;
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
                    const colorValue = typeof variable.value === 'string' ? variable.value : variable.value.name.replace(/\//g, '-').toLowerCase();
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
                    const colorValue = typeof variable.value === 'string' ? variable.value : variable.value.name.replace(/\//g, '-').toLowerCase();
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
fs.writeFileSync('tailwind.config.js', tailwindConfigFile, 'utf-8');

console.log('tailwind.config.js generated successfully.');
