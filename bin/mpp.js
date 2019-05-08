#!/usr/bin/env node

const pkg = require('../package')
const program = require('commander')
const MarkdownPostParser = require('../dist/markdown-post-parser')
let option = {}

program
  .version(pkg.version)
  .option('-w, --watch', 'watch mode')
  .option('-m, --main [value]', 'main markdown file name')
  .option('-i, --input [value]', 'input directory')
  .option('-o, --output [value]', 'output directory')
  .option('-s, --static [value]', 'output static files directory')
  .parse(process.argv)

if (program.main) option.main = program.main
if (program.input) option.input = program.input
if (program.output) option.output = program.output
if (program.static) option.static = program.static

const markdownPostParser = new MarkdownPostParser(option)

if (program.watch) {
  markdownPostParser.watch()
} else {
  markdownPostParser.generate().then(() => {
    console.log('Generate completeed')
  })
}
