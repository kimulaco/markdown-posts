import MarkdownPostParser from '../src/markdown-post-parser'
import { isEqualObject, toAbsPath } from './test-util'

const testOption = {
  main: 'index.md',
  input: './test/src',
  output: './test/dist/api/blog.json',
  static: './test/dist/api/static'
}

describe('MarkdownPostParser', () => {
  let markdownPostParser: any

  beforeAll(async () => {
    markdownPostParser = new MarkdownPostParser(testOption)
  })

  describe('parse()', () => {
    let result: any

    beforeAll(async () => {
      result = await markdownPostParser.parse()
    })

    test('"result" and "option.output json" data are equal', () => {
      const outputData = require(toAbsPath(testOption.output))
      expect(isEqualObject(result, outputData)).toBeTruthy()
    })
  })

  describe('generate()', () => {
    let result: any

    beforeAll(async () => {
      result = await markdownPostParser.generate()
    })

    test('"result.data" and "option.output json" data are equal', () => {
      const outputData = require(toAbsPath(testOption.output))
      expect(isEqualObject(result.data, outputData)).toBeTruthy()
    })
  })
})
