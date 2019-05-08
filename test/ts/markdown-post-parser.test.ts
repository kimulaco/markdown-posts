import MarkdownPostParser from '../../src/markdown-post-parser'
import {
  isEqual,
  toAbsPath
} from './test-util'

describe('generate()', () => {
  let markdownPostParser
  let result

  beforeAll(async () => {
    markdownPostParser = new MarkdownPostParser({
      main: 'index.md',
      input: './test/src',
      output: './test/ts/json/blog.json',
      static: './test/ts/static/img'
    })
    result = await markdownPostParser.generate()
  })

  test('"result.data" and "output json" data are equal', () => {
    const outputData = require(toAbsPath(result.path))
    expect(isEqual(result.data, outputData)).toBeTruthy()
  })
})
