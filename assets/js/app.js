/* 起量指南 — 全站核心脚本（无依赖，原生 JS）
   包含：移动端菜单、全站搜索、广告位渲染、抽屉、复制、通用小工具。 */

(function () {
  'use strict';

  var QL = window.QL = window.QL || {};

  /* ---------------- 小工具 ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  QL.$ = $; QL.$$ = $$; QL.esc = esc;

  QL.param = function (k) {
    var m = new RegExp('[?&]' + k + '=([^&#]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  };

  /* ---------------- 移动端菜单 ---------------- */
  function initMenu() {
    var btn = $('.menu-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('nav-open')) return;
      if (e.target.closest('.site-header')) return;
      document.body.classList.remove('nav-open');
    });
  }

  /* ---------------- 全站搜索 ---------------- */
  function buildIndex() {
    var idx = [];
    (QL.channels || []).forEach(function (c) {
      idx.push({
        t: c.name, s: c.summary, u: 'channels.html?q=' + encodeURIComponent(c.name) + '&id=' + c.id,
        g: '渠道 · ' + QL.cname(c.cat)
      });
    });
    (QL.cases || []).forEach(function (c) {
      idx.push({ t: c.title, s: '预算 ' + c.budget + ' · 周期 ' + c.days, u: 'cases.html#' + c.id, g: '打法拆解' });
    });
    (QL.playbooks || []).forEach(function (p) {
      idx.push({ t: QL.pname(p.id) + '该怎么推广', s: p.headline, u: 'playbook.html?id=' + p.id, g: '产品打法' });
    });
    (QL.glossary || []).forEach(function (g) {
      idx.push({ t: g.t, s: g.d, u: 'glossary.html#' + encodeURIComponent(g.t), g: '术语' });
    });
    [
      { t: '推广方案推荐器', s: '输入产品类型和预算，生成专属推广渠道组合和 30 天计划', u: 'recommend.html', g: '工具' },
      { t: '推广预算 & ROI 计算器', s: '算出你的点击成本上限和投放回本线', u: 'tools.html', g: '工具' },
      { t: 'UTM 链接生成器', s: '生成带跟踪参数的推广链接', u: 'tools.html#utm', g: '工具' },
      { t: '国内推广指南', s: '五大平台的完整打法与操作步骤', u: 'china.html', g: '指南' },
      { t: '海外推广', s: 'Google / Meta / TikTok 等海外渠道（建设中）', u: 'overseas.html', g: '指南' },
      { t: '渠道库', s: '53 个国内推广渠道 + 12 个海外渠道', u: 'channels.html', g: '渠道' },
      { t: '付费推广合作', s: '在本站投放推广位', u: 'promote.html', g: '合作' }
    ].forEach(function (x) { idx.push(x); });
    return idx;
  }

  function initSearch() {
    var box = $('.search-box');
    if (!box) return;
    var input = $('input', box);
    var drop = $('.search-drop', box);
    if (!input || !drop) return;
    var index = buildIndex();

    function render(list) {
      if (!list.length) {
        drop.innerHTML = '<div class="sd-empty">没找到相关内容，试试更短的关键词，或去<a href="channels.html">渠道库</a>按分类浏览</div>';
        drop.classList.add('open');
        return;
      }
      // 按分组归类
      var groups = {}, order = [];
      list.forEach(function (it) {
        if (!groups[it.g]) { groups[it.g] = []; order.push(it.g); }
        groups[it.g].push(it);
      });
      var html = '';
      order.forEach(function (g) {
        html += '<div class="sd-group">' + esc(g) + '</div>';
        groups[g].slice(0, 5).forEach(function (it) {
          html += '<a href="' + esc(it.u) + '">' + esc(it.t) +
                  (it.s ? '<span>' + esc(it.s).slice(0, 62) + '</span>' : '') + '</a>';
        });
      });
      drop.innerHTML = html;
      drop.classList.add('open');
    }

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      if (!q) { drop.classList.remove('open'); return; }
      var hit = index.filter(function (it) {
        return (it.t + ' ' + (it.s || '') + ' ' + it.g).toLowerCase().indexOf(q) > -1;
      });
      render(hit.slice(0, 24));
    });
    input.addEventListener('focus', function () { if (input.value.trim()) input.dispatchEvent(new Event('input')); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = input.value.trim();
        if (q) location.href = 'channels.html?q=' + encodeURIComponent(q);
      }
      if (e.key === 'Escape') { drop.classList.remove('open'); input.blur(); }
    });
    document.addEventListener('click', function (e) {
      if (!box.contains(e.target)) drop.classList.remove('open');
    });
  }

  /* ---------------- 广告位渲染 ---------------- */
  QL.renderAds = function (root) {
    $$('.ad-slot', root).forEach(function (el) {
      var key = el.getAttribute('data-slot');
      var cfg = (QL.ads && QL.ads.slots && QL.ads.slots[key]) || { name: '广告位', size: '', desc: '' };
      var on = QL.ads && QL.ads.enabled;
      var custom = el.getAttribute('data-html');
      if (on && custom) { el.innerHTML = custom; return; }
      if (on && el.innerHTML.trim()) return; // 已由页面自己填了广告代码
      el.innerHTML =
        '<div><b>' + esc(cfg.name) + (cfg.size ? '　' + esc(cfg.size) : '') + '</b>' +
        esc(cfg.desc) +
        '<br><span style="opacity:.75">广告位招商中 · 在 data/monetize.js 里接入联盟代码后自动显示</span></div>';
    });
  };

  /* ---------------- 抽屉（渠道详情） ---------------- */
  QL.openDrawer = function (html) {
    var drawer = $('#drawer'), mask = $('#drawerMask');
    if (!drawer || !mask) return;
    $('#drawerBody').innerHTML = html;
    drawer.classList.add('open');
    mask.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawer.scrollTop = 0;
  };
  QL.closeDrawer = function () {
    var drawer = $('#drawer'), mask = $('#drawerMask');
    if (!drawer || !mask) return;
    drawer.classList.remove('open');
    mask.classList.remove('open');
    document.body.style.overflow = '';
  };

  function initDrawer() {
    var mask = $('#drawerMask'), close = $('#drawerClose');
    if (mask) mask.addEventListener('click', QL.closeDrawer);
    if (close) close.addEventListener('click', QL.closeDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') QL.closeDrawer(); });
  }

  /* ---------------- 复制到剪贴板 ---------------- */
  QL.copy = function (text, btn) {
    function done() {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = '已复制 ✓';
      setTimeout(function () { btn.textContent = old; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var src = b.getAttribute('data-copy');
    var node = src && src.charAt(0) === '#' ? $(src) : null;
    QL.copy(node ? node.value || node.textContent : src, b);
  });

  /* ---------------- 通用：把 #锚点 的目录高亮 ---------------- */
  function initToc() {
    var links = $$('.toc a[href^="#"]');
    if (!links.length) return;
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    function onScroll() {
      var y = window.scrollY + 110, cur = 0;
      targets.forEach(function (t, i) { if (t && t.offsetTop <= y) cur = i; });
      links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- 星级渲染（给数据层用） ---------------- */
  QL.meterRow = function (a, b, c) {
    return '<div class="meters">' +
      '<div class="meter"><label>成本</label>' + QL.dots(a) + '</div>' +
      '<div class="meter"><label>见效速度</label>' + QL.dots(b) + '</div>' +
      '<div class="meter"><label>上手难度</label>' + QL.dots(c) + '</div>' +
      '</div>';
  };

  /* ---------------- 启动 ----------------
     注意：页头 / 页脚 / 抽屉的 HTML 是 components.js 在 DOMContentLoaded
     时注入的，而本文件在同一事件的监听器里排在前面的会先执行。
     所以菜单、搜索、抽屉这三项初始化必须等骨架挂载完成后再跑，
     否则 .menu-btn / .search-box / #drawerMask 都还不存在，事件全部绑不上
     （表现就是：搜索框没反应、抽屉只能按 Esc 关）。 */
  var chromeInited = false;
  QL.initChrome = function () {
    if (chromeInited) return;   // 防止两边都调用导致重复绑事件
    chromeInited = true;
    initMenu();
    initSearch();
    initDrawer();
  };

  document.addEventListener('DOMContentLoaded', function () {
    initToc();
    QL.renderAds(document);
    /* 若骨架已经挂载好（页面里没有占位元素），就直接初始化；
       否则由 components.js 在挂载完成后调用 QL.initChrome()。 */
    if (!document.getElementById('siteHeader') && !document.getElementById('siteDrawer')) QL.initChrome();
  });
})();
