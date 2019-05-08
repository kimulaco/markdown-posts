const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const MarkdownIt = require('markdown-it')
const meta = require('markdown-it-meta')

const isDir = (filePath) => {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
}

class MarkdownPosts {
  constructor (option) {
    this.option = Object.assign({
      main: 'index.md',
      input: 'src',
      output: 'json',
      static: 'static',
      markdownIt: {
        html: true
      }
    }, option || {})
    this.watcher = null
  }

  async parse () {
    const posts = await this.generatePosts(this.option.input)
    const tags = this.generateTags(posts)

    return {
      posts,
      tags
    }
  }

  async generate () {
    const blog = await this.parse()
    const result = await this.writeFile(
      this.option.output,
      JSON.stringify(blog, null, '  ')
    )

    return result
  }

  watch () {
    console.log('Watch start')

    this.watcher = fs.watch(this.option.input, {
      recursive: true
    }, (eventType, fileName) => {
      if (fileName) {
        console.log(`${eventType} - ${fileName}`)
        this.generate().then((result) => {
          console.log(result.path)
          console.log('')
        })
      }
    })

    this.watcher.on('error', (error) => {
      this.unwatch(error)
    })
  }

  unwatch (error) {
    if (error) console.error(error)
    console.log('Watch stop')
    this.watcher.close()
    this.watcher = null
    process.kill(process.pid, 'SIGHUP')
    process.exit(0)
  }

  generateTags (posts) {
    let tags = []

    posts.forEach((post) => {
      tags = _.union(tags, post.tags)
    })

    return tags
  }

  async generatePosts (dirPath) {
    const postsDir = await this.readPostsDir(dirPath)
    const posts = []

    for (let i = 0; i < postsDir.length; i++) {
      posts.push(await this.parsePost(postsDir[i]))
    }

    return posts
  }

  async parsePost (postDirName) {
    const postPath = path.join(this.option.input, postDirName)
    const mainPath = path.join(postPath, this.option.main)
    const md = fs.readFileSync(mainPath).toString()
    const mdParser = this.initMdParser()
    const html = mdParser.render(md)

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

  initMdParser () {
    const mdParser = new MarkdownIt(this.option.markdownIt)

    mdParser.use(meta)

    return mdParser
  }

  writeFile (filePath, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (error) => {
        if (error) reject(error)

        resolve({
          path: filePath,
          data: data
        })
      })
    })
  }

  getResource (dirPath, ignores) {
    return new Promise((resolve, reject) => {
      glob(path.join(dirPath, '**/**'), (error, files) => {
        if (error) reject(error)

        files = files.filter((file) => {
          return !ignores.includes(file)
        })

        resolve(files)
      })
    })
  }

  readPostsDir (dirPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (error, files) => {
        if (error) reject(error)

        const postsDir = files.filter((file) => {
          return isDir(path.join(dirPath, file))
        })

        resolve(postsDir)
      })
    })
  }
}

module.exports = MarkdownPosts
