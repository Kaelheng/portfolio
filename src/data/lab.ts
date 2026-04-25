export type LabCard = {
  id: string
  title: string
  meta: string
  content: string
  tone?: 'paper' | 'ink' | 'coffee'
}

export const labCards: LabCard[] = [
  {
    id: 'honor-01',
    title: '荣誉奖项',
    meta: '2023 - 2025',
    content:
      'RoboCup 国家一等奖、华为昇腾 AI 一等奖、挑战杯国际交往赛道银奖、北京市农场创业大赛优秀创业项目。',
    tone: 'coffee',
  },
  {
    id: 'practice-01',
    title: '项目实践',
    meta: 'Research / Platform',
    content:
      '完成 RandLA-Net 点云语义分割研究（EI 论文，国际会议汇报）；校企合作开发农业智慧系统，实现传感数据可视化与管理端增删改查。',
    tone: 'paper',
  },
  {
    id: 'role-01',
    title: '校园与组织',
    meta: 'Innovation Center Lead',
    content:
      '担任学校创新实践中心负责人：参与 20+ 次高层对接，组织 15+ 场赛事，开展 3 场选拔并累计招募 12 人。',
    tone: 'ink',
  },
  {
    id: 'ability-01',
    title: '成果与能力',
    meta: 'Leadership / Delivery',
    content:
      '带队获 RoboCup 国家一等奖 2 次、国家二等奖 1 次。具备项目组织、资源整合、团队搭建与技术落地能力。',
    tone: 'paper',
  },
]

