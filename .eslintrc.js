module.exports = {
  extends: 'standard',
  env: {
    jest: true
  },
  settings: {
    node: {
      tryExtensions: [
        '.ts',
        '.js',
        '.json',
        '.node'
      ]
    }
  },
  rules: {
    'node/no-missing-import': 'error'
  },
  overrides: {
    files: [
      '**/*.ts'
    ],
    plugins: [
      '@typescript-eslint'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      sourceType: 'module',
      project: './tsconfig.json'
    },
    rules: {
     'no-undef': 'off',
     'no-unused-vars': 'off',
     '@typescript-eslint/no-unused-vars': 'error',
    }
  }
}
