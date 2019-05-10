export type Post = any
export type Posts = Post[]
export type Tags = string[]
export type Resouces = string[]

export interface Blog {
  posts: Posts
  tags: Tags
  resources: Resouces
}

export interface Result {
  path: string
  data: Blog
}

export interface Option {
  main?: string
  input?: string
  output?: string
  static?: string
  markdownIt?: any
}
