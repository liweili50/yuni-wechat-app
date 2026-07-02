const commonTags = [
  {
    text: 'AI绘画',
    theme: 'primary',
  },
  {
    text: '版权素材',
    theme: 'success',
  },
];

const createContent = ({ title, url, scene, tone, code }) => [
  {
    type: 'image',
    url,
    mode: 'widthFix',
    alt: title,
  },
  {
    type: 'text',
    value: `${title}是一组适合视觉创作和商业展示的数字素材，画面围绕${scene}展开，适用于海报、封面、社媒配图和活动物料。`,
  },
  {
    type: 'image',
    url,
    mode: 'widthFix',
    alt: title,
  },
  {
    type: 'text',
    value: `素材编号为${code}，画面风格偏向${tone}。图片适合用于主视觉延展，也可以作为系列内容中的氛围图或故事插图。`,
  },
];

const cards = [
  {
    id: 1,
    url: '/static/home/card0.png',
    desc: '少年,星空与梦想',
    tags: commonTags,
    content: createContent({
      title: '少年,星空与梦想',
      url: '/static/home/card0.png',
      scene: '少年、星空与梦想感氛围',
      tone: '梦幻星空 / 蓝色光影',
      code: 'YUNI-AI-0001',
    }),
  },
  {
    id: 2,
    url: '/static/home/card1.png',
    desc: '仰望星空的少女',
    tags: commonTags,
    content: createContent({
      title: '仰望星空的少女',
      url: '/static/home/card1.png',
      scene: '少女、夜空与静谧情绪',
      tone: '治愈插画 / 柔和星光',
      code: 'YUNI-AI-0002',
    }),
  },
  {
    id: 3,
    url: '/static/home/card3.png',
    desc: '仰望星空的少年',
    tags: commonTags,
    content: createContent({
      title: '仰望星空的少年',
      url: '/static/home/card3.png',
      scene: '少年背影与银河远景',
      tone: '科幻幻想 / 深蓝夜景',
      code: 'YUNI-AI-0003',
    }),
  },
  {
    id: 4,
    url: '/static/home/card2.png',
    desc: '少年,星空与梦想',
    tags: commonTags,
    content: createContent({
      title: '少年,星空与梦想',
      url: '/static/home/card2.png',
      scene: '少年剪影、星空与远方',
      tone: '电影感 / 高对比光影',
      code: 'YUNI-AI-0004',
    }),
  },
  {
    id: 5,
    url: '/static/home/card4.png',
    desc: '多彩的天空',
    tags: commonTags,
    content: createContent({
      title: '多彩的天空',
      url: '/static/home/card4.png',
      scene: '渐变天空、云层与梦幻色彩',
      tone: '彩色梦境 / 渐变云霞',
      code: 'YUNI-AI-0005',
    }),
  },
  {
    id: 6,
    url: '/static/home/card0.png',
    desc: '少年,星空与梦想',
    tags: commonTags,
    content: createContent({
      title: '少年,星空与梦想',
      url: '/static/home/card0.png',
      scene: '星空主题的成长与探索意象',
      tone: '梦幻叙事 / 星空蓝紫',
      code: 'YUNI-AI-0006',
    }),
  },
  {
    id: 7,
    url: '/static/home/card1.png',
    desc: '仰望星空的少女',
    tags: commonTags,
    content: createContent({
      title: '仰望星空的少女',
      url: '/static/home/card1.png',
      scene: '少女独处、夜幕与温柔星光',
      tone: '温柔治愈 / 浅色星辉',
      code: 'YUNI-AI-0007',
    }),
  },
];

export default {
  path: '/home/cards',
  data: {
    code: 200,
    message: '请求成功',
    data: cards,
  },
};
