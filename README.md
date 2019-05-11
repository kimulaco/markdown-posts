# markdown-post-parser

[![npm version](https://badge.fury.io/js/markdown-post-parser.svg)](https://badge.fury.io/js/markdown-post-parser)
[![Build Status](https://travis-ci.org/kimulaco/markdown-post-parser.svg?branch=master)](https://travis-ci.org/kimulaco/markdown-post-parser)
[![Coverage Status](https://coveralls.io/repos/github/kimulaco/markdown-post-parser/badge.svg)](https://coveralls.io/github/kimulaco/markdown-post-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Parser for building blogs in Markdown.

## Install

```shell
npm install --save-dev markdown-post-parser
```

## Use

### CLI

```shell
# generate
mpp -m index.md -i ./src -o ./json/blog.json -s ./static

# watch
mpp -w -m index.md -i ./src -o ./json/blog.json -s ./static
```

### API

```js

const MarkdownPostParser = require('markdown-post-parser')
const markdownPostParser = new MarkdownPostParser({
  main: 'index.md',
  input: './src',
  output: './json/blog.json',
  static: './static'
})

// generate
markdownPostParser.generate().then(() => {
  console.log('Generate completeed')
})

// watch
markdownPostParser.watch()
```

## Example

### Directory

```
src
├─ post-01
│  ├─ index.md
│  └─ example.png
├─ post-02
│  ├─index.md
│  └─ example.png
└─ post-02
   └─index.md
```

### Markdown format

src/post-01/index.md

```
---
id: post-01
title: Example Post
description: test post
created_at: "2019-04-01"
updated_at: "2019-04-01"
tags:
    - HTML
    - CSS
    - JavaScript
---

## overview

text text

- list item
- list item
- list item
- list item
```

### JSON format

```js
{
  // All posts
  "posts": [
    {
      "path": "src/post-01",
      "main": "src/post-01/index.md",
      "id": "post-01",
      "title": "Example Post",
      "description": "test post",
      "created_at": "2019-04-01",
      "updated_at": "2019-04-01",
      "tags": [
        "HTML",
        "CSS",
        "JavaScript"
      ],
      "body": "<h2>overview</h2>\n<p>text</p>\n",
      "resource": [
        "src/post-01/example.png"
      ]
    },
    ...
  ],

  // All tags
  "tags": [
    "HTML",
    "CSS",
    "JavaScript",
    ...
  ],

  // All resources
  "resources": [
    "src/post-01/example.png",
    "src/post-02/example.png"
  ]
```

## Development

```shell
# Build TypeScript
yarn build

# Development mode
yarn dev

# Unit test
yarn test
```

## Todos

- Enhance test code
- Update document
- CLI design

## License

[MIT License](https://github.com/kimulaco/markdown-post-parser/blob/master/LICENSE)
