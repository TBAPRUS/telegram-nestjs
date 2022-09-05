module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  plugins: [
    '@typescript-eslint'
  ],
  'rules': {
    'quotes': ['warn', 'single'],
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'always'],
    '@typescript-eslint/explicit-member-accessibility': 'off'
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 'latest',
  }
};
