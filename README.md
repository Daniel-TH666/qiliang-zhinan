# 起量指南

> 让好产品被看见 —— 帮你搞清楚「我的产品该去哪里推广」。

一个**纯静态、零构建、零依赖**的推广渠道指南站。面向「产品做出来了，但不知道怎么推广」的人：
按产品类型、所处阶段和预算，给出该做哪些推广渠道、先做哪个、钱怎么分、30 天怎么走。

线上地址：<https://daniel-th666.github.io/qiliang-zhinan/>

---

## 这个站有什么

| 页面 | 作用 |
|---|---|
| `index.html` | 首页：按「我要推广 / 我要查渠道 / 我要看别人怎么打」三个入口分流 |
| `recommend.html` | **推广方案推荐器**：选 6 项，输出渠道组合 + 优先级 + 预算分配 + 30 天行动清单 |
| `channels.html` | **渠道库**：101 个渠道（国内 84 + 海外 17），可搜索、按分类/地区/费用筛选、排序 |
| `china.html` | 国内推广指南：搜索 / 小红书 / 抖音 / 微信生态 / 知乎 B 站 + 付费投放 + 90 天排期 |
| `overseas.html` | 海外推广：17 个渠道 + 出海顺序 + 自检清单 |
| `cases.html` | 打法拆解：11 套可直接改的方案模板 |
| `playbook.html` | 产品打法：12 类产品各自的推广逻辑、免费/付费渠道、指标、常见错误 |
| `tools.html` | 工具箱：ROI 计算器、渠道优先级打分、UTM 生成器、成本量级参考、30 天计划、免费工具 |
| `glossary.html` | 术语速查：44 个推广名词的大白话解释 |
| `about.html` | 关于本站：为什么做、怎么判断内容可信、**广告与变现说明、隐私政策** |
| `promote.html` | 广告合作与报价：版位、流量档位定价、投放要求、合作流程（盈利入口） |
| `404.html` | 404 页：用站点根路径引用资源，深层路径下也能正常显示 |

---

## 技术选型（为什么这么选）

- **无构建工具**：没有 npm / Vite / Webpack。双击 `index.html` 就能本地预览，改完直接刷新。
- **数据全在 `data/*.js`**：通过 `<script>` 挂到 `window.QL` 命名空间，不依赖 fetch，不受 `file://` 跨域限制。
- **原生 JS 渲染**：`assets/js/` 三个文件，模板字符串拼 HTML，无框架、无依赖。
- **一个 CSS 文件**：`assets/css/style.css`，颜色/间距/圆角全部走 `:root` 里的 CSS 变量。
- **托管**：GitHub Pages（免费、自动发布）。

> 结论：**搭建成本 0 元，运营成本 0 元**。没有服务器、没有数据库、没有构建流水线要维护。

---

## 目录结构

```
.
├── index.html            # 首页
├── recommend.html        # 推广方案推荐器
├── channels.html         # 渠道库
├── china.html            # 国内推广
├── overseas.html         # 海外推广（17 个渠道）
├── cases.html            # 打法拆解
├── playbook.html         # 产品打法
├── tools.html            # 工具箱
├── glossary.html         # 术语速查
├── about.html            # 关于 / 隐私 / 广告说明
├── promote.html          # 广告合作与报价（档位定价）
├── 404.html              # 404 页（资源用站点根路径）
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/style.css     # 全站唯一样式表（设计系统在这里）
│   └── js/
│       ├── app.js        # 基础工具、搜索、广告位渲染、抽屉、复制
│       ├── components.js # 页头 / 页脚 / 抽屉骨架 + 渠道卡片
│       └── recommend.js  # 推荐引擎（打分 + 渲染）
└── data/
    ├── meta.js           # 站点信息 + 产品类型 / 目标 / 阶段 / 预算 / 团队 / 分类
    ├── channels.js       # 101 个渠道
    ├── playbooks.js      # 12 类产品的打法
    ├── cases.js          # 11 套打法拆解
    ├── tools.js          # 术语、成本参考、30 天计划、免费工具
    └── monetize.js       # 广告位配置 + 联盟信息 + 报价
```

---

## 日常怎么改

**改文案 / 加渠道 / 调推荐结果，都不需要装任何环境**，直接编辑文件后提交即可。

### 加一个推广渠道

编辑 `data/channels.js`，在 `QL.channels` 数组里加一项：

```js
{
  id: 'your-channel',            // 唯一 id，站内链接用它
  name: '渠道名',
  cat: 'social',                 // 分类，必须是 meta.js 里 QL.cats 的 id
  region: 'cn',                  // cn 国内 / os 海外
  price: 'free',                 // free 免费 / mixed 免费+付费 / paid 主要付费
  cost: 1,                       // 成本 1–5
  speed: 3,                      // 见效速度 1–5
  difficulty: 2,                 // 上手难度 1–5
  team: 1,                       // 需要几个人扛 1–5
  fit: ['ec', 'local'],          // 适合哪些产品，必须是 QL.products 的 id
  goals: ['traffic', 'sale'],    // 服务哪些推广目标，必须是 QL.goals 的 id
  stages: ['cold', 'grow'],      // 适合哪些阶段，必须是 QL.stages 的 id
  url: 'https://example.com',    // 渠道官方入口，卡片与详情里渲染成「平台入口 ↗」外链
  summary: '一句话说清它是什么、为什么值得做。',
  why: ['为什么值得做（1–3 条）'],
  ops: ['具体怎么做（分步骤，越具体越好）'],
  kpi: ['要看的关键指标'],
  pitfall: '最容易踩的坑。'
}
```

渠道如果要标成「建设中」，加 `soon: true` 即可：只写 `summary` 等基础字段，详情字段会豁免检查（当前全部 101 个渠道都已是完整内容，暂无此标记）。

### 改广告位

`data/monetize.js` 里 `QL.ads.enabled` 改成 `true` 就会显示真实广告；
广告位在各页面的 HTML 里用 `<div class="ad-slot" data-slot="home-top"></div>` 占位。

### 改颜色 / 间距

`assets/css/style.css` 顶部的 `:root` 变量，改一处全站生效。

---

## 本地预览

因为资源都是相对路径，最简单的方式：

```bash
# 任选其一
python -m http.server 8777          # 然后访问 http://127.0.0.1:8777/index.html
```

> `404.html` 用的是站点根路径（`/qiliang-zhinan/...`），只有在 GitHub Pages 的子路径下才能完整验证；
> 本地直接打开 404.html 会缺样式，属正常现象。

---

## 部署

推送到 `main` 分支即自动发布（GitHub Pages，Source = `Deploy from a branch` → `main` / `/ (root)`）。

---

## 免责

站内内容为经验总结与操作建议，不构成效果承诺。各平台规则、成本与流量结构变化很快，
投放前请以平台官方文档为准，并先小预算测试。
