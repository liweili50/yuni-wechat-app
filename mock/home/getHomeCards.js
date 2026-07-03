const createContent = (keyword, imageId = 1015) => [{
    type: "text",
    value: `这是一组以「${keyword}」为主题的 AI 创作素材，整体画面具有较强的视觉冲击力。`
  },
  {
    type: "image",
    url: `https://picsum.photos/id/${imageId}/900/600`,
    mode: "widthFix",
    alt: keyword
  },
  {
    type: "text",
    value: "整体采用电影级光影表现，突出主体层次，使画面更具故事感。"
  },
  {
    type: "image",
    url: `https://picsum.photos/id/${imageId + 1}/900/600`,
    mode: "widthFix",
    alt: `${keyword} 场景`
  },
  {
    type: "text",
    value: "画面适合作为海报、宣传页、社交媒体封面以及品牌视觉素材。"
  },
  {
    type: "image",
    url: `https://picsum.photos/id/${imageId + 2}/900/600`,
    mode: "widthFix",
    alt: `${keyword} 特写`
  },
  {
    type: "text",
    value: "可以进一步调整色彩、光效和人物动作，生成不同风格的创意作品。"
  },
  {
    type: "image",
    url: `https://picsum.photos/id/${imageId + 3}/900/600`,
    mode: "widthFix",
    alt: `${keyword} 效果图`
  },
  {
    type: "text",
    value: "适用于 AI 绘画、设计提案、灵感展示以及商业创意项目。"
  }
];

const cards = [{
    id: 1,
    url: "https://picsum.photos/id/1015/800/500",
    desc: "少年，星空与梦想",
    tags: [{
        text: "AI绘画",
        theme: "primary"
      },
      {
        text: "治愈",
        theme: "success"
      }
    ],
    content: createContent("少年，星空与梦想", 1015)
  },
  {
    id: 2,
    url: "https://picsum.photos/id/1018/800/500",
    desc: "城市夜景霓虹",
    tags: [{
        text: "赛博朋克",
        theme: "warning"
      },
      {
        text: "插画",
        theme: "primary"
      }
    ],
    content: createContent("城市夜景霓虹", 1018)
  },
  {
    id: 3,
    url: "https://picsum.photos/id/1020/800/500",
    desc: "森林里的晨光",
    tags: [{
        text: "自然",
        theme: "success"
      },
      {
        text: "摄影",
        theme: "primary"
      }
    ],
    content: createContent("森林里的晨光", 1020)
  },
  {
    id: 4,
    url: "https://picsum.photos/id/1024/800/500",
    desc: "海边落日",
    tags: [{
        text: "风景",
        theme: "primary"
      },
      {
        text: "旅行",
        theme: "success"
      }
    ],
    content: createContent("海边落日", 1024)
  },
  {
    id: 5,
    url: "https://picsum.photos/id/1035/800/500",
    desc: "未来科技实验室",
    tags: [{
        text: "科技",
        theme: "primary"
      },
      {
        text: "AI",
        theme: "danger"
      }
    ],
    content: createContent("未来科技实验室", 1035)
  },
  {
    id: 6,
    url: "https://picsum.photos/id/1043/800/500",
    desc: "咖啡馆午后",
    tags: [{
        text: "生活",
        theme: "success"
      },
      {
        text: "文艺",
        theme: "primary"
      }
    ],
    content: createContent("咖啡馆午后", 1043)
  },
  {
    id: 7,
    url: "https://picsum.photos/id/1050/800/500",
    desc: "雪山远眺",
    tags: [{
        text: "旅行",
        theme: "primary"
      },
      {
        text: "自然",
        theme: "success"
      }
    ],
    content: createContent("雪山远眺", 1050)
  },
  {
    id: 8,
    url: "https://picsum.photos/id/1060/800/500",
    desc: "国风山水画卷",
    tags: [{
        text: "国风",
        theme: "warning"
      },
      {
        text: "AI绘画",
        theme: "primary"
      }
    ],
    content: createContent("国风山水画卷", 1060)

  },
  {
    id: 9,
    url: "https://picsum.photos/id/1074/800/500",
    desc: "可爱萌宠日常",
    tags: [{
        text: "萌宠",
        theme: "danger"
      },
      {
        text: "摄影",
        theme: "primary"
      }
    ],
    content: [{
        type: "text",
        value: "记录宠物自然可爱的生活瞬间，适用于社交媒体分享、宠物品牌推广和内容创作。"
      },
      {
        type: "image",
        url: "https://picsum.photos/id/1074/900/600",
        mode: "widthFix",
        alt: "可爱萌宠日常"
      }
    ]
  },
  {
    id: 10,
    url: "https://picsum.photos/id/1084/800/500",
    desc: "春日花海",
    tags: [{
        text: "风景",
        theme: "success"
      },
      {
        text: "壁纸",
        theme: "primary"
      }
    ],
    content: createContent("春日花海", 1084)
  }
];

export default {
  path: '/home/cards',
  data: {
    code: 200,
    message: '请求成功',
    data: cards,
  },
};