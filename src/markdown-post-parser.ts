import fs from 'fs-extra'
import path from 'path'
import glob from 'glob'
import _ from 'lodash'
import MarkdownIt from 'markdown-it'
import meta from 'markdown-it-meta'

type Post = any
type Posts = Post[]
type Tags = string[]
type Resouces = string[]

interface Blog {
  posts: Posts
  tags: Tags
  resources: Resouces
}

interface Result {
  path: string
  data: Blog
}

interface Option {
  main?: string
  input?: string
  output?: string
  static?: string
  markdownIt?: any
}

/**
 * MarkdownPostParser
 * @constructor
 */
class MarkdownPostParser {
  private watcher: any = null
  public option: Option = {
    main: 'index.md',
    input: 'src',
    output: 'json',
    static: 'static',
    markdownIt: {
      html: true
    }
  }

  constructor (option: Option) {
    this.option = Object.assign(this.option, option || {})
  }

  public async parse (): Promise<Blog> {
    const posts: Posts = await this.generatePosts(this.option.input)
    const tags: Tags = this.generateTags(posts)
    const resources: Resouces = this.generateResouces(posts)

    return {
      posts,
      tags,
      resources
    }
  }

  public async generate (): Promise<Result> {
    const blog: Blog = await this.parse()
    const result: Result = await this.writeFile(
      this.option.output,
      JSON.stringify(blog, null, '  ')
    )

    if (this.option.static) {
      await fs.emptyDir(this.option.static)
      await this.copyResource(blog.resources)
    }

    return result
  }

  public watch (): void {
    console.log('Watch start')

    this.watcher = fs.watch(this.option.input, {
      recursive: true
    }, (eventType: string, fileName: string) => {
      if (fileName) {
        console.log(`${eventType} - ${fileName}`)
        this.generate().then((result: Result) => {
          console.log(result.path)
          console.log('')
        })
      }
    })

    this.watcher.on('error', (error: any) => {
      this.unwatch(error)
    })
  }

  public unwatch (error: any): void {
    if (error) console.error(error)
    console.log('Watch stop')
    this.watcher.close()
    this.watcher = null
    process.kill(process.pid, 'SIGHUP')
    process.exit(0)
  }

  private generateResouces (posts: Posts): string[] {
    let resources: string[] = []

    posts.forEach((post: Post) => {
      resources = _.concat(resources, post.resource)
    })

    return _.uniq(resources)
  }

  private generateTags (posts: Posts): Tags {
    let tags: Tags = []

    posts.forEach((post: Post) => {
      tags = _.union(tags, post.tags)
    })

    return tags
  }

  private async generatePosts (dirPath: string): Promise<Posts> {
    const postsDir: any = await this.readPostsDir(dirPath)
    const posts: Posts = []

    for (let i: number = 0; i < postsDir.length; i++) {
      posts.push(await this.parsePost(postsDir[i]))
    }

    return posts
  }

  private async parsePost (postDirName: string): Promise<Post> {
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

  private initMdParser (): any {
    const mdParser: any = new MarkdownIt(this.option.markdownIt)

    mdParser.use(meta)

    return mdParser
  }

  private writeFile (filePath: string, data: any): Promise<Result> {
    return new Promise<Result>((resolve: any, reject: any) => {
      fs.writeFile(filePath, data, (error: any) => {
        if (error) reject(error)

        resolve({
          path: filePath,
          data: data
        })
      })
    })
  }

  private async copyResource (resources: Resouces): Promise<void> {
    const inputDir: string = path.resolve(process.cwd(), this.option.input)
    const staticDir: string = path.resolve(process.cwd(), this.option.static)

    for (let i: number = 0; i < resources.length; i++) {
      const srcPath: string = path.resolve(process.cwd(), resources[i])
      const distPath: string = srcPath.replace(inputDir, staticDir)

      await fs.copy(srcPath, distPath)
    }
  }

  private getResource (dirPath: string, ignores: string[]): Promise<string[]> {
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

  private readPostsDir (dirPath: string): Promise<string[]> {
    return new Promise((resolve: any, reject: any) => {
      fs.readdir(dirPath, (error: any, files: string[]) => {
        if (error) reject(error)

        const postsDir = files.filter((file: string) => {
          return this.isDir(path.join(dirPath, file))
        })

        resolve(postsDir)
      })
    })
  }

  private isDir (filePath: string): boolean {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
  }
}

module.exports = MarkdownPostParser
