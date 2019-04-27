const MarkdownPostParser = require('../lib/markdown-post-parser')
const markdownPostParser = new MarkdownPostParser({
  main: 'README.md',
  src: './example/src',
  dist: './example/json/blog.json',
  static: './example/static'
});

markdownPostParser.generate();
