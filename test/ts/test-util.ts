import path from 'path'
import _ from 'lodash'

export const isEqual = _.isEqual

export const toAbsPath = (filePath: string): string => {
  return path.resolve(process.cwd(), filePath)
}
