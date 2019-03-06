module.exports = {
    "extends": "airbnb-base",
    "rules": {
        // enable additional rules
        // "indent": ["error", 4],
        "linebreak-style": 0,
        "quotes": ["error", "single"],
        "semi": ["error", "never"],

        // override default options for rules from base configurations
        "comma-dangle": ["error", "never"],
        "no-cond-assign": ["error", "always"],
        "no-param-reassign": [2, { "props": false }],

        // disable rules from base configurations
        "no-console": "off",
    }
};