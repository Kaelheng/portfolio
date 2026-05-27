import project1Video from '../../video/project1.mp4'
import project2Video from '../../video/project2.mp4'
import project3Video from '../../video/project3.mp4'

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
    id: 'project-video-3',
    title: 'WorkMask',
    tagline: '办公场景摸鱼小工具',
    stack: ['Vue 3', 'Figma', 'UI/UX'],
    kind: 'video',
    coverSrc: project3Video,
    role: '产品设计 · 全栈开发 · UI 设计',
    description:
      'WorkMask 是一款面向办公场景的轻量化「摸鱼」小工具：支持界面伪装、快捷切换与细节动效，在不影响操作效率的前提下降低被发现风险。独立完成产品概念、Figma 高保真原型与前端实现，强调交互直觉与视觉一致性。',
  },
  {
    id: 'project-video-2',
    title: '农业智慧系统平台',
    tagline: '智慧农业数据可视化与管理',
    stack: ['Python', 'Spring Boot', 'JavaScript'],
    kind: 'video',
    coverSrc: project2Video,
    role: '前后端开发，UI设计',
    description:
      '该项目对接需求、方案实现以及前后端代码编写，实现客户端管理端的实时查看和增删改查。\n前端框架：Vue3，axios请求库，Echarts，Elements-Plus；\n后端：springboot框架，数据库采用MySQL存储农业数据和用户信息，并用Mybatis操作数据库',
  },
  {
    id: 'project-video-1',
    title: '艾德莱斯小程序',
    tagline: '新疆工艺文化数字化推广',
    stack: ['Java', 'Vue 3', 'SQL'],
    kind: 'video',
    coverSrc: project1Video,
    role: '全栈开发，UI设计',
    description:
      '项目以一种新疆工艺-艾德莱斯开展，通过市场调研、商业分析，以及相应访谈，做出小程序、网站，借此推广相应产品和文化',
  },
]
