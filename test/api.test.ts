import MarkdownPostParser from '../src/markdown-post-parser'
import { isEqualObject, toAbsPath } from './test-util'

const TEST_OPTION = {
  main: 'index.md',
  input: './test/src',
  output: './test/dist/api/blog.json',
  static: './test/dist/api/static'
}

describe('generate()', () => {
  let markdownPostParser: any
  let result: any

  beforeAll(async () => {
    markdownPostParser = new MarkdownPostParser(TEST_OPTION)
    result = await markdownPostParser.generate()
  })

  test('"result.data" and "output json" data are equal', () => {
    const outputData = require(toAbsPath(result.path))
    expect(isEqualObject(result.data, outputData)).toBeTruthy()
  })
})
