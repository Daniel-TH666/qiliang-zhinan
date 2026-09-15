/* 起量指南 — 共享渲染组件（渠道卡片、标签、抽屉、区块头部）
   所有页面共用。只定义函数，不自动执行，避免和 app.js 抢时序。 */

window.QL = window.QL || {};
(function () {
  'use strict';
  var esc = QL.esc;

  /* ---------- 标签 ---------- */
  QL.priceTag = function (p) {
    return '<span class="tag ' + QL.pcls(p) + '">' + esc(QL.pname2(p)) + '</span>';
  };
  QL.regionTag = function (r) {
    return r === 'os' ? '<span class="tag tag-os">海外</span>' : '<span class="tag tag-cn">国内</span>';
  };
  QL.tag = function (text, cls) {
    return '<span class="tag ' + (cls || '') + '">' + esc(text) + '</span>';
  };

  /* 渠道卡片 */
  QL.chCard = function (ch, opt) {
    opt = opt || {};
    var products = (ch.fit || []).slice(0, 3).map(function (id) { return QL.pname(id); });
    var more = (ch.fit || []).length > 3 ? ' 等' : '';
    var soon = ch.soon ? '<span class="tag tag-soon">建设中</span>' : '';
    return '' +
      '<article class="card hoverable ch-card" id="ch-' + esc(ch.id) + '">' +
        '<div class="ch-head">' +
          '<span class="card-ico" style="margin-bottom:0">' + QL.cemo(ch.cat) + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<h3>' + esc(ch.name) + '</h3>' +
            '<span class="ch-cat">' + QL.cname(ch.cat) + ' · ' + (ch.region === 'os' ? '海外' : '国内') + ' · 成本投入 ' + ch.cost + '/5</span>' +
          '</div>' +
        '</div>' +
        '<div class="tag-row" style="margin:10px 0">' + QL.priceTag(ch.price) + soon + QL.tag('见效 ' + ch.speed + '/5') + '</div>' +
        '<p class="ch-sum">' + esc(ch.summary) + '</p>' +
        QL.meterRow(ch.cost, ch.speed, ch.difficulty) +
        '<div class="ch-foot">' +
          '<span class="small muted">适合：' + esc(products.join('、') + more) + '</span>' +
          '<span style="display:flex;gap:8px;flex-shrink:0">' +
            '<a class="btn btn-ghost btn-sm ch-link" href="' + esc(ch.url || '#') + '" target="_blank" rel="noopener noreferrer">平台入口 ↗</a>' +
            '<button class="btn btn-soft btn-sm" data-ch="' + esc(ch.id) + '">看怎么用</button>' +
          '</span>' +
        '</div>' +
      '</article>';
  };

  /* 渠道抽屉内容 */
  QL.chDrawerHTML = function (ch) {
    var h = '';
    h += '<div class="tag-row" style="margin-bottom:14px">' +
         QL.regionTag(ch.region) + QL.priceTag(ch.price) + QL.tag(QL.cname(ch.cat)) +
         (ch.soon ? QL.tag('内容建设中', 'tag-soon') : '') + '</div>';
    h += QL.meterRow(ch.cost, ch.speed, ch.difficulty);
    if (ch.url) {
      h += '<a class="btn btn-primary ch-link" style="margin:4px 0 2px" href="' + esc(ch.url) + '" target="_blank" rel="noopener noreferrer">打开平台入口 ↗</a>';
    }

    /* 尚未写完详情的渠道：给一个明确的说明，而不是空白标题 */
    if (ch.soon) {
      h += '<div class="soon-banner"><b>这条渠道的详细实操还在整理中</b>' +
        '<p class="small">海外频道目前只放了渠道框架（有哪些渠道、大概什么成本、适合什么产品），' +
        '每个渠道的具体操作步骤、预算区间和避坑点会陆续补上。你可以先看下面这些已写好的信息，' +
        '或者用国内频道的同类渠道做法做参考。</p></div>';
      if (ch.summary) h += '<h4>先了解一下</h4><p class="small">' + esc(ch.summary) + '</p>';
      h += '<h4>基本盘</h4><div class="tag-row">' +
        QL.tag('成本投入 ' + ch.cost + '/5') + QL.tag('见效速度 ' + ch.speed + '/5') +
        QL.tag('上手难度 ' + ch.difficulty + '/5') + QL.tag('需要团队 ' + ch.team + ' 人起') + '</div>';
      if (ch.fit && ch.fit.length) {
        h += '<h4>适合的产品</h4><div class="tag-row">';
        ch.fit.forEach(function (id) { h += QL.tag(QL.pname(id)); });
        h += '</div>';
      }
      if (ch.goals && ch.goals.length) {
        h += '<h4>主要作用</h4><div class="tag-row">';
        ch.goals.forEach(function (id) { h += QL.tag(QL.gname(id), 'tag-brand'); });
        h += '</div>';
      }
      h += '<div class="callout brand" style="margin-top:18px">想第一时间拿到这一节？' +
        '把本站加入书签，或者去<a href="about.html#contact">关于页</a>留下邮箱，' +
        '我们会把补好的渠道清单发给你。</div>';
      h += '<div class="ad-slot ad-slot-inline" data-slot="channel-detail"></div>';
      return h;
    }

    h += '<h4>为什么值得做</h4><p class="small">' + esc(ch.why) + '</p>';

    if (ch.ops && ch.ops.length) {
      h += '<h4>具体怎么做</h4><ol class="dot-list" style="padding-left:0">';
      ch.ops.forEach(function (o) { h += '<li>' + esc(o) + '</li>'; });
      h += '</ol>';
    }
    if (ch.kpi && ch.kpi.length) {
      h += '<h4>重点看这几个数</h4><div class="tag-row">';
      ch.kpi.forEach(function (k) { h += QL.tag(k, 'tag-brand'); });
      h += '</div>';
    }
    if (ch.pitfall) {
      h += '<div class="callout warn" style="margin-top:18px"><b>常见坑</b>' + esc(ch.pitfall) + '</div>';
    }
    if (ch.tools && ch.tools.length) {
      h += '<h4 style="margin-top:20px">常用工具</h4><div class="tag-row">';
      ch.tools.forEach(function (t) { h += QL.tag(t); });
      h += '</div>';
    }

    /* 该渠道出现在哪些产品打法里 */
    var used = (QL.playbooks || []).filter(function (p) {
      return (p.free || []).indexOf(ch.id) > -1 || (p.paid || []).indexOf(ch.id) > -1;
    });
    if (used.length) {
      h += '<h4 style="margin-top:22px">这类产品会用到它</h4><div class="tag-row">';
      used.forEach(function (p) {
        h += '<a class="tag tag-brand" href="playbook.html?id=' + esc(p.id) + '">' + esc(QL.pname(p.id)) + '</a>';
      });
      h += '</div>';
    }

    h += '<div class="ad-slot ad-slot-inline" data-slot="channel-detail"></div>';
    h += '<p class="small muted" style="margin-top:14px">觉得有用？把本站加入书签，推广前先来查一遍。</p>';
    return h;
  };

  QL.openChannel = function (id) {
    var ch = QL.byId(QL.channels || [], id);
    if (!ch) return;
    var nameEl = document.getElementById('drawerName');
    if (nameEl) nameEl.textContent = ch.name;
    QL.openDrawer(QL.chDrawerHTML(ch));
    QL.renderAds(document.getElementById('drawerBody'));
  };

  /* ---------- 打赏位 ----------
     配置在 data/monetize.js 的 QL.support。
     收款码图片填了路径就显示真图；没填就显示一个占位方块（不会产生 404）。
     页面出现一个「赞赏支持」按钮，点开抽屉看二维码。 */

  QL._qrBox = function (m) {
    if (m.img) {
      return '<figure class="qr-box"><img src="' + esc(m.img) + '" alt="' + esc(m.name) +
        '" loading="lazy"><figcaption>' + esc(m.tip || m.name) + '</figcaption></figure>';
    }
    return '<figure class="qr-box"><div class="qr-ph" aria-hidden="true"><span>' +
      esc(m.name) + '</span></div><figcaption>' + esc(m.tip || m.name) + '</figcaption></figure>';
  };

  QL.supportDrawerHTML = function () {
    var s = QL.support || {};
    var h = '<p class="small">' + esc(s.desc || '') + '</p>';
    h += '<div class="qr-row">' + (s.methods || []).map(QL._qrBox).join('') + '</div>';
    if (s.thanks) h += '<div class="callout brand"><b>这些钱用在哪</b>' + esc(s.thanks) + '</div>';
    if (s.altNote) h += '<p class="small muted">' + esc(s.altNote) + '</p>';
    return h;
  };

  /* 精简版：放在每个页面页脚上方 */
  QL.supportBar = function () {
    var s = QL.support;
    if (!s || s.enabled === false || s.showInFooter === false) return '';
    return '' +
      '<div class="tip-bar">' +
        '<div class="tip-bar-txt">' +
          '<b>' + esc(s.title || '支持本站') + '</b>' +
          '<span>' + esc(s.desc || '') + '</span>' +
        '</div>' +
        '<button class="btn btn-primary btn-sm" data-tip>赞赏支持</button>' +
      '</div>';
  };

  /* 完整版：给首页用 */
  QL.supportCard = function () {
    var s = QL.support;
    if (!s || s.enabled === false) return '';
    return '' +
      '<div class="tip-card">' +
        '<div class="tip-card-main">' +
          '<div class="eyebrow">支持本站</div>' +
          '<h3 class="mt0">' + esc(s.title || '支持本站') + '</h3>' +
          '<p class="muted">' + esc(s.desc || '') + '</p>' +
          (s.thanks ? '<p class="small muted mb0">' + esc(s.thanks) + '</p>' : '') +
        '</div>' +
        '<div class="qr-row">' + (s.methods || []).map(QL._qrBox).join('') + '</div>' +
      '</div>';
  };

  QL.openSupport = function () {
    var t = document.getElementById('drawerTitle');
    if (t) t.innerHTML = '<div class="ch-cat">支持本站</div><h3 style="margin:0">打赏与支持</h3>';
    QL.openDrawer(QL.supportDrawerHTML());
  };

  /* 页面里写 <div data-support></div> 就会填入完整版打赏卡片 */
  QL.renderSupport = function (root) {
    var list = QL.$$ ? QL.$$('[data-support]', root) : [];
    list.forEach(function (el) { el.innerHTML = QL.supportCard(); });
  };

  /* ---------- 区块标题 ---------- */
  QL.secHead = function (eyebrow, title, desc, center) {
    return '<div class="sec-head' + (center ? ' center' : '') + '">' +
      (eyebrow ? '<div class="eyebrow">' + esc(eyebrow) + '</div>' : '') +
      '<h2>' + title + '</h2>' +
      (desc ? '<p>' + desc + '</p>' : '') + '</div>';
  };

  /* ---------- 公共头部 / 页脚 / 抽屉（写进 HTML，此处提供生成函数便于统一维护） ---------- */
  QL.NAV = [
    { t: '推广方案', u: 'recommend.html' },
    { t: '渠道库',   u: 'channels.html' },
    { t: '国内推广', u: 'china.html' },
    { t: '海外推广', u: 'overseas.html' },
    { t: '打法拆解', u: 'cases.html' },
    { t: '工具箱',   u: 'tools.html' }
  ];

  QL.header = function (active) {
    var nav = QL.NAV.map(function (n) {
      return '<a href="' + n.u + '"' + (n.u === active ? ' class="on"' : '') + '>' + n.t + '</a>';
    }).join('');
    return '' +
      '<header class="site-header">' +
        '<div class="wrap header-inner">' +
          '<a class="logo" href="index.html">' +
            '<span class="logo-mark">起</span>' +
            '<span>起量指南<small>让好产品被看见</small></span>' +
          '</a>' +
          '<nav class="nav">' + nav + '</nav>' +
          '<div class="header-right">' +
            '<div class="search-box">' +
              '<span class="si">&#128269;</span>' +
              '<input type="text" placeholder="搜渠道 / 打法 / 术语" aria-label="站内搜索">' +
              '<div class="search-drop"></div>' +
            '</div>' +
            '<button class="menu-btn" aria-label="展开菜单">&#9776;</button>' +
          '</div>' +
        '</div>' +
      '</header>';
  };

  QL.footer = function () {
    return '' +
      '<footer class="site-footer">' +
        '<div class="wrap">' +
          '<div class="ad-slot" data-slot="footer-top" style="margin-bottom:26px"></div>' +
          QL.supportBar() +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<a class="logo" href="index.html"><span class="logo-mark">起</span><span>起量指南</span></a>' +
              '<p>帮你搞清楚「我的产品该去哪里推广」。按产品类型、阶段和预算，给出可以照着做的渠道组合与行动清单。</p>' +
            '</div>' +
            '<div><h5>开始推广</h5>' +
              '<a href="recommend.html">推广方案推荐器</a>' +
              '<a href="channels.html">渠道库（101 个）</a>' +
              '<a href="china.html">国内推广指南</a>' +
              '<a href="overseas.html">海外推广（17 个）</a>' +
            '</div>' +
            '<div><h5>工具与资料</h5>' +
              '<a href="tools.html">工具箱</a>' +
              '<a href="tools.html#prep">成本量级参考</a>' +
              '<a href="glossary.html">术语速查</a>' +
              '<a href="cases.html">打法拆解</a>' +
            '</div>' +
            '<div><h5>关于</h5>' +
              '<a href="about.html">关于本站</a>' +
              '<a href="promote.html">广告合作与报价</a>' +
              '<a href="about.html#privacy">隐私与免责</a>' +
              '<a href="promote.html#contact">联系我们</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span>© ' + new Date().getFullYear() + ' 起量指南 · 内容仅供参考，请以各平台最新规则为准</span>' +
            '<span>本站部分广告位为商业合作，均会标注「推广」标识</span>' +
          '</div>' +
        '</div>' +
      '</footer>';
  };

  QL.drawerHTML = function () {
    return '' +
      '<div class="drawer-mask" id="drawerMask"></div>' +
      '<aside class="drawer" id="drawer" aria-hidden="true">' +
        '<div class="drawer-head">' +
          '<div class="di" id="drawerTitle"></div>' +
          '<button class="drawer-close" id="drawerClose" aria-label="关闭">&#10005;</button>' +
        '</div>' +
        '<div class="drawer-body" id="drawerBody"></div>' +
      '</aside>';
  };

  /* 页面骨架：自动插入头部、页脚、抽屉，页面 HTML 只需写主内容 */
  QL.mount = function (active) {
    var h = document.getElementById('siteHeader');
    if (h) h.outerHTML = QL.header(active);
    var f = document.getElementById('siteFooter');
    if (f) f.outerHTML = QL.footer();
    var d = document.getElementById('siteDrawer');
    if (d) d.outerHTML = QL.drawerHTML();
    QL.renderAds(document);
    QL.renderSupport(document);
    if (QL.initAnalytics) QL.initAnalytics();   // 统计脚本在骨架挂好后注入
  };

  /* ---------- 点击渠道按钮 ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ch]');
    if (b) {
      e.preventDefault();
      QL.openChannel(b.getAttribute('data-ch'));
      return;
    }
    var t = e.target.closest('[data-tip]');
    if (t) { e.preventDefault(); QL.openSupport(); }
  });

  /* ---------- 启动 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    QL.mount(document.body.getAttribute('data-nav') || '');
    /* 骨架挂载完成后，再初始化菜单 / 搜索 / 抽屉（否则选择器落空） */
    if (QL.initChrome) QL.initChrome();
    var t = document.getElementById('drawerTitle');
    if (t) t.innerHTML = '<div class="ch-cat">推广渠道详情</div><h3 id="drawerName" style="margin:0"></h3>';
  });
})();
