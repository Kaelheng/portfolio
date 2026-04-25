export type Project = {
  id: string
  title: string
  tagline: string
  stack: string[]
  kind: 'video' | 'image'
  coverSrc: string
  repoUrl?: string
  role?: string
  description?: string
}

export const projects: Project[] = [
  {
    id: 'project-video-1',
    title: '艾德莱斯小程序',
    tagline: '本地视频项目展示',
    stack: ['Java', 'Vue 3', 'SQL'],
    kind: 'video',
    coverSrc: new URL('../../video/project1.mp4', import.meta.url).href,
    role: '全栈开发，UI设计',
    description:
      '项目以一种新疆工艺-艾德莱斯开展，通过市场调研、商业分析，以及相应访谈，做出小程序、网站，借此推广相应产品和文化',
  },
  {
    id: 'project-video-2',
    title: '农业智慧系统平台',
    tagline: '本地视频项目展示',
    stack: ['Python', 'Spring Boot', 'JavaScript'],
    kind: 'video',
    coverSrc: new URL('../../video/project2.mp4', import.meta.url).href,
    role: '前后端开发，UI设计',
    description:
      '该项目对接需求、方案实现以及前后端代码编写，实现客户端管理端的实时查看和增删改查。\n前端框架：Vue3，axios请求库，Echarts，Elements-Plus；\n后端：springboot框架，数据库采用MySQL存储农业数据和用户信息，并用Mybatis操作数据库',
  },
]

