# AGENTS.md

## Build/Lint/Test Commands

```bash
# Lint all JS/TS files
npm run lint

# Auto-fix lint issues (ESLint + Prettier)
npm run lint:fix

# ESLint only fix
npm run lint:fix-eslint

# Prettier only fix
npm run lint:fix-prettier

# Test (no test framework configured)
npm test              # placeholder, no tests exist
```

There is **no test framework** in this project. Manual testing via WeChat DevTools is the only approach. When adding logic, verify manually in the WeChat DevTools simulator.

## Project Architecture

- **WeChat Mini Program** (no TypeScript, plain JS with ES modules)
- **UI Library**: `tdesign-miniprogram` ^1.11.2
- **Styling**: Less files (`.less`) compiled to `.wxss`
- **Mock**: Custom mock system using Mock.js, toggled via `config.isMock`
- **No build step** — standard WeChat project structure

## Code Style Guidelines

### File & Directory Naming

- **Pages**: lowercase kebab-case, entry file always `index.{js,wxml,json,less}`
  - Example: `pages/my/info-edit/index.js`
- **Components**: lowercase kebab-case directories with `index.js` entry
  - Example: `components/card/index.js`
- **Files**: camelCase for non-page utility modules
  - Example: `utils/util.js`, `behaviors/useToast.js`

### Imports

Use ES module `import` syntax (compiled by WeChat dev tools):

```javascript
import config from '~/config';                   // path alias
import request from '~/api/request';              // local module
import useToastBehavior from '~/behaviors/useToast'; // behavior
import { formatTime } from '~/utils/util';        // named import
```

- Use `~/*` path alias (maps to project root, configured in `app.json` resolveAlias)
- Import ordering (enforced by ESLint `import/order`): builtin → external → internal
- Avoid default exports when there are multiple exports

### Formatting (Prettier)

- `printWidth: 120`, `tabWidth: 2`, `semi: true`
- `singleQuote: true`, `trailingComma: 'all'`
- `arrowParens: 'always'` (always include parens around arrow function params)
- `bracketSpacing: true`
- Overrides: `.less`/`.wxss` → parser `less`, `.wxml` → parser `html` with `htmlWhitespaceSensitivity: strict`

### JavaScript Conventions

**Pages** use `Page({...})` with this structure:

```javascript
import request from '~/api/request';
import someBehavior from '~/behaviors/someBehavior';

Page({
  behaviors: [someBehavior],

  data: {
    // all reactive state here
  },

  onLoad(options) {},
  onShow() {},
  onReady() {},

  // event handlers: on + EventName (camelCase)
  onButtonTap(e) {},
  onInputChange(e) {},

  // internal helpers: verb + Noun (camelCase)
  fetchData() {},
  updateDisplay() {},
});
```

**Components** use `Component({...})`.

**WeChat global APIs**: `wx`, `App`, `Page`, `Component`, `getApp`, `getCurrentPages`, `requirePlugin` — all declared as ESLint globals.

### Data Binding & State

- Store all reactive state in `data` property
- Use `this.setData({ key: value })` for updates (never assign directly)
- For nested fields: use string key like `this.setData({ 'personInfo.name': 'foo' })`
- Use `wx.getStorageSync` / `wx.setStorageSync` for persistent state (tokens, user info)

### Asynchronous Code

```javascript
// Always use async/await with try/catch
async fetchPersonalInfo() {
  try {
    const res = await request('/api/genPersonalInfo');
    return res.data.data;
  } catch (err) {
    console.warn('Failed to fetch:', err);
    return {};
  }
}
```

### Error Handling

- `console.warn` and `console.error` only (no `console.log`, enforced by ESLint)
- Wrap async API calls in try/catch
- API request wrapper (`api/request.js`) handles token injection and status checking automatically
- For mock mode (config.isMock = true), responses are delayed by 500ms

### Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Variables/functions | camelCase | `getPersonalInfo`, `isLoad` |
| Page data fields | camelCase | `phoneNumber`, `isPasswordLogin` |
| Event handlers | `on` + EventDescription | `onLogin`, `onPhoneInput`, `onChooseAvatar` |
| Behavior methods | `onShowToast`, `onHideToast` |
| CSS classes | kebab-case within BEM-like blocks | `login__title`, `my-info__person` |
| Less files | Use `&-child` nesting | `&__title`, `&-info` |

### Styles (Less)

- Each page has a `.less` file compiled to `.wxss`
- Wrap all page styles in a root class to scope them:
```less
.my-page {
  &__title { ... }

  &-section { ... } // block-level modifier
}
```
- Set `page { background-color: #f5f5f5; }` for page background if needed
- Use `--td-*` CSS custom properties to override TDesign component styles

### Component Imports (JSON)

Each page's `.json` file imports TDesign components:

```json
{
  "navigationBarTitleText": "页面标题",
  "usingComponents": {
    "t-cell": "tdesign-miniprogram/cell/cell",
    "t-button": "tdesign-miniprogram/button/button"
  }
}
```

- **Only the home page** (`pages/home/index`) uses `<t-navbar>` with `"navigationStyle": "custom"`. All other pages use the native WeChat navigation bar and set its title via `navigationBarTitleText`.
- Only import components actually used in the WXML

### Templates (WXML)

- **Only the home page** uses `<t-navbar>` for custom navigation. All other pages rely on the native nav bar.
- Wrap page content in `<view class="page-name">`
- Use `wx:if` / `wx:else` for conditional rendering
- Use `wx:for` with `wx:for-item` and `wx:key` for lists
- Use `catchtap` to stop event propagation on modal overlays

### Page Registration

- **Tab pages** go in the top-level `"pages"` array of `app.json`
- **All other pages** must be registered in `"subpackages"` in `app.json`
- Each subpackage has a `root`, `name`, and `pages` array:
```json
{
  "root": "pages/settings",
  "name": "settings",
  "pages": ["user-agreement/index", "privacy/index"]
}
```

### API Layer (`api/request.js`)

- All API calls go through `request(url, method, data)`
- Automatically injects `access_token` from storage as `Bearer` token
- Auto-sets `content-type: application/json`
- Returns a Promise: resolves on HTTP 200, rejects otherwise
- Mock mode: responses are delayed by 500ms

### Mock System

- Mocks are registered in `mock/index.js`
- Each mock file exports `{ path: string, data: object }`
- Mock path must match the API path used in `request()`
- Mock is toggled by `config.isMock` in `config.js`
- Existing mock groups: search, home, my

### Behaviors

Reusable behaviors in `behaviors/` use TDesign's Toast as example:

```javascript
const useToastBehavior = Behavior({
  methods: {
    onShowToast(selector, message) {
      Toast({ context: this, selector, message });
    },
  },
});
export default useToastBehavior;
```
