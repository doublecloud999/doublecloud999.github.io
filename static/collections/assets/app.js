const PARENT = {
  Set: ['Collection'], List: ['Collection'], Queue: ['Collection'],
  HashSet: ['Set'], SortedSet: ['Set'], TreeSet: ['SortedSet'], LinkedHashSet: ['HashSet'],
  ArrayList: ['List'], LinkedList: ['List', 'Deque'], Vector: ['List'], Stack: ['Vector'],
  PriorityQueue: ['Queue'], Deque: ['Queue'], ArrayDeque: ['Deque'],
  HashMap: ['Map'], Hashtable: ['Map'], SortedMap: ['Map'],
  LinkedHashMap: ['HashMap'], TreeMap: ['SortedMap']
};
const EXTENDS = { LinkedHashSet: 1, Stack: 1, LinkedHashMap: 1 };
const MAPLIKE = { Map: 1, SortedMap: 1, HashMap: 1, LinkedHashMap: 1, Hashtable: 1, TreeMap: 1, ConcurrentHashMap: 1 };

if (typeof DEMOS !== 'undefined') {
  Object.keys(DEMOS).forEach(k => { if (DB[k]) DB[k].demos = DEMOS[k]; });
}

const H = 40;
const svg = document.getElementById('graph');
const drawer = document.getElementById('drawer');
const dbody = document.getElementById('dbody');
const dhead = document.getElementById('dhead');
const hint = document.getElementById('hint');
const searchInput = document.getElementById('q');
const btnCompare = document.getElementById('btnCompare');

let cur = null;
let cmpMode = false;
let cmpSel = [];

function widthOf(id) {
  return Math.max(78, Math.round(id.length * 8.6 + 40));
}

function nodeMap() {
  const m = {};
  LAYOUT.forEach(n => { m[n.id] = { id: n.id, x: n.x, y: n.y, w: widthOf(n.id) }; });
  return m;
}
const NODE = nodeMap();

function chainOf(id) {
  const seen = new Set([id]);
  let stack = [id];
  while (stack.length) {
    const c = stack.pop();
    (PARENT[c] || []).forEach(p => { if (!seen.has(p)) { seen.add(p); stack.push(p); } });
  }
  return seen;
}

function edgePath(child, parent, offset) {
  const a = NODE[child], b = NODE[parent];
  const x1 = a.x, y1 = a.y;
  const x2 = b.x, y2 = b.y + H;
  if (Math.abs(x2 - x1) < 3) return `M${x1} ${y1} L${x2} ${y2}`;
  const my = y2 + offset;
  return `M${x1} ${y1} L${x1} ${my} L${x2} ${my} L${x2} ${y2}`;
}

function siblingOffset(parent, child) {
  const kids = LAYOUT
    .filter(n => (PARENT[n.id] || []).indexOf(parent) >= 0)
    .sort((p, q) => p.x - q.x)
    .map(n => n.id);
  return 12 + kids.indexOf(child) * 10;
}

function buildGraph() {
  let edges = '';
  LAYOUT.forEach(n => {
    (PARENT[n.id] || []).forEach(p => {
      const kind = EXTENDS[n.id] ? 'ext' : 'impl';
      edges += `<path class="e ${kind}" id="e-${n.id}-${p}" d="${edgePath(n.id, p, siblingOffset(p, n.id))}" marker-end="url(#arrow)"/>`;
    });
  });

  let nodes = '';
  LAYOUT.forEach(n => {
    const w = NODE[n.id].w;
    const info = DB[n.id];
    const kind = info.kind === 'iface' ? 'iface' : 'cls';
    const x = n.x - w / 2;
    nodes += `<g class="n ${kind}" data-id="${n.id}">` +
      `<rect x="${x}" y="${n.y}" width="${w}" height="${H}" rx="7"/>` +
      `<rect x="${x}" y="${n.y}" width="3" height="${H}" rx="1.5" fill="${kind === 'iface' ? 'var(--iface)' : 'var(--cls)'}" opacity=".75"/>` +
      `<text x="${n.x}" y="${n.y + H / 2 + 1}" text-anchor="middle" dominant-baseline="middle">${n.id}</text>` +
      `</g>`;
  });

  svg.innerHTML =
    `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M2 1.5L8 5L2 8.5" fill="none" stroke="context-stroke" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </marker></defs>` + edges + nodes;

  svg.querySelectorAll('.n').forEach(g => {
    const id = g.dataset.id;
    g.addEventListener('mouseenter', () => hoverChain(id));
    g.addEventListener('mouseleave', () => hoverChain(null));
    g.addEventListener('click', () => onClickNode(id));
  });
}

function hoverChain(id) {
  const nodes = svg.querySelectorAll('.n');
  const edges = svg.querySelectorAll('.e');
  if (!id) {
    nodes.forEach(n => n.classList.remove('dim', 'chain'));
    edges.forEach(e => e.classList.remove('dim', 'hl'));
    if (cur) markCurrent(cur);
    return;
  }
  if (cmpMode) return;
  const ch = chainOf(id);
  nodes.forEach(n => {
    const on = ch.has(n.dataset.id);
    n.classList.toggle('chain', on);
    n.classList.toggle('dim', !on);
  });
  edges.forEach(e => {
    const parts = e.id.split('-');
    const c = parts[1], p = parts[2];
    const on = ch.has(c) && ch.has(p);
    e.classList.toggle('hl', on);
    e.classList.toggle('dim', !on);
  });
}

function markCurrent(id) {
  svg.querySelectorAll('.n').forEach(n => {
    n.classList.toggle('on', n.dataset.id === id && !cmpMode);
    n.classList.toggle('sel', cmpMode && cmpSel.includes(n.dataset.id));
  });
}

function onClickNode(id) {
  if (cmpMode) {
    const i = cmpSel.indexOf(id);
    if (i >= 0) cmpSel.splice(i, 1);
    else if (cmpSel.length < 2) cmpSel.push(id);
    else { cmpSel = [cmpSel[1], id]; }
    markCurrent(null);
    renderCompare();
    return;
  }
  openClass(id);
}

function openClass(id) {
  cur = id;
  if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
  const info = DB[id];
  dhead.innerHTML = info ? renderHead(id, info) : '';
  dbody.innerHTML = renderClass(id);
  drawer.classList.add('open');
  dbody.scrollTop = 0;
  bindDrawer();
  markCurrent(id);
}

function closeDrawer() {
  drawer.classList.remove('open');
  if (cur) history.replaceState(null, '', location.pathname + location.search);
  cur = null;
  svg.querySelectorAll('.n').forEach(n => n.classList.remove('on'));
}

function chainPath(id) {
  const out = [id];
  let c = id;
  while (PARENT[c] && PARENT[c].length) { c = PARENT[c][0]; out.unshift(c); }
  return out;
}

function kindLabel(info) {
  if (info.kind === 'iface') return 'interface';
  if (info.kind === 'extra') return '图外';
  return 'class';
}

function declOf(id, info) {
  const g = MAPLIKE[id] ? '&lt;K, V&gt;' : (info.kind === 'extra' && id === 'Collections' ? '' : '&lt;E&gt;');
  let s = `<em>${info.kind === 'iface' ? 'interface' : 'class'}</em> ${id}${info.kind === 'extra' && id === 'Collections' ? '' : g}`;
  if (info.real && info.real.ext && info.real.ext.indexOf('无') !== 0) s += ' <em>extends</em> ' + info.real.ext;
  if (info.real && info.real.impl && info.real.impl.length) s += ' <em>implements</em> ' + info.real.impl.join(', ');
  return s;
}

function methodGroups(info) {
  const order = [];
  const map = {};
  info.methods.forEach(m => {
    const from = m[1];
    if (!map[from]) { map[from] = []; order.push(from); }
    map[from].push(m);
  });
  const prio = f => (f === '构造' ? 0 : f === '自身' ? 1 : 2);
  order.sort((a, b) => prio(a) - prio(b));
  return order.map(f => [f, map[f]]);
}

function renderHead(id, info) {
  return `<div class="row1"><h2>${id}</h2><span class="kind ${info.kind}">${kindLabel(info)}</span>
    <button class="x" id="closeBtn" title="关闭">×</button></div>
    <div class="sub">${esc(info.sub)}</div>`;
}

function renderClass(id) {
  const info = DB[id];
  if (!info) return '<div class="empty">没有这个类的数据</div>';

  const chips = info.tags.map(t => `<span class="chip"><b>${t[0]}</b>${t[1]}</span>`).join('');

  const pathHtml = chainPath(id).map((p, i, arr) =>
    i === arr.length - 1
      ? `<span style="color:var(--tx)">${p}</span>`
      : `<a data-go="${p}">${p}</a><span>→</span>`
  ).join('');

  const groups = methodGroups(info).map(([from, list]) => {
    const rows = list.map(m => {
      const note = m[3] || C[m[0]] || '';
      return `<div class="m ${m[2] ? 'hot' : ''}"><span class="sg">${esc(m[0])}</span><span class="nt">${esc(note)}</span></div>`;
    }).join('');
    return `<div class="mgroup"><div class="gl">${from === '自身' ? '本类实现' : from === '构造' ? '构造方法' : '来自 ' + from}</div>${rows}</div>`;
  }).join('');

  const fields = (info.fields || []).map(f =>
    `<div class="f"><span class="sg">${esc(f[0])}</span><span class="md">${esc(f[1])}</span><span class="nt">${esc(f[2])}</span></div>`
  ).join('');

  const warns = (info.traps || []).map(t => `<li>${esc(t)}</li>`).join('');
  const ivs = (info.interview || []).map(t => `<li>${esc(t)}</li>`).join('');

  const nHot = info.methods.filter(m => m[2]).length;

  const demos = (info.demos || []).map(d =>
    `<div class="demo"><div class="dt">${esc(d[0])}</div><pre class="code">${hl(d[1].trim())}</pre></div>`
  ).join('');

  return `
  <div class="chips">${chips}</div>
  <div class="decl">${declOf(id, info)}</div>
  <div class="intro">${esc(info.intro)}</div>

  <div class="sec"><h3>继承链</h3><div class="path">${pathHtml}</div></div>

  ${demos ? `<div class="sec"><h3>示例代码 · ${info.demos.length}</h3>${demos}</div>` : ''}

  <div class="sec"><h3>方法 · ${info.methods.length} 个${nHot ? ' · 标黄 ' + nHot + ' 个必会' : ''}</h3>${groups}</div>

  <div class="sec"><h3>源码级字段 · ${(info.fields || []).length}</h3>
    ${fields || '<div class="note" style="color:var(--tx-3)">接口没有实例字段</div>'}
    <div class="note" style="color:var(--tx-3);font-size:12px;margin-top:8px;padding-left:8px">这些字段基本都是 private，不属于对外 API，是看源码和面试时要能说出来的东西。</div>
  </div>

  <div class="sec"><h3>底层与扩容</h3><div class="note">${esc(info.grow)}</div></div>

  ${warns ? `<div class="sec"><h3>坑</h3><ul class="warns">${warns}</ul></div>` : ''}
  ${ivs ? `<div class="sec"><h3>面试点</h3><ul class="warns mine">${ivs}</ul></div>` : ''}

  ${TARGET === 'local' ? `<div class="sec"><h3>对应笔记</h3>
    <div class="doc"><span>桌面/java后端全套/文档/${esc(info.doc)}</span><button id="copyDoc">复制路径</button></div>
  </div>` : ''}`;
}

function bindDrawer() {
  const cb = document.getElementById('closeBtn');
  if (cb) cb.onclick = closeDrawer;
  dbody.querySelectorAll('[data-go]').forEach(a => {
    a.onclick = () => openClass(a.dataset.go);
  });
  const cp = document.getElementById('copyDoc');
  if (cp) cp.onclick = () => {
    const info = DB[cur];
    const p = 'C:\\Users\\qdyun\\Desktop\\java后端全套\\文档\\' + info.doc.replace(/\//g, '\\');
    copyText(p);
    cp.textContent = '已复制';
    setTimeout(() => { cp.textContent = '复制路径'; }, 1500);
  };
}

function copyText(t) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(t).catch(() => fallbackCopy(t));
  } else fallbackCopy(t);
}

function fallbackCopy(t) {
  const ta = document.createElement('textarea');
  ta.value = t;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const KW = new Set(('public private protected static final class interface extends implements new ' +
  'return void int long boolean double float char byte short if else for while do switch case break ' +
  'continue try catch finally throw throws this super null true false import package instanceof default ' +
  'synchronized abstract enum record var').split(' '));

function hl(code) {
  let out = '', i = 0;
  const n = code.length;
  while (i < n) {
    const c = code[i];
    if (c === '/' && code[i + 1] === '/') {
      let j = code.indexOf('\n', i);
      if (j < 0) j = n;
      out += '<span class="c-cm">' + esc(code.slice(i, j)) + '</span>';
      i = j;
      continue;
    }
    if (c === '/' && code[i + 1] === '*') {
      let j = code.indexOf('*/', i + 2);
      j = j < 0 ? n : j + 2;
      out += '<span class="c-cm">' + esc(code.slice(i, j)) + '</span>';
      i = j;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && code[j] !== c) {
        if (code[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, n);
      out += '<span class="c-st">' + esc(code.slice(i, j)) + '</span>';
      i = j;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_$]/.test(code[j])) j++;
      const w = code.slice(i, j);
      out += KW.has(w) ? '<span class="c-kw">' + w + '</span>' : esc(w);
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[0-9.xXa-fA-F]/.test(code[j])) j++;
      out += '<span class="c-nu">' + code.slice(i, j) + '</span>';
      i = j;
      continue;
    }
    out += esc(c);
    i++;
  }
  return out;
}

/* ---------- compare ---------- */

function renderCompare() {
  if (!cmpMode) return;
  drawer.classList.add('open', 'cmp');
  if (cmpSel.length < 2) {
    dhead.innerHTML = '';
    dbody.innerHTML = `<div class="cmpwrap">
      <div class="cmpbar">对比模式 · 在左边点两个类，已选 ${cmpSel.length}/2
        <button class="btn" id="exitCmp" style="margin-left:auto">退出对比</button></div>
      <div class="empty">${cmpSel.length ? '已选：' + cmpSel.join('、') + '，再点一个' : '点两个节点开始对比<br>比如 ArrayList 和 LinkedList'}</div>
    </div>`;
    const b = document.getElementById('exitCmp');
    if (b) b.onclick = toggleCompare;
    return;
  }

  const [a, b] = cmpSel;
  const A = DB[a], B = DB[b];
  const na = new Set(A.methods.map(m => m[0].split('(')[0]));
  const nb = new Set(B.methods.map(m => m[0].split('(')[0]));
  const common = [...na].filter(x => nb.has(x));
  const onlyA = [...na].filter(x => !nb.has(x));
  const onlyB = [...nb].filter(x => !na.has(x));

  const colHtml = (id, info, otherSet) => {
    const rows = info.methods.map(m => {
      const base = m[0].split('(')[0];
      const same = otherSet.has(base);
      return `<div class="m ${m[2] && !same ? 'hot' : ''}"><span class="sg ${same ? 'same' : 'only'}">${esc(m[0])}</span></div>`;
    }).join('');
    return `<div class="cmpcol"><h4>${id}</h4><div class="k">${esc(info.sub)}</div>
      <div class="chips" style="margin:0 0 12px">${info.tags.map(t => `<span class="chip"><b>${t[0]}</b>${t[1]}</span>`).join('')}</div>
      ${rows}</div>`;
  };

  dhead.innerHTML = '';
  dbody.innerHTML = `<div class="cmpwrap">
    <div class="cmpbar">共有方法名 ${common.length} · 各自独有 ${onlyA.length} / ${onlyB.length}
      <button class="btn" id="exitCmp" style="margin-left:auto">退出对比</button></div>
    <div class="cmpcols">${colHtml(a, A, nb)}${colHtml(b, B, na)}</div>
    <div class="sec" style="margin-top:20px"><h3>提示</h3>
      <div class="note" style="color:var(--tx-3)">黄色 = 对方没有的方法，灰色 = 双方都有。${common.length > 0 ? '共有：' + common.slice(0, 10).join('、') : ''}</div></div>
  </div>`;
  const x = document.getElementById('exitCmp');
  if (x) x.onclick = toggleCompare;
}

function toggleCompare() {
  cmpMode = !cmpMode;
  cmpSel = [];
  if (!cmpMode) drawer.classList.remove('cmp');
  btnCompare.classList.toggle('on', cmpMode);
  markCurrent(cur);
  if (cmpMode) renderCompare();
  else if (cur) openClass(cur);
  else closeDrawer();
}

/* ---------- search ---------- */

function doSearch() {
  const q = searchInput.value.trim().toLowerCase();
  const nodes = svg.querySelectorAll('.n');
  if (!q) {
    nodes.forEach(n => n.classList.remove('dim'));
    hint.textContent = '悬停点亮继承链 · 点击看方法';
    return;
  }
  let hit = 0, mhit = 0;
  nodes.forEach(n => {
    const id = n.dataset.id;
    const info = DB[id];
    const inName = id.toLowerCase().includes(q) || info.sub.toLowerCase().includes(q);
    const ms = info.methods.filter(m => m[0].toLowerCase().includes(q)).length;
    const inTag = info.tags.some(t => (t[0] + t[1]).toLowerCase().includes(q));
    const ok = inName || inTag || ms > 0;
    if (ok) { hit++; mhit += ms; }
    n.classList.toggle('dim', !ok);
  });
  hint.textContent = `命中 ${hit} 个类 · ${mhit} 个方法${hit === 1 ? '（回车打开）' : ''}`;
}

/* ---------- boot ---------- */

function buildExtras() {
  const wrap = document.getElementById('extras');
  wrap.innerHTML = EXTRA.map(e => {
    const info = DB[e.id];
    return `<div class="xc" data-id="${e.id}"><span>${e.id}</span><em>${info.methods.length} 方法</em></div>`;
  }).join('');
  wrap.querySelectorAll('.xc').forEach(el => {
    el.onclick = () => {
      wrap.querySelectorAll('.xc').forEach(x => x.classList.remove('on'));
      el.classList.add('on');
      openClass(el.dataset.id);
    };
  });
}

buildGraph();
buildExtras();
markCurrent(null);

searchInput.addEventListener('input', doSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const first = svg.querySelector('.n:not(.dim)');
    if (first && searchInput.value.trim()) openClass(first.dataset.id);
  }
  if (e.key === 'Escape') { searchInput.value = ''; doSearch(); searchInput.blur(); }
});
btnCompare.addEventListener('click', toggleCompare);

document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput) { e.preventDefault(); searchInput.focus(); }
  if (e.key === 'Escape' && !searchInput.value) closeDrawer();
});

window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (id && DB[id]) openClass(id);
  else closeDrawer();
});

const start = location.hash.slice(1);
if (start && DB[start]) openClass(start);
