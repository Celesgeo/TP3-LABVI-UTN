    export default {
    extends: ["eslint:recommended", "plugin:react/recommended"],
    settings: {
        react: { version: "detect" },
    },
    rules: {
        "react/react-in-jsx-scope": "off",
        "no-unused-vars": "warn",
    },
    };
