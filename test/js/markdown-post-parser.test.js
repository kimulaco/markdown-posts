const MarkdownPostParser = require('../../lib/markdown-post-parser')
const markdownPostParser = new MarkdownPostParser({
  main: 'index.md',
  input: './test/src',
  output: './test/js/json/blog.json',
  static: './test/js/static'
});

markdownPostParser.generate();
