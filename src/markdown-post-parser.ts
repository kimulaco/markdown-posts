import fs from 'fs-extra'
import path from 'path'
import glob from 'glob'
import _ from 'lodash'
import MarkdownIt from 'markdown-it'
import meta from 'markdown-it-meta'

const isDir = (filePath: string): boolean => {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
}

/**
 * MarkdownPostParser
 * @constructor
 */
class MarkdownPostParser {
  watcher: any = null
  option: any = {
    main: 'index.md',
    input: 'src',
    output: 'json',
    static: 'static',
    markdownIt: {
      html: true
    }
  }

  constructor (option: any) {
    this.option = Object.assign(this.option, option || {})
  }

  async parse () {
    const posts: any = await this.generatePosts(this.option.input)
    const tags: string[] = this.generateTags(posts)

    return {
      posts,
      tags
    }
  }

  async generate () {
    const blog: any = await this.parse()
    const result: any = await this.writeFile(
      this.option.output,
      JSON.stringify(blog, null, '  ')
    )

    return result
  }

  watch (): void {
    console.log('Watch start')

    this.watcher = fs.watch(this.option.input, {
      recursive: true
    }, (eventType: string, fileName: string) => {
      if (fileName) {
        console.log(`${eventType} - ${fileName}`)
        this.generate().then((result) => {
          console.log(result.path)
          console.log('')
        })
      }
    })

    this.watcher.on('error', (error: any) => {
      this.unwatch(error)
    })
  }

  unwatch (error: any): void {
    if (error) console.error(error)
    console.log('Watch stop')
    this.watcher.close()
    this.watcher = null
    process.kill(process.pid, 'SIGHUP')
    process.exit(0)
  }

  generateTags (posts): string[] {
    let tags = []

    posts.forEach((post) => {
      tags = _.union(tags, post.tags)
    })

    return tags
  }

  async generatePosts (dirPath: string) {
    const postsDir: any = await this.readPostsDir(dirPath)
    const posts: any[] = []

    for (let i = 0; i < postsDir.length; i++) {
      posts.push(await this.parsePost(postsDir[i]))
    }

    return posts
  }

  async parsePost (postDirName) {
    const postPath: string = path.join(this.option.input, postDirName)
    const mainPath: string = path.join(postPath, this.option.main)
    const md: string = fs.readFileSync(mainPath).toString()
    const mdParser: any = this.initMdParser()
    const html: string = mdParser.render(md)

    return {
      path: postPath,
      main: mainPath,
      ...mdParser.meta,
      body: html,
      resource: await this.getResource(postPath, [
        postPath,
        mainPath
      ])
    }
  }

  initMdParser (): any {
    const mdParser: any = new MarkdownIt(this.option.markdownIt)

    mdParser.use(meta)

    return mdParser
  }

  writeFile (filePath: string, data: any) {
    return new Promise((resolve: any, reject: any) => {
      fs.writeFile(filePath, data, (error: any) => {
        if (error) reject(error)

        resolve({
          path: filePath,
          data: data
        })
      })
    })
  }

  getResource (dirPath: string, ignores: string[]) {
    return new Promise((resolve: any, reject: any) => {
      glob(path.join(dirPath, '**/**'), (error: any, files: string[]) => {
        if (error) reject(error)

        files = files.filter((file: string) => {
          return !ignores.includes(file)
        })

        resolve(files)
      })
    })
  }

  readPostsDir (dirPath: string) {
    return new Promise((resolve: any, reject: any) => {
      fs.readdir(dirPath, (error: any, files: string[]) => {
        if (error) reject(error)

        const postsDir = files.filter((file: string) => {
          return isDir(path.join(dirPath, file))
        })

        resolve(postsDir)
      })
    })
  }
}

module.exports = MarkdownPostParser
