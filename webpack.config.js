const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/markdown-post-parser.ts',
  output: {
    filename: 'markdown-post-parser.js',
    path: path.join(__dirname, 'dist')
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
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
