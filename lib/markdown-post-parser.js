const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const MarkdownIt = require('markdown-it');
const meta = require('markdown-it-meta');

const isDir = (filePath) => {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
};

class MarkdownPosts {
    constructor(option) {
        this.option = Object.assign({
            main: 'README.md',
            src: 'src',
            dist: 'json',
            static: 'static',
            markdownIt: {
                html: true
            }
        }, option || {});
    }

    async generate() {
        const data = await this.initialize(this.option.src);

        await this.writeFile(this.option.dist, JSON.stringify(data, null, '  '));
    }

    async initialize(dirPath) {
        const postsDir = await this.readPostsDir(dirPath);
        const result = [];

        for (let i = 0; i < postsDir.length; i++) {
            result.push(await this.parsePost(postsDir[i]));
        }

        return result;
    }

    async parsePost(postDirName) {
        const postPath = path.join(this.option.src, postDirName);
        const mainPath = path.join(postPath, this.option.main);
        const md = fs.readFileSync(mainPath).toString();
        const mdParser = this.initMdParser();
        const html = mdParser.render(md);

        return {
            path: postPath,
            main: mainPath,
            ...mdParser.meta,
            body: html,
            resource: await this.getResource(postPath, [
                postPath,
                mainPath
            ])
        };
    }

    initMdParser() {
        const mdParser = new MarkdownIt(this.option.markdownIt);

        mdParser.use(meta);

        return mdParser;
    }

    writeFile(filePath, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, (error) => {
                if (error) reject(error);

                resolve({
                    path: filePath,
                    data: data,
                })
            })
        });
    }

    getResource(dirPath, ignores) {
        return new Promise((resolve, reject) => {
            glob(path.join(dirPath, '**/**'), (error, files) => {
                if (error) reject(error)

                files = files.filter((file) => {
                    return !ignores.includes(file)
                });

                resolve(files)
            });
        });
    }

    readPostsDir(dirPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, (error, files) => {
                if (error) reject(error);

                const postsDir = files.filter((file) => {
                    return isDir(path.join(dirPath, file));
                });

                resolve(postsDir);
            });
        });
    }
}

module.exports = MarkdownPosts;
