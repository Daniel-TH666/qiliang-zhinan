/* 起量指南 — 产品打法（回答「不同产品该怎么推广」）
   每个产品类型一份打法总结：核心逻辑、免费渠道、付费渠道、关键指标、常见错误。
   free / paid 里填的是 data/channels.js 里的渠道 id。 */

window.QL = window.QL || {};

QL.playbooks = [
{
  id: 'tool',
  headline: '工具类：先让人「搜到」，再让人「用上」',
  logic: '工具的需求天然是「搜索型」的——用户遇到问题会去搜解决方案，而不是逛社交平台。所以工具类的第一优先级永远是 SEO / 搜索类渠道，付费广告只是加速器。产品本身要能「3 分钟上手出结果」，否则来多少流量都留不住。',
  free: ['baidu-seo', 'multi-seo', 'zhihu', 'v2ex', 'tech-content', 'sspai', 'jike', 'github-open', 'content-matrix', 'utm'],
  paid: ['baidu-sem', 'juliliang', 'xhs-juguang', 'zhihu-ads', 'kol'],
  kpi: ['自然搜索流量', '首页 → 注册转化率', '7 日留存', '付费转化率'],
  mistake: '最典型的错误是「一上线就去投抖音信息流」。工具的用户在搜索引擎和社区里，不在娱乐信息流里。先用免费的搜索和社区渠道把产品说服力磨出来，再去投钱。',
  timeline: '0–1 月：铺 SEO 基础 + 社区发帖；1–3 月：内容矩阵 + 达人测评；3 月后：小预算投放放大'
},
{
  id: 'ai',
  headline: 'AI 产品：靠「演示」和「话题」出圈',
  logic: 'AI 产品最大的壁垒不是技术，而是「让人相信它真的有用」。所以最有效的推广形式是「效果演示」——一个 15 秒的前后对比视频，胜过一万字的技术说明。同时 AI 产品天生自带话题，要去技术圈和产品圈引爆。',
  free: ['zhihu', 'bilibili', 'tech-content', 'v2ex', 'jike', 'github-open', 'content-matrix', 'baidu-seo', 'utm'],
  paid: ['juliliang', 'kol', 'google-ads'],
  kpi: ['试用转化率', '日均使用次数', '自然分享率', '留存'],
  mistake: '常见错误是「讲模型参数不讲使用效果」。用户不关心你用什么模型，只关心「能帮我省多少时间」。另一个坑是免费额度给得太少，用户还没体验到价值就用完了。',
  timeline: '0–2 周：演示内容 + 技术社区首发；1–2 月：达人测评铺开；2 月后：投放放大'
},
{
  id: 'ec',
  headline: '电商：把「决策最后一公里」全部铺满',
  logic: '电商推广的本质是「在用户做购买决策的每一个环节都出现」。用户决策路径通常是：刷到内容 → 搜索比价 → 看评价 → 下单。你要做的是每个环节都有你的信息，而不是只在某一个环节砸钱。',
  free: ['xhs-search', 'xiaohongshu', 'wechat-mp', 'qywx', 'douyin-search', 'content-matrix', 'smzdm', 'utm'],
  paid: ['cps', 'kol', 'alimama', 'jd-jingzhuntong', 'xhs-juguang', 'juliliang'],
  kpi: ['访客数', '加购率', '转化率', '客单价', '复购率'],
  mistake: '最烧钱的错误是「product 还没打磨好就去投广告」。主图、详情页、评价这三样不过关，投多少钱都是亏。先用 CPS（按成交付佣金）验证转化率，跑正了再投 CPC。',
  timeline: '0–1 月：内容种草 + CPS 验证；1–2 月：达人合作 + 评价积累；2 月后：站内+站外投放并跑'
},
{
  id: 'content',
  headline: '内容站：SEO 是命脉，多分发是加速器',
  logic: '内容站的推广几乎等同于 SEO。核心动作只有两件：一是做「有人搜」的内容，二是让搜索引擎尽快收录。所有社交媒体分发的目的，一是引初始流量，二是引蜘蛛收录。',
  free: ['baidu-seo', 'multi-seo', 'content-matrix', 'jike', 'wechat-mp', 'sspai', 'podcast', 'seo-content-tool', 'utm'],
  paid: ['baidu-sem', 'pr-media', 'juliliang'],
  kpi: ['收录页数', '自然搜索访客', '单页停留时长', '回访率'],
  mistake: '最大的坑是「为了量而量产垃圾内容」，纯 AI 生成的站群在百度很容易被整体降权（飓风算法）。另一个坑是不做内链，搜索引擎无法理解站点结构，收录会很差。',
  timeline: '0–1 月：选题库 + 首批 50 篇；1–3 月：内容规模化 + 内链优化；3 月后：老内容更新 + 外链建设'
},
{
  id: 'app',
  headline: 'App：商店 ASO 打底，内容渠道拉新',
  logic: 'App 的流量有两个入口：应用商店内的搜索（ASO）和站外内容（短视频/社区/投放）。ASO 是免费的、必须做的地基；站外内容决定你能不能突破自然增长的天花板。',
  free: ['aso', 'baidu-seo', 'xhs-search', 'douyin-search', 'bilibili', 'v2ex', 'content-matrix', 'utm'],
  paid: ['juliliang', 'tencent-ads', 'meta-ads', 'kol', 'aso'],
  kpi: ['商店曝光→下载转化率', '自然下载量', '次日/7日留存', '获客成本 CAC'],
  mistake: '最常见的问题是把钱都花在买量上，但商店页面（截图、视频、描述）很粗糙，导致转化率只有同行一半——这样买量成本会贵一倍。先优化商店素材，再考虑投放。',
  timeline: '0–2 周：ASO 基础优化 + 商店素材；1 月：内容渠道铺量；1–2 月：小预算投放测素材；2 月后：放量'
},
{
  id: 'mp',
  headline: '小程序：吃微信生态内的免费流量',
  logic: '小程序的推广成本可以极低，因为微信自己会给流量：搜一搜、附近的小程序、发现页、分享卡片。把这些免费入口吃透，再配合私域承接，冷启动基本不用花钱。',
  free: ['miniapp-traffic', 'wechat-sousuo', 'wechat-mp', 'qywx', 'shipinhao', 'local-map', 'fenxiao', 'utm'],
  paid: ['tencent-ads', 'kol', 'juliliang'],
  kpi: ['小程序访问量', '搜一搜来源占比', '分享率', '付费/留资转化'],
  mistake: '最大的遗憾是「小程序名字起错了」。名称唯一、注册后改名会掉权重，选名字时一定要把核心关键词放进去（比如「XX 记账」而不是「萌系小助手」）。',
  timeline: '0–2 周：名称/类目/搜一搜优化；1 月：社群裂变；1–2 月：视频号+朋友圈承接；2 月后：投放'
},
{
  id: 'local',
  headline: '本地生意：让周边 3 公里的人都找到你',
  logic: '本地生意的推广不需要全国流量，只需要「附近的人」。核心是三件事：地图/点评上能搜到、周边人群能看到、来了之后能留下好评。这三件事都是低成本甚至免费的。',
  free: ['local-map', 'wechat-mp', 'qywx', 'bd-huhuan', 'xhs-search', 'douyin-search', 'xiaohongshu', 'utm'],
  paid: ['meituan-tuiguang', 'tencent-ads', 'juliliang', 'kol'],
  kpi: ['地图曝光/导航数', '到店人数', '团购核销率', '店铺评分', '复购率'],
  mistake: '最致命的错误是「不维护评价」。评分掉到 4.5 以下，再投钱效果也会断崖式下滑——因为用户先看评分再决定要不要点进来。把评价当日常动作，每单都引导。',
  timeline: '0–2 周：地图三平台信息补齐 + 首批评价；1 月：周边异业合作 + 内容种草；1 月后：推广通投放 + 私域复购'
},
{
  id: 'course',
  headline: '课程/知识付费：先证明专业，再谈成交',
  logic: '知识付费的推广 = 信任建立。用户买的不是课程，是「这个人是这个领域的专家」这个判断。所以最有效的动作是持续输出专业内容，让用户先免费受益、再愿意付费。',
  free: ['zhihu', 'wechat-mp', 'xhs-search', 'bilibili', 'podcast', 'zsxq', 'wechat-sousuo', 'gzh-hutui', 'douyin-search', 'utm'],
  paid: ['kol', 'tencent-ads', 'zhihu-ads', 'juliliang', 'xhs-juguang'],
  kpi: ['免费资料领取数', '试听/体验课转化率', '正价课成交率', '完课率', '转介绍率'],
  mistake: '常见错误是「直接卖正价课」。正确的路径是：免费内容 → 低价体验 → 正价成交 → 高价陪跑。跳级卖课，转化率会低到让人怀疑人生。',
  timeline: '0–1 月：专业内容铺量（知乎/B站/公众号）；1 月：9.9 体验课测转化；1–2 月：正价课 + 达人合作；2 月后：投放放量'
},
{
  id: 'game',
  headline: '游戏/泛娱乐：素材和渠道并重，靠量取胜',
  logic: '游戏是典型的「买量生意」，但买量效率取决于素材。同样的钱，素材好的人能拿到 3 倍的量。所以游戏推广的第一优先级是「批量生产并测试素材」，第二才是渠道选择。',
  free: ['aso', 'douyin-search', 'bilibili', 'tieba', 'nga-hupu', 'content-matrix', 'video-matrix', 'utm'],
  paid: ['juliliang', 'tencent-ads', 'kuaishou-cili', 'meta-ads', 'kol'],
  kpi: ['点击率', '安装成本', '次留/7留', 'LTV', 'ROI（LTV/CAC）'],
  mistake: '最大的坑是「算不清 LTV 就买量」。游戏的 ROI 要按 LTV 算，如果 30 天 LTV 低于获客成本，买得越多亏得越多。先用小量测留存和付费率，算清楚再放量。',
  timeline: '0–2 周：素材批量测试（20 条起）；1 月：渠道小额并跑；1–2 月：跑通渠道放量 + 私域/社区运营'
},
{
  id: 'b2b',
  headline: 'B2B：内容建立专业度，关系推动成交',
  logic: 'B2B 的决策链长、金额大、参与人多，所以「直接投放」效率很低。真正有效的是：用专业内容让决策者认识你，再用持续跟进把关系推进到成交。内容 + 私域跟进是核心。',
  free: ['zhihu', 'wechat-mp', 'baidu-seo', 'tech-content', 'baidu-baike', 'qywx', 'content-matrix', 'podcast', 'utm'],
  paid: ['baidu-sem', 'pr-media', 'tencent-ads', 'linkedin', 'zhihu-ads', 'kol'],
  kpi: ['有效线索数', '线索到商机转化率', '销售周期', '客单价', '赢单率'],
  mistake: '最常见的错误是「把 B2B 当 B2C 投」。B2B 一条线索值几千块是正常的，用「今晚下单立减」这种 B2C 打法会显得不专业。另外一定要做品牌词搜索优化——客户被介绍后会搜你公司名，搜不到就黄了。',
  timeline: '0–1 月：官网+品牌词+百科打底；1–3 月：专业内容持续输出；3 月后：SEM 获客 + 案例包装'
},
{
  id: 'ip',
  headline: '个人 IP：一个平台做深，胜过五个平台做浅',
  logic: '个人 IP 的推广逻辑和公司产品完全不同——用户关注的是「人」而不是「产品」。所以最有效的动作是选定一个平台，持续输出同一个人设的内容，把人立起来，产品自然卖得动。',
  free: ['xhs-search', 'zhihu', 'bilibili', 'douyin-search', 'wechat-mp', 'shipinhao', 'podcast', 'jike', 'utm'],
  paid: ['kol', 'douyin', 'shipinhao'],
  kpi: ['粉丝净增', '单条内容互动率', '主页访问量', '私信咨询数'],
  mistake: '最大的错误是「全平台同时开号」，结果每个平台都做不起来。正确做法是先在一个平台做到 1000 粉、跑通内容模型，再把同一套内容剪成不同形式分发到其他平台。',
  timeline: '0–1 月：单平台日更，找内容感觉；1–3 月：跑出爆款结构后复制；3 月后：多平台分发 + 产品化'
},
{
  id: 'community',
  headline: '社区产品：先解决「冷启动」这个死结',
  logic: '社区产品的推广核心不是拉人，而是「让进来的人觉得这里热闹」。所以早期要做的是人工制造内容密度：你自己当最活跃的用户，先让社区看起来有人气，再拉真实用户。',
  free: ['jike', 'v2ex', 'douban', 'tieba', 'qywx', 'content-matrix', 'zhihu', 'utm'],
  paid: ['juliliang', 'kol', 'tencent-ads'],
  kpi: ['发帖/互动用户数', '内容生产量', '次日留存', '用户平均停留时长'],
  mistake: '最常见的死法是大规模买量，拉来一堆人在空荡荡的社区里逛 30 秒就走。社区必须「先小后大」：先做 100 个铁杆用户的深度社区，再考虑规模化。',
  timeline: '0–1 月：手动邀请 100 个种子用户 + 自造内容；1–3 月：内容生产者激励；3 月后：逐步放量获取'
}
];

QL.playbookById = function (id) { return QL.byId(QL.playbooks, id); };
