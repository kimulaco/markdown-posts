const path = require('path')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/markdown-post-parser.ts',
  output: {
    library: 'MarkdownPostParser',
    libraryTarget: 'commonjs2',
    filename: 'markdown-post-parser.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
          'eslint-loader'
        ],
        exclude: /(node_modules|dist)/
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ]
  }
}
