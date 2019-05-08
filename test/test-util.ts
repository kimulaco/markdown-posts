import path from 'path'
import _ from 'lodash'

const isEqualObject = _.isEqual

const toAbsPath = (filePath: string): string => {
  return path.resolve(process.cwd(), filePath)
}

export {
  isEqualObject,
  toAbsPath
}
