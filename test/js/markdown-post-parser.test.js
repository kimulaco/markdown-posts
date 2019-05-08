const MarkdownPostParser = require('../../dist/markdown-post-parser')
const markdownPostParser = new MarkdownPostParser({
  main: 'index.md',
  input: './test/src',
  output: './test/js/json/blog.json',
  static: './test/js/static/img'
})

markdownPostParser.generate()
