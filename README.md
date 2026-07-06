# yuni 微信小程序

yuni 是一个基于微信小程序和 TDesign MiniProgram 构建的 AI 创作素材展示应用，支持素材浏览、搜索、详情查看、收藏关注、图片预览和本地用户信息管理。

## 功能特性

- 首页推荐：展示 AI 创作素材卡片，支持下拉刷新。
- 我的关注：基于本地收藏数据展示已关注素材，空列表时展示引导状态。
- 素材详情：展示图文详情，支持收藏/取消收藏和图片预览。
- 搜索：支持热门搜索、搜索历史、本地历史删除和搜索结果回填首页。
- 我的页面：支持本地微信昵称/头像登录、联系预订、协议入口和清除本地数据。
- 分享：支持首页和详情页分享到好友及朋友圈。

## 技术栈

- 微信小程序
- JavaScript ES Modules
- Less
- TDesign MiniProgram `^1.11.2`
- Mock.js / 自定义 `wx.request` mock
- ESLint + Prettier

## 目录结构

```text
.
├── api/                     # 请求封装
│   └── request.js
├── behaviors/               # 复用行为
│   └── useToast.js
├── components/              # 公共组件
│   ├── card/
│   └── nav/
├── mock/                    # Mock 数据和拦截逻辑
│   ├── home/
│   └── index.js
├── pages/
│   ├── home/                # 首页 / 推荐 / 我的关注
│   ├── detail/              # 素材详情
│   ├── search/              # 搜索页
│   ├── my/                  # 我的页面
│   └── settings/            # 用户协议 / 隐私政策
├── static/                  # 静态资源
├── app.json                 # 小程序页面和分包配置
├── config.js                # Mock 与接口配置
├── package.json
└── project.config.json
```

## 页面路由

### Tab 页面

- `pages/home/index`：首页
- `pages/my/index`：我的

### 分包页面

- `pages/search/index`：搜索
- `pages/detail/index`：详情
- `pages/settings/user-agreement/index`：用户协议
- `pages/settings/privacy/index`：隐私政策

## 本地开发

### 安装依赖

```bash
npm install
```

### 微信开发者工具预览

1. 打开微信开发者工具。
2. 导入当前项目目录。
3. 在工具中执行“构建 npm”。
4. 确认开启 Less 编译插件。
5. 使用模拟器或真机预览。

项目当前基础库版本配置为 `3.7.8`。

## 常用命令

```bash
# 检查 JS/TS 代码规范
npm run lint

# 自动修复 ESLint + Prettier
npm run lint:fix

# 仅 ESLint 修复
npm run lint:fix-eslint

# 仅 Prettier 修复
npm run lint:fix-prettier
```

> 当前项目未配置测试框架，`npm test` 为占位命令。功能验证需要通过微信开发者工具手动测试。

## Mock 与接口

接口统一通过 `api/request.js` 请求：

```js
request(url, method, data);
```

配置位于 `config.js`：

```js
export default {
  isMock: true,
  baseUrl: '',
};
```

当 `isMock` 为 `true` 时，项目使用本地 mock 数据，并模拟 500ms 延迟。

当前主要 Mock 接口：

- `/home/cards`：首页素材卡片和详情内容
- `/home/swipers`：首页轮播数据

## 本地缓存

项目使用微信本地缓存管理轻量状态：

| Key | 说明 |
| --- | --- |
| `userInfo` | 本地登录昵称和头像 |
| `access_token` | Mock 登录态 |
| `collectedCardIds` | 收藏/关注的素材 ID 列表 |
| `searchKeyword` | 搜索页回传首页的关键词 |
| `searchHistory` | 搜索历史记录 |

## 核心功能说明

### 收藏 / 我的关注

详情页点击爱心会将当前素材 ID 写入 `collectedCardIds`。首页“我的关注”会读取该缓存，并与当前素材列表匹配后展示关注内容。

### 图片预览

详情页中的图片支持点击预览，使用微信原生 `wx.previewImage`，并支持在当前详情页图片列表中滑动查看。

### 清除本地数据

“我的”页面提供“清除本地数据”功能，二次确认后会清除：

- `userInfo`
- `access_token`
- `collectedCardIds`

## 开发约定

- 页面和组件使用 `index.js / index.wxml / index.json / index.less` 组织。
- JS 使用 ES module import。
- 内部路径优先使用 `~/*` 别名。
- 页面状态统一放在 `data` 中，通过 `this.setData` 更新。
- 异步请求使用 `async/await` 或 Promise，并做好异常处理。
- 样式使用 Less，页面样式通过根 class 进行作用域隔离。

## 手动验证建议

- 首页素材列表加载和下拉刷新。
- 搜索关键词跳转首页并过滤素材。
- 详情页收藏/取消收藏后返回首页查看“我的关注”。
- 详情页点击图片打开预览。
- 我的页面登录、联系预订、清除本地数据。
- 用户协议和隐私政策页面展示。
