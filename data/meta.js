/* 起量指南 — 基础字典数据
   改这里就能改全站的选项：产品类型、推广目标、阶段、预算、团队规模、渠道分类。
   全部是普通 JS，不需要构建工具，双击 HTML 就能用。 */

window.QL = window.QL || {};

QL.site = {
  name: '起量指南',
  slogan: '让好产品被看见',
  desc: '帮你搞清楚「我的产品该去哪里推广」——按产品类型、阶段和预算，给出可执行的推广渠道组合与行动清单。',
  // 部署到 GitHub Pages 后改成真实网址，用于 sitemap / 分享卡片
  url: 'https://daniel-th666.github.io/qiliang-zhinan/',
  contact: 'hi@example.com'
};

/* ---------------- 产品类型 ---------------- */
QL.products = [
  { id: 'tool',       emo: '🧰', name: '工具 / 软件',      desc: '效率工具、SaaS、插件、浏览器扩展' },
  { id: 'ai',         emo: '🤖', name: 'AI 产品',          desc: 'AI 应用、AI 助手、模型相关服务' },
  { id: 'ec',         emo: '🛒', name: '电商 / 独立站',    desc: '卖实物商品、店铺、跨境独立站' },
  { id: 'content',    emo: '📰', name: '内容站 / 博客',    desc: '资讯站、博客、导航站、聚合站' },
  { id: 'app',        emo: '📱', name: 'App 移动应用',     desc: 'iOS / Android 客户端' },
  { id: 'mp',         emo: '💬', name: '小程序 / 公众号',  desc: '微信生态内的轻应用与服务号' },
  { id: 'local',      emo: '🏪', name: '本地生活 / 门店',  desc: '餐饮、美容、教育、维修等实体服务' },
  { id: 'course',     emo: '🎓', name: '课程 / 知识付费',  desc: '训练营、网课、付费社群、咨询' },
  { id: 'game',       emo: '🎮', name: '游戏 / 泛娱乐',    desc: '手游、小游戏、小说、漫画、音视频' },
  { id: 'b2b',        emo: '🏢', name: 'B2B / 企业服务',   desc: '面向企业的软件、咨询、供应链' },
  { id: 'ip',         emo: '🙋', name: '个人 IP / 作品集', desc: '自由职业者、设计/开发作品、求职' },
  { id: 'community',  emo: '👥', name: '社区 / 社群产品',  desc: '论坛、兴趣社区、社交类产品' }
];

/* ---------------- 推广目标 ---------------- */
QL.goals = [
  { id: 'traffic',  emo: '👀', name: '拿到流量',   desc: '先要有人看到，把基础访问量做起来' },
  { id: 'lead',     emo: '📮', name: '获取线索',   desc: '留资、加微信、预约咨询' },
  { id: 'sale',     emo: '💰', name: '直接成交',   desc: '卖货、卖课、卖会员' },
  { id: 'download', emo: '⬇️', name: '下载安装',   desc: 'App / 小游戏的装机量' },
  { id: 'brand',    emo: '🏅', name: '品牌背书',   desc: '建立信任感，让人搜得到、看得见' },
  { id: 'seed',     emo: '🌱', name: '种子用户',   desc: '找第一批愿意反馈和传播的人' },
  { id: 'retain',   emo: '🔁', name: '复购与留存', desc: '让老用户回来、买过的人再买、客户主动转介绍' }
];

/* ---------------- 项目阶段 ---------------- */
QL.stages = [
  { id: 'cold',  emo: '🥚', name: '刚上线 / 0 用户', desc: '产品能用了，但没人知道' },
  { id: 'grow',  emo: '🌿', name: '有点用户，要增长', desc: '有留存有反馈，想把量做上去' },
  { id: 'scale', emo: '🚀', name: '要规模化',        desc: '模型跑通了，准备放大投入' }
];

/* ---------------- 预算档位（cost 值越低越便宜） ---------------- */
QL.budgets = [
  { id: 'b0', emo: '🆓', name: '0 元',       desc: '只投入时间，不花钱',        max: 1 },
  { id: 'b1', emo: '💵', name: '1000 元内',  desc: '测试性质的小额投入',        max: 2 },
  { id: 'b2', emo: '💴', name: '1 万元内',   desc: '有明确预算，能持续投一段',  max: 3 },
  { id: 'b3', emo: '💶', name: '10 万元内',  desc: '可以多平台并跑做对比',      max: 4 },
  { id: 'b4', emo: '💷', name: '不设上限',   desc: '以 ROI 为准，能放量',       max: 5 }
];

/* ---------------- 团队规模 ---------------- */
QL.teams = [
  { id: 'solo',   emo: '🧍', name: '就我一个人', desc: '时间有限，只能做少数几件对的事', power: 2 },
  { id: 'small',  emo: '👨‍👩‍👦', name: '2–3 人小团队', desc: '能分工，内容+投放可以并行', power: 4 },
  { id: 'mid',    emo: '🏙️', name: '5 人以上 / 有预算', desc: '有专人或代理负责推广', power: 5 }
];

/* ---------------- 渠道分类 ---------------- */
QL.cats = [
  { id: 'search',    emo: '🔍', name: '搜索引擎' },
  { id: 'social',    emo: '💬', name: '社交平台' },
  { id: 'content',   emo: '✍️', name: '内容平台' },
  { id: 'video',     emo: '🎬', name: '视频平台' },
  { id: 'community', emo: '🗣️', name: '社区论坛' },
  { id: 'ads',       emo: '📣', name: '广告投放' },
  { id: 'alliance',  emo: '🤝', name: '联盟分销' },
  { id: 'private',   emo: '🔒', name: '私域运营' },
  { id: 'bd',        emo: '🔗', name: '异业合作' },
  { id: 'store',     emo: '🏬', name: '应用商店' },
  { id: 'offline',   emo: '📍', name: '线下推广' },
  { id: 'tool',      emo: '🧩', name: '基建工具' }
];

/* ---------------- 价格类型 ---------------- */
QL.prices = [
  { id: 'free',  name: '免费', cls: 'tag-free' },
  { id: 'paid',  name: '付费', cls: 'tag-paid' },
  { id: 'mixed', name: '免费+付费', cls: 'tag-mixed' }
];

/* ---------------- 小工具函数 ---------------- */
QL.byId = function (arr, id) { for (var i = 0; i < arr.length; i++) { if (arr[i].id === id) return arr[i]; } return null; };
QL.pname = function (id) { var p = QL.byId(QL.products, id); return p ? p.name : id; };
QL.gname = function (id) { var g = QL.byId(QL.goals, id); return g ? g.name : id; };
QL.cname = function (id) { var c = QL.byId(QL.cats, id); return c ? c.name : id; };
QL.cemo  = function (id) { var c = QL.byId(QL.cats, id); return c ? c.emo : '•'; };
QL.sname = function (id) { var s = QL.byId(QL.stages, id); return s ? s.name : id; };
QL.pcls  = function (id) { var p = QL.byId(QL.prices, id); return p ? p.cls : 'tag'; };
QL.pname2 = function (id) { var p = QL.byId(QL.prices, id); return p ? p.name : id; };

// 星级（1–5）渲染成小块
QL.dots = function (n) {
  var s = '<span class="dots">';
  for (var i = 1; i <= 5; i++) s += '<i class="' + (i <= n ? 'f' + n : '') + '"></i>';
  return s + '</span>';
};
