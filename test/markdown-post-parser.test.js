const MarkdownPostParser = require('../lib/markdown-post-parser')
const markdownPostParser = new MarkdownPostParser({
  main: 'index.md',
  src: './test/src',
  dist: './test/json/blog.json',
  static: './test/static'
});

markdownPostParser.generate();
