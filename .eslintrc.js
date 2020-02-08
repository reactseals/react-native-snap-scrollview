const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));

module.exports = {
    parser: 'babel-eslint',
    extends: ['airbnb', 'prettier', 'prettier/react'],
    env: {
        node: true,
        browser: true,
        es6: true,
        jest: true,
        mocha: true,
    },
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },
    },
    plugins: ['mocha', 'react-hooks', 'prettier'],
    rules: {
        'max-len': [
            'error',
            100,
            2,
            {
                ignoreUrls: true,
                ignoreComments: true,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'arrow-body-style': ['warn', 'as-needed'],
        camelcase: 'off',
        'class-methods-use-this': 'off',
        'max-statements': ['warn', 20],
        'new-cap': ['error', { capIsNew: false }],
        'no-duplicate-imports': 'off',
        'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['el', 'ref', 'event'] }],
        'no-plusplus': 'off',
        'no-shadow': ['error', { builtinGlobals: false, hoist: 'functions', allow: ['describe'] }],
        'id-length': ['error', { min: 2 }],
        'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
        'react/jsx-indent-props': ['error', 4],
        'react/require-extension': 'off',
        'react/sort-comp': [
            'error',
            {
                order: [
                    'type-annotations',
                    'static-methods',
                    'lifecycle',
                    '/^on.+$/',
                    '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
                    'everything-else',
                    '/^render.+$/',
                    'render',
                ],
            },
        ],
        'object-curly-newline': [
            'error',
            {
                ObjectExpression: { minProperties: 6, multiline: true, consistent: true },
                ObjectPattern: { minProperties: 6, multiline: true, consistent: true },
            },
        ],
        'prettier/prettier': ['error', prettierOptions],
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-duplicates': 'error',
        'import/no-named-as-default': 'off',
        'comma-dangle': ['error', 'only-multiline'],
        'mocha/no-exclusive-tests': 'error',
        'react-hooks/rules-of-hooks': 'error',
    },
    settings: {
        'import/resolver': {
            // resolver needed for different platforms and platform groups
            node: {
                extensions: ['.js', '.smarttv.js'],
            }
        },
    },
};
