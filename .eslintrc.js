// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect", // detecta automáticamente la versión de React
    },
  },
  rules: {
    "react/prop-types": "off", // 🔴 desactiva validación con PropTypes
  },
};
