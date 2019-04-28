#!/usr/bin/env node

const pkg = require('../package');
const program = require('commander');
const MarkdownPostParser = require('../lib/markdown-post-parser');
let option = {};

program
  .version(pkg.version)
  .option('-m, --main [value]', 'Main markdown file name.')
  .option('-i, --input [value]', 'Input directory.')
  .option('-o, --output [value]', 'Output directory.')
  .option('-s, --static [value]', 'Output static files directory.')
  .parse(process.argv);

console.log(program)

if (program.main) option.main = program.main
if (program.input) option.input = program.input
if (program.output) option.output = program.output
if (program.static) option.static = program.static

console.log(option)

const markdownPostParser = new MarkdownPostParser(option);

markdownPostParser.generate();