/* 起量指南 — 推广方案推荐引擎
   输入：产品类型 / 推广目标 / 阶段 / 预算 / 团队 / 地区
   输出：渠道组合 + 优先级 + 预算分配 + 30 天行动清单 + 避坑提醒

   打分逻辑全部可读可改。想调某类渠道的权重，改 SCORE 里对应的数字即可。
   纯前端计算，不上传任何数据。 */

window.QL = window.QL || {};
(function () {
  'use strict';
  var esc = QL.esc;

  /* 各预算档位的参考金额（用于生成分配建议，不是让用户填真实数字） */
  var AMOUNT = { b0: 0, b1: 1000, b2: 10000, b3: 100000, b4: 100000 };

  function niceRound(n) {
    if (n >= 10000) return Math.round(n / 1000) * 1000;
    if (n >= 1000) return Math.round(n / 100) * 100;
    if (n >= 100) return Math.round(n / 10) * 10;
    return Math.round(n);
  }
  function money(n) {
    return '¥' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /* ==================================================================
     一、打分
     ================================================================== */

  /* 产品类型 × 渠道分类 的天然契合度。
     这是整套推荐里权重最高的一项——方向对了，后面的努力才有意义。 */
  var AFFINITY = {
    tool:      { search: 16, community: 10, content: 8,  tool: 8 },
    ai:        { community: 14, content: 10, video: 8,   search: 8 },
    ec:        { social: 16, alliance: 14, ads: 10, video: 8, content: 6, private: 6 },
    content:   { search: 18, content: 12, tool: 8 },
    app:       { store: 20, ads: 12, video: 8, social: 6 },
    mp:        { private: 18, search: 10, social: 8, alliance: 6 },
    local:     { offline: 22, private: 12, social: 10, search: 8, ads: 8 },
    course:    { social: 12, content: 12, private: 10, ads: 8, video: 8 },
    game:      { ads: 14, video: 12, social: 8, alliance: 6 },
    b2b:       { search: 14, content: 12, bd: 10, private: 8 },
    ip:        { content: 14, social: 12, community: 10 },
    community: { community: 16, content: 12, social: 8 }
  };

  /* 不属于「推广渠道」的基建类，单独作为前置动作展示，不参与排序 */
  var FOUNDATION = ['utm'];

  QL.scoreChannel = function (ch, ctx) {
    var s = 42, why = [];
    var p = ctx.p, g = ctx.g, st = ctx.st, budMax = ctx.budMax, power = ctx.power;

    /* 产品匹配 */
    if ((ch.fit || []).indexOf(p) > -1) { s += 24; why.push('正好是这类产品常用的渠道'); }
    else { s -= 16; }

    /* 产品类型 × 渠道分类的天然契合度（权重最高） */
    var aff = (AFFINITY[p] || {})[ch.cat] || 0;
    if (aff) {
      s += aff;
      if (aff >= 10) why.push('这类产品的主战场就是' + QL.cname(ch.cat));
    }

    /* 目标匹配 */
    if ((ch.goals || []).indexOf(g) > -1) { s += 20; why.push('能直接达成「' + ctx.goalName + '」'); }
    else { s -= 10; }

    /* 阶段匹配 */
    if ((ch.stages || []).indexOf(st) > -1) { s += 12; } else { s -= 6; }

    /* 编辑精选：产品打法里手工整理过的渠道清单，权重给得很高 */
    var pbFree = (ctx.pb && ctx.pb.free) || [];
    var pbPaid = (ctx.pb && ctx.pb.paid) || [];
    if (pbFree.indexOf(ch.id) > -1) { s += 24; why.push('这类产品的标准打法里就有它'); }
    else if (pbPaid.indexOf(ch.id) > -1) { s += 18; }

    /* 预算：免费渠道不看钱、只看时间；付费渠道严格看预算 */
    if (ch.price === 'free') {
      s += 12; why.push('基本不花钱，只要投入时间');
    } else if (ch.price === 'mixed') {
      /* 「免费为主、可以加码」的渠道：超出一档预算也只算轻微扣分，
         因为它完全可以只做免费的部分 */
      s += 8;
      var over1 = ch.cost - budMax - 1;
      if (over1 > 0) { s -= over1 * 8; } else { s += 10; why.push('成本在你当前预算范围内'); }
    } else {
      var over2 = ch.cost - budMax;
      if (over2 > 0) { s -= over2 * 28; } else { s += 10; why.push('成本在你当前预算范围内'); }
      if (budMax <= 1) s -= 34;
    }

    /* 团队 */
    if (ch.team <= power) { s += 8; }
    else { s -= 22; if (power <= 2) why.push('这个渠道要有人专门盯，暂时不太现实'); }

    /* 一人团队扛不住的是「要持续投钱盯盘」和「要日更」的渠道，
       纯免费的慢渠道（SEO、内容）只是慢，一个人也能做。
       编辑精选清单里的渠道已经考虑过适配性，不再重复扣分。 */
    if (power <= 2 && ch.difficulty >= 4 && ch.price !== 'free' && pbFree.indexOf(ch.id) < 0) s -= 12;

    /* 阶段偏好 */
    if (st === 'cold') {
      if (ch.price === 'paid') { s -= 12; } else { s += 10; }
      if (ch.speed >= 4) s += 6;
    }
    if (st === 'grow' && ch.speed >= 3) s += 6;
    if (st === 'scale') {
      if (ch.price === 'paid') { s += 14; }
      if (ch.speed >= 4) s += 6;
    }

    /* 目标 × 渠道类型的强关联 */
    if (g === 'lead' && /search|ads|offline/.test(ch.cat)) s += 10;
    if (g === 'sale' && /alliance|ads|social/.test(ch.cat)) s += 8;
    if (g === 'download' && /store|ads/.test(ch.cat)) s += 12;
    if (g === 'seed' && /community|content/.test(ch.cat)) s += 12;
    if (g === 'brand' && /search|bd|content/.test(ch.cat)) s += 8;
    if (g === 'traffic' && /search|content|video|social/.test(ch.cat)) s += 8;

    /* 本地生意：纯线上渠道帮不上忙（到店才是目的） */
    if (p === 'local' && /community|video/.test(ch.cat)) s -= 8;

    /* 线下渠道只对本地生意有意义 */
    if (ch.cat === 'offline' && p !== 'local') s -= 30;

    /* 还在建设中的海外内容降权 */
    if (ch.soon) s -= 40;

    /* 去重 + 截断 */
    var seen = {}, rw = [];
    why.forEach(function (w) { if (!seen[w]) { seen[w] = 1; rw.push(w); } });

    return { score: Math.max(0, Math.round(s)), why: rw.slice(0, 4) };
  };

  /* ==================================================================
     二、主函数
     ================================================================== */
  QL.recommend = function (input) {
    var prod  = QL.byId(QL.products, input.p);
    var goal  = QL.byId(QL.goals, input.g);
    var stage = QL.byId(QL.stages, input.s);
    var bud   = QL.byId(QL.budgets, input.b);
    var team  = QL.byId(QL.teams, input.t);
    var region = input.r === 'os' ? 'os' : 'cn';

    var ctx = {
      p: input.p, g: input.g, st: input.s,
      goalName: goal ? goal.name : '',
      budMax: bud ? bud.max : 1,
      power: team ? team.power : 2,
      pb: QL.playbookById ? QL.playbookById(input.p) : null
    };
    var power = ctx.power;

    /* ---- 1. 逐个渠道打分 ---- */
    var scored = [];
    (QL.channels || []).forEach(function (ch) {
      if (ch.region !== region) return;
      if (FOUNDATION.indexOf(ch.id) > -1) return;   // 基建类单独展示
      var r = QL.scoreChannel(ch, ctx);
      if (r.score <= 0) return;
      /* 核心命中数用于并列时的排序，避免顺序随机 */
      var core = ((ch.fit || []).indexOf(input.p) > -1 ? 1 : 0) +
                 ((ch.goals || []).indexOf(input.g) > -1 ? 1 : 0) +
                 ((ch.stages || []).indexOf(input.s) > -1 ? 1 : 0);
      scored.push({ ch: ch, score: r.score, why: r.why, core: core });
    });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      if (b.core !== a.core) return b.core - a.core;
      if (a.ch.cost !== b.ch.cost) return a.ch.cost - b.ch.cost;
      return b.ch.speed - a.ch.speed;
    });

    /* ---- 2. 取前 N 个（按团队能扛的渠道数量） ---- */
    var N = power <= 2 ? 6 : (power <= 4 ? 8 : 10);
    if (ctx.budMax <= 1) N = Math.min(N, 6);
    var top = scored.slice(0, N);

    top.forEach(function (it, i) {
      it.priority = i < 2 ? 1 : (i < 5 ? 2 : 3);
      it.rank = i + 1;
    });

    /* ---- 3. 预算分配 ---- */
    var amount = AMOUNT[input.b] || 0;
    var alloc = { amount: amount, items: [], reserve: 0, free: [], note: '' };
    var freeOnes = top.filter(function (it) { return it.ch.price === 'free'; });
    /* 钱只分给前 3 个值得投的渠道，摊到 6 个渠道等于哪个都投不透 */
    var paidOnes = top.filter(function (it) { return it.ch.price === 'paid'; }).slice(0, 3);
    var mixedOnes = top.filter(function (it) { return it.ch.price === 'mixed'; }).slice(0, 3);
    alloc.free = freeOnes.map(function (it) { return it.ch.name; });

    function split(pool, list, weightOf) {
      var wsum = 0;
      list.forEach(function (it) { wsum += weightOf(it); });
      list.forEach(function (it) {
        var w = weightOf(it);
        alloc.items.push({ ch: it.ch, amount: niceRound(pool * w / wsum), pct: Math.round(w * 100 / wsum), rank: it.rank });
      });
      var used = alloc.items.reduce(function (a, b) { return a + b.amount; }, 0);
      alloc.reserve = Math.max(0, amount - used);
    }

    if (amount === 0) {
      alloc.note = '0 元预算完全可以开始。下面所有渠道都不需要花钱，代价是你的时间——按 30 天清单执行，每天抽出 1–2 小时即可。';
    } else if (paidOnes.length) {
      split(Math.round(amount * 0.7), paidOnes, function () { return 1; });
      alloc.note = '按「70% 投已经看好的付费渠道、30% 留作测试金」分配。注意：每个渠道先小预算跑 3–7 天，算出真实的线索/成交成本，再决定要不要放量。' +
        (mixedOnes.length ? '另外 ' + mixedOnes.map(function (x) { return x.ch.name; }).join('、') + ' 可以先只做免费的部分，不必先花钱。' : '');
    } else if (mixedOnes.length) {
      split(Math.round(amount * 0.5), mixedOnes, function (it) { return 6 - it.ch.cost; });
      alloc.note = '你当前的推荐组合以「免费为主、可以加码」的渠道为主，所以这笔预算不必全花在渠道上：一半用于这些渠道的内容制作、素材和达人合作，一半留作后续测试金。';
    } else {
      alloc.note = '当前推荐以免费渠道为主，这笔预算建议先留着，等内容跑出数据、明确了哪个渠道值得加投再花。';
      alloc.reserve = amount;
    }

    /* ---- 4. 30 天行动清单 ---- */
    var byCat = function (cats) {
      return top.filter(function (it) { return cats.indexOf(it.ch.cat) > -1; }).slice(0, 2);
    };
    var plan = [];
    QL.planWeeks.forEach(function (w, i) {
      var actions = [];
      if (i === 0) {
        actions.push('给每个推广入口生成带 UTM 参数的链接，先确定「怎么算这个渠道有效」（工具箱里有生成器）');
        actions.push('检查落地页：首屏要能在 5 秒内说清「你是谁、帮谁、解决什么」，把表单或按钮放在第一屏');
        byCat(['search', 'tool', 'private', 'store']).forEach(function (it) {
          actions.push(it.ch.name + '：' + (it.ch.ops && it.ch.ops[0] ? it.ch.ops[0] : it.ch.summary));
        });
        if (actions.length < 3) actions.push('先把品牌地基做齐：官网/主页、公众号或企业微信、联系方式，让搜你名字的人找得到');
      } else if (i === 1) {
        var c2 = byCat(['content', 'community', 'video', 'social']);
        if (c2.length) {
          c2.forEach(function (it) {
            actions.push(it.ch.name + '：' + (it.ch.ops && it.ch.ops[0] ? it.ch.ops[0] : it.ch.summary));
          });
        } else {
          actions.push('挑 2 个内容/社区渠道，用「回答问题」的方式发内容，不要直接发广告');
        }
        actions.push('同一篇内容改写成 2–3 个版本，分发到不同平台（一稿多投，成本最低）');
        actions.push('记录哪篇内容带来的咨询最多，这决定了下一周该往哪里加力');
      } else if (i === 2) {
        if (paidOnes.length && amount > 0) {
          paidOnes.slice(0, 2).forEach(function (it) {
            var budget = alloc.items.length
              ? (alloc.items.filter(function (x) { return x.ch.id === it.ch.id; })[0] || {}).amount
              : 0;
            actions.push(it.ch.name + '：先投 ' + (budget ? money(budget) : '小额') +
              ' 试水，只跑 3–7 天，盯 ' + ((it.ch.kpi && it.ch.kpi[0]) || '转化成本'));
          });
          actions.push('每天记录一次数据（花费 / 点击 / 咨询 / 成交），不要在数据不全的时候加预算');
        } else {
          actions.push('预算有限就先不投钱，把这周用来加大内容产出和社区互动量');
        }
        actions.push('把「点击多但不转化」和「点击少但转化好」的渠道分开处理：前者改素材，后者加投入');
      } else {
        var best = top[0];
        actions.push('保留数据最好的 1–2 个渠道并加投，其余暂时停掉——分散精力比花错钱更浪费');
        actions.push('把来咨询/下单的人沉淀到私域（企业微信、社群、公众号），下次触达不再花钱');
        actions.push('给这个月的每个渠道做一张小表：花了多少、来了多少人、成交多少。这张表就是下个月的决策依据');
        actions.push('回看 ' + (best ? '「' + best.ch.name + '」' : '主攻渠道') + ' 的数据，如果成本高于你的毛利，先停，回头优化落地页和转化率');
      }
      plan.push({ wk: w.wk, title: w.title, goal: w.goal, actions: actions });
    });

    /* ---- 5. 避坑提醒 ---- */
    var pits = [];
    top.slice(0, 3).forEach(function (it) {
      if (it.ch.pitfall) pits.push({ src: it.ch.name, text: it.ch.pitfall });
    });
    var pb = QL.playbookById ? QL.playbookById(input.p) : null;
    if (pb && pb.mistake) pits.push({ src: '这类产品最常犯的错', text: pb.mistake });

    /* ---- 6. 一句话诊断 ---- */
    var diag = '你是「' + (prod ? prod.name : '') + '」，现在最想「' + (goal ? goal.name : '') +
      '」，处在「' + (stage ? stage.name : '') + '」阶段，预算「' + (bud ? bud.name : '') +
      '」，团队「' + (team ? team.name : '') + '」。';
    if (ctx.budMax <= 1 && ctx.st === 'cold') {
      diag += '这是最正常也最难的起点：不要花钱投广告，先把下面的免费渠道做扎实，用内容换第一批真实用户。';
    } else if (ctx.st === 'cold') {
      diag += '有预算很好，但冷启动阶段的核心是「验证需求」而不是「买量」，先花小钱测，别一上来就放量。';
    } else if (ctx.st === 'scale') {
      diag += '模型已经跑通，接下来是「找到最划算的渠道然后加投」，同时盯紧获客成本和回本线。';
    } else {
      diag += '有用户基础了，重点是把「内容 + 渠道」的产出流程固定下来，让它能持续而不靠灵感。';
    }

    return {
      input: input, region: region,
      product: prod, goal: goal, stage: stage, budget: bud, team: team,
      top: top, all: scored, alloc: alloc, plan: plan, pitfalls: pits,
      playbook: pb, diag: diag,
      /* 前置基建：不管什么产品都该先做的一步 */
      foundation: FOUNDATION.map(function (id) { return QL.byId(QL.channels, id); })
        .filter(function (c) { return c && c.region === region; })
    };
  };

  /* ==================================================================
     三、渲染（recommend.html 专用）
     ================================================================== */
  QL.renderRecommend = function (res) {
    var h = '';
    h += '<div class="callout brand"><b>你的情况</b>' + esc(res.diag) + '</div>';

    /* 产品打法一句话 */
    if (res.playbook) {
      h += '<div class="card mt2" style="border-left:3px solid var(--brand-500)">' +
        '<h4 style="margin-bottom:6px">' + esc(res.playbook.headline) + '</h4>' +
        '<p class="small" style="margin-bottom:8px">' + esc(res.playbook.logic) + '</p>' +
        '<div class="small muted">推荐节奏：' + esc(res.playbook.timeline || '') + '</div>' +
        '<div class="mt2"><a class="btn btn-ghost btn-sm" href="playbook.html?id=' + res.input.p + '">看这类产品的完整打法</a></div>' +
        '</div>';
    }

    /* 前置基建（所有方案都要先做） */
    if (res.foundation.length) {
      h += '<div class="callout ok mt2"><b>先做这一步（不管最后选了哪些渠道）</b>' +
        '给每个推广入口生成带 UTM 参数的链接。否则所有渠道的流量混在一起，你永远不知道哪个有效、哪个该停。' +
        '<div class="mt1"><a class="btn btn-soft btn-sm" href="tools.html#utm">打开 UTM 链接生成器</a> ' +
        '<button class="btn btn-ghost btn-sm" data-ch="' + res.foundation[0].id + '">看埋点怎么做</button></div></div>';
    }

    /* 渠道组合 */
    h += '<h3 class="mt3">推荐渠道组合</h3>';
    h += '<p class="small muted">按你的情况排序。P1 是现在最该做的，P3 是等前两个跑顺了再接。</p>';
    res.top.forEach(function (it) {
      h += '<div class="rank-item p' + it.priority + '">' +
        '<div class="rank-top">' +
          '<span class="rank-no">' + it.rank + '</span>' +
          '<h4>' + QL.cemo(it.ch.cat) + ' ' + esc(it.ch.name) + '</h4>' +
          '<span class="rank-score">匹配度 ' + it.score + '　' +
            (it.priority === 1 ? 'P1 主攻' : it.priority === 2 ? 'P2 辅助' : 'P3 储备') + '</span>' +
        '</div>' +
        '<div class="tag-row" style="margin-bottom:8px">' + QL.priceTag(it.ch.price) +
          QL.tag(QL.cname(it.ch.cat)) + QL.tag('成本 ' + it.ch.cost + '/5') +
          QL.tag('见效 ' + it.ch.speed + '/5') + QL.tag('难度 ' + it.ch.difficulty + '/5') + '</div>' +
        '<p class="rank-why">' + esc(it.ch.summary) + '</p>' +
        '<p class="rank-why"><b>为什么推给你：</b>' + esc(it.why.join('；')) + '。</p>' +
        '<div class="mt1"><button class="btn btn-soft btn-sm" data-ch="' + esc(it.ch.id) + '">看具体怎么做</button></div>' +
      '</div>';
    });

    /* 预算分配 */
    h += '<h3 class="mt3">预算怎么分</h3>';
    if (res.alloc.items.length) {
      var total = res.alloc.amount || 1;
      var pal = function (i) { return 'hsl(' + (172 - i * 14) + ',' + Math.max(38, 74 - i * 5) + '%,' + Math.min(72, 34 + i * 7) + '%)'; };
      h += '<div class="bar-alloc">';
      res.alloc.items.forEach(function (x, i) {
        h += '<i style="width:' + Math.max(2, Math.round(x.amount / total * 100)) + '%;background:' + pal(i) + '"></i>';
      });
      h += '<i style="width:' + Math.round(res.alloc.reserve / total * 100) + '%;background:#cbd5e1"></i></div>';
      h += '<div class="legend">';
      res.alloc.items.forEach(function (x, i) {
        h += '<span><em style="background:' + pal(i) + '"></em>' + esc(x.ch.name) + '　' + money(x.amount) + '</span>';
      });
      h += '<span><em style="background:#cbd5e1"></em>预留测试金　' + money(res.alloc.reserve) + '</span></div>';
      h += '<div class="mt2 table-scroll"><table class="tbl"><thead><tr><th>渠道</th><th>建议投入</th><th>占比</th><th>先看哪个数</th></tr></thead><tbody>';
      res.alloc.items.forEach(function (x) {
        h += '<tr><td>' + esc(x.ch.name) + '</td><td>' + money(x.amount) + '</td><td>' + x.pct + '%</td><td>' +
          esc((x.ch.kpi && x.ch.kpi[0]) || '—') + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    if (res.alloc.free.length) {
      h += '<p class="small muted mt1">免费渠道（0 元，投入时间）：' + esc(res.alloc.free.join('、')) + '</p>';
    }
    h += '<div class="callout info"><b>分配原则</b>' + esc(res.alloc.note) + '</div>';

    /* 30 天计划 */
    h += '<h3 class="mt3">接下来 30 天怎么走</h3>';
    h += '<p class="small muted">这是按你的推荐渠道生成的行动清单，可直接照做。</p>';
    res.plan.forEach(function (w) {
      h += '<div class="plan-block"><div class="plan-week">' +
        '<h4><span class="wk">' + esc(w.wk) + '</span>' + esc(w.title) + '</h4>' +
        '<p class="small muted" style="margin:-4px 0 8px">本周目标：' + esc(w.goal) + '</p>' +
        '<ul class="dot-list">';
      w.actions.forEach(function (a) { h += '<li>' + esc(a) + '</li>'; });
      h += '</ul></div></div>';
    });

    /* 避坑 */
    h += '<h3 class="mt3">先别踩这些坑</h3>';
    res.pitfalls.forEach(function (p) {
      h += '<div class="callout warn"><b>' + esc(p.src) + '</b>' + esc(p.text) + '</div>';
    });

    /* 下一步 */
    h += '<div class="card mt3 center" style="background:var(--bg-soft)">' +
      '<h4>把这个方案存下来</h4>' +
      '<p class="small muted">可以把链接收藏或分享给同事，随时回来看。</p>' +
      '<div class="flex gap1 middle" style="justify-content:center;flex-wrap:wrap">' +
        '<button class="btn btn-primary btn-sm" data-copy="' + esc(location.href) + '">复制方案链接</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="window.print()">打印 / 存成 PDF</button>' +
      '</div></div>';

    h += '<div class="ad-slot ad-slot-inline" data-slot="article-bottom"></div>';
    return h;
  };
})();
