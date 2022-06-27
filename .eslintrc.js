module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:react/recommended',
    'airbnb',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-no-bind': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-console': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/react-in-jsx-scope': 'off',
  },
};
