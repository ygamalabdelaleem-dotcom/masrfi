'use strict';
/* محفظتي — نسخة الويب (PWA) للآيفون. كل البيانات محفوظة على الجهاز فقط (localStorage). */

const KEY = 'mywallet.v1';
const APP_VERSION = '35';
// تحديث إجباري: يمسح الكاش ويعيد تحميل آخر نسخة من الموقع (البيانات مش بتتمسح)
async function forceUpdate() {
  try { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); const r = await navigator.serviceWorker?.getRegistration(); if (r) await r.update(); } catch (e) { }
  location.reload();
}
const CURRENCIES = ['EGP', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'KWD', 'QAR', 'JOD', 'TRY'];
const EMOJIS = ['🍽️', '☕', '🛒', '🚗', '🏠', '💡', '📱', '🎬', '🎮', '📚', '🎓', '💊', '🏥', '👕', '💄', '🎁', '✈️', '🏖️',
  '👨‍👩‍👧', '🐾', '🔧', '🧾', '💼', '💻', '📈', '💰', '💸', '🏦', '🔁', '🤲', '📦', '🍔', '🚌', '🎂', '🏧', '💳', '🎯'];
const LABELS = {
  cat_food: 'طعام', cat_transport: 'مواصلات', cat_bills: 'فواتير', cat_rent: 'إيجار', cat_shopping: 'تسوق',
  cat_health: 'صحة', cat_fun: 'ترفيه', cat_edu: 'تعليم', cat_telecom: 'اتصالات', cat_clothes: 'ملابس',
  cat_gifts: 'هدايا', cat_travel: 'سفر', cat_family: 'عائلة', cat_cash: 'سحب نقدي', cat_transfer: 'تحويلات',
  cat_other_exp: 'مصروفات أخرى', cat_salary: 'راتب', cat_bonus: 'مكافأة', cat_refund: 'مبالغ مستردة',
  cat_other_inc: 'إيرادات أخرى', cat_installments: 'أقساط', acc_cash: 'نقدي'
};
const ACC_TYPES = { BANK: 'بنك', CASH: 'نقدي', CREDIT: 'بطاقة ائتمان', SAVING: 'توفير', GOLD: 'ذهب', WALLET: 'محفظة إلكترونية' };
// أيقونات خطية (SVG) بنفس الستايل في كل التطبيق
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  back: '<path d="m9 6 6 6-6 6"/>',
  chevron: '<path d="m15 6-6 6 6 6"/>',
  up: '<path d="M7 17 17 7M8 7h9v9"/>',
  down: '<path d="M17 7 7 17M16 17H7V8"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/>',
  coins: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18M7 6h1v4M16.7 13.9l.7.7-2.8 2.8"/>',
  bank: '<path d="M3 21h18M5 21v-9M19 21v-9M9.5 21v-9M14.5 21v-9M2 10l10-6 10 6z"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  wallet: '<path d="M19 7V5a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v3M21 16v3a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6"/><path d="M17 12h4v4h-4a2 2 0 0 1 0-4z"/>',
  gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8.5 9 12 3l3.5 6L12 21"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  transfer: '<path d="m17 3 4 4-4 4M21 7H7M7 21l-4-4 4-4M3 17h14"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="m3 3 18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  users: '<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.1a4 4 0 0 1 0 7.8M21 21v-2a4 4 0 0 0-3-3.9"/>',
  split: '<path d="M16 3h5v5M8 3H3v5M12 22v-8.3a4 4 0 0 0-1.2-2.9L3 3M15 9l6-6"/>',
  currency: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2a3 3 0 0 1-3-1.5M12 6v2M12 16v2"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  install: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3"/>',
  report: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 17v-3M12 17v-6M16 17v-4"/>',
  sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>',
  faceid: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M9 9v1M15 9v1M12 9v4h-1M9 16a4 4 0 0 0 6 0"/>',
  speaker: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  pie: '<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.3A9 9 0 0 1 20.7 9H15z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>'
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const ACC_ICONS = { BANK: 'bank', CASH: 'cash', CREDIT: 'card', SAVING: 'coins', GOLD: 'gem', WALLET: 'phone' };
const accIcon = a => ic(ACC_ICONS[a.type] || 'wallet');
// تصنيف المصروفات لقاعدة 50/30/20: احتياجات أساسية أو رغبات
const NEED_CATS = new Set(['cat_food', 'cat_transport', 'cat_bills', 'cat_rent', 'cat_health', 'cat_edu', 'cat_telecom', 'cat_family', 'cat_installments']);
const catGroup = c => c.group || (NEED_CATS.has(c.name) ? 'NEED' : 'WANT');
const PERIODS = { DAILY: 'يومي', WEEKLY: 'أسبوعي', MONTHLY: 'شهري', YEARLY: 'سنوي' };
const DAY = 86400000;

// ================= التخزين =================
function seed() {
  const exp = [['cat_food', '🍽️'], ['cat_transport', '🚗'], ['cat_bills', '🧾'], ['cat_rent', '🏠'], ['cat_shopping', '🛒'],
    ['cat_health', '💊'], ['cat_fun', '🎬'], ['cat_edu', '🎓'], ['cat_telecom', '📱'], ['cat_clothes', '👕'],
    ['cat_gifts', '🎁'], ['cat_travel', '✈️'], ['cat_family', '👨‍👩‍👧'], ['cat_cash', '🏧'], ['cat_transfer', '🔁'],
    ['cat_installments', '💳'], ['cat_other_exp', '📦']];
  const inc = [['cat_salary', '💼'], ['cat_bonus', '🎉'], ['cat_refund', '↩️'], ['cat_other_inc', '💰']];
  let id = 1;
  const categories = [];
  exp.forEach(([n, i]) => categories.push({ id: id++, name: n, isIncome: false, icon: i, monthlyBudget: 0 }));
  inc.forEach(([n, i]) => categories.push({ id: id++, name: n, isIncome: true, icon: i, monthlyBudget: 0 }));
  return {
    v: 1, nextId: 1000,
    accounts: [{ id: id++, name: 'acc_cash', type: 'CASH', currency: 'EGP', initialBalance: 0, last4: '', archived: false }],
    categories, txns: [], recurring: [], goals: [], debts: [], merchants: {}, rates: {},
    installments: [], inbox: [], profile: {},
    prefs: { base: 'EGP', goldOz: 0, ratesUpdated: 0, pinHash: '', reminderTime: '21:00', autoAddSms: false, savingRate: 20 }
  };
}

// يضيف الحقول الجديدة للبيانات المحفوظة من الإصدار الأول
function migrate(d) {
  d.installments = d.installments || [];
  d.inbox = d.inbox || [];
  d.profile = d.profile || {};
  d.prefs = Object.assign({ reminderTime: '21:00', autoAddSms: false, savingRate: 20 }, d.prefs);
  if (!d.categories.some(c => c.name === 'cat_installments')) d.categories.push({ id: ++d.nextId, name: 'cat_installments', isIncome: false, icon: '💳', monthlyBudget: 0 });
  return d;
}

let db;
try { db = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch (e) { db = seed(); }
db = migrate(db);
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('تعذّر الحفظ: ' + e.message); }
}
const newId = () => ++db.nextId;
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

// ================= أدوات =================
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lbl = n => LABELS[n] || n;
const money = v => (Number(v) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pad = n => String(n).padStart(2, '0');
const fmtDate = ms => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fmtDT = ms => { const d = new Date(ms); return `${fmtDate(ms)} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const ltr = s => '\u2066' + s + '\u2069';
const toLocalInput = ms => { const d = new Date(ms); return `${fmtDate(ms)}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
function normDigits(s) {
  return String(s ?? '').replace(/[٠-٩]/g, c => c.charCodeAt(0) - 0x660)
    .replace(/[۰-۹]/g, c => c.charCodeAt(0) - 0x6F0).replace(/٫/g, '.').replace(/٬/g, ',');
}
const parseAmount = s => { const v = parseFloat(normDigits(s).replace(/[, ]/g, '')); return isFinite(v) ? v : null; };
const acc = id => db.accounts.find(a => a.id === id);
const cat = id => db.categories.find(c => c.id === id);
const catByName = n => db.categories.find(c => c.name === n);
const base = () => db.prefs.base;
const conv = (amt, cur) => cur === base() ? amt : amt * (db.rates[cur] || 1);

function monthRange(off) {
  const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); d.setMonth(d.getMonth() + off);
  const s = d.getTime(); d.setMonth(d.getMonth() + 1); return [s, d.getTime() - 1];
}
function periodRange(p) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  switch (p) {
    case 'TODAY': return [d.getTime(), d.getTime() + DAY - 1];
    case 'WEEK': return [d.getTime() - 6 * DAY, Infinity];
    case 'MONTH': return monthRange(0);
    case 'LAST': return monthRange(-1);
    case '3M': return [monthRange(-2)[0], monthRange(0)[1]];
    case 'YEAR': { const s = new Date(d.getFullYear(), 0, 1).getTime(); return [s, new Date(d.getFullYear() + 1, 0, 1).getTime() - 1]; }
    default: return [0, Infinity];
  }
}
const PERIOD_LABELS = { ALL: 'الكل', TODAY: 'اليوم', WEEK: '7 أيام', MONTH: 'هذا الشهر', LAST: 'الشهر الماضي', '3M': '3 أشهر', YEAR: 'هذه السنة' };

function balances() {
  const b = {};
  db.accounts.forEach(a => b[a.id] = +a.initialBalance || 0);
  db.txns.forEach(t => {
    if (t.type === 'INCOME') b[t.accountId] = (b[t.accountId] || 0) + t.amount;
    else if (t.type === 'EXPENSE') b[t.accountId] = (b[t.accountId] || 0) - t.amount;
    else if (t.type === 'TRANSFER') {
      b[t.accountId] = (b[t.accountId] || 0) - t.amount;
      if (t.toAccountId != null) b[t.toAccountId] = (b[t.toAccountId] || 0) + (t.toAmount ?? t.amount);
    }
  });
  return b;
}
const txCur = t => (acc(t.accountId) || {}).currency || base();
function inRange(from, to) { return db.txns.filter(t => t.date >= from && t.date <= to); }
function typeTotals(list) {
  let inc = 0, exp = 0;
  list.forEach(t => { const v = conv(t.amount, txCur(t)); if (t.type === 'INCOME') inc += v; else if (t.type === 'EXPENSE') exp += v; });
  return [inc, exp];
}
function catTotals(list, type) {
  const m = {};
  list.filter(t => t.type === type).forEach(t => { const k = t.categoryId ?? -1; m[k] = (m[k] || 0) + conv(t.amount, txCur(t)); });
  return m;
}

let toastT;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.remove('hidden');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('hidden'), 2600);
}

// ================= التصنيف الذكي =================
const RULES = [
  ['cat_food', ['kfc', 'mcdonald', 'burger', 'pizza', 'talabat', 'elmenus', 'restaurant', 'cafe', 'coffee', 'starbucks', 'costa', 'supermarket', 'carrefour', 'spinneys', 'hyper', 'kazyon', 'bakery', 'مطعم', 'كافيه', 'قهوة', 'بيتزا', 'طلبات', 'كنتاكي', 'ماكدونالدز', 'سوبر ماركت', 'كارفور', 'سبينس', 'خير زمان', 'بقالة', 'هايبر', 'مخبز', 'حلواني']],
  ['cat_transport', ['uber', 'careem', 'indrive', 'didi', 'swvl', 'petrol', 'gasoline', 'taxi', 'metro', 'chillout', 'wataniya', 'mobil', 'بنزينة', 'بنزين', 'وطنية', 'تاكسي', 'مترو', 'اوبر', 'أوبر', 'كريم', 'قطار', 'جراج', 'موقف']],
  ['cat_bills', ['electric', 'electricity', 'water', 'gas bill', 'bill', 'fawry', 'internet', 'كهرباء', 'مياه', 'غاز', 'فاتورة', 'فوري', 'ضرائب']],
  ['cat_telecom', ['vodafone', 'orange', 'etisalat', 'we', 'telecom', 'فودافون', 'اورنج', 'أورنج', 'اتصالات', 'وي', 'شحن']],
  ['cat_shopping', ['amazon', 'noon', 'jumia', 'aliexpress', 'shein', 'ikea', 'mall', 'souq', 'temu', 'سيتي سنتر', 'امازون', 'نون', 'جوميا', 'مول', 'سوق']],
  ['cat_health', ['pharmacy', 'hospital', 'clinic', 'lab', 'dental', 'doctor', 'seif', 'ezaby', 'صيدلية', 'مستشفى', 'عيادة', 'معمل', 'دكتور', 'العزبي', 'سيف', 'أسنان', 'اشعة']],
  ['cat_fun', ['netflix', 'spotify', 'cinema', 'vox', 'shahid', 'playstation', 'steam', 'youtube', 'anghami', 'game', 'سينما', 'شاهد', 'العاب', 'ألعاب', 'انغامي']],
  ['cat_edu', ['school', 'university', 'udemy', 'course', 'coursera', 'academy', 'مدرسة', 'جامعة', 'كورس', 'اكاديمية', 'أكاديمية', 'تعليم']],
  ['cat_rent', ['rent', 'ايجار', 'إيجار']],
  ['cat_travel', ['airline', 'egyptair', 'booking', 'airbnb', 'hotel', 'airport', 'فندق', 'مصر للطيران', 'مطار', 'طيران', 'سفر']],
  ['cat_clothes', ['zara', 'h&m', 'defacto', 'lcw', 'max', 'adidas', 'nike', 'ملابس', 'ديفاكتو', 'حذاء']],
  ['cat_gifts', ['gift', 'هدية', 'هدايا', 'زهور', 'flowers']]
];
const merchantKey = m => String(m || '').toLowerCase().replace(/[0-9#*]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30);
function keywordCategory(merchant, kind, body) {
  if (kind === 'ATM') return 'cat_cash';
  if (kind === 'TRANSFER') return 'cat_transfer';
  if (kind === 'CREDIT') {
    const t = (merchant + ' ' + body).toLowerCase();
    if (['salary', 'payroll', 'راتب', 'مرتب'].some(w => t.includes(w))) return 'cat_salary';
    if (['refund', 'reversal', 'cashback', 'استرداد', 'ارجاع', 'إرجاع'].some(w => t.includes(w))) return 'cat_refund';
    return 'cat_other_inc';
  }
  const t = String(merchant || '').toLowerCase();
  if (!t.trim()) return 'cat_other_exp';
  const tokens = new Set(t.split(/[^\p{L}0-9&]+/u).filter(Boolean));
  for (const [c, words] of RULES) for (const w of words) if (tokens.has(w) || (w.length >= 4 && t.includes(w))) return c;
  return 'cat_other_exp';
}
function suggestCategory(merchant, kind, body = '') {
  const k = merchantKey(merchant);
  if (k && kind !== 'ATM' && kind !== 'TRANSFER' && db.merchants[k]) return db.merchants[k];
  const c = catByName(keywordCategory(merchant, kind, body));
  return c ? c.id : null;
}
function learn(merchant, categoryId) {
  const k = merchantKey(merchant);
  if (k && categoryId) db.merchants[k] = categoryId;
}

// ================= محلل رسائل البنوك (لصق الرسالة) =================
const SMS = (() => {
  const nrm = s => s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي');
  const isAscii = w => /^[\x00-\x7f]*$/.test(w);
  function firstIdx(t, words) {
    let best = -1;
    for (const w of words) {
      let from = 0;
      while (true) {
        const i = t.indexOf(w, from);
        if (i < 0) break;
        let ok = true;
        if (isAscii(w)) {
          if (i > 0 && /[a-z]/.test(t[i - 1])) ok = false;
          if (ok && w.length <= 3 && /[a-z]/.test(t[i + w.length] || '')) ok = false;
        }
        if (ok) { if (best < 0 || i < best) best = i; break; }
        from = i + 1;
      }
    }
    return best;
  }
  const atm = ['atm', 'صراف', 'سحب نقدي', 'cash withdrawal', 'cash wdl'];
  const credit = ['credited', 'credit of', 'received', 'deposit', 'salary', 'refund', 'reversal', 'cashback', 'ايداع', 'اضافه', 'اضافة', 'استلام', 'تم استلام', 'راتب', 'استرداد', 'واردة', 'وارد', 'دائن', 'اضيف'];
  const transfer = ['transfer', 'instapay', 'ipn', 'تحويل', 'حواله', 'حوالة', 'انستاباي'];
  const debit = ['debited', 'debit', 'purchase', 'spent', 'paid', 'payment', 'pos', 'withdrawn', 'withdrawal', 'charged', 'تم خصم', 'خصم', 'شراء', 'دفع', 'سداد', 'مدين', 'عمليه', 'عملية', 'مشتريات', 'تم سحب', 'سحب'];
  const strong = ['debited', 'credited', 'purchase', 'spent', 'withdrawn', 'transferred', 'تم خصم', 'تم ايداع', 'تم استلام', 'شراء', 'تم سحب', 'تم تحويل', 'عمليه شراء', 'عملية شراء'];
  const otpRx = /(\botp\b|one[- ]?time|verification code|security code|passcode|رمز التحقق|رمز التفعيل|كلمه المرور|الرمز السري|كود التحقق|كود التفعيل|رمز الدخول|do not share|لا تشارك)/i;
  const promoRx = /(promo|offer|% off|discount up|congratulations|apply now|installment plan|عرض|عروض|كوبون|مبروك|قسط|تقدم|للتقديم|احصل علي|استمتع)/i;
  const NUM = '(?:\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?)';
  const CUR = '(?:EGP|USD|EUR|GBP|SAR|AED|KWD|QAR|LE|L\\.E\\.?|E£|£|\\$|€|جنيه|ج\\.م|ج\\.\\s?م|دولار|ريال|درهم)';
  const moneyRx = new RegExp(`(?:^|[^A-Za-z])(?:(${CUR})\\s*(${NUM})|(${NUM})\\s*(${CUR}))(?![A-Za-z])`, 'gi');
  const labelAmountRx = new RegExp(`(?:amount|مبلغ|بمبلغ|قيمه|value)[^\\d\\n]{0,15}(${NUM})`, 'i');
  const balRx = new RegExp(`(?:balance|bal\\.?|الرصيد|رصيدك|رصيد)[^\\d\\n]{0,30}?(${NUM})`, 'i');
  const toNum = s => { const v = parseFloat(String(s).replace(/,/g, '')); return isFinite(v) ? v : null; };
  function normCur(c) {
    if (!c) return null;
    const u = c.toUpperCase().replace(/\s/g, '');
    if (['EGP', 'LE', 'L.E', 'L.E.', 'E£', 'جنيه', 'ج.م'].includes(u)) return 'EGP';
    if (u === '$' || u === 'USD' || u === 'دولار') return 'USD';
    if (u === '€' || u === 'EUR') return 'EUR';
    if (u === '£' || u === 'GBP') return 'GBP';
    if (u === 'SAR' || u === 'ريال') return 'SAR';
    if (u === 'AED' || u === 'درهم') return 'AED';
    return u;
  }
  const last4A = /(?:\*+|x+|\.{2,}|#)\s?(\d{4})(?!\d)(?![.,]\d)/i;
  const last4B = /(?:card|a\/c|acct|account|ending|بطاقه|بطاقة|بطاقتك|حساب|حسابك|كارت)[^\d\n]{0,15}?(\d{4})(?!\d)(?![.,]\d)/i;
  const merchLabel = /(?:merchant|المتجر|التاجر)\s*[:\-]?\s*([^\n.,،;:]{2,40})/i;
  const merchEn = /\b(?:at|to|from|@)\s+([A-Za-z][A-Za-z0-9&'\-. *]{1,38}?)(?=\s+(?:on|at|using|with|via|ref|dated|card|a\/c|acct|avail|bal|balance|\d)|[.,;\n]|$)/gi;
  const merchAr = /(?:لدى|لدي|عند|الى|إلى|التاجر)\s*[:\-]?\s*([؀-ۿA-Za-z0-9&'\-. ]{2,40}?)(?=\s+(?:بتاريخ|يوم|في|علي|على|بطاقه|بطاقة|بطاقتك|رصيد|الرصيد|مبلغ|بمبلغ|\d)|[.,،;\n]|$)/g;
  const merchArFrom = /(?:من)\s*[:\-]?\s*([؀-ۿA-Za-z0-9&'\-. ]{2,40}?)(?=\s+(?:بتاريخ|يوم|في|علي|على|بطاقه|بطاقة|بطاقتك|رصيد|الرصيد|مبلغ|بمبلغ|\d)|[.,،;\n]|$)/g;
  const stopWords = new Set(['account', 'card', 'your', 'a/c', 'acct', 'atm', 'merchant', 'you', 'the', 'balance', 'bal', 'date', 'حساب', 'بطاقه', 'بطاقة', 'بطاقتك', 'حسابك', 'الحساب', 'رصيد', 'رصيدك', 'الرصيد', 'ماكينه', 'ماكينة', 'ماكينات', 'بطاقات', 'المحفظه', 'المحفظة', 'محفظتك']);
  const cutWords = new Set(['بالبطاقه', 'بالبطاقة', 'المنتهيه', 'المنتهية', 'بطاقه', 'بطاقة', 'بطاقتك', 'بتاريخ', 'رقم', 'عبر', 'بواسطه', 'بواسطة', 'using', 'via', 'with', 'card', 'ref', 'dated']);
  function clean(s) {
    const kept = [];
    for (const w of s.replace(/\s+/g, ' ').trim().split(' ')) { if (cutWords.has(nrm(w))) break; kept.push(w); }
    return kept.join(' ').trim().replace(/[.,\-:;]+$/, '').slice(0, 40);
  }
  function merchant(body) {
    const m = merchLabel.exec(body);
    if (m) { const v = clean(m[1]); if (v) return v; }
    for (const rx of [merchAr, merchArFrom, merchEn]) {
      rx.lastIndex = 0;
      let x;
      while ((x = rx.exec(body))) {
        const v = clean(x[1]);
        if (v.length >= 2 && !stopWords.has(nrm(v.split(' ')[0]))) return v;
      }
    }
    return '';
  }
  function extractDate(body, fb) {
    const build = (y, m, d, h, mi) => {
      if (m < 1 || m > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
      const t = new Date(y, m - 1, d, h, mi).getTime();
      return t >= fb - 400 * DAY && t <= fb + DAY ? t : null;
    };
    let m = /(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})(?:[ T,]+(\d{1,2}):(\d{2}))?/.exec(body);
    if (m) { const r = build(+m[1], +m[2], +m[3], +(m[4] || 0), +(m[5] || 0)); if (r) return r; }
    m = /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})(?:[ T,]+(\d{1,2}):(\d{2}))?/.exec(body);
    if (m) { let y = +m[3]; if (y < 100) y += 2000; const r = build(y, +m[2], +m[1], +(m[4] || 0), +(m[5] || 0)); if (r) return r; }
    return fb;
  }
  function parse(raw, now = Date.now()) {
    const body = normDigits(raw);
    const t = nrm(body);
    const hasStrong = firstIdx(t, strong) >= 0;
    if (otpRx.test(t) && !hasStrong) return null;
    if (promoRx.test(t) && !hasStrong) return null;
    let balance = null, bs = -1, be = -1;
    const bm = balRx.exec(body);
    if (bm) { balance = toNum(bm[1]); bs = bm.index; be = bm.index + bm[0].length - 1; }
    let amount = null, currency = null, x;
    moneyRx.lastIndex = 0;
    while ((x = moneyRx.exec(body))) {
      const s = x.index, e = x.index + x[0].length - 1;
      if (bs >= 0 && s <= be && e >= bs) continue;
      amount = toNum(x[2] || x[3]); currency = normCur(x[1] || x[4]);
      if (amount > 0) break;
    }
    if (!(amount > 0)) { const lm = labelAmountRx.exec(body); if (lm) amount = toNum(lm[1]); }
    if (!(amount > 0)) return null;
    const iAtm = firstIdx(t, atm), iCr = firstIdx(t, credit), iTr = firstIdx(t, transfer), iDb = firstIdx(t, debit);
    let kind;
    if (iAtm >= 0 && iCr < 0) kind = 'ATM';
    else {
      const c = [['CREDIT', iCr], ['TRANSFER', iTr], ['DEBIT', iDb]].filter(p => p[1] >= 0).sort((a, b) => a[1] - b[1]);
      if (!c.length) return null;
      kind = c[0][0];
      if (kind === 'TRANSFER' && iCr >= 0) kind = 'CREDIT';
    }
    const l4 = last4A.exec(body) || last4B.exec(body);
    let m = merchant(body);
    if (kind === 'ATM' && !m) m = 'ATM';
    return { amount, currency, kind, last4: l4 ? l4[1] : null, merchant: m, balance, date: extractDate(body, now) };
  }
  return { parse };
})();

// ================= المعاملات المتكررة =================
function advance(r) {
  const d = new Date(r.nextDate);
  if (r.period === 'DAILY') d.setDate(d.getDate() + 1);
  else if (r.period === 'WEEKLY') d.setDate(d.getDate() + 7);
  else {
    const months = r.period === 'YEARLY' ? 12 : 1;
    const y = d.getFullYear(), m = d.getMonth() + months;
    const last = new Date(y, m + 1, 0).getDate();
    d.setFullYear(y, m, Math.min(r.anchorDay || 1, last));
  }
  return d.getTime();
}
function runRecurring() {
  const now = Date.now();
  let n = 0;
  db.recurring.forEach(r => {
    if (!r.active || r.auto === false || !acc(r.accountId)) return;
    let guard = 0;
    while (r.nextDate <= now && guard++ < 400) {
      db.txns.push({ id: newId(), type: r.type, amount: r.amount, accountId: r.accountId, categoryId: r.categoryId, merchant: r.merchant, note: r.note, date: r.nextDate, source: 'RECURRING' });
      r.nextDate = advance(r);
      n++;
    }
  });
  if (n) { save(); toast(`تمت إضافة ${n} حركة متكررة`); }
}

// ================= أسعار الصرف والذهب =================
async function refreshRates(manual) {
  const urls = ['https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    'https://latest.currency-api.pages.dev/v1/currencies/usd.json'];
  let usd = null;
  for (const u of urls) {
    try { const r = await fetch(u, { cache: 'no-store' }); const j = await r.json(); usd = {}; for (const k in j.usd) usd[k.toUpperCase()] = j.usd[k]; break; } catch (e) { usd = null; }
  }
  const b = base(); const bu = usd && usd[b];
  if (!usd || !bu) { if (manual) toast('تعذّر تحديث الأسعار، يتم استخدام الأسعار المحفوظة'); return; }
  const list = new Set([...db.accounts.map(a => a.currency), ...db.goals.map(g => g.currency), ...CURRENCIES]);
  list.forEach(c => { if (c !== b && usd[c] > 0) db.rates[c] = bu / usd[c]; });
  let oz = null;
  try { const r = await fetch('https://api.gold-api.com/price/XAU', { cache: 'no-store' }); oz = (await r.json()).price; } catch (e) { }
  if (!(oz > 0) && usd.XAU > 0) oz = 1 / usd.XAU;
  if (oz > 0) db.prefs.goldOz = oz;
  db.prefs.ratesUpdated = Date.now();
  save();
  if (manual) toast('تم تحديث الأسعار');
  render();
}
function goldPrices() {
  const oz = db.prefs.goldOz; const b = base();
  const usdToBase = b === 'USD' ? 1 : (db.rates.USD || 0);
  if (!oz || !usdToBase) return null;
  const g24 = oz / 31.1035 * usdToBase;
  return { k24: g24, k21: g24 * 21 / 24, k18: g24 * 18 / 24, pound: g24 * 21 / 24 * 8 };
}

// ================= الواجهة =================
let tab = 'home';
let filter = { q: '', type: '', accountId: 0, categoryId: 0, period: 'ALL' };
let reportPeriod = 'MONTH', reportType = 'EXPENSE';
const view = () => $('#view');

const SUB_VIEWS = { cards: 'more', savings: 'home', inbox: 'home', ctrl: 'home' };
function setTab(t) {
  if (t === 'add') { openTxn(); return; }
  tab = t;
  const main = SUB_VIEWS[t] || t;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === main));
  window.scrollTo(0, 0);
  render();
}

function render() {
  const titles = { home: 'محفظتي', txns: 'الحركات', reports: 'التقارير', more: 'المزيد', cards: 'بطاقات الائتمان', savings: 'الادخار', inbox: 'رسائل البنك', ctrl: 'المتحكم المالي' };
  $('#title').textContent = titles[tab] || 'محفظتي';
  const back = $('#back');
  back.classList.toggle('hidden', !SUB_VIEWS[tab]);
  back.onclick = () => setTab(SUB_VIEWS[tab]);
  ({ home: renderHome, txns: renderTxns, reports: renderReports, more: renderMore, cards: renderCards, savings: renderSavings, inbox: renderInbox, ctrl: renderCtrl })[tab]();
}

function txRow(t) {
  const a = acc(t.accountId); const c = cat(t.categoryId);
  const cur = a ? a.currency : base();
  let icon = c ? c.icon : '📦', title = t.merchant || (c ? lbl(c.name) : 'بدون تصنيف'), cls = 'exp', sign = '-';
  if (t.type === 'INCOME') { cls = 'inc'; sign = '+'; }
  if (t.type === 'TRANSFER') { icon = ic('transfer'); cls = ''; sign = ''; title = t.merchant || `تحويل إلى ${lbl((acc(t.toAccountId) || {}).name || '')}`; }
  return `<div class="item" data-tx="${t.id}">
    <div class="ico">${icon}</div>
    <div class="grow"><div class="ellipsis">${esc(title)}</div><div class="muted ellipsis">${t.source === 'ESTIMATE' ? '<span class="pill">تقديري</span> ' : ''}${esc(lbl(a ? a.name : ''))} · ${ltr(fmtDT(t.date))}${t.note ? ' · ' + esc(t.note) : ''}</div></div>
    <div class="num ${cls}">${sign}${money(t.amount)} <small class="muted">${cur}</small></div>
  </div>`;
}
function bindTxRows(root) {
  root.querySelectorAll('[data-tx]').forEach(el => el.onclick = () => openTxn(db.txns.find(t => t.id === +el.dataset.tx)));
}

const insH = (i, h, w) => `<div class="insight ${w ? 'w' : ''}"><span class="ib">${ic(i)}</span><div class="grow">${h}</div></div>`;
function renderHome() {
  const bal = balances();
  const total = db.accounts.filter(a => !a.archived).reduce((s, a) => s + conv(bal[a.id] || 0, a.currency), 0);
  const [f, to] = monthRange(0);
  const month = inRange(f, to);
  const [inc, exp] = typeTotals(month);
  const [lf, lt] = monthRange(-1);
  const lastExp = typeTotals(inRange(lf, lt))[1];
  const cats = catTotals(month, 'EXPENSE');

  const ins = [];
  const now = new Date(); const day = now.getDate(); const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  if (day >= 3 && exp > 0) {
    const fc = exp / day * days;
    ins.push(insH('chart', `المتوقع صرفه حتى نهاية الشهر: <b class="num">${money(fc)}</b> ${base()}`));
    if (lastExp > 0) { const p = (fc - lastExp) / lastExp * 100; ins.push(insH(p > 0 ? 'up' : 'down', `${p > 0 ? 'أعلى' : 'أقل'} من الشهر الماضي بنسبة ${Math.abs(p).toFixed(0)}%`, p > 0)); }
  }
  const topId = Object.keys(cats).filter(k => +k > 0).sort((a, b) => cats[b] - cats[a])[0];
  if (topId && exp > 0) ins.push(insH('tag', `أكثر تصنيف صرفاً: ${esc(lbl(cat(+topId).name))} (${(cats[topId] / exp * 100).toFixed(0)}%)`));
  db.categories.filter(c => c.monthlyBudget > 0 && !c.isIncome).forEach(c => {
    const s = cats[c.id] || 0; const p = s / c.monthlyBudget * 100;
    if (p >= 80) ins.push(insH('alert', `ميزانية ${esc(lbl(c.name))}: استهلكت ${p.toFixed(0)}%`, true));
  });
  const due = db.debts.filter(d => d.dueDate && d.paid < d.amount && d.dueDate - Date.now() < 3 * DAY).length;
  if (due) ins.push(insH('users', `لديك ${due} دين مستحق قريباً`, true));
  db.accounts.filter(a => a.type === 'CREDIT' && !a.archived && a.dueDay).forEach(a => {
    const st = stmtLeft(a);
    const owed = st ? st.left : -(bal[a.id] || 0); const left = st ? Math.round((dayStart(st.date) - dayStart(Date.now())) / DAY) : daysUntilDay(a.dueDay);
    if (owed > 0 && left <= 5) ins.push(insH('card', `موعد سداد ${esc(lbl(a.name))} بعد ${left === 0 ? 'النهارده' : left + ' يوم'}: <b class="num">${money(owed)}</b> ${a.currency}`, true));
  });
  db.installments.forEach(p => {
    const n = nextInstallment(p);
    if (n && n.date - Date.now() < 3 * DAY) ins.push(insH('calendar', `قسط «${esc(p.name)}» مستحق ${ltr(fmtDate(n.date))}: <b class="num">${money(n.payment)}</b>`, true));
  });
  const savedPct = inc > 0 ? (inc - exp) / inc * 100 : null;
  const pending = db.inbox.filter(m => m.status === 'PENDING').length;
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const [rh, rm] = (db.prefs.reminderTime || '21:00').split(':').map(Number);
  const showReminder = db.prefs.reminderTime && new Date().getHours() * 60 + new Date().getMinutes() >= rh * 60 + rm && !db.txns.some(t => t.date >= todayStart) && !noSpend().includes(dayKey(Date.now()));

  const recent = [...db.txns].sort((a, b) => b.date - a.date).slice(0, 6);
  const budgets = db.categories.filter(c => c.monthlyBudget > 0 && !c.isIncome);
  const gold = goldPrices();

  const hide = !!db.prefs.hideBal;
  const m = v => hide ? '••••' : money(v);
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'صباح الخير' : 'مساء الخير';
  const expPct = inc > 0 ? Math.min(100, exp / inc * 100) : (exp > 0 ? 100 : 0);
  const tiles = [['exp', 'up', 'مصروف'], ['inc', 'down', 'دخل'], ['tr', 'transfer', 'تحويل'], ['sms', 'mail', 'رسائل البنك', pending],
    ['ctrl', 'shield', 'المتحكم المالي'], ['cards', 'card', 'البطاقات'], ['savings', 'coins', 'الادخار'], ['voice', 'mic', 'مساعد صوتي']];
  view().innerHTML = `
    <section class="band">
      <div class="greet">${greet}</div>
      <div class="bal-row">
        <div><div class="label">الرصيد الحالي</div><div class="big num">${m(total)} <small>${base()}</small></div></div>
        <div class="row" style="gap:8px"><button class="eye" id="hMic" aria-label="المساعد الصوتي">${ic('mic')}</button><button class="eye" id="hEye" aria-label="إظهار أو إخفاء الرصيد">${ic(hide ? 'eyeOff' : 'eye')}</button></div>
      </div>
      ${(() => { const ps = positions(); return `<button class="pos-row" id="hPos">
        <div><span>بعد أقساط الشهر</span><b class="num">${m(ps.afterInst)}</b></div>
        <div><span>صافي الرصيد (لك − عليك)</span><b class="num">${m(ps.net)}</b></div></button>`; })()}
      <div class="acc-scroll">${db.accounts.filter(a => !a.archived).map(a => `<button class="acc-card ${a.type === 'CREDIT' ? 'credit' : ''}" data-acc="${a.id}">
        <div class="row between"><span class="acc-ic">${accIcon(a)}</span><span class="acc-type">${ACC_TYPES[a.type] || ''}</span></div>
        <div class="acc-name ellipsis">${esc(lbl(a.name))}</div>
        <div class="acc-no num">${a.last4 ? '•••• ' + esc(a.last4) : '&nbsp;'}</div>
        <div class="acc-bal num">${m(bal[a.id] || 0)} <small>${a.currency}</small></div>
      </button>`).join('')}<button class="acc-card add" id="hAcc">${ic('plus')}<span>إدارة الحسابات</span></button></div>
    </section>
    <div class="card tiles">${tiles.map(([k, i, t, b]) => `<button data-q="${k}"><span class="ti">${ic(i)}</span><span>${t}</span>${b ? `<i class="badge">${b}</i>` : ''}</button>`).join('')}</div>
    ${riskCard(hide)}
    ${usualCard()}
    ${showReminder ? `<div class="card reminder"><div class="row"><span class="ib warn">${ic('bell')}</span><div class="grow"><b>ماسجّلتش مصاريف النهارده</b><div class="muted">سجّلها دلوقتي عشان تفضل حساباتك مظبوطة</div></div><button class="btn small primary" id="hRem">إضافة</button></div>${usualDay().total ? `<div class="btns"><button class="btn small" id="hUsual">سجّل يومي العادي (≈ ${money(usualDay().total).replace(/\.00$/, '')})</button><button class="btn small" id="hNone">ماصرفتش حاجة</button></div>` : ''}</div>` : ''}
    ${planCard(hide)}
    ${spendCard(cats, exp, hide)}
    ${ins.length ? `<div class="card"><h3>رؤى ذكية</h3>${ins.join('')}</div>` : ''}
    ${budgets.length ? `<div class="card"><h3>الميزانيات</h3>${budgets.map(c => { const s = cats[c.id] || 0; const p = s / c.monthlyBudget * 100;
      return `<div style="margin-bottom:10px"><div class="row between"><span>${c.icon} ${esc(lbl(c.name))}</span><span class="num muted">${money(s)} / ${money(c.monthlyBudget)}</span></div>
      <div class="bar ${p >= 100 ? 'over' : p >= 80 ? 'warn' : ''}"><i style="width:${Math.min(100, p)}%"></i></div></div>`; }).join('')}</div>` : ''}
    ${db.goals.length ? `<div class="card"><h3>الأهداف</h3>${db.goals.map(g => { const p = g.target ? g.saved / g.target * 100 : 0;
      return `<div style="margin-bottom:10px"><div class="row between"><span>${g.icon} ${esc(g.name)}</span><span class="num muted">${money(g.saved)} / ${money(g.target)} ${g.currency}</span></div>
      <div class="bar"><i style="width:${Math.min(100, p)}%"></i></div></div>`; }).join('')}</div>` : ''}
    ${gold ? `<div class="card"><h3>سعر الذهب (${base()} للجرام)</h3><div class="grid2">
      <div>عيار 24<br><b class="num">${money(gold.k24)}</b></div><div>عيار 21<br><b class="num">${money(gold.k21)}</b></div>
      <div>عيار 18<br><b class="num">${money(gold.k18)}</b></div><div>الجنيه الذهب<br><b class="num">${money(gold.pound)}</b></div></div></div>` : ''}
    <div class="card"><div class="row between"><h3>آخر الحركات</h3><button class="btn small" id="hAll">الكل</button></div>
      <div class="list">${recent.length ? recent.map(txRow).join('') : '<div class="empty">لا توجد حركات بعد. اضغط ＋ لإضافة أول حركة.</div>'}</div></div>
  `;
  $('#hAcc').onclick = openAccounts;
  $('#hPos').onclick = openPositions;
  $('#hAll').onclick = () => setTab('txns');
  if ($('#hRem')) $('#hRem').onclick = () => openTxn();
  if ($('#hUsual')) $('#hUsual').onclick = () => { const r = fillUsual([Date.now()]); toast(`اتسجّل ${money(r.total)} تقديري`); render(); };
  if ($('#hNone')) $('#hNone').onclick = () => { noSpend().push(dayKey(Date.now())); save(); render(); };
  bindUsualCard();
  const qa = { exp: () => openTxn(null, { type: 'EXPENSE' }), inc: () => openTxn(null, { type: 'INCOME' }), tr: () => openTxn(null, { type: 'TRANSFER' }), sms: () => setTab('inbox'),
    cards: () => setTab('cards'), savings: () => setTab('savings'), ctrl: () => setTab('ctrl'), voice: openVoice };
  const hS = $('#hSpend'); if (hS) hS.onclick = () => openSpend();
  view().querySelectorAll('[data-cat]').forEach(el => el.onclick = () => { filter = { q: '', type: 'EXPENSE', accountId: 0, categoryId: +el.dataset.cat, period: 'MONTH' }; setTab('txns'); });
  if ($('#hSpeak')) $('#hSpeak').onclick = () => speak(dailyPlan().tips.map(x => x.text.replace(/<[^>]+>/g, '')).join('. '));
  $('#hMic').onclick = quickVoice;
  if ($('#hRisk')) $('#hRisk').onclick = () => setTab('ctrl');
  if ($('#hProf')) $('#hProf').onclick = () => openOnboarding();
  view().querySelectorAll('[data-q]').forEach(b => b.onclick = qa[b.dataset.q]);
  $('#hEye').onclick = () => { db.prefs.hideBal = !db.prefs.hideBal; save(); renderHome(); };
  view().querySelectorAll('[data-acc]').forEach(b => b.onclick = () => {
    const a = acc(+b.dataset.acc);
    if (a.type === 'CREDIT') return setTab('cards');
    filter = { q: '', type: '', accountId: a.id, categoryId: 0, period: 'ALL' }; setTab('txns');
  });
  bindTxRows(view());
}

function renderTxns() {
  const [f, to] = periodRange(filter.period);
  const q = filter.q.trim().toLowerCase();
  const list = db.txns.filter(t => t.date >= f && t.date <= to
    && (!filter.type || t.type === filter.type)
    && (!filter.accountId || t.accountId === filter.accountId || t.toAccountId === filter.accountId)
    && (!filter.categoryId || t.categoryId === filter.categoryId)
    && (!q || (t.merchant + ' ' + t.note).toLowerCase().includes(q) || String(t.amount).includes(q))
  ).sort((a, b) => b.date - a.date);
  const [inc, exp] = typeTotals(list);
  const shown = list.slice(0, 300);
  view().innerHTML = `
    <div class="card">
      <input class="in" id="q" placeholder="🔍 بحث بالتاجر أو الملاحظة أو المبلغ" value="${esc(filter.q)}">
      <div class="chips" style="margin-top:8px">${Object.entries(PERIOD_LABELS).map(([k, v]) => `<button class="chip ${filter.period === k ? 'on' : ''}" data-p="${k}">${v}</button>`).join('')}</div>
      <div class="chips" style="margin-top:6px">${[['', 'كل الأنواع'], ['EXPENSE', 'مصروف'], ['INCOME', 'دخل'], ['TRANSFER', 'تحويل']].map(([k, v]) => `<button class="chip ${filter.type === k ? 'on' : ''}" data-t="${k}">${v}</button>`).join('')}</div>
      <div class="grid2" style="margin-top:8px">
        <select class="in" id="fa"><option value="0">كل الحسابات</option>${db.accounts.map(a => `<option value="${a.id}" ${filter.accountId === a.id ? 'selected' : ''}>${esc(lbl(a.name))}</option>`).join('')}</select>
        <select class="in" id="fc"><option value="0">كل التصنيفات</option>${db.categories.map(c => `<option value="${c.id}" ${filter.categoryId === c.id ? 'selected' : ''}>${c.icon} ${esc(lbl(c.name))}</option>`).join('')}</select>
      </div>
      <div class="row between" style="margin-top:10px"><span class="muted">${list.length} حركة</span>
        <span class="num"><span class="inc">+${money(inc)}</span> · <span class="exp">-${money(exp)}</span></span></div>
    </div>
    <div class="card list">${shown.length ? shown.map(txRow).join('') : '<div class="empty">لا توجد نتائج</div>'}
    ${list.length > shown.length ? `<div class="muted" style="text-align:center;padding-top:8px">يتم عرض أحدث 300 حركة، استخدم الفلاتر لتضييق النتائج</div>` : ''}</div>`;
  const qi = $('#q');
  qi.oninput = () => { filter.q = qi.value; clearTimeout(qi._t); qi._t = setTimeout(() => { renderTxns(); const n = $('#q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 300); };
  view().querySelectorAll('[data-p]').forEach(b => b.onclick = () => { filter.period = b.dataset.p; renderTxns(); });
  view().querySelectorAll('[data-t]').forEach(b => b.onclick = () => { filter.type = b.dataset.t; renderTxns(); });
  $('#fa').onchange = e => { filter.accountId = +e.target.value; renderTxns(); };
  $('#fc').onchange = e => { filter.categoryId = +e.target.value; renderTxns(); };
  bindTxRows(view());
}

function renderReports() {
  const [f, to] = periodRange(reportPeriod);
  const list = inRange(f, to);
  const [inc, exp] = typeTotals(list);
  const cats = catTotals(list, reportType);
  const total = Object.values(cats).reduce((s, v) => s + v, 0);
  const slices = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const [a, b] = monthRange(-i);
    const [mi, me] = typeTotals(inRange(a, b));
    const d = new Date(a);
    months.push({ k: `${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`, inc: mi, exp: me });
  }
  const max = Math.max(1, ...months.map(m => Math.max(m.inc, m.exp)));
  const top = list.filter(t => t.type === 'EXPENSE').sort((a, b) => conv(b.amount, txCur(b)) - conv(a.amount, txCur(a))).slice(0, 10);
  view().innerHTML = `
    <div class="card">
      <div class="chips">${['MONTH', 'LAST', '3M', 'YEAR', 'ALL'].map(k => `<button class="chip ${reportPeriod === k ? 'on' : ''}" data-p="${k}">${PERIOD_LABELS[k]}</button>`).join('')}</div>
      <div class="grid2" style="margin-top:12px">
        <div><div class="muted">الدخل</div><b class="num inc">${money(inc)}</b></div>
        <div><div class="muted">المصروف</div><b class="num exp">${money(exp)}</b></div>
      </div>
      <div style="margin-top:8px"><span class="muted">الصافي: </span><b class="num ${inc - exp >= 0 ? 'inc' : 'exp'}">${money(inc - exp)}</b> <small class="muted">${base()}</small></div>
    </div>
    <div class="card">
      <div class="seg"><button class="${reportType === 'EXPENSE' ? 'on e' : ''}" data-rt="EXPENSE">المصروفات</button><button class="${reportType === 'INCOME' ? 'on i' : ''}" data-rt="INCOME">الدخل</button></div>
      <h3 style="margin-top:12px">حسب التصنيف</h3>
      ${slices.length ? slices.map(([id, v]) => { const c = cat(+id); const p = total ? v / total * 100 : 0;
        return `<div style="margin-bottom:10px"><div class="row between"><span>${c ? c.icon + ' ' + esc(lbl(c.name)) : '📦 بدون تصنيف'}</span><span class="num muted">${money(v)} · ${p.toFixed(1)}%</span></div><div class="bar"><i style="width:${p}%"></i></div></div>`; }).join('') : '<div class="empty">لا توجد بيانات لهذه الفترة</div>'}
    </div>
    <div class="card"><h3>آخر 12 شهراً</h3>
      <div class="months">${months.map(m => `<div class="m"><div class="b"><i class="ii" style="height:${m.inc / max * 100}%"></i><i class="ee" style="height:${m.exp / max * 100}%"></i></div><small>${m.k}</small></div>`).join('')}</div>
      <div class="row muted" style="margin-top:6px;gap:14px"><span><span class="inc">■</span> دخل</span><span><span class="exp">■</span> مصروف</span></div>
    </div>
    ${top.length ? `<div class="card"><h3>أكبر المصروفات</h3><div class="list">${top.map(txRow).join('')}</div></div>` : ''}
    <div class="card"><h3>اسأل عن مصروفاتك</h3>
      <input class="in" id="nl" placeholder="مثال: كم صرفت على المطاعم الشهر الماضي">
      <div id="nlOut" style="margin-top:8px"></div>
    </div>
    <button class="btn block" id="repMonth" style="margin-bottom:8px">${ic('report')} التقرير الشهري (قائمة دخل)</button>
    <button class="btn block" id="repCsv">⬇️ تصدير التقرير (Excel/CSV)</button>`;
  view().querySelectorAll('[data-p]').forEach(b => b.onclick = () => { reportPeriod = b.dataset.p; renderReports(); });
  view().querySelectorAll('[data-rt]').forEach(b => b.onclick = () => { reportType = b.dataset.rt; renderReports(); });
  bindTxRows(view());
  $('#nl').onkeydown = e => { if (e.key === 'Enter') askNl(e.target.value); };
  $('#nl').onchange = e => askNl(e.target.value);
  $('#repMonth').onclick = () => openMonthReport(0);
  $('#repCsv').onclick = () => {
    const rows = [['القسم', 'البند', `المبلغ (${base()})`, '%'], ['ملخص', 'الدخل', inc.toFixed(2), ''], ['ملخص', 'المصروف', exp.toFixed(2), ''], ['ملخص', 'الصافي', (inc - exp).toFixed(2), '']];
    slices.forEach(([id, v]) => rows.push(['التصنيفات', cat(+id) ? lbl(cat(+id).name) : 'بدون تصنيف', v.toFixed(2), total ? (v / total * 100).toFixed(1) : '0']));
    months.forEach(m => { rows.push(['الأشهر', m.k + ' دخل', m.inc.toFixed(2), '']); rows.push(['الأشهر', m.k + ' مصروف', m.exp.toFixed(2), '']); });
    downloadCsv(`report-${fmtDate(Date.now())}.csv`, rows);
  };
}

// بحث بلغة طبيعية (قواعد محلية)
function askNl(text, out = $('#nlOut')) { const t = normDigits(text).toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي');
  if (!t.trim()) { out.innerHTML = ''; return; }
  let period = 'MONTH';
  if (/الشهر الماضي|الشهر اللي فات|last month/.test(t)) period = 'LAST';
  else if (/النهارده|اليوم|today/.test(t)) period = 'TODAY';
  else if (/الاسبوع|اسبوع|week/.test(t)) period = 'WEEK';
  else if (/السنه|السنة|سنه|year/.test(t)) period = 'YEAR';
  else if (/3 شهور|ثلاث|3 اشهر|3 months/.test(t)) period = '3M';
  else if (/كل|اجمالي|all/.test(t)) period = 'ALL';
  const type = /دخل|كسبت|قبضت|income|earn/.test(t) ? 'INCOME' : 'EXPENSE';
  const syn = { cat_food: ['مطاعم', 'مطعم', 'اكل', 'طعام', 'food'], cat_transport: ['مواصلات', 'بنزين', 'اوبر', 'transport'], cat_bills: ['فواتير', 'كهرباء', 'bills'],
    cat_shopping: ['تسوق', 'shopping'], cat_health: ['صحه', 'صحة', 'دكتور', 'علاج'], cat_fun: ['ترفيه', 'خروج'], cat_telecom: ['اتصالات', 'موبايل', 'نت'], cat_clothes: ['ملابس', 'هدوم'] };
  let catId = 0;
  for (const c of db.categories) {
    const names = [lbl(c.name).toLowerCase(), ...(syn[c.name] || [])].map(x => x.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه'));
    if (names.some(n => n && t.replace(/ة/g, 'ه').includes(n))) { catId = c.id; break; }
  }
  const [f, to] = periodRange(period);
  const list = inRange(f, to).filter(x => x.type === type && (!catId || x.categoryId === catId));
  const sum = list.reduce((s, x) => s + conv(x.amount, txCur(x)), 0);
  out.innerHTML = `<div class="insight">${type === 'INCOME' ? 'إجمالي الدخل' : 'إجمالي المصروف'}${catId ? ' على ' + esc(lbl(cat(catId).name)) : ''} (${PERIOD_LABELS[period]}): <b class="num">${money(sum)}</b> ${base()} في ${list.length} حركة <button class="btn small" id="nlGo">عرض</button></div>`;
  out.querySelector('#nlGo').onclick = () => { $('#sheet').classList.add('hidden'); document.body.style.overflow = ''; filter = { q: '', type, accountId: 0, categoryId: catId, period }; setTab('txns'); };
}

function renderMore() {
  const groups = [
    ['الفلوس', [
      ['shield', 'المتحكم المالي', 'تنبيهات السيولة، توقع الرصيد، توزيع المرتب', () => setTab('ctrl')],
      ['bank', 'الحسابات', 'بنوك، نقدي، توفير، ذهب', openAccounts],
      ['card', 'بطاقات الائتمان والتقسيط', 'الحد المستخدم، مواعيد السداد، جدول الأقساط', () => setTab('cards')],
      ['coins', 'الادخار', 'قاعدة 50/30/20، صندوق الطوارئ، خطة الأهداف', () => setTab('savings')],
      ['target', 'الأهداف', 'أهداف الادخار', openGoals],
      ['users', 'الديون والقروض', 'أقرضت / اقترضت وسداد جزئي', openDebts]]],
    ['التنظيم', [
      ['mail', 'رسائل البنك', 'لصق أو استيراد الرسائل وربطها تلقائياً', () => setTab('inbox')],
      ['tag', 'التصنيفات والميزانيات', 'ميزانية كل تصنيف ونوعه (احتياج/رغبة)', openCategories],
      ['repeat', 'المصاريف الثابتة والمتكررة', 'يومي وشهري، تلقائي أو يدوي، واقتراحات', openRecurring],
      ['report', 'التقرير الشهري', 'قائمة دخل: ثابت، متغير، صافي', () => openMonthReport(0)],
      ['split', 'تقسيم فاتورة', 'سجّل نصيبك فقط كمصروف', openSplit]]],
    ['البيانات والإعدادات', [
      ['target', 'بياناتي المالية', 'المرتب، يوم القبض، ساعات الشغل، حد الأمان', () => openOnboarding(true)],
      ['settings', 'الإعدادات', 'التذكير اليومي، الرسائل، ساعة أبل', openSettings],
      ['currency', 'العملة وأسعار الصرف والذهب', `العملة الأساسية: ${base()}`, openRates],
      ['save', 'نسخ احتياطي واستعادة', 'حفظ بياناتك في ملف (iCloud Drive أو الملفات)', openBackup],
      ['upload', 'تصدير الحركات (Excel/CSV)', 'كل الحركات في ملف واحد', exportCsv],
      ['lock', 'قفل PIN', db.prefs.pinHash ? 'مفعّل' : 'غير مفعّل', openPin],
      ['install', 'التثبيت على الآيفون', 'إضافة التطبيق للشاشة الرئيسية', () => $('#iosHint').classList.remove('hidden')]]]
  ];
  const items = groups.flatMap(g => g[1]);
  let n = 0;
  view().innerHTML = groups.map(([title, list]) => `<div class="section-title">${title}</div><div class="card list menu">${list.map(x => `<div class="item" data-m="${n++}"><div class="ico blue">${ic(x[0])}</div><div class="grow"><div class="t">${x[1]}</div><div class="muted">${x[2]}</div></div><span class="chev">${ic('chevron')}</span></div>`).join('')}</div>`).join('') +
    `<p class="muted" style="text-align:center">الإصدار ${APP_VERSION} · <a href="#" id="mUpd">تحديث التطبيق</a></p><p class="muted" style="text-align:center">بياناتك محفوظة على هذا الجهاز فقط ولا تُرسل لأي خادم. خذ نسخة احتياطية بانتظام.</p>`;
  view().querySelectorAll('[data-m]').forEach(el => el.onclick = () => items[+el.dataset.m][3]());
  $('#mUpd').onclick = e => { e.preventDefault(); forceUpdate(); };
}

// ================= بطاقات الائتمان والتقسيط =================
// مبلغ الكشف المطلوب سداده (من البنك) ناقص اللي اتسدد على البطاقة من ساعة ما اتسجّل
function stmtLeft(a) {
  if (!(a && +a.stmtDue > 0 && a.stmtDate && a.stmtDate >= dayStart(Date.now()))) return null;
  const paid = db.txns.filter(t => t.type === 'TRANSFER' && t.toAccountId === a.id && t.date >= (a.stmtSetAt || 0)).reduce((s0, t) => s0 + (t.toAmount ?? t.amount), 0);
  return { left: Math.max(0, a.stmtDue - paid), date: a.stmtDate, paid };
}
function daysUntilDayFrom(day, from) {
  const now = new Date(dayStart(from));
  let d = new Date(now.getFullYear(), now.getMonth(), Math.min(day, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()));
  if (d <= now) d = new Date(now.getFullYear(), now.getMonth() + 1, Math.min(day, new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate()));
  return Math.round((d - now) / DAY);
}
function daysUntilDay(day) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  let d = new Date(now.getFullYear(), now.getMonth(), Math.min(day, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()));
  if (d < now) d = new Date(now.getFullYear(), now.getMonth() + 1, Math.min(day, new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate()));
  return Math.round((d - now) / DAY);
}
// جدول السداد: FLAT = فائدة ثابتة على أصل المبلغ (الشائع في مصر)، REDUCING = فائدة على الرصيد المتبقي
function schedule(p) {
  const n = Math.max(1, p.months | 0), P = +p.principal || 0, annual = (+p.rate || 0) / 100, fees = +p.fees || 0;
  const rows = [];
  const start = new Date(p.startDate);
  const dateOf = i => { const y = start.getFullYear(), m = start.getMonth() + i; return new Date(y, m, Math.min(start.getDate(), new Date(y, m + 1, 0).getDate())).getTime(); };
  let bal = P;
  if (+p.monthlyFixed > 0) {
    // المستخدم عارف القسط الشهري من البنك: نستخدمه زي ما هو
    const pay = +p.monthlyFixed; const r = annual / 12;
    for (let i = 0; i < n; i++) {
      // مع فائدة متناقصة: الفائدة على المتبقي والباقي من القسط أصل (زي جدول البنك)
      const interest = p.method === 'REDUCING' && r ? bal * r : Math.max(0, pay - P / n);
      const principal = i === n - 1 ? bal : Math.min(bal, pay - interest);
      bal = Math.max(0, bal - principal);
      rows.push({ i: i + 1, date: dateOf(i), payment: pay + (i === 0 ? fees : 0), principal, interest, balance: bal });
    }
    return rows;
  }
  if (p.method === 'REDUCING') {
    const r = annual / 12;
    const pmt = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
    for (let i = 0; i < n; i++) {
      const interest = bal * r; const principal = i === n - 1 ? bal : pmt - interest;
      bal = Math.max(0, bal - principal);
      rows.push({ i: i + 1, date: dateOf(i), payment: principal + interest + (i === 0 ? fees : 0), principal, interest, balance: bal });
    }
  } else {
    const interestEach = P * annual * n / 12 / n;
    for (let i = 0; i < n; i++) {
      const principal = P / n; bal = Math.max(0, bal - principal);
      rows.push({ i: i + 1, date: dateOf(i), payment: principal + interestEach + (i === 0 ? fees : 0), principal, interest: interestEach, balance: bal });
    }
  }
  return rows;
}
// ملخص البطاقات الائتمانية لفترة: مشتريات، أقساط اتقيدت، سداد، وحالة البطاقة دلوقتي
function cardsSummary(f, t) {
  const bal = balances();
  return db.accounts.filter(a => a.type === 'CREDIT' && !a.archived).map(a => {
    const tx = db.txns.filter(x => x.date >= f && x.date <= t);
    const ex = tx.filter(x => x.type === 'EXPENSE' && x.accountId === a.id);
    const inst = ex.filter(x => x.source === 'INSTALLMENT').reduce((s0, x) => s0 + x.amount, 0);
    const buy = ex.filter(x => x.source !== 'INSTALLMENT').reduce((s0, x) => s0 + x.amount, 0);
    const paid = tx.filter(x => x.type === 'TRANSFER' && x.toAccountId === a.id).reduce((s0, x) => s0 + (x.toAmount ?? x.amount), 0);
    const plans = db.installments.filter(p => p.cardId === a.id);
    const instOut = plans.reduce((s0, p) => s0 + planSummary(p).outstanding, 0);
    const instMonthly = plans.filter(p => nextInstallment(p)).reduce((s0, p) => s0 + nextInstallment(p).payment, 0);
    const lastEnd = plans.reduce((m, p) => Math.max(m, planDates(p).end || 0), 0);
    const owed = Math.max(0, -(bal[a.id] || 0)); const lim = +a.creditLimit || 0;
    const st = stmtLeft(a);
    const due = st ? { amt: st.left, date: st.date } : owed > 0 && a.dueDay ? { amt: owed, date: dayStart(Date.now()) + daysUntilDay(a.dueDay) * DAY } : null;
    return { a, buy, inst, paid, owed, instOut, instMonthly, lastEnd, lim, used: lim ? (owed + instOut) / lim * 100 : 0, avail: lim ? Math.max(0, lim - owed - instOut) : 0, due, cur: a.currency };
  });
}
function planSummary(p) {
  const rows = schedule(p); const paid = Math.min(p.paid || 0, rows.length);
  const sum = (a, k) => a.reduce((s, r) => s + r[k], 0);
  const rest = rows.slice(paid);
  return { rows, paid, monthly: rows[0] ? rows[rows.length > 1 ? 1 : 0].payment : 0, totalInterest: sum(rows, 'interest'), total: sum(rows, 'payment'),
    remaining: sum(rest, 'payment'), remainingPrincipal: sum(rest, 'principal'), remainingInterest: sum(rest, 'interest'), next: rest[0] || null,
    // المتبقي زي شاشة البنك: أصل المبلغ بعد كل الأقساط ما عدا آخر قسط اتقيّد (لسه في كشف البطاقة)
    outstanding: paid >= 2 ? rows[paid - 2].balance : paid === rows.length ? 0 : (+p.principal || 0) };
}
const nextInstallment = p => planSummary(p).next;
// بداية ونهاية التقسيط والشهور الباقية
function planDates(p) {
  const rows = schedule(p); const s = rows[0], e = rows[rows.length - 1];
  const left = rows.length - Math.min(p.paid || 0, rows.length);
  return { start: s ? s.date : p.startDate, end: e ? e.date : p.startDate, left, txt: `من ${ltr(fmtDate(s ? s.date : p.startDate))} لـ ${ltr(fmtDate(e ? e.date : p.startDate))}${left ? ` · باقي ${left} شهر` : ''}` };
}
// الأقساط التلقائية: كل ما ييجي ميعاد قسط يتسجّل على البطاقة (أو الحساب) ويتعلّم مدفوع
function runInstallments() {
  let n = 0; const now = Date.now();
  db.installments.forEach(p => {
    if (p.autoPay === false) return;
    const rows = schedule(p); let g = 0;
    while ((p.paid || 0) < rows.length && rows[p.paid || 0].date <= now && g++ < 120) {
      const r = rows[p.paid || 0];
      const accId = acc(p.cardId) ? p.cardId : (db.accounts.find(a => !a.archived && a.type !== 'CREDIT') || {}).id;
      if (accId) db.txns.push({ id: newId(), type: 'EXPENSE', amount: Math.round(r.payment * 100) / 100, accountId: accId, categoryId: (catByName('cat_installments') || {}).id || null,
        merchant: p.name, note: `قسط ${r.i}/${rows.length}`, date: r.date, source: 'INSTALLMENT', planId: p.id });
      p.paid = (p.paid || 0) + 1; n++;
    }
  });
  if (n) { save(); toast(`اتسجّل ${n} قسط تلقائي`); }
}

function renderCards() {
  const bal = balances();
  const cards = db.accounts.filter(a => a.type === 'CREDIT' && !a.archived);
  view().innerHTML = `
    ${cards.length ? cards.map(a => {
      const owed = Math.max(0, -(bal[a.id] || 0)); const lim = +a.creditLimit || 0;
      const plans = db.installments.filter(x => x.cardId === a.id);
      // البنك بيحجز باقي مبلغ التقسيط من الحد المتاح
      const blocked = plans.reduce((s, x) => s + planSummary(x).outstanding, 0);
      const p = lim ? (owed + blocked) / lim * 100 : 0;
      return `<div class="card ccard">
        <div class="row between"><b>${esc(lbl(a.name))}</b><span class="muted">${a.last4 ? '•••• ' + esc(a.last4) : ''}</span></div>
        <div class="row between" style="margin-top:14px"><div><div class="muted">المستخدم</div><div class="big2 num">${money(owed)}</div></div>
          ${lim ? `<div style="text-align:left"><div class="muted">المتاح</div><div class="big2 num">${money(Math.max(0, lim - owed - blocked))}</div></div>` : ''}</div>
        ${lim ? `<div class="bar light ${p >= 80 ? 'over' : p >= 50 ? 'warn' : ''}"><i style="width:${Math.min(100, p)}%"></i></div><div class="muted" style="margin-top:4px">${p.toFixed(0)}% من الحد ${money(lim)} ${a.currency}${p >= 30 ? ' · يُفضّل إبقاء الاستخدام أقل من 30%' : ''}</div>` : ''}
        ${stmtLeft(a) ? (() => { const st = stmtLeft(a); const dl = Math.round((dayStart(st.date) - dayStart(Date.now())) / DAY);
          return `<div class="row between" style="margin-top:10px;background:rgba(255,255,255,.12);border-radius:12px;padding:8px 10px"><div><div class="muted">مطلوب سداده ${st.paid ? '(باقي)' : ''}</div><b class="num">${money(st.left)}</b></div><div style="text-align:left"><div class="muted">قبل</div><b class="num">${fmtDate(st.date)}</b> <small class="muted">(${dl} يوم)</small></div></div>`; })() : ''}
        <div class="muted" style="margin-top:6px">${a.statementDay ? `كشف الحساب يوم ${a.statementDay}` : ''}${a.dueDay ? ` · آخر موعد سداد يوم ${a.dueDay} (بعد ${daysUntilDay(a.dueDay)} يوم)` : ''}${blocked ? ` · أقساط متبقية ${money(blocked)}` : ''}</div>
        <div class="btns"><button class="btn small" data-pay="${a.id}">سداد البطاقة</button><button class="btn small" data-plan="${a.id}">تقسيط جديد</button><button class="btn small" data-edit="${a.id}">تعديل</button></div>
      </div>`;
    }).join('') : `<div class="card empty">لا توجد بطاقات ائتمان بعد.<br>أضف بطاقة لمتابعة الحد المستخدم ومواعيد السداد والتقسيط.</div>`}
    <button class="btn primary block" id="ccNew">＋ إضافة بطاقة ائتمان</button>
    <h3 style="margin-top:18px">خطط التقسيط</h3>
    ${db.installments.some(p => nextInstallment(p)) ? (() => { const act = db.installments.filter(p => nextInstallment(p)); const mon = act.reduce((s, p) => s + nextInstallment(p).payment, 0); const last = act.map(p => planDates(p).end).sort((a, b) => b - a)[0];
      return `<div class="card"><div class="grid3"><div><span class="muted">أقساط شهرية</span><b class="num exp">${money(mon)}</b></div><div><span class="muted">${prof().salary ? 'من المرتب' : 'عدد الخطط'}</span><b class="num">${prof().salary ? Math.round(mon / prof().salary * 100) + '%' : act.length}</b></div><div><span class="muted">آخر قسط</span><b class="num">${fmtDate(last).slice(0, 7)}</b></div></div></div>`; })() : ''}
    ${db.installments.length ? db.installments.map(p => {
      const s = planSummary(p); const a = acc(p.cardId);
      return `<div class="card plan" data-p="${p.id}">
        <div class="row between"><b>${esc(p.name)}</b><span class="pill">باقي ${s.rows.length - s.paid} من ${s.rows.length}</span></div>
        <div class="muted">${a ? esc(lbl(a.name)) + ' · ' : ''}${p.method === 'REDUCING' && +p.rate ? `فائدة متناقصة ${Math.round(p.rate / 12 * 100) / 100}% شهرياً` : +p.monthlyFixed ? 'قسط ثابت' : `فائدة ثابتة ${p.rate}% سنوياً`}${p.autoPay !== false ? ' · تلقائي' : ''}</div>
        <div class="muted">📅 ${planDates(p).txt}</div>
        <div class="grid3" style="margin-top:10px">
          <div><span class="muted">القسط الشهري</span><b class="num">${money(s.monthly)}</b></div>
          <div><span class="muted">المتبقي (زي البنك)</span><b class="num">${money(s.outstanding)}</b></div>
          <div><span class="muted">القسط القادم</span><b>${s.next ? ltr(fmtDate(s.next.date)) : '✅ انتهى'}</b></div>
        </div>
        <div class="bar"><i style="width:${s.paid / s.rows.length * 100}%"></i></div>
      </div>`;
    }).join('') : '<div class="card empty">لا توجد خطط تقسيط. اضغط «تقسيط جديد» من البطاقة أو من هنا.</div>'}
    <div class="btns"><button class="btn primary" id="plImg">📷 تقسيط من صورة البنك</button><button class="btn" id="plNew">＋ خطة تقسيط</button></div>
    <p class="muted">تقدر تختار كذا صورة مرة واحدة، وكل صورة بتتحوّل لتقسيط. لو التقسيط موجود بيتحدّث بس.</p>`;
  view().querySelectorAll('[data-pay]').forEach(b => b.onclick = () => {
    const a = acc(+b.dataset.pay); const st = stmtLeft(a); const owed = st ? st.left : Math.max(0, -(balances()[a.id] || 0));
    const from = db.accounts.find(x => x.type !== 'CREDIT' && x.currency === a.currency && !x.archived);
    openTxn(null, { type: 'TRANSFER', amount: owed || '', accountId: from ? from.id : a.id, toAccountId: a.id, merchant: 'سداد ' + lbl(a.name) });
  });
  view().querySelectorAll('[data-plan]').forEach(b => b.onclick = () => editPlan(null, +b.dataset.plan));
  view().querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editAccount(acc(+b.dataset.edit), true));
  view().querySelectorAll('[data-p]').forEach(el => el.onclick = () => openPlan(db.installments.find(p => p.id === +el.dataset.p)));
  $('#ccNew').onclick = () => editAccount(null, true);
  $('#plNew').onclick = () => editPlan();
  $('#plImg').onclick = () => addPlansFromImages();
}

// ===== قراءة صورة شاشة التقسيط من تطبيق البنك (OCR على الجهاز بـ Tesseract) =====
const addMonths = (ms, k) => { const d = new Date(ms); const day = d.getDate(); const t = new Date(d.getFullYear(), d.getMonth() + k, 1, 9); t.setDate(Math.min(day, new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate())); return t.getTime(); };
let tessP = null;
function loadTess() {
  return tessP || (tessP = new Promise((res, rej) => {
    if (window.Tesseract) return res(window.Tesseract);
    const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
    sc.onload = () => res(window.Tesseract); sc.onerror = () => { tessP = null; rej(new Error('net')); }; document.head.appendChild(sc);
  }));
}
async function ocrImages(files) {
  const T = await loadTess();
  const w = await T.createWorker('eng');
  const out = [];
  for (const f of files) out.push((await w.recognize(f)).data.text);
  await w.terminate();
  return out;
}
// يطلّع بيانات التقسيط من نص الشاشة (Original amount, Monthly payment, ...)
function parseBankPlan(text) {
  const t = normDigits(text).replace(/\r/g, '');
  const num = re => { const m = re.exec(t); return m ? parseFloat(m[1].replace(/,/g, '')) : null; };
  const name = (/Merchant name\s*\n\s*([^\n]+)/i.exec(t) || [])[1];
  const rem = /Remaining\s+installments?\s*(\d+)\s*out\s*of\s*(\d+)/i.exec(t);
  const mat = /Maturity\s+date\s*\n?\s*(\d{1,2})\s*[\/.-]\s*(\d{1,2})\s*[\/.-]\s*(\d{2,4})/i.exec(t);
  const r = { name: name ? name.trim() : '', principal: num(/Original\s+amount\s*\n?\s*([\d,]+(?:\.\d+)?)/i), monthlyFixed: num(/Monthly\s+payment\s*\n?\s*([\d,]+(?:\.\d+)?)/i),
    mRate: num(/Interest\s+rate\s*\n?\s*([\d.]+)\s*%/i), outstanding: num(/st\w*\s+amount\s*\n?\s*([\d,]+(?:\.\d+)?)/i),
    remaining: rem ? +rem[1] : null, months: rem ? +rem[2] : null,
    end: mat ? new Date(+mat[3] < 100 ? 2000 + +mat[3] : +mat[3], +mat[2] - 1, +mat[1], 9).getTime() : null };
  r.ok = !!(r.principal && r.monthlyFixed && r.months && r.remaining != null && r.end);
  return r;
}
function planFromBank(x, cardId) {
  return { id: newId(), name: (x.name || 'تقسيط') + (x.principal ? ` (${Math.round(x.principal).toLocaleString('en-US')})` : ''), cardId: cardId || null, principal: x.principal || '', monthlyFixed: x.monthlyFixed || '', rate: (x.mRate || 0) * 12, method: 'REDUCING', months: x.months, fees: 0,
    startDate: addMonths(x.end, -x.months), paid: Math.max(0, x.months - x.remaining), autoPay: true, bankMode: true };
}
// إضافة تقسيط (أو أكتر) من صور شاشة البنك
function addPlansFromImages(cardId) {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
  inp.onchange = async () => {
    const files = [...inp.files]; if (!files.length) return;
    toast('بقرا الصورة... ثواني'); 
    let texts; try { texts = await ocrImages(files); } catch (e) { return toast('محتاج نت أول مرة عشان قراءة الصور'); }
    let added = 0, updated = 0; const partial = [];
    texts.forEach(tx => {
      const x = parseBankPlan(tx);
      if (!x.ok) { partial.push(x); return; }
      const card = cardId || (db.accounts.find(a => a.type === 'CREDIT' && !a.archived) || {}).id;
      const old = db.installments.find(p => Math.abs(p.principal - x.principal) < 0.01 && Math.abs((+p.monthlyFixed || 0) - x.monthlyFixed) < 0.01);
      const np = planFromBank(x, card);
      if (old) { Object.assign(old, np, { id: old.id }); updated++; } else { db.installments.push(np); added++; }
    });
    save(); runInstallments(); setTab('cards');
    if (added || updated) toast(`${added ? `اتضاف ${added} تقسيط` : ''}${added && updated ? ' و' : ''}${updated ? `اتحدّث ${updated}` : ''}`);
    if (partial.length) { const x = partial[0]; toast('مقدرتش أقرا كل الخانات، كمّلها بإيدك'); editPlanBank(Object.assign(planFromBank({ ...x, months: x.months || 12, remaining: x.remaining ?? 12, end: x.end || Date.now() }, cardId), { id: 0, name: x.name || '' }), cardId, true); }
  };
  inp.click();
}
// كود تقسيط جاهز (من الشات أو لينك): أصل_القسط_الفائدة الشهرية_تاريخ الانتهاء_الباقي_الشهور~...
function importPlanCode(code) {
  let items = String(code || '').replace(/^.*?plans=/, '').trim().split(/[~\n;]+/).map(x => x.trim()).filter(Boolean);
  let card = (db.accounts.find(a => a.type === 'CREDIT' && !a.archived) || {}).id;
  // بيانات البطاقة: card_الاسم_آخر4_الحد_يوم السداد_المستحق (غير الأقساط)
  const cs = items.find(x => /^card_/.test(x));
  if (cs) {
    items = items.filter(x => x !== cs);
    const [, nm, last4, lim, due, owed] = cs.split('_');
    let a = db.accounts.find(x => x.type === 'CREDIT' && x.last4 === last4) || db.accounts.find(x => x.type === 'CREDIT' && !x.last4 && !x.archived);
    if (!a) { a = { id: newId(), type: 'CREDIT', currency: 'EGP', archived: false }; db.accounts.push(a); }
    // الرصيد الافتتاحي بحيث رصيد البطاقة يبقى = المستحق دلوقتي بعد الحركات المسجلة عليها
    const txSum = (balances()[a.id] || 0) - (+a.initialBalance || 0);
    Object.assign(a, { name: decodeURIComponent(nm), last4, creditLimit: +lim, dueDay: +due, initialBalance: -(+owed) - txSum });
    card = a.id;
  }
  if (!card && items.length) { card = newId(); db.accounts.push({ id: card, name: 'بطاقة ائتمان', type: 'CREDIT', currency: 'EGP', initialBalance: 0, last4: '', archived: false }); }
  let added = 0, updated = 0;
  items.forEach(it => {
    const [P, mf, rate, end, rem, months, ...nm] = it.split('_');
    const d = new Date(end + 'T09:00').getTime();
    const x = { principal: +P, monthlyFixed: +mf, mRate: +rate, end: d, remaining: +rem, months: +months, name: decodeURIComponent(nm.join('_') || 'Balance Conversion Debit') };
    if (!(x.principal > 0 && x.monthlyFixed > 0 && isFinite(d) && x.months > 0)) return;
    const old = db.installments.find(p => Math.abs(p.principal - x.principal) < 0.01);
    const np = planFromBank(x, card);
    if (old) { Object.assign(old, np, { id: old.id }); updated++; } else { db.installments.push(np); added++; }
  });
  save(); runInstallments();
  return { added, updated };
}
// إدخال التقسيط بنفس خانات شاشة البنك (Transaction details)
function editPlanBank(p, cardId, prefilled) {
  const isNew = !p || prefilled;
  p = p || { name: '', cardId: cardId || (db.accounts.find(a => a.type === 'CREDIT') || {}).id || null, principal: '', rate: '', months: 12, method: 'REDUCING', fees: 0, startDate: Date.now(), paid: 0, monthlyFixed: '', autoPay: true };
  const addM = addMonths;
  const maturity = !p.id && !prefilled ? '' : fmtDate(addM(p.startDate, p.months));
  sheet(isNew ? 'تقسيط جديد (زي شاشة البنك)' : 'تعديل التقسيط', `
    <button class="btn primary block" id="bImg">📷 املا الخانات من صورة شاشة البنك</button>
    <p class="muted">أو انقل الأرقام بإيدك من شاشة التقسيط في تطبيق البنك (Transaction details).</p>
    <label class="f">الاسم (Merchant name)</label><input class="in" id="bN" value="${esc(p.name)}" placeholder="Balance Conversion">
    <label class="f">البطاقة</label><select class="in" id="bC">${accOptions(p.cardId, a => a.type === 'CREDIT')}</select>
    <div class="grid2">
      <div><label class="f">Original amount</label><input class="in num" id="bP" inputmode="decimal" value="${p.principal}"></div>
      <div><label class="f">Monthly payment</label><input class="in num" id="bMF" inputmode="decimal" value="${p.monthlyFixed || ''}"></div>
      <div><label class="f">Monthly Interest rate %</label><input class="in num" id="bR" inputmode="decimal" value="${p.rate ? Math.round(p.rate / 12 * 1000) / 1000 : ''}"></div>
      <div><label class="f">Maturity date</label><input class="in" type="date" id="bEnd" value="${maturity}"></div>
      <div><label class="f">Remaining installments</label><input class="in num" id="bRem" inputmode="numeric" value="${!p.id && !prefilled ? '' : p.months - (p.paid || 0)}"></div>
      <div><label class="f">out of (عدد الشهور)</label><input class="in num" id="bM" inputmode="numeric" value="${p.months}"></div>
    </div>
    <label class="row" style="margin-top:12px"><input type="checkbox" id="bAuto" ${p.autoPay !== false ? 'checked' : ''}> سجّل القسط تلقائياً كل شهر على البطاقة</label>
    <div class="insight" id="bPrev" style="margin-top:12px"></div>
    <div class="btns"><button class="btn primary" id="bSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="bDel">حذف</button>'}</div>
    <button class="btn block" id="bManual" style="margin-top:8px;background:none;color:var(--muted)">حساب يدوي بدل كده</button>`, body => {
    const read = () => {
      const months = parseInt(normDigits($('#bM').value)) || 12, rem = parseInt(normDigits($('#bRem').value));
      const end = new Date($('#bEnd').value + 'T09:00').getTime();
      return { ...p, name: $('#bN').value.trim() || 'تقسيط', cardId: +$('#bC').value || null, principal: parseAmount($('#bP').value) || 0, monthlyFixed: parseAmount($('#bMF').value) || 0,
        rate: (parseAmount($('#bR').value) || 0) * 12, method: 'REDUCING', months, fees: 0, startDate: isFinite(end) ? addM(end, -months) : p.startDate,
        paid: isFinite(rem) ? Math.max(0, Math.min(months, months - rem)) : p.paid || 0, autoPay: $('#bAuto').checked, bankMode: true, _endOk: isFinite(end), _remOk: isFinite(rem) };
    };
    const prev = () => { const x = read(); if (!x.principal || !x.monthlyFixed) { $('#bPrev').innerHTML = 'اكتب Original amount و Monthly payment'; return; }
      const s = planSummary(x); const d = planDates(x);
      $('#bPrev').innerHTML = `المتبقي (Outstanding) هيطلع: <b class="num">${money(s.outstanding)}</b><br>باقي ${s.rows.length - s.paid} من ${s.rows.length} · آخر قسط يتقيّد ${ltr(fmtDate(d.end))}<br>إجمالي الفوايد: <b class="num">${money(s.totalInterest)}</b>`; };
    body.querySelectorAll('input,select').forEach(i => i.addEventListener('input', prev)); prev();
    $('#bImg').onclick = () => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = async () => { if (!inp.files[0]) return; $('#bImg').textContent = '⏳ بقرا الصورة...';
        let x; try { x = parseBankPlan((await ocrImages([inp.files[0]]))[0]); } catch (e) { $('#bImg').textContent = '📷 املا الخانات من صورة شاشة البنك'; return toast('محتاج نت أول مرة عشان قراءة الصور'); }
        const set = (id, v) => { if (v != null && v !== '' && !(typeof v === 'number' && isNaN(v))) $(id).value = v; };
        set('#bN', x.name); set('#bP', x.principal); set('#bMF', x.monthlyFixed); set('#bR', x.mRate); set('#bRem', x.remaining); set('#bM', x.months); if (x.end) set('#bEnd', fmtDate(x.end));
        $('#bImg').textContent = x.ok ? '✅ اتملت من الصورة، راجعها واضغط حفظ' : '⚠️ اتملا جزء، كمّل الباقي'; prev();
        if (x.outstanding) { const s = planSummary(read()); $('#bPrev').innerHTML += `<br>${Math.abs(s.outstanding - x.outstanding) < 1 ? '✅ مطابق للبنك' : '⚠️ البنك كاتب'} Outstanding <b class="num">${money(x.outstanding)}</b>`; }
      };
      inp.click();
    };
    $('#bSave').onclick = () => {
      const x = read(); if (!(x.principal > 0) || !(x.monthlyFixed > 0)) return toast('اكتب المبلغ والقسط الشهري');
      if (!x._endOk || !x._remOk) return toast('اكتب Maturity date و Remaining installments');
      delete x._endOk; delete x._remOk; x.id = x.id || newId();
      if (prefilled && !db.installments.some(y => y.id === x.id)) x.id = newId();
      const i = db.installments.findIndex(y => y.id === x.id); if (i >= 0) db.installments[i] = x; else db.installments.push(x);
      save(); runInstallments(); closeSheet(); setTab('cards'); toast('تم حفظ التقسيط');
    };
    $('#bManual').onclick = () => editPlan(isNew ? null : p, cardId, true);
    if (!isNew) $('#bDel').onclick = () => { if (confirm('حذف خطة التقسيط؟')) { db.installments = db.installments.filter(y => y.id !== p.id); save(); closeSheet(); } };
  });
}
function editPlan(p, cardId, manual) {
  if (!manual && (p ? p.bankMode : db.accounts.some(a => a.type === 'CREDIT'))) return editPlanBank(p, cardId);
  const isNew = !p;
  p = p || { name: '', cardId: cardId || (db.accounts.find(a => a.type === 'CREDIT') || {}).id || null, principal: '', rate: '', months: 12, method: 'FLAT', fees: 0, startDate: Date.now(), paid: 0, monthlyFixed: '', autoPay: true };
  sheet(isNew ? 'خطة تقسيط جديدة' : 'تعديل خطة التقسيط', `
    <label class="f">اسم المشتريات</label><input class="in" id="pN" value="${esc(p.name)}" placeholder="مثال: موبايل، تكييف">
    <label class="f">البطاقة / الحساب</label><select class="in" id="pC"><option value="">بدون</option>${accOptions(p.cardId)}</select>
    <div class="grid2">
      <div><label class="f">أصل المبلغ (Principal)</label><input class="in num" id="pP" inputmode="decimal" value="${p.principal}"></div>
      <div><label class="f">عدد الشهور</label><input class="in num" id="pM" inputmode="numeric" value="${p.months}"></div>
      <div><label class="f">سعر الفائدة السنوي %</label><input class="in num" id="pR" inputmode="decimal" value="${p.rate}" placeholder="0 = بدون فوائد"></div>
      <div><label class="f">مصاريف إدارية</label><input class="in num" id="pF" inputmode="decimal" value="${p.fees || 0}"></div>
    </div>
    <label class="f">القسط الشهري (لو عارفه من البنك، سيبه فاضي ونحسبه)</label><input class="in num" id="pMF" inputmode="decimal" value="${p.monthlyFixed || ''}" placeholder="اختياري">
    <label class="f">طريقة حساب الفائدة</label>
    <div class="seg"><button data-m="FLAT" class="${p.method !== 'REDUCING' ? 'on' : ''}">ثابتة (Flat)</button><button data-m="REDUCING" class="${p.method === 'REDUCING' ? 'on' : ''}">متناقصة</button></div>
    <p class="muted" style="margin:6px 0 0">الثابتة: الفائدة تُحسب على أصل المبلغ كله طول المدة (أغلب البنوك في مصر). المتناقصة: تُحسب على المتبقي فقط.</p>
    <label class="f">تاريخ أول قسط</label><input class="in" type="date" id="pD" value="${fmtDate(p.startDate)}">
    <label class="row" style="margin-top:12px"><input type="checkbox" id="pAuto" ${p.autoPay !== false ? 'checked' : ''}> سجّل القسط تلقائياً كل شهر على البطاقة</label>
    ${isNew ? '<p class="muted">لو التقسيط بادئ من قبل كده، الأقساط اللي فاتت هتتعلّم مدفوعة من غير ما تتسجّل تاني.</p>' : `<label class="f">عدد الأقساط المدفوعة</label><input class="in num" id="pPaid" inputmode="numeric" value="${p.paid || 0}">`}
    <div class="insight" id="pPrev" style="margin-top:12px"></div>
    <button class="btn block" id="pBank" style="margin-top:8px">📱 أدخله زي شاشة تطبيق البنك</button>
    <div class="btns"><button class="btn primary" id="pSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="pDel">حذف</button>'}</div>`, body => {
    let method = p.method || 'FLAT';
    const read = () => ({ ...p, name: $('#pN').value.trim(), cardId: +$('#pC').value || null, principal: parseAmount($('#pP').value) || 0, months: parseInt(normDigits($('#pM').value)) || 1,
      rate: parseAmount($('#pR').value) || 0, fees: parseAmount($('#pF').value) || 0, method, startDate: new Date($('#pD').value + 'T09:00').getTime() || Date.now(),
      paid: isNew ? 0 : Math.max(0, parseInt(normDigits($('#pPaid').value)) || 0), monthlyFixed: parseAmount($('#pMF').value) || 0, autoPay: $('#pAuto').checked });
    const prev = () => { const x = read(); if (!x.principal) { $('#pPrev').innerHTML = 'أدخل أصل المبلغ لعرض القسط'; return; } const s = planSummary(x);
      const d = planDates(x);
      $('#pPrev').innerHTML = `القسط الشهري: <b class="num">${money(s.monthly)}</b><br>إجمالي الفوائد: <b class="num">${money(s.totalInterest)}</b> · الإجمالي: <b class="num">${money(s.total)}</b><br>📅 يبدأ ${ltr(fmtDate(d.start))} وينتهي ${ltr(fmtDate(d.end))}${hourRate() ? `<br>⏱️ القسط = ${workTime(s.monthly)} كل شهر` : ''}`; };
    body.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { method = b.dataset.m; body.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b)); prev(); });
    body.querySelectorAll('input,select').forEach(i => i.addEventListener('input', prev));
    prev();
    $('#pBank').onclick = () => editPlanBank(isNew ? null : Object.assign(p, { bankMode: true }), cardId);
    $('#pSave').onclick = () => {
      const x = read(); if (!x.name || !(x.principal > 0)) return toast('أدخل الاسم وأصل المبلغ');
      x.id = x.id || newId();
      if (isNew) x.paid = schedule(x).filter(r => r.date < dayStart(Date.now())).length;
      const i = db.installments.findIndex(y => y.id === x.id); if (i >= 0) db.installments[i] = x; else db.installments.push(x);
      save(); runInstallments(); closeSheet(); setTab('cards');
    };
    if (!isNew) $('#pDel').onclick = () => { if (confirm('حذف خطة التقسيط؟')) { db.installments = db.installments.filter(y => y.id !== p.id); save(); closeSheet(); } };
  });
}

function openPlan(p) {
  const s = planSummary(p);
  sheet(p.name, `
    <div class="insight">📅 ${planDates(p).txt}${p.autoPay !== false ? ' · بيتسجّل تلقائي' : ''}</div>
    <div class="grid2">
      <div class="stat"><span class="muted">أصل المبلغ</span><b class="num">${money(p.principal)}</b></div>
      <div class="stat"><span class="muted">إجمالي الفوائد</span><b class="num exp">${money(s.totalInterest)}</b></div>
      <div class="stat"><span class="muted">المتبقي (زي البنك)</span><b class="num">${money(s.outstanding)}</b></div>
      <div class="stat"><span class="muted">المتبقي من الفوائد</span><b class="num">${money(s.remainingInterest)}</b></div>
    </div>
    <div class="table-wrap"><table class="tbl"><thead><tr><th>#</th><th>التاريخ</th><th>القسط</th><th>أصل</th><th>فائدة</th><th>المتبقي</th></tr></thead><tbody>
      ${s.rows.map(r => `<tr class="${r.i <= s.paid ? 'done' : r === s.next ? 'next' : ''}"><td>${r.i <= s.paid ? '✅' : r.i}</td><td class="num">${fmtDate(r.date).slice(2)}</td><td class="num">${money(r.payment)}</td><td class="num">${money(r.principal)}</td><td class="num">${money(r.interest)}</td><td class="num">${money(r.balance)}</td></tr>`).join('')}
    </tbody></table></div>
    ${s.next ? `<label class="f">سداد القسط رقم ${s.next.i} من حساب</label><select class="in" id="ppA"><option value="">تسجيل كمدفوع فقط</option>${accOptions(p.cardId)}</select>
    <button class="btn primary block" id="ppPay" style="margin-top:10px">✅ تسجيل سداد القسط (${money(s.next.payment)})</button>` : '<div class="insight">🎉 تم سداد كل الأقساط</div>'}
    <div class="btns"><button class="btn" id="ppEdit">✏️ تعديل</button>${s.paid ? '<button class="btn" id="ppUndo">↩️ تراجع عن آخر قسط</button>' : ''}</div>`, () => {
    if ($('#ppPay')) $('#ppPay').onclick = () => {
      const aId = +$('#ppA').value;
      if (aId) db.txns.push({ id: newId(), type: 'EXPENSE', amount: Math.round(s.next.payment * 100) / 100, accountId: aId, categoryId: (catByName('cat_installments') || {}).id || null,
        merchant: p.name, note: `قسط ${s.next.i}/${s.rows.length}`, date: Date.now(), source: 'INSTALLMENT' });
      p.paid = (p.paid || 0) + 1; save(); toast('تم تسجيل القسط'); openPlan(p);
    };
    $('#ppEdit').onclick = () => editPlan(p);
    if ($('#ppUndo')) $('#ppUndo').onclick = () => { p.paid = Math.max(0, p.paid - 1); save(); openPlan(p); };
  });
}

// ================= الادخار =================
const SAVING_TIPS = [
  'ادفع لنفسك أولاً: أول ما المرتب ينزل حوّل نسبة الادخار لحساب منفصل قبل أي صرف.',
  'قاعدة الـ 30 يوم: لو عاوز تشتري حاجة مش ضرورية، استنى 30 يوم. لو لسه عاوزها اشتريها.',
  'صندوق الطوارئ أهم من أي استثمار: 3 إلى 6 شهور من مصاريفك الأساسية.',
  'سدّد الديون ذات الفائدة الأعلى الأول (غالباً كارت الائتمان)، الفائدة بتاكل أي ادخار.',
  'راجع الاشتراكات الشهرية كل 3 شهور وألغي اللي مش بتستخدمه.',
  'حدد ميزانية لكل تصنيف، والتطبيق هينبهك لما توصل 80%.',
  'لما دخلك يزيد، زوّد نسبة الادخار بنفس النسبة قبل ما مصاريفك تزيد.',
  'سدّد كارت الائتمان بالكامل قبل آخر موعد عشان ماتدفعش فوايد.'
];
function avgMonthly(type, months = 3) {
  let s = 0; for (let o = -months; o <= -1; o++) { const [f, t] = monthRange(o); s += typeTotals(inRange(f, t))[type === 'INCOME' ? 0 : 1]; } return s / months;
}
function renderSavings() {
  const [f, t] = monthRange(0);
  const month = inRange(f, t);
  let [inc, exp] = typeTotals(month);
  const avgInc = avgMonthly('INCOME'), avgExp = avgMonthly('EXPENSE');
  const incBase = inc || avgInc;
  const cats = catTotals(month, 'EXPENSE');
  let needs = 0, wants = 0;
  for (const k in cats) { const c = cat(+k); if (c && catGroup(c) === 'NEED') needs += cats[k]; else wants += cats[k]; }
  const saved = incBase - exp; const rate = incBase > 0 ? saved / incBase * 100 : 0;
  const target = db.prefs.savingRate || 20;
  const bal = balances();
  const savingsBal = db.accounts.filter(a => a.type === 'SAVING' || a.type === 'GOLD').reduce((s, a) => s + conv(bal[a.id] || 0, a.currency), 0);
  let needAvg = 0;
  for (let o = -3; o <= -1; o++) { const [a, b] = monthRange(o); const m = catTotals(inRange(a, b), 'EXPENSE'); for (const k in m) { const c = cat(+k); if (c && catGroup(c) === 'NEED') needAvg += m[k] / 3; } }
  const emergency = (needAvg || needs || avgExp) * 6;
  const em = emergency ? Math.min(100, savingsBal / emergency * 100) : 0;
  const score = Math.round(Math.max(0, Math.min(100, (Math.min(rate, 30) / 30) * 50 + (em / 100) * 30 + (incBase && needs / incBase <= .5 ? 20 : 10))));
  const wantCats = Object.entries(cats).map(([k, v]) => [cat(+k), v]).filter(([c]) => c && catGroup(c) === 'WANT').sort((a, b) => b[1] - a[1]).slice(0, 3);
  const bar = (v, tgt, cls) => `<div class="bar ${cls || ''}"><i style="width:${Math.min(100, incBase ? v / incBase * 100 / tgt * 100 : 0)}%"></i></div>`;
  const tip = SAVING_TIPS[new Date().getDate() % SAVING_TIPS.length];
  view().innerHTML = `
    <div class="card hero">
      <div class="row between"><div><div class="muted">صحتك المالية هذا الشهر</div><div class="big">${score}<small style="font-size:16px">/100</small></div></div><div class="ring" style="--p:${score}"><span>${score >= 70 ? '😎' : score >= 40 ? '🙂' : '😟'}</span></div></div>
      <div class="hero-stats"><div><span class="muted">ادّخرت</span><b class="num">${money(Math.max(0, saved))}</b></div><div><span class="muted">نسبة الادخار</span><b class="num">${rate.toFixed(0)}%</b></div><div><span class="muted">الهدف</span><b class="num">${target}%</b></div></div>
    </div>
    ${!inc && avgInc ? '<div class="insight">ℹ️ مفيش دخل مسجّل الشهر ده، فالحساب على متوسط دخلك آخر 3 شهور.</div>' : ''}
    ${!incBase ? '<div class="insight w">سجّل دخلك (المرتب مثلاً) عشان نقدر نحسب خطة الادخار. ممكن تضيفه كمعاملة متكررة شهرية.</div>' : ''}
    <div class="card"><h3>قاعدة 50 / 30 / 20</h3>
      <p class="muted" style="margin-top:0">قسّم دخلك: 50% احتياجات أساسية، 30% رغبات، 20% ادخار.</p>
      <div class="rule"><div class="row between"><span>🏠 احتياجات</span><span class="num">${money(needs)} <small class="muted">من ${money(incBase * .5)}</small></span></div>${bar(needs, 50, needs > incBase * .5 ? 'over' : '')}</div>
      <div class="rule"><div class="row between"><span>🎉 رغبات</span><span class="num">${money(wants)} <small class="muted">من ${money(incBase * .3)}</small></span></div>${bar(wants, 30, wants > incBase * .3 ? 'over' : '')}</div>
      <div class="rule"><div class="row between"><span>💰 ادخار</span><span class="num">${money(Math.max(0, saved))} <small class="muted">من ${money(incBase * target / 100)}</small></span></div>${bar(Math.max(0, saved), target, 'good')}</div>
      <p class="muted">تقدر تغيّر نوع أي تصنيف (احتياج أو رغبة) من «التصنيفات».</p>
    </div>
    <div class="card"><h3>صندوق الطوارئ</h3>
      <div class="row between"><span>رصيد حسابات التوفير والذهب</span><b class="num">${money(savingsBal)}</b></div>
      <div class="row between muted"><span>المطلوب (6 شهور احتياجات)</span><span class="num">${money(emergency)}</span></div>
      <div class="bar good"><i style="width:${em}%"></i></div>
      <p class="muted">${em >= 100 ? '✅ صندوق الطوارئ مكتمل، ابدأ وجّه الزيادة للاستثمار أو أهدافك.' : `ناقصك ${money(Math.max(0, emergency - savingsBal))}. لو ادّخرت ${money(incBase * target / 100)} شهرياً هتوصل خلال ${incBase ? Math.ceil(Math.max(0, emergency - savingsBal) / Math.max(1, incBase * target / 100)) : '—'} شهر.`}</p>
    </div>
    ${wantCats.length ? `<div class="card"><h3>فرص للتوفير</h3>${wantCats.map(([c, v]) => `<div class="insight">${c.icon} ${esc(lbl(c.name))}: صرفت <b class="num">${money(v)}</b>. لو قلّلت 20% هتوفّر <b class="num">${money(v * .2)}</b> شهرياً (${money(v * .2 * 12)} في السنة).</div>`).join('')}</div>` : ''}
    <div class="card"><h3>خطة الأهداف</h3>
      ${db.goals.length ? db.goals.map(g => { const left = Math.max(0, g.target - g.saved); const months = g.deadline ? Math.max(1, Math.ceil((g.deadline - Date.now()) / (30.44 * DAY))) : null;
        return `<div class="rule"><div class="row between"><span>${g.icon} ${esc(g.name)}</span><span class="num muted">${money(g.saved)} / ${money(g.target)}</span></div><div class="bar good"><i style="width:${Math.min(100, g.saved / g.target * 100)}%"></i></div>
        <div class="muted">${left <= 0 ? '✅ تم الهدف' : months ? `محتاج تحوّش <b class="num">${money(left / months)}</b> ${g.currency} شهرياً لمدة ${months} شهر` : `ناقص ${money(left)} ${g.currency} · حدّد تاريخ للهدف عشان نحسب القسط الشهري`}</div></div>`; }).join('') : '<p class="muted">مفيش أهداف لسه.</p>'}
      <button class="btn small" id="svGoal">＋ هدف جديد</button>
    </div>
    <div class="card"><h3>نصيحة النهارده</h3><p style="margin:0">${tip}</p></div>
    <div class="card"><h3>نسبة الادخار المستهدفة</h3>
      <div class="chips">${[10, 15, 20, 25, 30].map(v => `<button class="chip ${target === v ? 'on' : ''}" data-sr="${v}">${v}%</button>`).join('')}</div></div>`;
  $('#svGoal').onclick = () => editGoal();
  view().querySelectorAll('[data-sr]').forEach(b => b.onclick = () => { db.prefs.savingRate = +b.dataset.sr; save(); renderSavings(); });
}

// ================= رسائل البنك (الوارد) =================
function hashText(s) { let h = 5381; const t = normDigits(s).replace(/\s+/g, ' ').trim(); for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return 'h' + (h >>> 0).toString(36); }
function splitMessages(text) { return String(text || '').split(/\n\s*\n|\n?-{3,}\n?/).map(s => s.trim()).filter(Boolean); }
function matchAccount(p) {
  let a = p.last4 && db.accounts.find(x => x.last4 === p.last4);
  if (!a && p.currency) a = db.accounts.find(x => x.currency === p.currency && x.type !== 'CASH' && !x.archived) || db.accounts.find(x => x.currency === p.currency);
  return a || null;
}
function suggestionToTxn(m) {
  const p = m.parsed; const a = matchAccount(p) || db.accounts[0];
  return { type: p.kind === 'CREDIT' ? 'INCOME' : 'EXPENSE', amount: p.amount, accountId: a && a.id, categoryId: suggestCategory(p.merchant, p.kind, m.body), merchant: p.merchant, date: p.date, note: p.last4 ? '••' + p.last4 : '' };
}
// يحلل الرسائل ويضيفها للوارد (أو مباشرة للحركات عند تفعيل الإضافة التلقائية). يتجاهل المكرر.
function ingestMessages(text) {
  const known = new Set([...db.inbox.map(m => m.hash), ...db.txns.map(t => t.hash).filter(Boolean)]);
  let added = 0, auto = 0, dup = 0, skipped = 0;
  for (const body of splitMessages(text)) {
    const hash = hashText(body);
    if (known.has(hash)) { dup++; continue; }
    known.add(hash);
    const p = SMS.parse(body);
    if (!p) { skipped++; continue; }
    const m = { id: newId(), hash, body, parsed: p, status: 'PENDING', at: Date.now() };
    if (db.prefs.autoAddSms && matchAccount(p)) {
      const t = suggestionToTxn(m);
      db.txns.push({ id: newId(), ...t, hash, source: 'SMS_AUTO' });
      if (p.last4) { const a = acc(t.accountId); if (a && !a.last4) a.last4 = p.last4; }
      m.status = 'ACCEPTED'; auto++;
    } else added++;
    db.inbox.push(m);
  }
  db.inbox = db.inbox.slice(-500);
  save();
  return { added, auto, dup, skipped };
}
function reportIngest(r) {
  const parts = [];
  if (r.auto) parts.push(`تمت إضافة ${r.auto} حركة تلقائياً`);
  if (r.added) parts.push(`${r.added} رسالة للمراجعة`);
  if (r.dup) parts.push(`${r.dup} مكررة`);
  if (r.skipped) parts.push(`${r.skipped} مش حركة مالية`);
  toast(parts.join(' · ') || 'لا توجد رسائل');
}
function renderInbox() {
  const pending = db.inbox.filter(m => m.status === 'PENDING').sort((a, b) => b.parsed.date - a.parsed.date);
  const kindL = { DEBIT: 'مصروف', CREDIT: 'دخل', TRANSFER: 'تحويل', ATM: 'سحب نقدي' };
  view().innerHTML = `
    <div class="card">
      <div class="quick inside">
        <button id="ibPaste"><span class="qi">${ic('list')}</span>لصق رسائل</button>
        <button id="ibFile"><span class="qi">${ic('upload')}</span>استيراد ملف</button>
        <button id="ibHow"><span class="qi">${ic('sparkle')}</span>ربط تلقائي</button>
      </div>
      <input type="file" id="ibFileIn" accept=".txt,text/plain" class="hidden">
      <label class="row" style="margin-top:12px"><input type="checkbox" id="ibAuto" ${db.prefs.autoAddSms ? 'checked' : ''}> أضف الحركات تلقائياً بدون مراجعة (لما الحساب يتعرّف)</label>
    </div>
    <div class="row between"><h3>للمراجعة (${pending.length})</h3>${pending.length ? '<button class="btn small" id="ibIgnoreAll">تجاهل الكل</button>' : ''}</div>
    ${pending.length ? pending.map(m => { const p = m.parsed; const a = matchAccount(p);
      return `<div class="card sms">
        <div class="row between"><b class="num ${p.kind === 'CREDIT' ? 'inc' : 'exp'}">${p.kind === 'CREDIT' ? '+' : '-'}${money(p.amount)} ${p.currency || ''}</b><span class="pill">${kindL[p.kind]}</span></div>
        <div>${esc(p.merchant || '—')}</div>
        <div class="muted">${ltr(fmtDT(p.date))}${a ? ' · ' + esc(lbl(a.name)) : ''}${p.last4 ? ' · ••' + p.last4 : ''}</div>
        <details><summary class="muted">نص الرسالة</summary><div class="muted">${esc(m.body)}</div></details>
        <div class="btns"><button class="btn small primary" data-ok="${m.id}">✔︎ إضافة</button><button class="btn small" data-ign="${m.id}">تجاهل</button></div>
      </div>`; }).join('') : '<div class="card empty">مفيش رسائل للمراجعة 👌</div>'}`;
  $('#ibPaste').onclick = openSmsPaste;
  $('#ibFile').onclick = () => $('#ibFileIn').click();
  $('#ibFileIn').onchange = async e => { const f = e.target.files[0]; if (!f) return; reportIngest(ingestMessages(await f.text())); renderInbox(); };
  $('#ibHow').onclick = openSmsAutomation;
  $('#ibAuto').onchange = e => { db.prefs.autoAddSms = e.target.checked; save(); };
  if ($('#ibIgnoreAll')) $('#ibIgnoreAll').onclick = () => { pending.forEach(m => m.status = 'IGNORED'); save(); renderInbox(); };
  view().querySelectorAll('[data-ign]').forEach(b => b.onclick = () => { db.inbox.find(m => m.id === +b.dataset.ign).status = 'IGNORED'; save(); renderInbox(); });
  view().querySelectorAll('[data-ok]').forEach(b => b.onclick = () => {
    const m = db.inbox.find(x => x.id === +b.dataset.ok);
    openTxn(null, { ...suggestionToTxn(m), source: 'SMS_OK', hash: m.hash, inboxId: m.id });
  });
}
function openSmsAutomation() {
  sheet('ربط رسائل البنك تلقائياً', `
    <p>الآيفون مش بيسمح لأي تطبيق يقرأ الرسائل بنفسه، بس تقدر تخلّي تطبيق <b>الاختصارات (Shortcuts)</b> يجمع رسائل البنك أول ما توصل، وتدخل كلها للتطبيق بضغطة واحدة.</p>
    <h3>مرة واحدة بس:</h3>
    <ol class="steps">
      <li>افتح تطبيق <b>Shortcuts</b> ← تبويب <b>Automation</b> ← <b>+</b> ← <b>Message</b>.</li>
      <li>في <b>Sender</b> اختار رقم/اسم البنك (أو في <b>Message Contains</b> اكتب كلمة زي «خصم» أو «EGP»).</li>
      <li>اختار <b>Run Immediately</b> ثم Next ← <b>New Blank Automation</b>.</li>
      <li>أضف أكشن <b>Append to Text File</b>: النص = <b>Shortcut Input</b> (المحتوى Content)، والملف = <b>Shortcuts/masrfi-sms.txt</b> في iCloud Drive، وفعّل <b>Make New Line</b>.</li>
      <li>أضف بعده أكشن <b>Append to Text File</b> تاني بنص <b>---</b> لنفس الملف (فاصل بين الرسايل).</li>
    </ol>
    <h3>بعد كده:</h3>
    <p>افتح «رسائل البنك» ← <b>استيراد ملف</b> ← اختار masrfi-sms.txt. الرسائل الجديدة بس هتتضاف، والمكرر بيتجاهل تلقائياً. لو فعّلت «أضف تلقائياً» هتتسجّل كحركات على طول.</p>
    <p class="muted">نصيحة: اكتب آخر 4 أرقام من كل بطاقة في إعدادات الحساب عشان التطبيق يربط الرسالة بالحساب الصح.</p>`);
}

// ================= الإعدادات والتذكير =================
const APP_URL = location.origin + location.pathname;
function icsFor(time) {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1);
  const st = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`;
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//masrfi//MyWallet//AR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:masrfi-daily-reminder@${location.host || 'local'}`, `DTSTAMP:${now}`,
    `DTSTART:${st}`, 'DURATION:PT5M', 'RRULE:FREQ=DAILY', 'SUMMARY:💰 سجّل مصاريف النهارده في محفظتي', `URL:${APP_URL}`, `DESCRIPTION:افتح محفظتي وسجّل مصاريف اليوم: ${APP_URL}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0M', 'DESCRIPTION:سجّل مصاريف النهارده', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
function openSettings() {
  const notifOk = 'Notification' in window;
  sheet('الإعدادات', `
    <h3>المظهر</h3>
    <div class="seg" id="stTheme">${[['auto', 'تلقائي'], ['light', '☀️ فاتح'], ['dark', '🌙 داكن']].map(([k, v]) => `<button data-th="${k}" class="${(db.prefs.theme || 'auto') === k ? 'on' : ''}">${v}</button>`).join('')}</div>
    <p class="muted">«تلقائي» بيمشي مع وضع الآيفون نفسه.</p>
    <h3 style="margin-top:16px">بياناتي المالية</h3>
    <div class="list menu"><div class="item" id="stProf"><div class="ico">💼</div><div class="grow">المرتب ويوم القبض وساعات الشغل</div><span class="muted">${hasProfile() ? money(prof().salary) + ' · يوم ' + prof().payday : 'غير محدد'} ‹</span></div></div>
    <h3 style="margin-top:16px">الإشعارات</h3>
    <div class="list menu"><div class="item" id="stNotifs"><div class="ico">🔔</div><div class="grow">أنواع الإشعارات ومواعيدها</div><span class="muted">${NOTIFS.filter(n => nSet(n.id).on).length} شغال ‹</span></div></div>
    ${voiceSettingsHtml()}
    <h3 style="margin-top:16px">رسائل البنك</h3>
    <label class="row"><input type="checkbox" id="stAuto" ${db.prefs.autoAddSms ? 'checked' : ''}> إضافة حركات الرسائل تلقائياً</label>
    <button class="btn block" id="stSmsHow" style="margin-top:8px">⚡ طريقة الربط التلقائي بالاختصارات</button>
    <h3 style="margin-top:16px">ساعة أبل</h3>
    <p class="muted">تطبيقات الويب مش بتتثبت على الساعة، لكن تذكير التقويم اليومي بيظهر عليها. تطبيق ساعة كامل محتاج يتعمل كتطبيق iOS أصلي على جهاز Mac.</p>
    <h3 style="margin-top:16px">أخرى</h3>
    <div class="list menu">
      <div class="item" id="stRates"><div class="ico">💱</div><div class="grow">العملة وأسعار الصرف</div><span class="muted">${base()} ‹</span></div>
      <div class="item" id="stPin"><div class="ico">🔒</div><div class="grow">قفل PIN</div><span class="muted">${db.prefs.pinHash ? 'مفعّل' : 'غير مفعّل'} ‹</span></div>
      <div class="item" id="stBackup"><div class="ico">💾</div><div class="grow">نسخ احتياطي واستعادة</div><span class="muted">‹</span></div>
    </div>`, () => {
    document.querySelectorAll('[data-th]').forEach(b => b.onclick = () => { setTheme(b.dataset.th); document.querySelectorAll('[data-th]').forEach(x => x.classList.toggle('on', x === b)); });
    $('#stNotifs').onclick = openNotifSettings;
    $('#stAuto').onchange = e => { db.prefs.autoAddSms = e.target.checked; save(); };
    $('#stSmsHow').onclick = openSmsAutomation;
    $('#stProf').onclick = () => openOnboarding(true);
    $('#stVoices').onclick = openVoicePicker;
    $('#stVoiceOn').onchange = e => { db.prefs.voiceOff = !e.target.checked; save(); if (!db.prefs.voiceOff) speak('تم تشغيل الصوت'); else speechSynthesis && speechSynthesis.cancel(); };
    document.querySelectorAll('[data-vr]').forEach(b => b.onclick = () => { db.prefs.voiceRate = +b.dataset.vr; save(); document.querySelectorAll('[data-vr]').forEach(x => x.classList.toggle('on', x === b)); speak('ده صوتي بالسرعة دي'); });
    $('#stVoiceTest').onclick = () => speak('صرفت النهارده 250 جنيه، وفاضلك 1500 لحد القبض');
    $('#stRates').onclick = openRates; $('#stPin').onclick = openPin; $('#stBackup').onclick = openBackup;
  });
}

// ================= صرفت كام على إيه =================
const PIE_COLORS = ['#1e74d6', '#0f9d58', '#e37400', '#d93025', '#8e44ad', '#00a3a3', '#c2185b', '#7c8a9e'];
function spendCard(cats, exp, hide) {
  const rows = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  if (!rows.length || !(exp > 0)) return '';
  return `<button class="card spend-mini" id="hSpend">
    <div class="row between"><h3>صرفت على إيه الشهر ده</h3><span class="muted num">${hide ? '••••' : money(exp)} ‹</span></div>
    <div class="stack">${rows.slice(0, 6).map(([, v], i) => `<i style="width:${v / exp * 100}%;background:${PIE_COLORS[i % PIE_COLORS.length]}"></i>`).join('')}</div>
    <div class="row muted" style="gap:10px;font-size:13px">${rows.slice(0, 4).map(([id, v]) => { const c = cat(+id); return `<span>${c ? c.icon : '•'} ${(v / exp * 100).toFixed(0)}%</span>`; }).join('')}<span class="grow"></span><span>التفاصيل</span></div>
  </button>`;
}
// صفحة المصروفات: شارت في النص، تحته أيقونات التصنيفات، وتحتهم نسبة الصرف من الشهر
function openSpend(off = 0) {
  const [f, t] = monthRange(off); const list = inRange(f, t);
  const [inc, exp] = typeTotals(list);
  const cats = catTotals(list, 'EXPENSE');
  const rows = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  let a0 = 0;
  const stops = rows.map(([, v], i) => { const a = a0; a0 += v / (exp || 1) * 100; return `${PIE_COLORS[i % PIE_COLORS.length]} ${a}% ${a0}%`; }).join(',');
  const now = new Date(); const dim = new Date(new Date(f).getFullYear(), new Date(f).getMonth() + 1, 0).getDate();
  const dayN = off === 0 ? now.getDate() : dim; const timePct = dayN / dim * 100;
  const incBase = inc || prof().salary || 0; const spentPct = incBase ? exp / incBase * 100 : null;
  const pace = spentPct == null ? '' : spentPct > timePct + 5 ? `<div class="insight">صارف أسرع من الشهر: ${spentPct.toFixed(0)}% من الدخل في ${timePct.toFixed(0)}% من الشهر.</div>` : `<div class="insight">ماشي كويس: صرفك أقل من أو قد الوقت اللي عدّى من الشهر.</div>`;
  const label = new Date(f).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
  sheet('صرفت على إيه', `
    <div class="chips">${[0, -1, -2, -3].map(o => `<button class="chip ${o === off ? 'on' : ''}" data-sm="${o}">${new Date(monthRange(o)[0]).toLocaleDateString('ar-EG', { month: 'long' })}</button>`).join('')}</div>
    ${exp > 0 ? `<div class="donut big" style="background:conic-gradient(${stops})"><div><span class="muted">${label}</span><b class="num">${money(exp)}</b><span class="muted">${base()}</span></div></div>
    <div class="cat-grid">${rows.map(([id, v], i) => { const c = cat(+id); const col = PIE_COLORS[i % PIE_COLORS.length];
      return `<button class="cg" ${+id ? `data-sc="${id}"` : ''}><span class="cg-ic" style="background:${col}22;border-color:${col}">${c ? c.icon : '•'}</span><span class="ellipsis">${c ? esc(lbl(c.name)) : 'بدون تصنيف'}</span><b class="num">${money(v)}</b><span class="pct" style="color:${col}">${(v / exp * 100).toFixed(0)}%</span></button>`; }).join('')}</div>` : '<div class="empty">مفيش مصاريف متسجلة في الشهر ده.</div>'}
    <h3 style="margin-top:14px">نسبة الصرف من الشهر</h3>
    <div class="row between"><span>من الدخل${inc ? '' : ' (المرتب)'}</span><b class="num">${spentPct == null ? '—' : spentPct.toFixed(0) + '%'}</b></div>
    <div class="bar ${spentPct >= 90 ? 'over' : spentPct >= 70 ? 'warn' : ''}" style="height:10px"><i style="width:${Math.min(100, spentPct || 0)}%"></i></div>
    <div class="row between" style="margin-top:10px"><span>من أيام الشهر</span><b class="num">${dayN} / ${dim} يوم (${timePct.toFixed(0)}%)</b></div>
    <div class="bar" style="height:10px"><i style="width:${timePct}%;background:var(--muted)"></i></div>
    ${pace}`, () => {
    document.querySelectorAll('[data-sm]').forEach(b => b.onclick = () => openSpend(+b.dataset.sm));
    document.querySelectorAll('[data-sc]').forEach(el => el.onclick = () => { closeSheetQuiet(); filter = { q: '', type: 'EXPENSE', accountId: 0, categoryId: +el.dataset.sc, period: 'MONTH' }; setTab('txns'); });
  });
}

// ================= الاقتراح اليومي =================
function dailyPlan() {
  const now = new Date(); const [f, t] = monthRange(0);
  const month = inRange(f, t);
  const [inc, exp] = typeTotals(month);
  const incBase = inc || prof().salary || avgMonthly('INCOME');
  const savePct = db.prefs.savingRate || 20;
  const saveTarget = incBase * savePct / 100;
  // مدفوعات متبقية الشهر ده: المعاملات المتكررة والأقساط اللي لسه ماتدفعتش
  let upcoming = 0, upcomingN = 0;
  db.recurring.filter(r => r.active && r.type === 'EXPENSE').forEach(r => {
    let d = r.nextDate, g = 0; const x = { ...r };
    while (d <= t && g++ < 40) { if (d >= Date.now()) { upcoming += conv(r.amount, (acc(r.accountId) || {}).currency || base()); upcomingN++; } x.nextDate = d; d = advance(x); }
  });
  db.installments.forEach(p => { const n = nextInstallment(p); if (n && n.date <= t && n.date >= f) { upcoming += n.payment; upcomingN++; } });
  let daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
  let remaining = incBase - exp - saveTarget - upcoming;
  let daily = Math.max(0, remaining / daysLeft);
  // لو بيانات المرتب متسجلة: الحساب على الرصيد المتاح لحد يوم القبض
  const byPay = hasProfile();
  if (byPay) { const cp = cashPlan(); daysLeft = cp.cyc.left; remaining = cp.free; daily = cp.safeDaily; upcoming = cp.fixedDue; upcomingN = cp.ev.filter(e => e.i < cp.cyc.left && e.amt < 0).length; }
  const todaySpent = typeTotals(inRange(new Date().setHours(0, 0, 0, 0), Date.now()))[1];
  const tips = [];
  if (!incBase) tips.push({ icon: 'down', text: 'سجّل دخلك الشهري (المرتب مثلاً) عشان أقدر أحسبلك تصرف كام في اليوم.' });
  else if (remaining < 0) tips.push({ icon: 'alert', w: 1, text: `صرفك عدّى المسموح الشهر ده بـ <b class="num">${money(-remaining)}</b> بعد خصم الادخار والمدفوعات الجاية. حاول توقف الكماليات لآخر الشهر.` });
  else if (todaySpent > daily) tips.push({ icon: 'alert', w: 1, text: `صرفت النهارده <b class="num">${money(todaySpent)}</b>، وده أكتر من حدّك اليومي <b class="num">${money(daily)}</b>. خفّف بكرة شوية.` });
  else tips.push({ icon: 'coins', text: `لسه قدامك <b class="num">${money(daily - todaySpent)}</b> تقدر تصرفهم النهارده وانت ماشي على خطتك.` });
  if (upcomingN) tips.push({ icon: 'calendar', text: `عندك ${upcomingN} مدفوعات جاية ${byPay ? 'لحد القبض' : 'الشهر ده'} بإجمالي <b class="num">${money(upcoming)}</b>. سيبهم على جنب من دلوقتي.` });
  const cats = catTotals(month, 'EXPENSE'); const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const over = db.categories.filter(c => c.monthlyBudget > 0 && !c.isIncome).map(c => [c, (cats[c.id] || 0) / now.getDate() * days]).filter(([c, p]) => p > c.monthlyBudget).sort((a, b) => b[1] / b[0].monthlyBudget - a[1] / a[0].monthlyBudget)[0];
  if (over) tips.push({ icon: 'tag', w: 1, text: `مصروف ${esc(lbl(over[0].name))} ماشي إنه يوصل <b class="num">${money(over[1])}</b> والميزانية <b class="num">${money(over[0].monthlyBudget)}</b>. قلّله الأيام الجاية.` });
  else {
    let wants = 0; for (const k in cats) { const c = cat(+k); if (c && catGroup(c) === 'WANT') wants += cats[k]; }
    if (incBase && wants > incBase * .3) tips.push({ icon: 'tag', w: 1, text: `الكماليات وصلت ${(wants / incBase * 100).toFixed(0)}% من دخلك، والأفضل ماتعديش 30%.` });
  }
  if (incBase && exp + saveTarget <= incBase) tips.push({ icon: 'target', text: `حوّل <b class="num">${money(saveTarget)}</b> (${savePct}% من دخلك) لحساب التوفير أول الشهر قبل ما تصرف.` });
  tips.push({ icon: 'bulb', text: SAVING_TIPS[now.getDate() % SAVING_TIPS.length] });
  return { incBase, remaining, daily, todaySpent, daysLeft, upcoming, byPay, tips: tips.slice(0, 4) };
}
function planCard(hide) {
  const p = dailyPlan();
  if (!p.incBase && !db.txns.length) return '';
  const pct = p.daily > 0 ? Math.min(100, p.todaySpent / p.daily * 100) : 100;
  return `<div class="card plan-card">
    <div class="row between"><h3>اقتراح النهارده</h3><button class="btn small" id="hSpeak">${ic('speaker')} اسمع</button></div>
    ${p.incBase ? `<div class="daily">
      <div><span class="muted">تقدر تصرف النهارده</span><b class="num">${hide ? '••••' : money(p.daily)}</b></div>
      <div><span class="muted">صرفت النهارده</span><b class="num ${p.todaySpent > p.daily ? 'exp' : ''}">${hide ? '••••' : money(p.todaySpent)}</b></div>
      <div><span class="muted">${p.byPay ? 'متاح لحد القبض' : 'متبقي للشهر'}</span><b class="num">${hide ? '••••' : money(Math.max(0, p.remaining))}</b></div>
    </div>
    <div class="bar ${pct >= 100 ? 'over' : pct >= 75 ? 'warn' : 'good'}"><i style="width:${pct}%"></i></div>
    <div class="muted" style="margin:6px 0 10px">${p.byPay ? `باقي ${p.daysLeft} يوم على القبض · بعد خصم الثابت وحد الأمان` : `باقي ${p.daysLeft} يوم في الشهر · بعد خصم ${db.prefs.savingRate || 20}% ادخار والمدفوعات الجاية`}</div>` : ''}
    ${p.tips.map(x => insH(x.icon, x.text, x.w)).join('')}
  </div>`;
}

// ================= المتحكم المالي =================
// بيانات المرتب والقبض وساعات الشغل (بتتسأل مرة واحدة وتتعدّل من الإعدادات)
const prof = () => db.profile || {};
const hasProfile = () => !!(prof().done && prof().salary > 0);
const dayStart = ms => new Date(ms).setHours(0, 0, 0, 0);
const LIQUID = new Set(['BANK', 'CASH', 'WALLET']);
function payDate(y, m) { return new Date(y, m, Math.min(prof().payday || 1, new Date(y, m + 1, 0).getDate())).getTime(); }
// آخر يوم قبض (النهارده أو قبله) والقبض الجاي (بعد النهارده)
function payCycle() {
  const t0 = dayStart(Date.now()); const n = new Date(t0);
  let last = payDate(n.getFullYear(), n.getMonth());
  if (last > t0) last = payDate(n.getFullYear(), n.getMonth() - 1);
  const ld = new Date(last); const next = payDate(ld.getFullYear(), ld.getMonth() + 1);
  return { last, next, days: Math.round((next - last) / DAY), left: Math.max(1, Math.round((next - t0) / DAY)) };
}
// قيمة ساعة الشغل من المرتب
function hourRate() {
  const p = prof(); const h = (+p.hoursDay || 0) * (+p.daysWeek || 0) * 4.33;
  return p.salary > 0 && h > 0 ? p.salary / h : 0;
}
function workTime(amount) {
  const r = hourRate(); if (!r || !(amount > 0)) return '';
  const hrs = amount / r; const hd = +prof().hoursDay || 8;
  if (hrs < 1) return `${Math.max(1, Math.round(hrs * 60))} دقيقة شغل`;
  if (hrs < hd) return `${(Math.round(hrs * 10) / 10)} ساعة شغل`;
  const d = Math.floor(hrs / hd), h = Math.round(hrs - d * hd);
  return `${d} يوم${h ? ` و ${h} ساعة` : ''} شغل`;
}
// المبلغ كنسبة من شهر الشغل (المرتب)
function monthTime(amount) {
  const sal = +prof().salary || 0; if (!sal || !(amount > 0)) return '';
  const r = amount / sal; const days = Math.round(r * 30 * 10) / 10;
  if (r >= 1) return `${(Math.round(r * 10) / 10)} شهر شغل`;
  return `${Math.round(r * 100) || '<1'}% من شهر شغلك (≈ ${days} يوم)`;
}
// المكافئ الشهري لأي بند متكرر
const MONTH_FACTOR = { DAILY: 30.44, WEEKLY: 4.35, MONTHLY: 1, YEARLY: 1 / 12 };
const recCur = r => (acc(r.accountId) || {}).currency || base();
function fixedMonthly() {
  let s = 0;
  db.recurring.filter(r => r.active && r.type === 'EXPENSE').forEach(r => { s += conv(r.amount, recCur(r)) * (MONTH_FACTOR[r.period] || 1); });
  db.installments.forEach(p => { const n = nextInstallment(p); if (n) s += n.payment; });
  return s;
}
function occurrences(r, from, to) {
  const out = []; const x = { ...r }; let d = r.nextDate, g = 0;
  while (d <= to && g++ < 500) { if (d >= from) out.push(d); x.nextDate = d; d = advance(x); }
  return out;
}
// لما مصروف ثابت يدوي يتسجّل، الموعد الجاي بتاعه يتأجل
function markFixedPaid(r, date) {
  const tol = FIX_TOL[r.period] || 0;
  let g = 0; const end = new Date(date).setHours(23, 59, 59, 999);
  while ((r.nextDate <= end || r.nextDate - date < tol * DAY) && g++ < 400) r.nextDate = advance(r);
}
const isFixedTxn = t => !!t.fixedId || t.source === 'RECURRING' || t.source === 'INSTALLMENT';

// توقع الرصيد يوم بيوم لحد بعد القبض الجاي بشهر
function cashPlan() {
  const p = prof(); const now = Date.now(); const t0 = dayStart(now);
  const cyc = payCycle();
  const H = cyc.left + 30;
  const end = t0 + (H + 1) * DAY - 1;
  const bal = balances();
  let liquid = db.accounts.filter(a => !a.archived && LIQUID.has(a.type)).reduce((s, a) => s + conv(bal[a.id] || 0, a.currency), 0);
  const ev = [];
  const idx = d => Math.max(0, Math.round((dayStart(d) - t0) / DAY));
  const add = (d, amt, label, kind) => { const i = idx(d); if (i <= H && amt) ev.push({ i, date: d, amt, label, kind }); };
  const salaryRec = db.recurring.some(r => r.active && r.type === 'INCOME' && r.profileSalary);
  db.recurring.filter(r => r.active && acc(r.accountId)).forEach(r => {
    const from = r.auto === false ? t0 : now;
    occurrences(r, from, end).forEach(d => add(d, (r.type === 'INCOME' ? 1 : -1) * conv(r.amount, recCur(r)), r.merchant || lbl((cat(r.categoryId) || {}).name || ''), r.type === 'INCOME' ? 'in' : 'fixed'));
  });
  if (p.salary > 0) {
    for (let k = 0; k < 3; k++) {
      const nd = new Date(cyc.next); const d = payDate(nd.getFullYear(), nd.getMonth() + k);
      if (d > end) break;
      if (!salaryRec) add(d, p.salary, 'المرتب', 'in');
      if (p.saveOnPayday !== false) add(d + 1, -(p.salary * (db.prefs.savingRate || 20) / 100), 'تحويل الادخار', 'save');
    }
  }
  // أقساط البطاقة بتتدفع مع سداد البطاقة في يوم السداد اللي بعد القسط، وغيرها بتتدفع في ميعادها
  db.installments.forEach(pl => { const card = acc(pl.cardId); const viaCard = card && card.type === 'CREDIT' && card.dueDay;
    // لو الكشف متسجل، أقساط الكشف ده داخلة في مبلغه فماتتحسبش تاني
    const st = viaCard ? stmtLeft(card) : null;
    planSummary(pl).rows.slice(Math.min(pl.paid || 0, 999)).forEach(r => { const d = viaCard ? dayStart(r.date) + daysUntilDayFrom(card.dueDay, r.date) * DAY : r.date; if (st && d <= dayStart(st.date)) return; if (d >= t0 && d <= end) add(d, -conv(r.payment, card ? card.currency : base()), 'قسط ' + pl.name, 'fixed'); }); });
  db.accounts.filter(a => a.type === 'CREDIT' && !a.archived && a.dueDay).forEach(a => {
    const owed = -(bal[a.id] || 0); const st = stmtLeft(a);
    if (st) {
      // المطلوب في الكشف يتدفع في ميعاده، والباقي (مشتريات بعد الكشف) في ميعاد الشهر اللي بعده
      if (st.left > 0) add(st.date, -conv(st.left, a.currency), 'سداد كشف ' + lbl(a.name), 'fixed');
      const rest = owed - st.left; if (rest > 0) add(dayStart(st.date) + daysUntilDayFrom(a.dueDay || new Date(st.date).getDate(), st.date) * DAY, -conv(rest, a.currency), 'سداد ' + lbl(a.name), 'fixed');
    } else if (owed > 0) add(t0 + daysUntilDay(a.dueDay) * DAY, -conv(owed, a.currency), 'سداد ' + lbl(a.name), 'fixed');
  });
  db.debts.filter(d => !d.lent && d.dueDate && d.paid < d.amount && d.dueDate <= end).forEach(d => add(Math.max(d.dueDate, t0), -conv(d.amount - d.paid, d.currency), 'دين لـ ' + d.person, 'fixed'));
  db.debts.filter(d => d.lent && d.dueDate && d.paid < d.amount && d.dueDate >= t0 && d.dueDate <= end).forEach(d => add(d.dueDate, conv(d.amount - d.paid, d.currency), 'دين عند ' + d.person, 'in'));
  // المصروف المتغير اليومي: متوسط آخر 30 يوم، أو تقدير من المرتب لو مفيش تاريخ كفاية
  const hist = db.txns.filter(t => t.type === 'EXPENSE' && t.date >= t0 - 30 * DAY && t.date < t0);
  const firstTx = db.txns.reduce((m, t) => Math.min(m, t.date), now);
  // المتوسط على الأيام اللي اتسجلت بس، عشان الأيام المنسية ماتقللش المتوسط
  const histDays = Math.max(1, Math.min(Math.min(30, Math.round((t0 - dayStart(firstTx)) / DAY)), loggedDays(t0 - 30 * DAY, t0 - 1).size || 1));
  let varDaily = hist.filter(t => !isFixedTxn(t)).reduce((s, t) => s + conv(t.amount, txCur(t)), 0) / histDays;
  const estimated = histDays < 10 && p.salary > 0;
  if (estimated) varDaily = Math.max(varDaily, Math.max(0, p.salary * (1 - (db.prefs.savingRate || 20) / 100) - fixedMonthly()) / 30.44);
  const todayVar = db.txns.filter(t => t.type === 'EXPENSE' && t.date >= t0 && !isFixedTxn(t)).reduce((s, t) => s + conv(t.amount, txCur(t)), 0);
  // الأيام اللي ماتسجلتش: صرفها المتوقع بيتخصم من الرصيد عشان مايبانش أعلى من الحقيقة
  const unlogged = missedDays().reduce((s, d) => s + usualDay(d).total, 0);
  liquid -= unlogged;
  const series = []; let b = liquid;
  for (let i = 0; i <= H; i++) {
    ev.filter(e => e.i === i).forEach(e => { b += e.amt; });
    b -= i === 0 ? Math.max(0, varDaily - todayVar) : varDaily;
    series.push(b);
  }
  const L = cyc.left; // أيام لحد القبض (النهارده منهم)
  const before = ev.filter(e => e.i < L);
  const fixedDue = -before.filter(e => e.amt < 0).reduce((s, e) => s + e.amt, 0);
  const inflowDue = before.filter(e => e.amt > 0).reduce((s, e) => s + e.amt, 0);
  const cushion = p.cushion != null && p.cushion !== '' ? +p.cushion : (p.salary || 0) * 0.1;
  // الادخار المطلوب للدورة دي ولسه ماتحوّلش لحساب توفير
  const savedCycle = db.txns.filter(t => t.type === 'TRANSFER' && t.date >= cyc.last && ['SAVING', 'GOLD'].includes((acc(t.toAccountId) || {}).type)).reduce((s, t) => s + conv(t.amount, txCur(t)), 0);
  const saveLeft = p.saveOnPayday !== false && p.salary > 0 ? Math.max(0, p.salary * (db.prefs.savingRate || 20) / 100 - savedCycle) : 0;
  const free = liquid + inflowDue - fixedDue - cushion - saveLeft;
  const safeDaily = Math.max(0, free / L);
  const zeroDay = series.findIndex(v => v < 0);
  const lowIn = n => { let m = Infinity, at = 0; for (let i = 0; i < Math.min(n, series.length); i++) if (series[i] < m) { m = series[i]; at = i; } return { v: m, i: at }; };
  const low = lowIn(L), low7 = lowIn(7);
  const atPay = series[Math.max(0, L - 1)];
  const burn = varDaily + fixedMonthly() / 30.44;
  const runway = burn > 0 ? Math.floor(liquid / burn) : Infinity;
  let level = 'ok';
  if (free < 0 || (zeroDay >= 0 && zeroDay < L)) level = 'danger';
  else if (low.v < cushion || safeDaily < varDaily * 0.8) level = 'warn';
  return { liquid, cyc, H, ev: ev.sort((a, b) => a.i - b.i), series, varDaily, estimated, todayVar, fixedDue, inflowDue, cushion, saveLeft, unlogged, free, safeDaily, zeroDay, low, low7, atPay, runway, level, t0 };
}

// تنبيهات السيولة: يومي، أسبوعي، شهري
function riskAlerts(cp = cashPlan()) {
  const p = prof(); const out = []; const n = v => money(Math.round(v)).replace(/\.00$/, '');
  const dayName = i => i === 0 ? 'النهارده' : i === 1 ? 'بكرة' : new Date(cp.t0 + i * DAY).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'short' });
  const L = cp.cyc.left;
  // يومي
  const todayAll = typeTotals(inRange(cp.t0, Date.now()))[1];
  if (cp.liquid < cp.cushion) out.push({ lvl: 'danger', sc: 'يومي', text: `رصيدك المتاح <b class="num">${n(cp.liquid)}</b> تحت حد الأمان <b class="num">${n(cp.cushion)}</b>. وقّف أي صرف مش ضروري.` });
  if (cp.todayVar > cp.safeDaily && cp.safeDaily >= 0) out.push({ lvl: cp.todayVar > cp.safeDaily * 1.5 ? 'danger' : 'warn', sc: 'يومي', text: `صرفت النهارده <b class="num">${n(cp.todayVar)}</b> والآمن <b class="num">${n(cp.safeDaily)}</b> في اليوم لحد القبض.` });
  // أسبوعي
  if (cp.low7.v < 0) {
    const e = cp.ev.filter(x => x.i <= cp.low7.i && x.amt < 0).sort((a, b) => a.amt - b.amt)[0];
    out.push({ lvl: 'danger', sc: 'أسبوعي', text: `خطر سيولة: رصيدك متوقع يبقى بالسالب ${dayName(cp.low7.i)} (<b class="num">${n(cp.low7.v)}</b>)${e ? ` بسبب ${esc(e.label)}` : ''}.` });
  } else if (cp.low7.v < cp.cushion) out.push({ lvl: 'warn', sc: 'أسبوعي', text: `رصيدك هينزل تحت حد الأمان ${dayName(cp.low7.i)} (<b class="num">${n(cp.low7.v)}</b>).` });
  const wk = db.txns.filter(t => t.type === 'EXPENSE' && t.date >= cp.t0 - 6 * DAY && !isFixedTxn(t)).reduce((s, t) => s + conv(t.amount, txCur(t)), 0);
  if (cp.safeDaily > 0 && wk > cp.safeDaily * 7 * 1.15) out.push({ lvl: 'warn', sc: 'أسبوعي', text: `صرفك المتغير آخر 7 أيام <b class="num">${n(wk)}</b>، أعلى من المسموح للأسبوع <b class="num">${n(cp.safeDaily * 7)}</b>.` });
  const big = cp.ev.filter(e => e.i < 7 && e.amt < 0 && e.kind === 'fixed');
  if (big.length) out.push({ lvl: 'info', sc: 'أسبوعي', text: `مدفوعات الأسبوع ده: ${groupEv(big).slice(0, 4).map(e => `${esc(e.label)} <b class="num">${n(-e.amt)}</b> (${e.n > 1 ? e.n + ' مرات' : dayName(e.i)})`).join('، ')}.` });
  // شهري
  if (cp.zeroDay >= 0 && cp.zeroDay < L) out.push({ lvl: 'danger', sc: 'شهري', text: `خطر إفلاس: بالمعدل الحالي فلوسك هتخلص ${dayName(cp.zeroDay)}، قبل القبض بـ ${L - cp.zeroDay} يوم. محتاج توفّر حوالي <b class="num">${n(-cp.atPay)}</b>.` });
  else if (p.salary > 0 && cp.atPay < cp.cushion) out.push({ lvl: 'warn', sc: 'شهري', text: `متوقع توصل يوم القبض ومعاك <b class="num">${n(cp.atPay)}</b> بس، أقل من حد الأمان.` });
  const fm = fixedMonthly();
  if (p.salary > 0 && fm > p.salary * 0.5) out.push({ lvl: 'warn', sc: 'شهري', text: `مصاريفك الثابتة <b class="num">${n(fm)}</b> = ${Math.round(fm / p.salary * 100)}% من مرتبك. الأفضل تبقى أقل من 50%.` });
  const act = db.installments.filter(x => nextInstallment(x));
  const instM = act.reduce((s0, x) => s0 + nextInstallment(x).payment, 0);
  if (p.salary > 0 && instM > p.salary * 0.3) out.push({ lvl: 'warn', sc: 'شهري', text: `الأقساط <b class="num">${n(instM)}</b> في الشهر = ${Math.round(instM / p.salary * 100)}% من مرتبك. ماتدخلش في تقسيط جديد قبل ما حاجة تخلص.` });
  act.filter(x => planDates(x).left <= 2).forEach(x => out.push({ lvl: 'info', sc: 'شهري', text: `تقسيط «${esc(x.name)}» بيخلص ${ltr(fmtDate(planDates(x).end))}، وهيوفّرلك <b class="num">${n(nextInstallment(x).payment)}</b> كل شهر. وجّههم للادخار.` }));
  cardsSummary(...monthRange(0)).forEach(c => {
    if (c.lim && c.used >= 80) out.push({ lvl: c.used >= 95 ? 'danger' : 'warn', sc: 'شهري', text: `بطاقة ${esc(lbl(c.a.name))} مستخدم منها ${c.used.toFixed(0)}% من الحد. الأفضل تفضل تحت 30%.` });
    if (c.due && c.due.amt > 0) { const di = Math.round((dayStart(c.due.date) - cp.t0) / DAY);
      if (di >= 0 && di <= 7) out.push({ lvl: 'warn', sc: 'أسبوعي', text: `سداد بطاقة ${esc(lbl(c.a.name))} <b class="num">${n(c.due.amt)}</b> ${dayName(di)}. ماتتأخرش عشان الفوايد.` }); }
  });
  const ai = avgMonthly('INCOME'), ae = avgMonthly('EXPENSE');
  if (ai > 0 && ae > ai) out.push({ lvl: 'danger', sc: 'شهري', text: `آخر 3 شهور بتصرف أكتر من دخلك بمتوسط <b class="num">${n(ae - ai)}</b> في الشهر.` });
  if (!out.some(x => x.lvl !== 'info')) out.unshift({ lvl: 'ok', sc: 'الحالة', text: `وضعك آمن. تقدر تصرف <b class="num">${n(cp.safeDaily)}</b> في اليوم لحد القبض (${L} يوم)${cp.liquid > 0 && isFinite(cp.runway) ? `، وفلوسك تكفي ${cp.runway} يوم من غير دخل` : ''}.` });
  return out;
}
// يجمع المدفوعات المتكررة بنفس الاسم (زي المواصلات اليومية) في سطر واحد
function groupEv(list) {
  const g = {}; list.forEach(e => { const k = e.label + (e.amt > 0 ? '+' : '-'); (g[k] = g[k] || { label: e.label, n: 0, amt: 0, i: e.i, date: e.date, inflow: e.amt > 0 }); g[k].n++; g[k].amt += e.amt; });
  return Object.values(g).sort((a, b) => a.i - b.i);
}
const LVL = { danger: ['alert', 'خطر', 'over'], warn: ['alert', 'تنبيه', 'warn'], info: ['calendar', 'معلومة', ''], ok: ['check', 'تمام', 'good'] };
const alertH = a => `<div class="insight lv-${a.lvl}"><span class="ib">${ic(LVL[a.lvl][0])}</span><div class="grow"><span class="tagx">${a.sc}</span> ${a.text}</div></div>`;

// رسم توقع الرصيد (SVG بسيط)
function forecastChart(cp) {
  const s = cp.series; const W = 320, Hh = 120;
  const max = Math.max(cp.cushion, ...s, 1), min = Math.min(0, ...s);
  const y = v => (Hh - 6) - (v - min) / (max - min || 1) * (Hh - 12);
  const x = i => i / (s.length - 1) * W;
  const pts = s.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const payI = cp.cyc.left;
  return `<svg class="fc" viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" aria-label="توقع الرصيد">
    <line x1="0" x2="${W}" y1="${y(0)}" y2="${y(0)}" class="z"/>
    ${cp.cushion > 0 ? `<line x1="0" x2="${W}" y1="${y(cp.cushion)}" y2="${y(cp.cushion)}" class="c"/>` : ''}
    <line x1="${x(payI)}" x2="${x(payI)}" y1="0" y2="${Hh}" class="p"/>
    <polygon points="0,${y(min)} ${pts} ${W},${y(min)}" class="a ${cp.level}"/>
    <polyline points="${pts}" class="l ${cp.level}"/>
  </svg>
  <div class="row between muted fc-k" style="direction:ltr"><span>النهارده</span><span>القبض ${fmtDate(cp.cyc.next).slice(5)}</span><span>${fmtDate(cp.t0 + cp.H * DAY).slice(5)}</span></div>
  <div class="row muted fc-k" style="gap:12px"><span><i class="lg l"></i> الرصيد المتوقع</span><span><i class="lg c"></i> حد الأمان</span><span><i class="lg p"></i> يوم القبض</span></div>`;
}

// توزيع المرتب يوم القبض
function allocation() {
  const p = prof(); const S = p.salary || 0;
  const fixed = Math.min(S, fixedMonthly());
  const save = S * (db.prefs.savingRate || 20) / 100;
  const bal = balances();
  const savingsBal = db.accounts.filter(a => a.type === 'SAVING' || a.type === 'GOLD').reduce((s, a) => s + conv(bal[a.id] || 0, a.currency), 0);
  let needAvg = 0;
  db.recurring.filter(r => r.active && r.type === 'EXPENSE').forEach(r => { needAvg += conv(r.amount, recCur(r)) * (MONTH_FACTOR[r.period] || 1); });
  needAvg = Math.max(needAvg, avgMonthly('EXPENSE') * 0.6);
  const emTarget = needAvg * (+p.emMonths || 6);
  const emDone = emTarget > 0 && savingsBal >= emTarget;
  const emerg = emDone ? 0 : save * 0.7, invest = save - emerg;
  const free = S - fixed - save;
  return { S, fixed, save, emerg, invest, free, perDay: free / payCycle().days, emTarget, savingsBal, emDone };
}
const INVEST_IDEAS = [
  ['🏦', 'شهادات الادخار البنكية', 'عائد ثابت ومضمون، مناسبة لصندوق الطوارئ والفلوس اللي محتاجها خلال سنة أو اتنين.', 'مخاطرة قليلة'],
  ['💧', 'صناديق أسواق النقد', 'تقدر تسحب منها في أي وقت وعائدها قريب من الفايدة، بديل كويس للحساب الجاري.', 'مخاطرة قليلة'],
  ['📜', 'أذون وسندات الخزانة', 'عائد أعلى نسبياً لمدد 3 شهور لسنة، عن طريق البنك.', 'مخاطرة قليلة'],
  ['🥇', 'الذهب (سبائك أو صناديق ذهب)', 'تحوّط ضد التضخم وانخفاض الجنيه، للمدى المتوسط والطويل. خلّيه جزء مش كل الفلوس.', 'مخاطرة متوسطة'],
  ['📈', 'صناديق الأسهم أو مؤشر البورصة', 'للمدى الطويل (5 سنين أو أكتر)، استثمر مبلغ ثابت كل شهر ومتتابعش كل يوم.', 'مخاطرة أعلى']
];

function renderCtrl() {
  if (!hasProfile()) {
    view().innerHTML = `<div class="card hero"><h3>خلّي التطبيق المتحكم المالي بتاعك</h3><p style="margin:0 0 12px;opacity:.85">جاوب على 3 أسئلة بس (المرتب، يوم القبض، ساعات الشغل) عشان نحسبلك التوقعات والتنبيهات.</p><button class="btn" id="cSetup" style="background:#fff;color:var(--band-1)">ابدأ</button></div>`;
    $('#cSetup').onclick = () => openOnboarding(); return;
  }
  const cp = cashPlan(); const al = riskAlerts(cp); const a = allocation(); const p = prof();
  const hide = !!db.prefs.hideBal; const m = v => hide ? '••••' : money(v);
  const st = { ok: ['😎', 'وضعك آمن'], warn: ['😐', 'خلي بالك'], danger: ['🚨', 'خطر سيولة'] }[cp.level];
  const groups = ['يومي', 'أسبوعي', 'شهري'];
  const up = groupEv(cp.ev.filter(e => e.i < cp.cyc.left + 1 && (e.kind === 'fixed' || e.kind === 'in'))).slice(0, 8);
  view().innerHTML = `
    <div class="card hero lvl-${cp.level}">
      <div class="row between"><div><div class="muted">مؤشر السيولة</div><div class="big2">${st[1]}</div></div><div class="ring" style="--p:${{ ok: 90, warn: 50, danger: 15 }[cp.level]}"><span>${st[0]}</span></div></div>
      <div class="hero-stats">
        <div><span class="muted">الآمن في اليوم</span><b class="num">${m(cp.safeDaily)}</b></div>
        <div><span class="muted">باقي على القبض</span><b class="num">${cp.cyc.left} يوم</b></div>
        <div><span class="muted">متوقع يوم القبض</span><b class="num">${m(cp.atPay)}</b></div>
      </div>
    </div>
    <div class="card"><h3>التنبيهات</h3>
      ${al.filter(x => x.lvl === 'ok').map(alertH).join('')}
      ${groups.map(g => { const l = al.filter(x => x.sc === g); return l.length ? `<div class="section-title" style="margin:10px 2px 6px">${g}</div>${l.map(alertH).join('')}` : ''; }).join('')}
    </div>
    <div class="card"><div class="row between"><h3>توقع الرصيد</h3><span class="muted">${cp.estimated ? 'تقديري لحد ما تسجّل أكتر' : `متوسط صرفك المتغير ${money(cp.varDaily)}/يوم`}</span></div>
      ${forecastChart(cp)}
      <div class="grid3" style="margin-top:12px">
        <div class="stat"><span class="muted">المتاح الآن</span><b class="num">${m(cp.liquid)}</b></div>
        <div class="stat"><span class="muted">ثابت لحد القبض</span><b class="num exp">${m(cp.fixedDue)}</b></div>
        <div class="stat"><span class="muted">حد الأمان</span><b class="num">${m(cp.cushion)}</b></div>
      </div>
      ${cp.unlogged > 0 ? `<p class="muted">اتخصم <b class="num">${m(cp.unlogged)}</b> تقدير للأيام اللي ماسجّلتش فيها. سجّلها من الرئيسية عشان الحساب يبقى أدق.</p>` : ''}
      ${cp.saveLeft > 0 ? `<p class="muted">محجوز <b class="num">${m(cp.saveLeft)}</b> ادخار الشهر ده لسه ماتحوّلش لحساب التوفير، ومش داخل في المسموح اليومي.</p>` : ''}
    </div>
    ${(() => { const cs = cardsSummary(...monthRange(0)); if (!cs.length) return '';
      const tot = k => cs.reduce((s0, c) => s0 + conv(c[k], c.cur), 0);
      return `<div class="card"><div class="row between"><h3>البطاقات الائتمانية</h3><span class="muted">عليك ${m(tot('owed') + tot('instOut'))}</span></div>
      ${cs.map(c => { const di = c.due ? Math.round((dayStart(c.due.date) - cp.t0) / DAY) : -1; const after = di >= 0 && di < cp.series.length ? cp.series[di] : null;
        return `<div class="rule"><div class="row between"><b>💳 ${esc(lbl(c.a.name))}</b>${c.due && c.due.amt > 0 ? `<span class="num exp">${m(c.due.amt)}</span>` : '<span class="muted">مفيش مطلوب</span>'}</div>
        ${c.due && c.due.amt > 0 ? `<div class="muted">آخر ميعاد ${ltr(fmtDate(c.due.date))} (بعد ${Math.max(0, di)} يوم)${after != null ? ` · رصيدك بعد السداد متوقع <b class="num ${after < 0 ? 'exp' : ''}">${m(after)}</b>` : ''}</div>` : ''}
        ${c.lim ? `<div class="bar ${c.used >= 90 ? 'over' : c.used >= 70 ? 'warn' : ''}" style="margin-top:6px"><i style="width:${Math.min(100, c.used)}%"></i></div>
        <div class="row between muted" style="font-size:12.5px"><span>مستخدم ${c.used.toFixed(0)}% من الحد</span><span>المتاح ${m(c.avail)}</span></div>` : ''}
        <div class="row between muted" style="font-size:12.5px"><span>استخدام ${m(c.owed)} · أقساط باقية ${m(c.instOut)}</span><span>${c.instMonthly ? `قسط شهري ${m(c.instMonthly)}${c.lastEnd ? ` لحد ${ltr(fmtDate(c.lastEnd).slice(0, 7))}` : ''}` : ''}</span></div></div>`; }).join('')}
      ${p.salary > 0 && tot('instMonthly') ? insH('coins', `أقساط البطاقات <b class="num">${money(tot('instMonthly'))}</b> في الشهر = ${Math.round(tot('instMonthly') / p.salary * 100)}% من مرتبك.`) : ''}</div>`; })()}
    ${up.length ? `<div class="card"><h3>الجاي لحد القبض</h3><div class="list">${up.map(e => `<div class="item"><div class="ico">${e.amt > 0 ? '⬇️' : '📌'}</div><div class="grow"><div class="ellipsis">${esc(e.label)}</div><div class="muted">${e.n > 1 ? `${e.n} مرات من ${ltr(fmtDate(e.date))}` : ltr(fmtDate(e.date))}</div></div><div class="num ${e.amt > 0 ? 'inc' : 'exp'}">${money(Math.abs(e.amt))}</div></div>`).join('')}</div></div>` : ''}
    <div class="card"><div class="row between"><h3>توزيع المرتب</h3><span class="muted num">${money(a.S)}</span></div>
      ${[['🏠', 'مصاريف ثابتة', a.fixed, 'exp'], ['🛟', 'صندوق الطوارئ', a.emerg, 'inc'], ['📈', 'استثمار', a.invest, 'primary'], ['🛍️', 'مصروف حر', Math.max(0, a.free), 'warn']].filter(x => x[2] > 0).map(([i, t, v, c]) => `<div class="rule"><div class="row between"><span>${i} ${t}</span><span class="num">${m(v)} <small class="muted">${a.S ? Math.round(v / a.S * 100) : 0}%</small></span></div><div class="bar"><i style="width:${a.S ? v / a.S * 100 : 0}%;background:var(--${c})"></i></div></div>`).join('')}
      ${a.free < 0 ? insH('alert', `مصاريفك الثابتة والادخار أكتر من المرتب بـ <b class="num">${money(-a.free)}</b>. قلّل نسبة الادخار أو راجع الثابت.`, 1) : insH('coins', `يوم القبض: حوّل <b class="num">${money(a.save)}</b> للادخار الأول، وسيب <b class="num">${money(a.fixed)}</b> للثابت، والباقي <b class="num">${money(a.free)}</b> مصروفك الحر (حوالي <b class="num">${money(a.perDay)}</b> في اليوم).`)}
      ${a.emDone ? insH('check', 'صندوق الطوارئ مكتمل، كل الادخار يروح للاستثمار.') : a.emTarget ? insH('target', `صندوق الطوارئ: معاك <b class="num">${money(a.savingsBal)}</b> من <b class="num">${money(a.emTarget)}</b> (${p.emMonths || 6} شهور ثابت).`) : ''}
    </div>
    <div class="card"><h3>قيمة وقتك</h3>
      ${p.salary > 0 ? `<div class="row between"><span>شهر شغلك يساوي</span><b class="num">${money(p.salary)} ${base()}</b></div>
      <input class="in num" id="cHr" inputmode="decimal" placeholder="اكتب سعر حاجة عاوز تشتريها" style="margin-top:10px"><div id="cHrOut" class="muted" style="margin-top:6px"></div>
      <p class="muted">صرفت الشهر ده ${monthTime(typeTotals(inRange(...monthRange(0)))[1]) || '—'}.</p>` : '<p class="muted">اكتب مرتبك في «بياناتي المالية» عشان نحسبلك قيمة شهرك.</p>'}
    </div>
    <div class="card"><h3>أفكار للادخار والاستثمار</h3>
      ${INVEST_IDEAS.map(([i, t, d, r]) => `<div class="insight"><span style="font-size:20px">${i}</span><div class="grow"><b>${t}</b> <span class="pill">${r}</span><div class="muted">${d}</div></div></div>`).join('')}
      <p class="muted">أفكار عامة مش نصيحة استثمارية. الأولوية: صندوق الطوارئ، بعدين سداد الديون الغالية، بعدين الاستثمار.</p>
    </div>
    <div class="btns" style="margin-bottom:12px"><button class="btn" id="cFixed">${ic('repeat')} المصاريف الثابتة</button><button class="btn" id="cRep">${ic('chart')} التقرير الشهري</button></div>
    <button class="btn block" id="cProf">${ic('settings')} تعديل بياناتي المالية</button>`;
  if ($('#cHr')) $('#cHr').oninput = e => { const v = parseAmount(e.target.value); $('#cHrOut').innerHTML = v ? `= <b>${monthTime(v)}</b>` : ''; };
  $('#cFixed').onclick = openRecurring; $('#cRep').onclick = () => openMonthReport(0); $('#cProf').onclick = () => openOnboarding(true);
}
// كارت مختصر في الرئيسية
function riskCard(hide) {
  if (!hasProfile()) return db.profile && db.profile.skipped ? '' : `<div class="card reminder"><div class="row"><span class="ib warn">${ic('target')}</span><div class="grow"><b>كمّل بياناتك المالية</b><div class="muted">المرتب ويوم القبض عشان التوقعات وتنبيهات السيولة</div></div><button class="btn small primary" id="hProf">ابدأ</button></div></div>`;
  const cp = cashPlan(); const al = riskAlerts(cp).filter(a => a.lvl !== 'info').sort((a, b) => ['danger', 'warn', 'ok'].indexOf(a.lvl) - ['danger', 'warn', 'ok'].indexOf(b.lvl)).slice(0, 3);
  return `<div class="card risk lvl-${cp.level}" id="hRisk"><div class="row between"><h3>${{ ok: '✅ السيولة تمام', warn: '⚠️ تنبيه سيولة', danger: '🚨 خطر سيولة' }[cp.level]}</h3><span class="chev">${ic('chevron')}</span></div>
    ${al.map(alertH).join('')}
    <div class="muted">باقي ${cp.cyc.left} يوم على القبض · متوقع يوم القبض <b class="num">${hide ? '••••' : money(cp.atPay)}</b></div></div>`;
}

// التقرير الشهري بشكل قائمة دخل
function openMonthReport(off = 0) {
  const [f, t] = monthRange(off); const list = inRange(f, t);
  const [pf, pt] = monthRange(off - 1); const prevExp = typeTotals(inRange(pf, pt))[1];
  const incC = catTotals(list, 'INCOME');
  const ex = list.filter(x => x.type === 'EXPENSE');
  const fixedL = ex.filter(isFixedTxn), varL = ex.filter(x => !isFixedTxn(x));
  const sum = l => l.reduce((s, x) => s + conv(x.amount, txCur(x)), 0);
  const inc = Object.values(incC).reduce((s, v) => s + v, 0), fx = sum(fixedL), vr = sum(varL), exp = fx + vr, net = inc - exp;
  const vc = catTotals(varL, 'EXPENSE'), fc = catTotals(fixedL, 'EXPENSE');
  const name = id => +id && cat(+id) ? cat(+id).icon + ' ' + esc(lbl(cat(+id).name)) : 'بدون تصنيف';
  const rows = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([id, v]) => `<tr><td>${name(id)}</td><td class="num">${money(v)}</td><td class="num muted">${inc ? (v / inc * 100).toFixed(0) + '%' : ''}</td></tr>`).join('');
  const label = new Date(f).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
  const notes = [];
  if (inc) notes.push(`نسبة الادخار ${(net / inc * 100).toFixed(0)}% والهدف ${db.prefs.savingRate || 20}%.`);
  if (prevExp) { const d = (exp - prevExp) / prevExp * 100; notes.push(`المصروف ${d >= 0 ? 'زاد' : 'قلّ'} ${Math.abs(d).toFixed(0)}% عن الشهر اللي قبله.`); }
  if (inc) notes.push(`الثابت ${(fx / inc * 100).toFixed(0)}% من الدخل، والمتغير ${(vr / inc * 100).toFixed(0)}%.`);
  if (hourRate() && exp) notes.push(`المصروف ده = ${workTime(exp)}.`);
  const topV = Object.entries(vc).sort((a, b) => b[1] - a[1])[0];
  if (topV) notes.push(`أكبر بند متغير: ${name(topV[0])} (${money(topV[1])}).`);
  sheet('التقرير الشهري', `
    <div class="chips">${[0, -1, -2, -3].map(o => `<button class="chip ${o === off ? 'on' : ''}" data-mo="${o}">${new Date(monthRange(o)[0]).toLocaleDateString('ar-EG', { month: 'long' })}</button>`).join('')}</div>
    <h3 style="margin-top:12px">قائمة الدخل · ${label}</h3>
    <div class="table-wrap"><table class="tbl">
      <tr><th>البند</th><th>المبلغ (${base()})</th><th>% من الدخل</th></tr>
      <tr class="next"><td>الإيرادات</td><td class="num inc">${money(inc)}</td><td></td></tr>${rows(incC)}
      <tr class="next"><td>مصروفات ثابتة</td><td class="num exp">(${money(fx)})</td><td class="num">${inc ? (fx / inc * 100).toFixed(0) + '%' : ''}</td></tr>${rows(fc)}
      <tr class="next"><td>مصروفات متغيرة</td><td class="num exp">(${money(vr)})</td><td class="num">${inc ? (vr / inc * 100).toFixed(0) + '%' : ''}</td></tr>${rows(vc)}
      <tr class="next"><td>صافي الفائض / (العجز)</td><td class="num ${net >= 0 ? 'inc' : 'exp'}">${net < 0 ? `(${money(-net)})` : money(net)}</td><td class="num">${inc ? (net / inc * 100).toFixed(0) + '%' : ''}</td></tr>
    </table></div>
    ${(() => { const cs = cardsSummary(f, t); if (!cs.length) return '';
      return `<h3 style="margin-top:14px">البطاقات الائتمانية · ${label}</h3>
      <div class="table-wrap"><table class="tbl">
        <tr><th>البطاقة</th><th>مشتريات</th><th>أقساط</th><th>سددت</th></tr>
        ${cs.map(c => `<tr><td>💳 ${esc(lbl(c.a.name))}</td><td class="num">${money(c.buy)}</td><td class="num">${money(c.inst)}</td><td class="num inc">${money(c.paid)}</td></tr>`).join('')}
        ${cs.length > 1 ? `<tr class="next"><td>الإجمالي</td>${['buy', 'inst', 'paid'].map(k => `<td class="num">${money(cs.reduce((s0, c) => s0 + conv(c[k], c.cur), 0))}</td>`).join('')}</tr>` : ''}
      </table></div>
      ${cs.map(c => `<div class="insight"><div class="grow">💳 ${esc(lbl(c.a.name))}: عليك دلوقتي استخدام <b class="num">${money(c.owed)}</b> + أقساط باقية <b class="num">${money(c.instOut)}</b>${c.due && c.due.amt > 0 ? `، والمطلوب <b class="num">${money(c.due.amt)}</b> قبل ${ltr(fmtDate(c.due.date))}` : ''}.</div></div>`).join('')}
      <p class="muted">مشتريات وأقساط البطاقة داخلة في المصروفات فوق في الشهر اللي اتصرفت فيه، والسداد مجرد تحويل من حسابك للبطاقة.</p>`; })()}
    <h3 style="margin-top:14px">ملاحظات</h3>${notes.length ? notes.map(x => `<div class="insight">${x}</div>`).join('') : '<p class="muted">مفيش بيانات كفاية للشهر ده.</p>'}
    <div class="btns"><button class="btn" id="mrCsv">⬇️ Excel/CSV</button><button class="btn" id="mrShare">مشاركة</button></div>`, () => {
    document.querySelectorAll('[data-mo]').forEach(b => b.onclick = () => openMonthReport(+b.dataset.mo));
    const csv = () => { const r = [['البند', `المبلغ (${base()})`], ['الإيرادات', inc.toFixed(2)]];
      Object.entries(incC).forEach(([id, v]) => r.push(['  ' + name(id).replace(/^\S+ /, ''), v.toFixed(2)]));
      r.push(['مصروفات ثابتة', (-fx).toFixed(2)]); Object.entries(fc).forEach(([id, v]) => r.push(['  ' + name(id).replace(/^\S+ /, ''), (-v).toFixed(2)]));
      r.push(['مصروفات متغيرة', (-vr).toFixed(2)]); Object.entries(vc).forEach(([id, v]) => r.push(['  ' + name(id).replace(/^\S+ /, ''), (-v).toFixed(2)]));
      r.push(['صافي الفائض', net.toFixed(2)]); return r; };
    $('#mrCsv').onclick = () => downloadCsv(`income-statement-${fmtDate(f).slice(0, 7)}.csv`, csv());
    $('#mrShare').onclick = () => { const txt = `تقرير ${label}\nالدخل: ${money(inc)}\nثابت: ${money(fx)}\nمتغير: ${money(vr)}\nالصافي: ${money(net)}\n` + notes.map(x => '• ' + x.replace(/<[^>]+>/g, '')).join('\n');
      if (navigator.share) navigator.share({ text: txt }).catch(() => {}); else { navigator.clipboard && navigator.clipboard.writeText(txt); toast('اتنسخ التقرير'); } };
  });
}

// الإعداد الأول: بيتعمل مرة واحدة ويتعدّل من الإعدادات
function openOnboarding(edit) {
  const p = Object.assign({ salary: '', payday: 1, hoursDay: 8, daysWeek: 5, cushion: '', emMonths: 6, autoSalary: true, saveOnPayday: true,
    accountId: (db.accounts.find(a => !a.archived && LIQUID.has(a.type) && a.type !== 'CASH') || db.accounts.find(a => !a.archived) || {}).id }, db.profile || {});
  let savePct = db.prefs.savingRate || 20;
  const FIX = [['rent', '🏠 إيجار / قسط سكن', 'MONTHLY', 'cat_rent'], ['bills', '💡 كهرباء ومية وغاز', 'MONTHLY', 'cat_bills'], ['tel', '📱 موبايل وإنترنت', 'MONTHLY', 'cat_telecom'],
    ['family', '👨‍👩‍👧 مصروف البيت / الأسرة', 'MONTHLY', 'cat_family'], ['trans', '🚗 مواصلات يومية', 'DAILY', 'cat_transport'], ['food', '🍽️ أكل/قهوة يومي', 'DAILY', 'cat_food']];
  const fixVals = {};
  const steps = edit ? 3 : 4;
  let step = 1;
  const read = () => {
    const g = id => $(id) && $(id).value;
    if ($('#obSal')) p.salary = parseAmount(g('#obSal')) || '';
    if ($('#obDay')) p.payday = +g('#obDay');
    if ($('#obAcc')) p.accountId = +g('#obAcc');
    if ($('#obAuto')) p.autoSalary = $('#obAuto').checked;
    if ($('#obHrs')) p.hoursDay = parseAmount(g('#obHrs')) || 0;
    if ($('#obDays')) p.daysWeek = +g('#obDays');
    if ($('#obCush')) p.cushion = g('#obCush') === '' ? '' : (parseAmount(g('#obCush')) ?? '');
    if ($('#obEm')) p.emMonths = +g('#obEm');
    if ($('#obSaveDay')) p.saveOnPayday = $('#obSaveDay').checked;
    FIX.forEach(([k]) => { if ($('#fx_' + k)) fixVals[k] = $('#fx_' + k).value; });
  };
  const body = () => {
    if (step === 1) return `<p class="muted">عشان نحسب الادخار والتوقعات وتنبيهات السيولة صح.</p>
      <label class="f">المرتب الشهري (الصافي اللي بتقبضه)</label><input class="in num" id="obSal" inputmode="decimal" value="${p.salary}" placeholder="0" style="font-size:22px;text-align:center">
      <label class="f">بتقبض يوم كام في الشهر؟</label><select class="in" id="obDay">${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}" ${+p.payday === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select>
      <label class="f">المرتب بينزل في حساب</label><select class="in" id="obAcc">${accOptions(p.accountId, a => a.type !== 'CREDIT')}</select>
      <label class="row" style="margin-top:12px"><input type="checkbox" id="obAuto" ${p.autoSalary ? 'checked' : ''}> سجّل المرتب تلقائياً كل شهر يوم القبض</label>`;
    if (step === 2) return `<p class="muted">عشان نقولك كل حاجة بتشتريها تساوي كام ساعة من شغلك.</p>
      <label class="f">عدد ساعات الشغل في اليوم</label><input class="in num" id="obHrs" inputmode="decimal" value="${p.hoursDay}">
      <label class="f">أيام الشغل في الأسبوع</label><select class="in" id="obDays">${[4, 5, 6, 7].map(d => `<option ${+p.daysWeek === d ? 'selected' : ''}>${d}</option>`).join('')}</select>
      <div class="insight" id="obRate" style="margin-top:12px"></div>`;
    if (step === 3) return `<label class="f">نسبة الادخار من المرتب</label><div class="chips">${[10, 15, 20, 25, 30, 40].map(v => `<button class="chip ${savePct === v ? 'on' : ''}" data-sp="${v}">${v}%</button>`).join('')}</div>
      <label class="row" style="margin-top:10px"><input type="checkbox" id="obSaveDay" ${p.saveOnPayday !== false ? 'checked' : ''}> احسب تحويل الادخار يوم القبض في التوقعات</label>
      <label class="f">حد الأمان (أقل رصيد ماتنزلش تحته)</label><input class="in num" id="obCush" inputmode="decimal" value="${p.cushion}" placeholder="${p.salary ? Math.round(p.salary * 0.1) + ' (10% من المرتب)' : '10% من المرتب'}">
      <label class="f">صندوق الطوارئ يغطي</label><select class="in" id="obEm">${[3, 6, 9, 12].map(v => `<option value="${v}" ${+p.emMonths === v ? 'selected' : ''}>${v} شهور</option>`).join('')}</select>`;
    return `<p class="muted">المصاريف الثابتة اللي بتدفعها. اكتب المبلغ للي عندك بس، وتقدر تضيف أو تعدّل بعدين من «المصاريف الثابتة».</p>
      ${FIX.map(([k, t, per]) => `<div class="row" style="margin-top:8px"><span class="grow">${t} <small class="muted">${PERIODS[per]}</small></span><input class="in num" id="fx_${k}" inputmode="decimal" value="${fixVals[k] || ''}" placeholder="0" style="width:120px"></div>`).join('')}`;
  };
  const draw = () => sheet(`${edit ? 'بياناتي المالية' : 'أهلاً بيك في محفظتي'} (${step}/${steps})`, `
    <div class="bar" style="margin:0 0 10px"><i style="width:${step / steps * 100}%"></i></div>
    ${body()}
    <div class="btns">${step > 1 ? '<button class="btn" id="obBack">رجوع</button>' : ''}<button class="btn primary" id="obNext">${step < steps ? 'التالي' : 'حفظ'}</button></div>
    ${!edit && step === 1 ? '<button class="btn block" id="obSkip" style="margin-top:8px;background:none;color:var(--muted)">بعدين</button>' : ''}`, () => {
    if ($('#obRate')) { const upd = () => { read(); $('#obRate').innerHTML = p.salary && p.hoursDay ? `ساعة شغلك = <b class="num">${money(p.salary / (p.hoursDay * p.daysWeek * 4.33))}</b> ${base()}` : 'اكتب المرتب الأول عشان نحسب قيمة الساعة'; }; $('#obHrs').oninput = upd; $('#obDays').onchange = upd; upd(); }
    document.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { savePct = +b.dataset.sp; document.querySelectorAll('[data-sp]').forEach(x => x.classList.toggle('on', x === b)); });
    if ($('#obBack')) $('#obBack').onclick = () => { read(); step--; draw(); };
    if ($('#obSkip')) $('#obSkip').onclick = () => { db.profile = Object.assign(db.profile || {}, { skipped: true }); save(); closeSheet(); };
    $('#obNext').onclick = () => {
      read();
      if (step === 1 && !(p.salary > 0)) return toast('اكتب المرتب الشهري');
      if (step === 2 && !(p.hoursDay > 0)) return toast('اكتب عدد ساعات الشغل');
      if (step < steps) { step++; return draw(); }
      finish();
    };
  });
  const finish = () => {
    db.profile = Object.assign({}, p, { done: true, skipped: false });
    db.prefs.savingRate = savePct;
    // المرتب كمعاملة متكررة تلقائية
    let sr = db.recurring.find(r => r.profileSalary);
    if (p.autoSalary && p.accountId) {
      const now = Date.now(); const n = new Date();
      let nd = new Date(payDate(n.getFullYear(), n.getMonth())).setHours(9, 0, 0, 0);
      if (nd <= now) { const t = new Date(payDate(n.getFullYear(), n.getMonth() + 1)); nd = t.setHours(9, 0, 0, 0); }
      const rec = { id: sr ? sr.id : newId(), type: 'INCOME', amount: p.salary, accountId: p.accountId, categoryId: (catByName('cat_salary') || {}).id || null, merchant: 'المرتب', note: '',
        period: 'MONTHLY', nextDate: sr && sr.nextDate > now && sr.anchorDay === p.payday ? sr.nextDate : nd, anchorDay: p.payday, active: true, auto: true, profileSalary: true };
      if (sr) Object.assign(sr, rec); else db.recurring.push(rec);
    } else if (sr) sr.active = false;
    const accId = p.accountId || (db.accounts.find(a => !a.archived) || {}).id;
    FIX.forEach(([k, t, per, cn]) => {
      const v = parseAmount(fixVals[k] || ''); if (!(v > 0) || !accId) return;
      const name = t.replace(/^\S+\s/, '');
      if (db.recurring.some(r => r.merchant === name)) return;
      const n = new Date(); const next = per === 'DAILY' ? new Date().setHours(9, 0, 0, 0) : new Date(n.getFullYear(), n.getMonth() + 1, 1, 9).getTime();
      db.recurring.push({ id: newId(), type: 'EXPENSE', amount: v, accountId: accId, categoryId: (catByName(cn) || {}).id || null, merchant: name, note: '', period: per, nextDate: next, anchorDay: 1, active: true, auto: false });
    });
    save(); closeSheet(); toast('تم الحفظ'); if (!edit) setTab('ctrl');
  };
  draw();
}

// اقتراحات المصاريف المتكررة من الحركات (عشان تتحول لمصروف ثابت)
function repeatHints(limit = 6) {
  const since = Date.now() - 60 * DAY;
  const existing = new Set(db.recurring.map(r => merchantKey(r.merchant)));
  const groups = {};
  db.txns.filter(t => t.type === 'EXPENSE' && t.date >= since && !isFixedTxn(t)).forEach(t => {
    const k = t.merchant ? merchantKey(t.merchant) : 'c' + (t.categoryId || 0) + ':' + Math.round(t.amount);
    (groups[k] = groups[k] || []).push(t);
  });
  const hints = [];
  for (const k in groups) {
    if (existing.has(k)) continue;
    const l = groups[k].sort((a, b) => a.date - b.date);
    if (l.length < 3) continue;
    const amts = l.map(t => t.amount).sort((a, b) => a - b); const med = amts[amts.length >> 1];
    if (l.filter(t => Math.abs(t.amount - med) <= med * 0.25).length < l.length * 0.7) continue;
    const g = (l[l.length - 1].date - l[0].date) / DAY / (l.length - 1);
    const period = g <= 2.5 ? 'DAILY' : g <= 10 ? 'WEEKLY' : g <= 40 ? 'MONTHLY' : null;
    if (!period) continue;
    const last = l[l.length - 1];
    hints.push({ merchant: last.merchant || lbl((cat(last.categoryId) || {}).name || ''), amount: Math.round(med * 100) / 100, accountId: last.accountId, categoryId: last.categoryId, period, lastDate: last.date, n: l.length });
  }
  return hints.sort((a, b) => b.n - a.n).slice(0, limit);
}
// اقتراحات وقت تسجيل مصروف: الثابت اللي معاده جه + الأكثر تكراراً
function txnSuggestions() {
  const due = dueFixed().map(r => ({ label: '📌 ' + (r.merchant || lbl((cat(r.categoryId) || {}).name || '')), amount: r.amount, categoryId: r.categoryId, merchant: r.merchant, accountId: r.accountId, fixedId: r.id }));
  const seen = new Set(due.map(d => merchantKey(d.merchant)));
  const groups = {};
  db.txns.filter(t => t.type === 'EXPENSE' && t.merchant && t.date >= Date.now() - 60 * DAY).forEach(t => { const k = merchantKey(t.merchant); (groups[k] = groups[k] || []).push(t); });
  const freq = Object.entries(groups).filter(([k, l]) => l.length >= 2 && !seen.has(k)).sort((a, b) => b[1].length - a[1].length).slice(0, 6)
    .map(([, l]) => { const x = l.reduce((a, b) => b.date > a.date ? b : a); return { label: (cat(x.categoryId) || {}).icon ? cat(x.categoryId).icon + ' ' + x.merchant : x.merchant, amount: x.amount, categoryId: x.categoryId, merchant: x.merchant, accountId: x.accountId }; });
  const all = [...due, ...freq];
  if (!all.length) return '';
  return `<label class="f">${due.length ? 'مصاريف ثابتة معادها جه واقتراحات' : 'اقتراحات من مصاريفك المتكررة'}</label><div class="chips">${all.map(g => `<button class="chip ${g.fixedId ? 'fx' : ''}" data-sg='${esc(JSON.stringify(g))}'>${esc(g.label)} · <span class="num">${money(g.amount).replace(/\.00$/, '')}</span></button>`).join('')}</div>`;
}
const FIX_TOL = { DAILY: 0, WEEKLY: 3, MONTHLY: 10, YEARLY: 30 };
// يربط المصروف ببند ثابت: من الاقتراح، أو «مصروف ثابت»، أو نفس اسم التاجر
function linkFixed(rec, isNew, make) {
  if (rec.fixedId) { const r = db.recurring.find(x => x.id === rec.fixedId); if (r && isNew && r.auto === false) markFixedPaid(r, rec.date); return; }
  if (make) {
    const x = { period: make.period, nextDate: rec.date, anchorDay: new Date(rec.date).getDate() };
    const r = { id: newId(), type: 'EXPENSE', amount: rec.amount, accountId: rec.accountId, categoryId: rec.categoryId, merchant: rec.merchant || lbl((cat(rec.categoryId) || {}).name || 'مصروف ثابت'), note: '',
      period: make.period, anchorDay: x.anchorDay, nextDate: advance(x), active: true, auto: make.auto };
    db.recurring.push(r); rec.fixedId = r.id; return;
  }
  if (!isNew || !rec.merchant) return;
  const k = merchantKey(rec.merchant);
  const r = db.recurring.find(x => x.active && x.auto === false && x.type === 'EXPENSE' && merchantKey(x.merchant) === k && x.nextDate <= new Date(rec.date).setHours(23, 59, 59, 999) + (FIX_TOL[x.period] || 0) * DAY);
  if (r) { rec.fixedId = r.id; markFixedPaid(r, rec.date); }
}

// المصاريف الثابتة اليدوية اللي معادها جه ولسه ماتسجلتش
const dueFixed = () => db.recurring.filter(r => r.active && r.auto === false && r.type === 'EXPENSE' && r.nextDate <= new Date().setHours(23, 59, 59, 999));

// تنبيه بالإشعار مرة في اليوم لو في خطر سيولة
async function checkRiskNotify() {
  if (!hasProfile() || !('Notification' in window) || Notification.permission !== 'granted') return;
  const today = fmtDate(Date.now()); if (db.prefs.lastRiskNote === today) return;
  const a = riskAlerts().find(x => x.lvl === 'danger'); if (!a) return;
  db.prefs.lastRiskNote = today; save();
  try { const reg = await navigator.serviceWorker.getRegistration(); reg.showNotification('محفظتي: خطر سيولة', { body: a.text.replace(/<[^>]+>/g, ''), icon: 'icons/icon-192.png', tag: 'risk' }); } catch (e) { }
}

// ================= الإشعارات =================
// كل نوع ليه تشغيل/إيقاف وإعداد (وقت أو أيام أو نسبة). الإشعار بيظهر على الموبايل لو مسموح، وبيتسجّل في صندوق الإشعارات جوه التطبيق.
const NOTIFS = [
  { id: 'daily', i: '📝', t: 'تذكير تسجيل المصاريف', d: 'لو ماسجّلتش ولا حركة لحد الوقت ده', set: { k: 'time', def: '21:00', l: 'الساعة' } },
  { id: 'missed', i: '📅', t: 'أيام ماتسجلتش', d: 'لو فيه أيام فاتت من غير تسجيل', set: { k: 'num', def: 2, l: 'بعد كام يوم' } },
  { id: 'risk', i: '🚨', t: 'خطر السيولة', d: 'لو رصيدك متوقع يخلص قبل القبض أو ينزل تحت حد الأمان' },
  { id: 'overspend', i: '🔥', t: 'صرف النهارده عالي', d: 'لو صرفك النهارده عدّى المسموح اليومي' },
  { id: 'big', i: '💸', t: 'مصروف كبير غير عادي', d: 'لو سجّلت مصروف أكبر من متوسط مصاريفك بكتير', set: { k: 'num', def: 3, l: 'أكبر من المتوسط بكام مرة' } },
  { id: 'budget', i: '📊', t: 'تجاوز الميزانية', d: 'لما توصل لنسبة من ميزانية أي تصنيف', set: { k: 'num', def: 80, l: 'النسبة %' } },
  { id: 'card', i: '💳', t: 'سداد البطاقة', d: 'قبل آخر ميعاد سداد للبطاقة', set: { k: 'num', def: 3, l: 'قبلها بكام يوم' } },
  { id: 'cardUse', i: '📈', t: 'استخدام البطاقة', d: 'لو استخدام البطاقة عدّى نسبة من الحد', set: { k: 'num', def: 80, l: 'النسبة %' } },
  { id: 'fixed', i: '📌', t: 'مصروف ثابت مستحق', d: 'الإيجار والفواتير والاشتراكات قبل ميعادها', set: { k: 'num', def: 1, l: 'قبلها بكام يوم' } },
  { id: 'inst', i: '🧾', t: 'الأقساط', d: 'قسط جاي، أو تقسيط قرب يخلص', set: { k: 'num', def: 2, l: 'قبلها بكام يوم' } },
  { id: 'debt', i: '🤝', t: 'الديون والسلف', d: 'دين عليك أو ليك ميعاده قرب', set: { k: 'num', def: 2, l: 'قبلها بكام يوم' } },
  { id: 'payday', i: '💰', t: 'يوم القبض', d: 'تفكير بتوزيع المرتب وتحويل الادخار' },
  { id: 'goal', i: '🎯', t: 'أهداف الادخار', d: 'لما توصل لهدف أو تقرب منه' },
  { id: 'weekly', i: '🗓️', t: 'ملخص الأسبوع', d: 'صرفت كام الأسبوع ده مقارنة بالمسموح', set: { k: 'day', def: 5, l: 'اليوم' } },
  { id: 'monthly', i: '📑', t: 'ملخص الشهر', d: 'أول يوم في الشهر: دخل ومصروف وادخار الشهر اللي فات' },
];
const WDAYS = ['الأحد', 'الاتنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة', 'السبت'];
const nSet = id => { db.prefs.notif = db.prefs.notif || {}; const n = NOTIFS.find(x => x.id === id); const c = db.prefs.notif[id] || {};
  return { on: c.on !== false, v: c.v != null && c.v !== '' ? c.v : id === 'daily' ? (db.prefs.reminderTime || n.set.def) : n.set ? n.set.def : null }; };
const nUnread = () => (db.notifLog || []).filter(x => !x.read).length;
function nBadge() { const b = $('#bellBtn'); if (!b) return; const n = nUnread(); b.innerHTML = ic('bell') + (n ? `<i class="nb">${n > 9 ? '9+' : n}</i>` : ''); }
async function pushNote(key, title, body, go) {
  db.prefs.nSent = db.prefs.nSent || {}; if (db.prefs.nSent[key]) return false;
  db.prefs.nSent[key] = Date.now();
  db.notifLog = db.notifLog || []; db.notifLog.unshift({ id: newId(), date: Date.now(), title, body, go: go || '', read: false }); db.notifLog.length = Math.min(db.notifLog.length, 60);
  if ('Notification' in window && Notification.permission === 'granted') {
    try { const reg = await navigator.serviceWorker.getRegistration(); const o = { body, icon: 'icons/icon-192.png', tag: key };
      if (reg) reg.showNotification(title, o); else new Notification(title, o); } catch (e) { }
  }
  return true;
}
// بيرجّع الإشعارات المستحقة دلوقتي، كل واحد بمفتاح فريد عشان مايتكررش
function dueNotifs(now = Date.now()) {
  const out = []; const t0 = dayStart(now); const today = fmtDate(now); const d = new Date(now);
  const add = (id, key, title, body, go) => out.push({ key: id + ':' + key, title, body, go });
  const on = id => nSet(id).on; const v = id => nSet(id).v;
  const n0 = x => money(Math.round(x)).replace(/\.00$/, '');
  const inDays = (ts, k) => { const di = Math.round((dayStart(ts) - t0) / DAY); return di >= 0 && di <= k ? di : -1; };
  const when = di => di === 0 ? 'النهارده' : di === 1 ? 'بكرة' : di === 2 ? 'بعد يومين' : `بعد ${di} أيام`;
  if (on('daily')) { const [h, m] = String(v('daily')).split(':').map(Number);
    if (d.getHours() * 60 + d.getMinutes() >= h * 60 + m && !db.txns.some(t => t.date >= t0) && !noSpend().includes(dayKey(now))) add('daily', today, '📝 سجّل مصاريف النهارده', 'ماسجّلتش ولا حركة النهارده. سجّلها دلوقتي عشان حساباتك تفضل مظبوطة.', 'home'); }
  if (on('missed')) { const md = missedDays(); if (md.length >= +v('missed')) add('missed', today, '📅 فيه أيام ماتسجلتش', `فيه ${md.length} يوم من غير مصاريف متسجلة. افتح وسجّلهم أو استخدم «يومي العادي».`, 'home'); }
  const prof0 = hasProfile(); const cp = prof0 && (on('risk') || on('overspend') || on('weekly')) ? cashPlan() : null;
  if (cp && on('risk')) { const a = riskAlerts(cp).find(x => x.lvl === 'danger'); if (a) add('risk', today, '🚨 خطر سيولة', a.text.replace(/<[^>]+>/g, ''), 'ctrl'); }
  if (cp && on('overspend') && cp.safeDaily >= 0 && cp.todayVar > cp.safeDaily && cp.todayVar > 0) add('overspend', today, '🔥 صرفت كتير النهارده', `صرفت ${n0(cp.todayVar)} والمسموح ${n0(cp.safeDaily)} في اليوم لحد القبض.`, 'ctrl');
  if (on('big')) { const ex = db.txns.filter(t => t.type === 'EXPENSE' && !isFixedTxn(t) && t.date >= t0 - 90 * DAY && t.date < t0);
    const avg = ex.length >= 10 ? ex.reduce((s0, t) => s0 + conv(t.amount, txCur(t)), 0) / ex.length : 0;
    if (avg) db.txns.filter(t => t.type === 'EXPENSE' && !isFixedTxn(t) && t.date >= t0 - DAY && conv(t.amount, txCur(t)) > avg * +v('big')).forEach(t =>
      add('big', t.id, '💸 مصروف كبير', `${t.merchant || lbl((cat(t.categoryId) || {}).name || '')} ${n0(conv(t.amount, txCur(t)))}، ده ${Math.round(conv(t.amount, txCur(t)) / avg)} أضعاف متوسط مصروفك.`, 'txns')); }
  if (on('budget')) { const [f, t] = monthRange(0); const cats = catTotals(inRange(f, t), 'EXPENSE'); const th = +v('budget');
    db.categories.filter(c => c.monthlyBudget > 0).forEach(c => { const p = (cats[c.id] || 0) / c.monthlyBudget * 100;
      if (p >= 100) add('budget', `${c.id}:${fmtDate(f)}:100`, '📊 ميزانية خلصت', `عدّيت ميزانية ${lbl(c.name)}: صرفت ${n0(cats[c.id])} من ${n0(c.monthlyBudget)}.`, 'home');
      else if (p >= th) add('budget', `${c.id}:${fmtDate(f)}:${th}`, '📊 قربت من الميزانية', `صرفت ${Math.round(p)}% من ميزانية ${lbl(c.name)}.`, 'home'); }); }
  if (on('card') || on('cardUse')) cardsSummary(...monthRange(0)).forEach(c => {
    if (on('card') && c.due && c.due.amt > 0) { const di = inDays(c.due.date, +v('card')); if (di >= 0) add('card', `${c.a.id}:${fmtDate(c.due.date)}:${di === 0 ? 0 : 1}`, '💳 سداد البطاقة', `مطلوب ${n0(c.due.amt)} لبطاقة ${lbl(c.a.name)} ${when(di)} (${ltr(fmtDate(c.due.date))}).`, 'cards'); }
    if (on('cardUse') && c.lim && c.used >= +v('cardUse')) add('cardUse', `${c.a.id}:${today.slice(0, 7)}`, '📈 استخدام البطاقة عالي', `مستخدم ${Math.round(c.used)}% من حد بطاقة ${lbl(c.a.name)}. المتاح ${n0(c.avail)}.`, 'cards'); });
  if (on('fixed')) { const k = +v('fixed');
    db.recurring.filter(r => r.active && r.type === 'EXPENSE' && acc(r.accountId)).forEach(r => occurrences(r, t0, t0 + (k + 1) * DAY - 1).forEach(ts => { const di = inDays(ts, k);
      if (di >= 0) add('fixed', `${r.id}:${fmtDate(ts)}`, '📌 مصروف ثابت', `${r.merchant || lbl((cat(r.categoryId) || {}).name || '')} ${n0(conv(r.amount, recCur(r)))} ${when(di)}.`, 'ctrl'); })); }
  if (on('inst')) { const k = +v('inst');
    db.installments.forEach(pl => { const nx = nextInstallment(pl); if (!nx) return; const di = inDays(nx.date, k);
      if (di >= 0) add('inst', `${pl.id}:${nx.i}`, '🧾 قسط جاي', `قسط ${pl.name} ${n0(nx.payment)} ${when(di)}.`, 'cards');
      const pd = planDates(pl); if (pd.left === 1) add('inst', `${pl.id}:last`, '🎉 آخر قسط', `ده آخر قسط في «${pl.name}». من الشهر الجاي هيوفّرلك ${n0(nx.payment)}، وجّههم للادخار.`, 'cards'); }); }
  if (on('debt')) { const k = +v('debt');
    db.debts.filter(x => x.dueDate && x.paid < x.amount).forEach(x => { const di = inDays(x.dueDate, k); const late = dayStart(x.dueDate) < t0;
      if (di >= 0 || late) add('debt', `${x.id}:${late ? 'late:' + today : di === 0 ? 0 : 1}`, x.lent ? '🤝 فلوس ليك' : '🤝 دين عليك', `${x.lent ? `${x.person} عليه ليك` : `عليك لـ ${x.person}`} ${n0(x.amount - x.paid)} ${late ? 'وميعاده عدّى' : when(di)}.`, 'more'); }); }
  if (on('payday') && prof0 && prof().salary > 0) { const c = payCycle(); if (dayStart(c.last) === t0) { const a = allocation();
    add('payday', today, '💰 النهارده يوم القبض', `حوّل ${n0(a.save)} للادخار الأول، وسيب ${n0(a.fixed)} للثابت، والباقي ${n0(a.free)} مصروفك (≈ ${n0(a.perDay)} في اليوم).`, 'ctrl'); } }
  if (on('goal')) db.goals.forEach(g => { if (!(g.target > 0)) return; const p = g.saved / g.target * 100;
    if (p >= 100) add('goal', `${g.id}:100`, '🎯 هدف اتحقق', `مبروك! وصلت لهدف «${g.name}».`, 'more');
    else if (p >= 80) add('goal', `${g.id}:80`, '🎯 قربت من هدفك', `وصلت ${Math.round(p)}% من هدف «${g.name}». فاضل ${n0(g.target - g.saved)}.`, 'more'); });
  if (on('weekly') && d.getDay() === +v('weekly') && d.getHours() >= 18) {
    const wk = db.txns.filter(t => t.type === 'EXPENSE' && t.date >= t0 - 6 * DAY).reduce((s0, t) => s0 + conv(t.amount, txCur(t)), 0);
    add('weekly', today, '🗓️ ملخص الأسبوع', `صرفت ${n0(wk)} آخر 7 أيام${cp ? `، والمسموح ليك حوالي ${n0(cp.safeDaily * 7)} في الأسبوع` : ''}.`, 'reports'); }
  if (on('monthly') && d.getDate() === 1) { const [f, t] = monthRange(-1); const [inc, exp] = typeTotals(inRange(f, t));
    add('monthly', fmtDate(f), '📑 ملخص الشهر اللي فات', `دخل ${n0(inc)}، مصروف ${n0(exp)}${inc ? `، ادخرت ${Math.round((inc - exp) / inc * 100)}%` : ''}.`, 'ctrl'); }
  return out;
}
let nBusy = false;
async function checkNotifs() {
  if (nBusy) return; nBusy = true;
  try { let n = 0; for (const x of dueNotifs()) if (await pushNote(x.key, x.title, x.body, x.go)) n++;
    // تنضيف المفاتيح القديمة
    const lim = Date.now() - 120 * DAY; Object.keys(db.prefs.nSent || {}).forEach(k => { if (db.prefs.nSent[k] < lim) delete db.prefs.nSent[k]; });
    if (n) { save(); nBadge(); } } catch (e) { console.error(e); }
  nBusy = false;
}
function openNotifs() {
  const log = db.notifLog || [];
  sheet('الإشعارات', `
    ${log.length ? `<div class="list">${log.map(x => `<div class="item ${x.read ? '' : 'unread'}" data-ngo="${x.go}"><div class="grow"><b>${esc(x.title)}</b><div class="muted">${esc(x.body)}</div><div class="muted" style="font-size:11.5px">${ltr(new Date(x.date).toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }))}</div></div></div>`).join('')}</div>` : '<div class="empty">مفيش إشعارات لسه.</div>'}
    <div class="btns"><button class="btn" id="nSet">⚙️ إعدادات الإشعارات</button>${log.length ? '<button class="btn" id="nClr">مسح الكل</button>' : ''}</div>`, () => {
    log.forEach(x => x.read = true); save(); nBadge();
    document.querySelectorAll('[data-ngo]').forEach(el => el.onclick = () => { const g = el.dataset.ngo; if (g) { closeSheetQuiet(); setTab(g); } });
    $('#nSet').onclick = openNotifSettings;
    if ($('#nClr')) $('#nClr').onclick = () => { db.notifLog = []; save(); openNotifs(); };
  });
}
function openNotifSettings() {
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  const ctl = n => { if (!n.set) return ''; const val = nSet(n.id).v;
    if (n.set.k === 'time') return `<input class="in sm" type="time" data-nv="${n.id}" value="${val}">`;
    if (n.set.k === 'day') return `<select class="in sm" data-nv="${n.id}">${WDAYS.map((w, i) => `<option value="${i}" ${+val === i ? 'selected' : ''}>${w}</option>`).join('')}</select>`;
    return `<input class="in sm num" inputmode="numeric" data-nv="${n.id}" value="${val}">`; };
  sheet('إعدادات الإشعارات', `
    ${perm === 'granted' ? '<div class="insight"><div class="grow">✅ إشعارات الموبايل شغالة.</div></div>' : perm === 'unsupported' ? '<div class="insight"><div class="grow">المتصفح ده مش بيدعم الإشعارات. الإشعارات هتظهر جوه التطبيق في 🔔 بس. على الآيفون ضيف التطبيق للشاشة الرئيسية الأول.</div></div>' : '<button class="btn primary block" id="nPerm">🔔 تفعيل إشعارات الموبايل</button>'}
    <div class="row" style="gap:8px;margin:10px 0"><button class="btn small" id="nAllOn">تشغيل الكل</button><button class="btn small" id="nAllOff">إيقاف الكل</button><button class="btn small" id="nTest">جرّب إشعار</button></div>
    <div class="list nset">${NOTIFS.map(n => { const c = nSet(n.id); return `<div class="item"><div class="ico">${n.i}</div><div class="grow"><b>${n.t}</b><div class="muted">${n.d}</div>
      ${n.set ? `<label class="row muted" style="gap:8px;margin-top:6px;font-size:12.5px;white-space:nowrap">${n.set.l} ${ctl(n)}</label>` : ''}</div>
      <label class="sw-t"><input type="checkbox" data-non="${n.id}" ${c.on ? 'checked' : ''}><span></span></label></div>`; }).join('')}</div>
    <h3 style="margin-top:14px">لما التطبيق يكون مقفول</h3>
    <p class="muted">الآيفون مش بيسمح لتطبيقات الويب تبعت إشعار وهي مقفولة خالص. عشان كده تقدر تضيف المواعيد المهمة (تذكير التسجيل، سداد البطاقات، الأقساط، المصاريف الثابتة، يوم القبض) لتقويم الآيفون، وهي تنبّهك في ميعادها حتى على ساعة أبل.</p>
    <button class="btn block" id="nIcs">📅 إضافة المواعيد للتقويم</button>`, () => {
    db.prefs.notif = db.prefs.notif || {};
    const setP = (id, k, val) => { db.prefs.notif[id] = { ...(db.prefs.notif[id] || {}), [k]: val }; if (id === 'daily' && k === 'v') db.prefs.reminderTime = val; save(); };
    document.querySelectorAll('[data-non]').forEach(el => el.onchange = () => setP(el.dataset.non, 'on', el.checked));
    document.querySelectorAll('[data-nv]').forEach(el => el.onchange = () => setP(el.dataset.nv, 'v', el.type === 'time' ? el.value : +el.value || 0));
    $('#nAllOn').onclick = () => { NOTIFS.forEach(n => setP(n.id, 'on', true)); openNotifSettings(); };
    $('#nAllOff').onclick = () => { NOTIFS.forEach(n => setP(n.id, 'on', false)); openNotifSettings(); };
    $('#nTest').onclick = async () => { await pushNote('test:' + Date.now(), '🔔 محفظتي', 'كده الإشعارات شغالة تمام.', ''); save(); nBadge(); toast('اتبعت إشعار تجريبي'); };
    if ($('#nPerm')) $('#nPerm').onclick = async () => { const r = await Notification.requestPermission(); toast(r === 'granted' ? 'تم تفعيل الإشعارات' : 'الإشعارات مش مسموحة. فعّلها من إعدادات الآيفون'); openNotifSettings(); };
    $('#nIcs').onclick = () => { const blob = new Blob([icsAll()], { type: 'text/calendar;charset=utf-8' });
      if (isIOS) location.href = URL.createObjectURL(blob); else shareOrDownload('masrfi-reminders.ics', blob); };
  });
}
// ملف تقويم فيه التذكير اليومي + المواعيد المالية الجاية (60 يوم)
function icsAll() {
  const pad = x => String(x).padStart(2, '0');
  const dt = (ts, h = 10, m = 0) => { const d = new Date(ts); return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`; };
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const esc2 = x => String(x).replace(/[,;\\]/g, m => '\\' + m).replace(/\n/g, ' ');
  const ev = []; const t0 = dayStart(Date.now()); const end = t0 + 60 * DAY;
  const add = (uid, ts, title, alarmDaysBefore = 0, rrule) => ev.push(['BEGIN:VEVENT', `UID:masrfi-${uid}@${location.host || 'local'}`, `DTSTAMP:${stamp}`, `DTSTART:${dt(ts)}`, 'DURATION:PT15M', ...(rrule ? [rrule] : []),
    `SUMMARY:${esc2(title)}`, `URL:${APP_URL}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', `TRIGGER:${alarmDaysBefore ? `-P${alarmDaysBefore}D` : 'PT0M'}`, `DESCRIPTION:${esc2(title)}`, 'END:VALARM', 'END:VEVENT'].join('\r\n'));
  const n0 = x => money(Math.round(x)).replace(/\.00$/, '');
  if (nSet('daily').on) { const [h, m] = String(nSet('daily').v).split(':').map(Number); ev.push(['BEGIN:VEVENT', `UID:masrfi-daily-reminder@${location.host || 'local'}`, `DTSTAMP:${stamp}`, `DTSTART:${dt(t0, h, m)}`, 'DURATION:PT5M', 'RRULE:FREQ=DAILY',
    'SUMMARY:💰 سجّل مصاريف النهارده في محفظتي', `URL:${APP_URL}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0M', 'DESCRIPTION:سجّل مصاريف النهارده', 'END:VALARM', 'END:VEVENT'].join('\r\n')); }
  if (nSet('card').on) cardsSummary(...monthRange(0)).forEach(c => { if (c.due && c.due.amt > 0) add(`card-${c.a.id}-${fmtDate(c.due.date)}`, c.due.date, `💳 سداد ${lbl(c.a.name)}: ${n0(c.due.amt)}`, +nSet('card').v || 0); });
  if (nSet('inst').on) db.installments.forEach(pl => planSummary(pl).rows.slice(pl.paid || 0).filter(r => r.date <= end).forEach(r => add(`inst-${pl.id}-${r.i}`, r.date, `🧾 قسط ${pl.name}: ${n0(r.payment)}`)));
  if (nSet('fixed').on) db.recurring.filter(r => r.active && r.type === 'EXPENSE' && acc(r.accountId)).forEach(r => occurrences(r, t0, end).slice(0, 8).forEach(ts => add(`fx-${r.id}-${fmtDate(ts)}`, ts, `📌 ${r.merchant || lbl((cat(r.categoryId) || {}).name || '')}: ${n0(conv(r.amount, recCur(r)))}`, +nSet('fixed').v || 0)));
  if (nSet('debt').on) db.debts.filter(x => x.dueDate && x.paid < x.amount && x.dueDate >= t0).forEach(x => add(`debt-${x.id}`, x.dueDate, `🤝 ${x.lent ? x.person + ' عليه ليك' : 'عليك لـ ' + x.person}: ${n0(x.amount - x.paid)}`, +nSet('debt').v || 0));
  if (nSet('payday').on && hasProfile() && prof().salary > 0) add('payday', payCycle().next, '💰 يوم القبض: وزّع المرتب وحوّل الادخار', 0, 'RRULE:FREQ=MONTHLY');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//masrfi//MyWallet//AR', 'CALSCALE:GREGORIAN', ...ev, 'END:VCALENDAR'].join('\r\n');
}

// ================= المركز المالي =================
// الرصيد الحالي، وبعد أقساط الشهر، والصافي بعد كل اللي ليك واللي عليك (ديون وأقساط)
function positions() {
  const bal = balances();
  const live = db.accounts.filter(a => !a.archived);
  const total = live.reduce((s, a) => s + conv(bal[a.id] || 0, a.currency), 0);
  const assets = live.filter(a => (bal[a.id] || 0) > 0).reduce((s, a) => s + conv(bal[a.id], a.currency), 0);
  const cardOwed = -live.filter(a => (bal[a.id] || 0) < 0).reduce((s, a) => s + conv(bal[a.id], a.currency), 0);
  const [, mEnd] = monthRange(0);
  let instMonth = 0, instAll = 0, instOut = 0;
  db.installments.forEach(p => { const cur = (acc(p.cardId) || {}).currency || base();
    const ps = planSummary(p); instOut += conv(ps.outstanding, cur);
    ps.rows.slice(Math.min(p.paid || 0, 999)).forEach(r => { const v = conv(r.payment, cur); instAll += v; if (r.date <= mEnd) instMonth += v; }); });
  const rem = d => conv(Math.max(0, d.amount - d.paid), d.currency);
  const recv = db.debts.filter(d => d.lent).reduce((s, d) => s + rem(d), 0);
  const pay = db.debts.filter(d => !d.lent).reduce((s, d) => s + rem(d), 0);
  // الصافي بأصل التقسيط المتبقي (زي البنك) مش بالفوايد اللي لسه ماستحقتش
  return { total, assets, cardOwed, instMonth, instAll, instOut, recv, pay, afterInst: total - instMonth, net: total + recv - pay - instOut };
}
function openPositions() {
  const p = positions(); const r = (t, v, cls, sub) => `<tr${sub ? '' : ' class="next"'}><td>${t}</td><td class="num ${cls || ''}">${v < 0 ? `(${money(-v)})` : money(v)}</td></tr>`;
  sheet('مركزك المالي', `
    <div class="grid3"><div class="stat"><span class="muted">الرصيد الحالي</span><b class="num">${money(p.total)}</b></div>
      <div class="stat"><span class="muted">بعد أقساط الشهر</span><b class="num">${money(p.afterInst)}</b></div>
      <div class="stat"><span class="muted">صافي الرصيد</span><b class="num ${p.net >= 0 ? 'inc' : 'exp'}">${money(p.net)}</b></div></div>
    <div class="table-wrap"><table class="tbl">
      <tr><th>البند</th><th>المبلغ (${base()})</th></tr>
      ${r('أرصدة الحسابات (نقدي، بنك، توفير، ذهب)', p.assets, 'inc', 1)}
      ${r('مستحق على البطاقات', -p.cardOwed, 'exp', 1)}
      ${r('= الرصيد الحالي', p.total)}
      ${r('أقساط باقية الشهر ده', -p.instMonth, 'exp', 1)}
      ${r('= الرصيد بعد أقساط الشهر', p.afterInst)}
      ${r('الرصيد الحالي', p.total, '', 1)}
      ${r('باقي أصل التقسيط (زي البنك)', -p.instOut, 'exp', 1)}
      ${r('ديون ليك (دائن)', p.recv, 'inc', 1)}
      ${r('ديون عليك (مدين)', -p.pay, 'exp', 1)}
      ${r('= صافي الرصيد', p.net)}
    </table></div>
    <p class="muted">صافي الرصيد = الرصيد الحالي، زائد الديون اللي ليك، ناقص الديون اللي عليك وباقي أصل التقسيط زي ما البنك كاتبه (من غير فوايد الشهور الجاية). ده مركزك الحقيقي لو سددت كل حاجة النهارده.</p>
    <div class="btns"><button class="btn" id="posDebts">${ic('users')} الديون</button><button class="btn" id="posCards">${ic('card')} الأقساط</button></div>`, () => {
    $('#posDebts').onclick = openDebts; $('#posCards').onclick = () => { closeSheet(); setTab('cards'); };
  });
}

// ================= يومك العادي =================
// بيتعلم صرفك اليومي المعتاد من الأيام اللي سجّلت فيها، عشان يكمّل الأيام اللي نسيت تسجّلها
const dayKey = ms => fmtDate(dayStart(ms));
const noSpend = () => db.prefs.noSpend || (db.prefs.noSpend = []);
function loggedDays(from, to) {
  const s = new Set(db.txns.filter(t => t.type === 'EXPENSE' && t.date >= from && t.date <= to).map(t => dayKey(t.date)));
  noSpend().forEach(k => s.add(k)); return s;
}
// صرف اليوم العادي لكل تصنيف (المتغير بس)، ولو فيه بيانات كفاية لنفس يوم الأسبوع بيستخدمها
function usualDay(ms = Date.now()) {
  const t0 = dayStart(Date.now()); const from = t0 - 56 * DAY;
  const days = [...loggedDays(from, t0 - 1)];
  if (days.length < 5) return { items: [], total: 0, days: days.length };
  const wd = new Date(ms).getDay();
  const same = days.filter(k => new Date(k + 'T12:00').getDay() === wd);
  const use = new Set(same.length >= 3 ? same : days);
  const per = {};
  db.txns.filter(t => t.type === 'EXPENSE' && t.date >= from && t.date < t0 && !isFixedTxn(t) && t.source !== 'ESTIMATE' && use.has(dayKey(t.date))).forEach(t => {
    const k = t.categoryId || 0; const x = per[k] = per[k] || { sum: 0, d: new Set(), acc: {} };
    x.sum += conv(t.amount, txCur(t)); x.d.add(dayKey(t.date)); x.acc[t.accountId] = (x.acc[t.accountId] || 0) + 1;
  });
  const items = Object.entries(per).filter(([, x]) => x.d.size >= use.size * 0.3)
    .map(([k, x]) => ({ categoryId: +k || null, amount: Math.round(x.sum / use.size), accountId: +Object.entries(x.acc).sort((a, b) => b[1] - a[1])[0][0] }))
    .filter(i => i.amount > 0);
  // المصاريف الثابتة اليومية اليدوية (زي المواصلات) بتدخل كمان
  db.recurring.filter(r => r.active && r.auto === false && r.type === 'EXPENSE' && r.period === 'DAILY').forEach(r => items.push({ categoryId: r.categoryId, amount: r.amount, accountId: r.accountId, fixedId: r.id, merchant: r.merchant }));
  return { items, total: items.reduce((s, i) => s + i.amount, 0), days: use.size };
}
// الأيام اللي فاتت (آخر 7 أيام) ومفيهاش ولا مصروف
function missedDays() {
  if (!db.txns.length) return [];
  const t0 = dayStart(Date.now()); const first = dayStart(db.txns.reduce((m, t) => Math.min(m, t.date), Date.now()));
  const logged = loggedDays(t0 - 7 * DAY, t0);
  const out = [];
  for (let i = 7; i >= 1; i--) { const d = t0 - i * DAY; if (d > first && !logged.has(dayKey(d))) out.push(d); }
  return out;
}
function fillUsual(days) {
  let n = 0, total = 0; const ids = [];
  days.forEach(d => {
    const u = usualDay(d);
    u.items.forEach(i => {
      const accId = acc(i.accountId) ? i.accountId : (db.accounts.find(a => !a.archived) || {}).id; if (!accId) return;
      const id = newId(); ids.push(id);
      db.txns.push({ id, type: 'EXPENSE', amount: i.amount, accountId: accId, categoryId: i.categoryId, merchant: i.merchant || '', note: 'تقديري (يومك العادي)', date: dayStart(d) + 20 * 3600000, source: 'ESTIMATE', fixedId: i.fixedId || null });
      if (i.fixedId) { const r = db.recurring.find(x => x.id === i.fixedId); if (r) markFixedPaid(r, dayStart(d) + 20 * 3600000); }
      n++; total += i.amount;
    });
    if (!u.items.length) noSpend().push(dayKey(d));
  });
  save(); return { n, total, ids };
}
function usualCard() {
  const miss = missedDays(); if (!miss.length) return '';
  const est = miss.reduce((s, d) => s + usualDay(d).total, 0);
  return `<div class="card reminder"><div class="row"><span class="ib warn">${ic('calendar')}</span><div class="grow"><b>ماسجّلتش مصاريف ${miss.length === 1 ? 'يوم ' + new Date(miss[0]).toLocaleDateString('ar-EG', { weekday: 'long' }) : miss.length + ' أيام'}</b>
    <div class="muted">${est ? `يومك العادي ≈ <b class="num">${money(est)}</b>. نسجّله تقديري وتعدّله بعدين؟` : 'سجّل اللي صرفته أو قول ماصرفتش حاجة'}</div></div></div>
    <div class="btns">${est ? '<button class="btn small primary" id="uFill">سجّل زي العادي</button><button class="btn small" id="uReview">مراجعة</button>' : ''}<button class="btn small" id="uNone">ماصرفتش حاجة</button></div></div>`;
}
function bindUsualCard() {
  if ($('#uFill')) $('#uFill').onclick = () => { const r = fillUsual(missedDays()); toast(`اتسجّل ${money(r.total)} تقديري`); render(); };
  if ($('#uReview')) $('#uReview').onclick = openUsualReview;
  if ($('#uNone')) $('#uNone').onclick = () => { missedDays().forEach(d => noSpend().push(dayKey(d))); save(); render(); };
}
function openUsualReview() {
  const miss = missedDays();
  sheet('الأيام اللي ماتسجلتش', `<p class="muted">ده تقدير من الأيام اللي سجّلت فيها (آخر 8 أسابيع${''}). علّم على الأيام اللي عاوز تسجّلها تقديري، والباقي اعتبره ماصرفتش فيه.</p>
    ${miss.map(d => { const u = usualDay(d); return `<div class="insight"><input type="checkbox" data-ud="${d}" ${u.items.length ? 'checked' : ''}><div class="grow"><b>${new Date(d).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'short' })}</b> · <span class="num">${money(u.total)}</span>
      <div class="muted">${u.items.map(i => `${(cat(i.categoryId) || {}).icon || '📦'} ${esc(i.merchant || lbl((cat(i.categoryId) || {}).name || 'بدون تصنيف'))} ${money(i.amount).replace(/\.00$/, '')}`).join('، ') || 'مفيش بيانات كفاية'}</div></div></div>`; }).join('')}
    <div class="btns"><button class="btn primary" id="urGo">سجّل</button></div>
    <p class="muted">المصاريف التقديرية بتظهر في الحركات بعلامة «تقديري»، اضغط على أي واحدة تعدّل مبلغها.</p>`, () => {
    $('#urGo').onclick = () => {
      const on = [], off = [];
      document.querySelectorAll('[data-ud]').forEach(c => (c.checked ? on : off).push(+c.dataset.ud));
      off.forEach(d => noSpend().push(dayKey(d)));
      const r = fillUsual(on); toast(`اتسجّل ${money(r.total)} تقديري`); closeSheet();
    };
  });
}

// ================= دليل البرنامج بالصوت =================
// كل موضوع: كلمات بيتعرف بيها، عنوان، الشرح، والشاشة اللي يفتحها
const HELP = [
  { k: ['البرنامج', 'التطبيق', 'ابدا', 'بيعمل ايه', 'فكره'], t: 'فكرة البرنامج', a: 'محفظتي بيسجّل دخلك ومصاريفك، ويحسبلك تقدر تصرف كام في اليوم لحد القبض، وينبهك لو في خطر سيولة. ابدأ بتسجيل مرتبك في بياناتي المالية، وبعدين سجّل كل مصروف بزرار الزائد اللي تحت أو بالصوت.' },
  { k: ['اضيف مصروف', 'اسجل مصروف', 'سجل مصروف', 'اضافه مصروف', 'حركه جديده'], t: 'تسجيل مصروف', a: 'اضغط زرار الزائد الأزرق اللي في نص الشريط تحت، اكتب المبلغ واختار التصنيف واضغط حفظ. أو اضغط المايك وقول مثلاً: صرفت 150 أكل. وهتلاقي اقتراحات بالمصاريف اللي بتتكرر تضغط عليها على طول.', go: () => openTxn() },
  { k: ['دخل', 'قبضت', 'اسجل المرتب'], t: 'تسجيل دخل', a: 'اضغط زرار الزائد واختار دخل، أو قول: قبضت 20000. ولو سجّلت مرتبك في بياناتي المالية، المرتب بيتسجّل لوحده كل شهر يوم القبض.' },
  { k: ['مصروف ثابت', 'مصاريف ثابته', 'ثابت', 'ثابته', 'متكرر', 'متكرره', 'ايجار', 'اشتراك'], t: 'المصاريف الثابتة', a: 'المصاريف الثابتة زي الإيجار والفواتير والمواصلات اليومية. تقدر تضيفها من المزيد ثم المصاريف الثابتة، أو وانت بتسجّل أي مصروف علّم على مصروف ثابت واختار يومي أو أسبوعي أو شهري. التلقائي بيتسجّل لوحده، واليدوي بيظهرلك كاقتراح لما معاده ييجي، وكلهم بيدخلوا في التوقعات.', go: () => openRecurring() },
  { k: ['المتحكم', 'متحكم', 'سيوله', 'تنبيه', 'تنبيهات', 'خطر', 'افلاس', 'هفلس'], t: 'المتحكم المالي والتنبيهات', a: 'صفحة المتحكم المالي بتقولك حالتك: آمن أو خلي بالك أو خطر. التنبيهات متقسمة يومي وأسبوعي وشهري، زي لو صرفت النهارده أكتر من المسموح، أو رصيدك هينزل تحت حد الأمان الأسبوع ده، أو فلوسك هتخلص قبل القبض.', go: () => { closeSheet(); setTab('ctrl'); } },
  { k: ['توقع', 'الرسم', 'الرصيد المتوقع', 'الخط'], t: 'توقع الرصيد', a: 'الرسم في المتحكم المالي بيوريك رصيدك المتوقع كل يوم لحد بعد القبض. بيحسب المصاريف الثابتة والأقساط والمرتب ومتوسط صرفك اليومي. الخط المتقطع البرتقالي هو حد الأمان، ولو الخط نزل تحته يبقى خلي بالك.', go: () => { closeSheet(); setTab('ctrl'); } },
  { k: ['الامن', 'اصرف كام', 'المسموح', 'الحد اليومي', 'اقتراح النهارده'], t: 'المسموح في اليوم', a: 'المسموح في اليوم بيتحسب كده: رصيدك المتاح، ناقص المصاريف الثابتة لحد القبض، ناقص الادخار وحد الأمان، والباقي مقسوم على الأيام لحد القبض.' },
  { k: ['توزيع', 'اوزع'], t: 'توزيع المرتب', a: 'يوم القبض حوّل نسبة الادخار الأول لحساب التوفير، وسيب فلوس المصاريف الثابتة، والباقي هو مصروفك الحر. لو صندوق الطوارئ لسه مش كامل، معظم الادخار بيروح له، والباقي للاستثمار.', go: () => { closeSheet(); setTab('ctrl'); } },
  { k: ['ساعات', 'ساعه', 'قيمه وقتي', 'قيمه الساعه'], t: 'قيمة ساعة الشغل', a: 'من مرتبك وعدد ساعات شغلك بنحسب ساعتك بكام. وانت بتسجّل أي مصروف هتلاقي تحت المبلغ هو يساوي كام ساعة شغل، وتقدر تسألني: 500 جنيه تساوي كام ساعة.' },
  { k: ['تقرير', 'قائمه الدخل', 'تقارير'], t: 'التقرير الشهري', a: 'التقرير الشهري زي قائمة الدخل: الإيرادات، ناقص المصروفات الثابتة، ناقص المتغيرة، والصافي فائض أو عجز، مع ملاحظات. تفتحه من التقارير أو من المزيد، وتقدر تصدّره Excel.', go: () => openMonthReport(0) },
  { k: ['ادخار', 'طوارئ', 'استثمار', 'احوش'], t: 'الادخار والاستثمار', a: 'صفحة الادخار فيها قاعدة 50 30 20 وصندوق الطوارئ وخطة الأهداف. ابدأ بصندوق طوارئ يغطي من 3 لـ 6 شهور، وبعدين الاستثمار، وفي المتحكم المالي هتلاقي أفكار زي الشهادات وصناديق النقد والذهب.', go: () => { closeSheet(); setTab('savings'); } },
  { k: ['بطاقه', 'كريدت', 'قسط', 'اقساط', 'تقسيط'], t: 'البطاقات والأقساط', a: 'من المزيد ثم بطاقات الائتمان والتقسيط، ضيف البطاقة بحدها ويوم السداد، وضيف أي تقسيط بالمبلغ والفايدة والمدة، والتطبيق يعمل جدول الأقساط ويقولك بدأ امتى وهيخلص امتى، ويسجّل القسط على البطاقة تلقائي كل شهر، ويدخله في التوقعات والتنبيهات.', go: () => { closeSheet(); setTab('cards'); } },
  { k: ['رسائل', 'رساله البنك', 'sms'], t: 'رسائل البنك', a: 'انسخ رسالة البنك والصقها في رسائل البنك، والتطبيق يطلع المبلغ والتاجر والتصنيف لوحده. وفيه طريقة ربط تلقائي بالاختصارات على الآيفون.', go: () => { closeSheet(); setTab('inbox'); } },
  { k: ['بياناتي', 'اعدل المرتب', 'يوم القبض', 'حد الامان', 'اغير المرتب'], t: 'بياناتي المالية', a: 'تقدر تعدّل المرتب ويوم القبض وساعات الشغل ونسبة الادخار وحد الأمان من الإعدادات، أو من المزيد ثم بياناتي المالية.', go: () => openOnboarding(true) },
  { k: ['ميزانيه', 'تصنيف', 'تصنيفات'], t: 'التصنيفات والميزانيات', a: 'من المزيد ثم التصنيفات والميزانيات، حط ميزانية شهرية لكل تصنيف، والتطبيق ينبهك لما توصل 80 في المية.', go: () => openCategories() },
  { k: ['نسخه', 'احتياطي', 'باك اب', 'اصدر', 'excel', 'اكسل'], t: 'النسخ الاحتياطي', a: 'بياناتك على موبايلك بس. خد نسخة احتياطية مشفرة من المزيد ثم نسخ احتياطي واستعادة، واحفظها في iCloud.', go: () => openBackup() },
  { k: ['قفل', 'باسورد', 'pin', 'فيس'], t: 'القفل', a: 'من المزيد ثم قفل PIN، حط رقم سري، وتقدر تفعّل الفتح بالوش.', go: () => openPin() },
  { k: ['نسيت', 'كسلت', 'مشغول', 'ماسجلتش', 'العادي', 'تقديري'], t: 'لو نسيت تسجّل', a: 'لو كسلت أو كنت مشغول، التطبيق بيتعلم يومك العادي من الأيام اللي سجّلت فيها. هيظهرلك في الرئيسية الأيام اللي ماتسجلتش، واضغط سجّل زي العادي، أو قول للمساعد: سجّل يومي العادي. المصاريف دي بتتعلّم تقديري وتقدر تعدّلها بعدين، ولو ماصرفتش حاجة اضغط ماصرفتش حاجة.' },
  { k: ['صوت', 'المساعد', 'اقول ايه', 'اوامر'], t: 'المساعد الصوتي', a: 'اضغط المايك وقول مثلاً: صرفت 200 أكل، قبضت 5000، حالتي المالية، فاضلي كام، مصاريفي الثابتة، 500 جنيه تساوي كام ساعة، أو اسألني إزاي أعمل أي حاجة في البرنامج. وتقدر تغيّر الصوت من الإعدادات.' }
];
// شرح الشاشة المفتوحة دلوقتي
const SCREEN_HELP = {
  home: 'دي الرئيسية: فوق رصيدك وحساباتك، وتحتها اختصارات، وبعدين حالة السيولة، واقتراح النهارده بالمبلغ اللي تقدر تصرفه، وآخر الحركات.',
  txns: 'دي الحركات: كل اللي سجّلته، وتقدر تدوّر وتفلتر بالفترة أو الحساب أو التصنيف، واضغط على أي حركة تعدّلها.',
  reports: 'دي التقارير: صرفك حسب التصنيف، وآخر 12 شهر، وأكبر المصروفات، وزرار التقرير الشهري بشكل قائمة دخل.',
  more: 'دي المزيد: فيها الحسابات، والمصاريف الثابتة، والديون، والأهداف، والإعدادات، والنسخ الاحتياطي.',
  ctrl: HELP[4].a + ' وتحت فيه توقع الرصيد، والمدفوعات الجاية، وتوزيع المرتب، وقيمة ساعة شغلك.',
  savings: HELP[10].a, cards: HELP[11].a, inbox: HELP[12].a
};
const normAr = x => normDigits(String(x)).toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
function findHelp(t) {
  let best = null, sc = 0;
  HELP.forEach(h => { const n = h.k.filter(k => t.includes(normAr(k))).reduce((s, k) => s + k.length, 0); if (n > sc) { sc = n; best = h; } });
  return best;
}
const HELP_Q = /(ازاي|كيف|ايه هو|ايه هي|يعني ايه|اشرح|فين|ساعدني|مش فاهم|عرفني|علمني|طريقه|استخدم)/;
function helpReply(t) {
  if (/(جوله|فرجني|وريني البرنامج|عرفني علي البرنامج)/.test(t)) { setTimeout(startTour, 300); return { reply: 'تمام، هاخدك جولة سريعة في البرنامج' , silent: true }; }
  if (/(الصفحه دي|الشاشه دي|انا فين|دي ايه)/.test(t)) return { reply: SCREEN_HELP[tab] || SCREEN_HELP.home };
  if (!HELP_Q.test(t)) return null;
  const h = findHelp(t);
  if (!h) return { reply: 'ممكن تسألني مثلاً: إزاي أضيف مصروف ثابت، يعني إيه المتحكم المالي، إزاي أعمل نسخة احتياطية، أو قول جولة وأنا أعرّفك على البرنامج.' };
  return { reply: h.a, go: h.go, goLabel: h.t };
}
// جولة صوتية: بتنقل بين الشاشات وتشرح كل واحدة
let tourStep = -1;
const TOUR = [['home', SCREEN_HELP.home], ['ctrl', SCREEN_HELP.ctrl], ['txns', SCREEN_HELP.txns], ['reports', SCREEN_HELP.reports], ['more', SCREEN_HELP.more],
  ['home', 'وأخيراً، زرار المايك الصغير موجود في كل الشاشات. اسألني أي حاجة زي: إزاي أضيف مصروف ثابت. بالتوفيق!']];
function startTour() { closeSheetQuiet(); tourStep = 0; tourShow(); }
function closeSheetQuiet() { $('#sheet').classList.add('hidden'); document.body.style.overflow = ''; }
function tourShow() {
  if (tourStep < 0 || tourStep >= TOUR.length) { tourStep = -1; $('#vbubble').classList.add('hidden'); return; }
  const [tb, txt] = TOUR[tourStep]; setTab(tb);
  const b = $('#vbubble'); b.classList.remove('hidden');
  b.innerHTML = `<div class="row between"><b>جولة ${tourStep + 1}/${TOUR.length}</b><button class="x" id="vbX">✕</button></div><div class="vb-text">${esc(txt)}</div><button class="btn small primary" id="tourNext">${tourStep < TOUR.length - 1 ? 'التالي' : 'إنهاء'}</button>`;
  const step = tourStep;
  const next = () => { if (tourStep !== step) return; tourStep++; tourShow(); };
  $('#tourNext').onclick = () => { speechSynthesis && speechSynthesis.cancel(); next(); };
  $('#vbX').onclick = () => { tourStep = -1; speechSynthesis && speechSynthesis.cancel(); b.classList.add('hidden'); };
  speak(txt, () => setTimeout(next, 700));
}

// ================= المساعد الصوتي =================
// أحسن صوت عربي متاح على الجهاز: المحسّن/المميز أولاً، والمصري قبل غيره. المستخدم يقدر يختار من الإعدادات.
let voicesCache = [];
function arVoices() {
  if ('speechSynthesis' in window) { const v = speechSynthesis.getVoices(); if (v.length) voicesCache = v; }
  const score = x => (/premium|enhanced|محسّن|مميز|neural|natural/i.test(x.name) ? 100 : 0) + (/ar[-_]EG/i.test(x.lang) ? 20 : /ar[-_]SA/i.test(x.lang) ? 10 : 0)
    + (/majed|maged|laila|tarik|hoda|salma|shakir|google/i.test(x.name) ? 8 : 0) + (x.localService ? 2 : 0) - (/eloquence|compact|grandpa|grandma|rocko|shelley|flo|reed|sandy/i.test(x.name) ? 50 : 0);
  return voicesCache.filter(x => /^ar/i.test(x.lang)).sort((a, b) => score(b) - score(a));
}
if ('speechSynthesis' in window) { arVoices(); speechSynthesis.onvoiceschanged = arVoices; }
// تنضيف النص قبل القراية: الأرقام من غير كسور وفواصل، ومن غير إيموجي ورموز
// الأصوات العربي في الآيفون فصحى، فالكلام العامي بيتنطق غلط ومقطّع. قبل القراية بنحوّل الكلمات العامية لفصحى بسيطة.
const SPOKEN = [['النهارده', 'اليوم'], ['انهارده', 'اليوم'], ['بكرة', 'غداً'], ['امبارح', 'أمس'], ['فاضلك', 'المتبقي لك'], ['فاضلي', 'المتبقي لي'], ['فاضل', 'متبقي'],
  ['عشان', 'لكي'], ['علشان', 'لكي'], ['مفيش', 'لا يوجد'], ['ماسجّلتش', 'لم تسجل'], ['ماسجلتش', 'لم تسجل'], ['ماصرفتش', 'لم تصرف'], ['اتلغت', 'تم الإلغاء'],
  ['دلوقتي', 'الآن'], ['كده', 'هكذا'], ['ده', 'هذا'], ['دي', 'هذه'], ['دول', 'هؤلاء'], ['إيه', 'ماذا'], ['ايه', 'ماذا'], ['إزاي', 'كيف'], ['ازاي', 'كيف'], ['فين', 'أين'],
  ['كام', 'كم'], ['عاوز', 'تريد'], ['عايز', 'تريد'], ['بتاع', 'الخاص ب'], ['اللي', 'الذي'], ['هتصرف', 'ستصرف'], ['هتخلص', 'ستنتهي'], ['هينزل', 'سينزل'], ['هيظهر', 'سيظهر'],
  ['هيظهرلك', 'سيظهر لك'], ['بيتسجّل', 'يُسجل'], ['بيتسجل', 'يُسجل'], ['سجّلت', 'سجلت'], ['خلي بالك', 'انتبه'], ['تقدر', 'يمكنك'], ['حاجة', 'شيء'], ['حاجه', 'شيء'],
  ['أكتر', 'أكثر'], ['اكتر', 'أكثر'], ['أقل من', 'أقل من'], ['يعني', 'أي'], ['لسه', 'ما زال'], ['بس', 'فقط'], ['قول', 'قل'], ['اضغط', 'اضغط'], ['المية', 'المئة'], ['تمام', 'حسناً'],
  ['شغلك', 'عملك'], ['شغل', 'عمل'], ['القبض', 'الراتب'], ['المرتب', 'الراتب'], ['مرتبك', 'راتبك'], ['وفّرت', 'وفرت'], ['هنا', 'هنا']];
const SPOKEN_RE = SPOKEN.map(([a, b]) => [new RegExp(`(^|[\\s،.؟!:])(و?)${a}(?=$|[\\s،.؟!:])`, 'g'), `$1$2${b}`]);
function speechText(text, colloquial) {
  let t = String(text).replace(/<[^>]+>/g, '').replace(/[⁦-⁩]/g, '')
    .replace(/(\d),(?=\d{3})/g, '$1').replace(/(\d+)\.00\b/g, '$1').replace(/(\d+)\.(\d)\d?\b/g, (m, a, b) => +b ? m : a)
    .replace(/\bEGP\b/g, 'جنيه').replace(/%/g, ' في المئة').replace(/[\u{1F300}-\u{1FAFF}☀-➿️📌•«»()]/gu, '').replace(/ـ/g, '');
  if (!colloquial) SPOKEN_RE.forEach(([re, to]) => { t = t.replace(re, to); });
  return t.replace(/\s+/g, ' ').trim();
}
// الآيفون: لازم أول نطق يحصل من لمسة، والـ cancel قبل speak على طول بيضيّع الكلام،
// وبعد المايك محتاج لحظة عشان الصوت يرجع للسماعة. لو الصوت المختار ماشتغلش بنرجع للصوت الافتراضي.
let curUtter = null, speechUnlocked = false;
// صوت مصري طبيعي من Azure (اختياري): محتاج مفتاح ونت، ولو فشل بيرجع لصوت الجهاز
const AZ_VOICES = { 'ar-EG-SalmaNeural': 'سلمى (مصري)', 'ar-EG-ShakirNeural': 'شاكر (مصري)' };
const azOn = () => !!(db.prefs.azKey && db.prefs.azRegion && db.prefs.azVoice !== 'off');
const azCache = new Map();
let azAudio = null;
function azPlayer() { if (!azAudio) { azAudio = new Audio(); azAudio.preload = 'auto'; } return azAudio; }
async function azSpeak(text, onEnd, voice) {
  const say = speechText(text, true); if (!say) return;
  const v = voice || db.prefs.azVoice || 'ar-EG-SalmaNeural';
  const rate = Math.round(((db.prefs.voiceRate || 0.95) - 1) * 100);
  const key = v + rate + say;
  let url = azCache.get(key);
  if (!url) {
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-EG"><voice name="${v}"><prosody rate="${rate}%">${say.replace(/[<&>]/g, c => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c]))}</prosody></voice></speak>`;
    const r = await fetch(`https://${db.prefs.azRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, { method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': db.prefs.azKey, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3' }, body: ssml });
    if (!r.ok) throw new Error('azure ' + r.status);
    url = URL.createObjectURL(await r.blob());
    if (azCache.size > 40) azCache.delete(azCache.keys().next().value);
    azCache.set(key, url);
  }
  const a = azPlayer(); a.pause(); a.src = url; a.onended = () => onEnd && onEnd();
  await a.play();
}
// صوت Gemini (نفس أصوات Google AI Studio): مفتاح مجاني من aistudio.google.com، وبيرجّع PCM بنحوّله WAV
const GM_VOICES = { Kore: 'Kore (ست، واضح)', Aoede: 'Aoede (ست، هادي)', Zephyr: 'Zephyr (ست، مشرق)', Leda: 'Leda (ست، شبابي)', Despina: 'Despina (ست، ناعم)', Sulafat: 'Sulafat (ست، دافي)', Charon: 'Charon (راجل)', Puck: 'Puck (راجل، مرح)' };
const GM_MODELS = ['gemini-2.5-flash-preview-tts', 'gemini-2.5-flash-tts', 'gemini-2.5-pro-preview-tts'];
const gmOn = () => !!(db.prefs.gmKey && db.prefs.gmVoice && db.prefs.gmVoice !== 'off');
function pcmToWav(b64, rate = 24000) {
  const pcm = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const buf = new ArrayBuffer(44 + pcm.length); const v = new DataView(buf);
  const w = (o, str) => [...str].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + pcm.length, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, pcm.length, true);
  new Uint8Array(buf, 44).set(pcm);
  return new Blob([buf], { type: 'audio/wav' });
}
function gmError(e) {
  const m = String(e.message || e);
  if (/ 400| 403/.test(m)) return 'مفتاح Gemini مش شغال. اتأكد إنك نسخته صح';
  if (/ 429/.test(m)) return 'خلص الحد المجاني لـ Gemini النهارده';
  if (/ 404/.test(m)) return 'موديل الصوت مش متاح على المفتاح ده';
  if (/fetch|network|Load failed/i.test(m)) return 'مفيش نت أو جوجل مش راد';
  if (/play|NotAllowed/i.test(m)) return 'الآيفون منع تشغيل الصوت، اضغط على الشاشة وجرّب تاني';
  return 'صوت Gemini ماشتغلش: ' + m;
}
async function gmSpeak(text, onEnd, voice) {
  const say = speechText(text, true); if (!say) return;
  const tok = speak.token;
  const v = voice || db.prefs.gmVoice || 'Kore';
  const key = 'gm' + v + say;
  let url = azCache.get(key);
  if (!url) {
    const body = { contents: [{ parts: [{ text: `اقرأ الجملة دي بصوت طبيعي ودود ولهجة مصرية، وبسرعة عادية: ${say}` }] }],
      generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: v } } } } };
    let r, last;
    for (const m of [db.prefs.gmModel, ...GM_MODELS].filter(Boolean)) {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, { method: 'POST', headers: { 'x-goog-api-key': db.prefs.gmKey, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (r.ok) { db.prefs.gmModel = m; break; }
      last = r.status; if (r.status !== 404) break;
    }
    if (!r.ok) throw new Error('gemini ' + (last || r.status));
    const j = await r.json();
    const part = ((((j.candidates || [])[0] || {}).content || {}).parts || []).find(p => p.inlineData);
    if (!part) throw new Error('gemini no audio');
    const rate = +((/rate=(\d+)/.exec(part.inlineData.mimeType || '') || [])[1] || 24000);
    url = URL.createObjectURL(pcmToWav(part.inlineData.data, rate));
    if (azCache.size > 40) azCache.delete(azCache.keys().next().value);
    azCache.set(key, url);
  }
  if (tok !== speak.token) return; // اتطلب صوت تاني بعده
  const a = azPlayer(); a.pause(); a.src = url; a.playbackRate = db.prefs.voiceRate > 1 ? 1.1 : db.prefs.voiceRate < 0.9 ? 0.9 : 1; a.onended = () => onEnd && onEnd();
  await a.play();
}
// الآيفون بيكتم أصوات المتصفح لو زرار الصامت شغال. بنخلي جلسة الصوت «تشغيل» زي الفيديو، وبنشغّل صوت فاضي في الخلفية وقت الكلام.
const SILENT_MP3 = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
let keepAlive = null;
function audioSessionPlayback() { try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { } }
function keepAudio(on) {
  try { if (!keepAlive) { keepAlive = new Audio(SILENT_MP3); keepAlive.loop = true; keepAlive.setAttribute('playsinline', ''); }
    if (on) { audioSessionPlayback(); keepAlive.play().catch(() => {}); } else keepAlive.pause(); } catch (e) { }
}
function unlockSpeech() {
  if (speechUnlocked) return;
  audioSessionPlayback(); keepAudio(true); setTimeout(() => { if (!(window.speechSynthesis && speechSynthesis.speaking)) keepAudio(false); }, 400);
  // الآيفون بيسمح بتشغيل الصوت بعد كده من نفس العنصر لو اتشغّل مرة من لمسة
  try { const a = azPlayer(); a.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'; a.play().then(() => a.pause()).catch(() => {}); } catch (e) { }
  if (!('speechSynthesis' in window)) { speechUnlocked = true; return; }
  speechUnlocked = true;
  try { const u = new SpeechSynthesisUtterance('ا'); u.volume = 0; u.rate = 2; u.lang = 'ar-SA'; speechSynthesis.speak(u); } catch (e) { }
}
['touchend', 'click'].forEach(ev => document.addEventListener(ev, unlockSpeech, { capture: true, passive: true }));
function speak(text, onEnd, plain) {
  if (db.prefs.voiceOff) { onEnd && setTimeout(onEnd, 2500); return; }
  if (!plain && !speak.dev && (speak.gm || (gmOn() && !speak.az))) {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const voice = speak.gm; speak.token = (speak.token || 0) + 1;
    gmSpeak(text, onEnd, voice).catch(e => { console.warn(e); toast(gmError(e)); if (/ 400| 403| 404/.test(String(e.message))) { db.prefs.gmVoice = 'off'; save(); } if (voice) return; else if (azOn()) { speak.az = db.prefs.azVoice; speak(text, onEnd); speak.az = null; } else speak(text, onEnd, true); });
    return;
  }
  if (!plain && !speak.dev && (azOn() || speak.az)) {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const voice = speak.az; speak.token = (speak.token || 0) + 1;
    azSpeak(text, onEnd, voice).catch(e => { console.warn(e); if (/ 401| 403| 404/.test(String(e.message))) { db.prefs.azVoice = 'off'; save(); } if (!speak.az) speak(text, onEnd, true); else toast('صوت Azure ماشتغلش: اتأكد من المفتاح والمنطقة والنت'); });
    return;
  }
  if (azAudio) azAudio.pause();
  if (!('speechSynthesis' in window)) return toast('القراءة بالصوت مش مدعومة هنا');
  const say = speechText(text); if (!say) return;
  const only = speak.only;
  const busy = speechSynthesis.speaking || speechSynthesis.pending;
  if (busy) speechSynthesis.cancel();
  // جمل قصيرة واحدة ورا التانية: الآيفون بيقطّع في الجمل الطويلة
  const parts = say.replace(/([.؟!])\s+/g, '$1\n').split('\n').map(x => x.trim()).filter(Boolean);
  const token = speak.token = (speak.token || 0) + 1;
  const go = () => {
    const list = arVoices();
    // الآيفون لو مفيش صوت محدد بيقرا بالإنجليزي، فبنستنى قائمة الأصوات مرة
    if (!list.length && !speak.waited) { speak.waited = true; setTimeout(() => speak(text, onEnd, plain), 700); return; }
    const want = plain ? null : list.find(x => x.voiceURI === (only || db.prefs.voiceURI));
    let v = want || list[0] || null;
    let i = 0, started = false, retried = false;
    keepAudio(true);
    const done = () => { curUtter = null; keepAudio(false); onEnd && onEnd(); };
    const say1 = () => {
      if (token !== speak.token) return;
      if (i >= parts.length) return done();
      const u = new SpeechSynthesisUtterance(parts[i]);
      try { if (v) u.voice = v; } catch (e) { }
      u.lang = v ? v.lang : 'ar-SA'; u.rate = db.prefs.voiceRate || 0.95; u.pitch = 1; u.volume = 1;
      u.onstart = () => { started = true; };
      u.onend = () => { i++; say1(); };
      u.onerror = e => { if (e.error === 'interrupted' || e.error === 'canceled') return; if (!started) return fail(); i++; say1(); };
      curUtter = u; // لازم نحتفظ بيه وإلا الآيفون ممكن يمسحه قبل ما يخلص
      try { speechSynthesis.resume(); } catch (e) { }
      speechSynthesis.speak(u);
    };
    // لو الصوت ماابتداش خلال ثانيتين: نجرّب من غير تحديد صوت، ولو برده لأ نقول السبب
    const fail = () => {
      if (token !== speak.token || started) return;
      speechSynthesis.cancel();
      if (v && !retried) {
        retried = true;
        if (want) { db.prefs.badVoices = [...new Set([...(db.prefs.badVoices || []), want.voiceURI])]; if (db.prefs.voiceURI === want.voiceURI) db.prefs.voiceURI = ''; save(); }
        v = null; setTimeout(() => { say1(); setTimeout(fail, 2000); }, 150); return;
      }
      keepAudio(false);
      toast('الصوت مش طالع: علّي صوت الموبايل واقفل الوضع الصامت، وجرّب تاني');
      onEnd && onEnd();
    };
    say1(); setTimeout(fail, 2000);
  };
  // من غير تأخير لو ممكن، عشان الآيفون يعتبر الكلام جاي من لمسة
  if (busy) setTimeout(go, 150); else go();
}
// أمثلة الأصوات: كل صوت عربي على الجهاز بزرار تشغيل، والمستخدم يختار اللي يعجبه
const VOICE_SAMPLE = 'أهلاً يا يوسف، صرفت النهارده 250 جنيه، وتقدر تصرف 400 في اليوم لحد القبض.';
const voiceQuality = v => /premium|مميز/i.test(v.name) ? 'مميز' : /enhanced|محسّن|neural|natural/i.test(v.name) ? 'محسّن' : 'عادي';
function openVoicePicker() {
  const bad = db.prefs.badVoices || []; const seen = new Set();
  const list = arVoices().filter(v => !bad.includes(v.voiceURI) && !seen.has(v.name) && seen.add(v.name));
  const row = (uri, name, sub, q) => `<div class="item"><button class="btn small" data-play="${esc(uri)}">${ic('speaker')}</button><div class="grow"><div class="ellipsis">${esc(name)}</div><div class="muted">${sub}</div></div>
    ${q ? `<span class="pill">${q}</span>` : ''}<button class="chip ${(db.prefs.voiceURI || '') === uri ? 'on' : ''}" data-pick="${esc(uri)}">${(db.prefs.voiceURI || '') === uri ? '✓ مختار' : 'اختار'}</button></div>`;
  sheet('أمثلة الأصوات', `<p class="muted">اضغط ${ic('speaker', 'inl')} تسمع كل صوت، واختار اللي يعجبك. «تلقائي» هو الصوت المضمون. أي صوت مايشتغلش بيختفي من القايمة لوحده.</p>
    <h3>أصوات الموبايل (من غير نت)</h3>
    <div class="list">${row('', 'تلقائي (مضمون)', 'أحسن صوت عربي على موبايلك', '')}${list.map(v => row(v.voiceURI, v.name, v.lang, voiceQuality(v))).join('')}</div>${bad.length ? `<button class="btn small" id="vBadReset" style="margin-top:6px">إظهار الأصوات المخفية (${bad.length})</button>` : ''}
    ${list.some(v => voiceQuality(v) !== 'عادي') ? '' : `<div class="insight w" style="margin-top:12px"><div class="grow"><b>مفيش صوت محسّن على موبايلك</b><br>الأصوات العادية بتبقى آلية. عشان صوت أحلى بكتير:<ol class="steps" style="margin-top:6px"><li>افتح <b>الإعدادات</b> في الآيفون</li><li><b>تسهيلات الاستخدام</b> ← <b>المحتوى المنطوق</b> ← <b>الأصوات</b></li><li><b>العربية</b> ← اختار <b>Majed</b> أو <b>Laila</b> ونزّل نسخة <b>Enhanced (محسّن)</b></li><li>اقفل التطبيق وافتحه تاني، وارجع هنا اختار الصوت الجديد</li></ol></div></div>`}
    <details style="margin-top:16px" ${db.prefs.gmKey || db.prefs.azKey ? 'open' : ''}><summary><b>أصوات أونلاين أطبع (محتاجة مفتاح ونت)</b></summary>
    <h3>أصوات Google Gemini (زي AI Studio)</h3>
    <div class="list">${Object.entries(GM_VOICES).map(([k, n]) => `<div class="item"><button class="btn small" data-gmplay="${k}">${ic('speaker')}</button><div class="grow"><div>${n}</div><div class="muted">${db.prefs.gmKey ? 'Gemini · محتاج نت' : 'حط المفتاح تحت الأول'}</div></div>
      <button class="chip ${gmOn() && db.prefs.gmVoice === k ? 'on' : ''}" data-gmpick="${k}">${gmOn() && db.prefs.gmVoice === k ? '✓ مختار' : 'اختار'}</button></div>`).join('')}</div>
    <p class="muted">كل صوت بياخد 2-3 ثواني. المفتاح المجاني بيسمح بعدد قليل في الدقيقة، فلو جربت أصوات كتير ورا بعض وماشتغلش، استنى دقيقة وجرّب تاني.</p>
    <details style="margin:8px 0 14px" ${db.prefs.gmKey ? '' : 'open'}><summary class="muted">مفتاح Gemini (مرة واحدة)</summary>
      <label class="f">API Key</label><input class="in" id="gmKey" value="${esc(db.prefs.gmKey || '')}" autocomplete="off" placeholder="AIza...">
      <button class="btn block" id="gmSave" style="margin-top:8px">حفظ المفتاح</button>
      <ol class="steps muted" style="margin-top:8px"><li>ادخل <b>aistudio.google.com</b> بحساب جوجل</li><li>اضغط <b>Get API key</b> ← <b>Create API key</b></li><li>انسخ المفتاح والصقه هنا</li></ol>
      <p class="muted">مجاني في حدود معينة في اليوم. جملة الرد بس اللي بتتبعت لجوجل عشان تتقري، وباقي بياناتك على موبايلك.</p></details>
    <h3>صوت مصري طبيعي (Azure)</h3>
    <div class="list">${Object.entries(AZ_VOICES).map(([k, n]) => `<div class="item"><button class="btn small" data-azplay="${k}">${ic('speaker')}</button><div class="grow"><div>${n}</div><div class="muted">${db.prefs.azKey ? 'Microsoft Azure · محتاج نت' : 'حط المفتاح تحت الأول'}</div></div><span class="pill">طبيعي</span>
      <button class="chip ${azOn() && (db.prefs.azVoice || 'ar-EG-SalmaNeural') === k ? 'on' : ''}" data-azpick="${k}">${azOn() && (db.prefs.azVoice || 'ar-EG-SalmaNeural') === k ? '✓ مختار' : 'اختار'}</button></div>`).join('')}</div>
    <details style="margin:8px 0 14px" ${db.prefs.azKey ? '' : 'open'}><summary class="muted">مفتاح Azure (مرة واحدة)</summary>
      <label class="f">المفتاح (Key)</label><input class="in" id="azKey" value="${esc(db.prefs.azKey || '')}" autocomplete="off" placeholder="الصق المفتاح هنا">
      <label class="f">المنطقة (Region)</label><input class="in" id="azRegion" value="${esc(db.prefs.azRegion || 'westeurope')}" placeholder="westeurope">
      <button class="btn block" id="azSave" style="margin-top:8px">حفظ المفتاح</button>
      <ol class="steps muted" style="margin-top:8px"><li>ادخل portal.azure.com واعمل حساب مجاني</li><li>Create a resource ← <b>Speech</b> ← اختار Free F0 والمنطقة West Europe</li><li>من Keys and Endpoint انسخ <b>Key 1</b> والـ <b>Location</b> وحطهم هنا</li></ol>
      <p class="muted">المجاني 500 ألف حرف في الشهر. جملة الرد بس اللي بتتبعت لـ Microsoft عشان تتقري، وباقي بياناتك على موبايلك.</p></details>
    </details>
`, () => {
    if ($('#vBadReset')) $('#vBadReset').onclick = () => { db.prefs.badVoices = []; save(); openVoicePicker(); };
    document.querySelectorAll('[data-play]').forEach(b => b.onclick = () => { speak.only = b.dataset.play || null; speak.dev = true; speak(VOICE_SAMPLE); speak.only = null; speak.dev = false; });
    document.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => { db.prefs.voiceURI = b.dataset.pick; db.prefs.azVoice = 'off'; db.prefs.gmVoice = 'off'; save(); openVoicePicker(); toast('تم اختيار الصوت'); });
    $('#gmSave').onclick = () => { db.prefs.gmKey = $('#gmKey').value.trim(); if (!db.prefs.gmVoice || db.prefs.gmVoice === 'off') db.prefs.gmVoice = 'Kore'; save(); speak.gm = db.prefs.gmVoice; speak(VOICE_SAMPLE); speak.gm = null; openVoicePicker(); };
    const gmRead = () => { if ($('#gmKey').value.trim()) db.prefs.gmKey = $('#gmKey').value.trim(); return !!db.prefs.gmKey || (toast('حط مفتاح Gemini الأول'), false); };
    document.querySelectorAll('[data-gmplay]').forEach(b => b.onclick = () => { if (!gmRead()) return; toast('ثانية...'); speak.gm = b.dataset.gmplay; speak(VOICE_SAMPLE); speak.gm = null; });
    document.querySelectorAll('[data-gmpick]').forEach(b => b.onclick = () => { if (!gmRead()) return; db.prefs.gmVoice = b.dataset.gmpick; save(); openVoicePicker(); toast('تم اختيار ' + b.dataset.gmpick); });
    const azRead = () => { db.prefs.azKey = $('#azKey').value.trim(); db.prefs.azRegion = ($('#azRegion').value.trim() || 'westeurope').toLowerCase().replace(/\s+/g, ''); };
    $('#azSave').onclick = () => { azRead(); if (db.prefs.azVoice === 'off' || !db.prefs.azVoice) db.prefs.azVoice = 'ar-EG-SalmaNeural'; db.prefs.gmVoice = 'off'; save(); speak.az = db.prefs.azVoice; speak(VOICE_SAMPLE); speak.az = null; openVoicePicker(); };
    document.querySelectorAll('[data-azplay]').forEach(b => b.onclick = () => { if ($('#azKey').value.trim()) azRead(); if (!db.prefs.azKey) return toast('حط مفتاح Azure الأول'); speak.az = b.dataset.azplay; speak(VOICE_SAMPLE); speak.az = null; });
    document.querySelectorAll('[data-azpick]').forEach(b => b.onclick = () => { if ($('#azKey').value.trim()) azRead(); if (!db.prefs.azKey) return toast('حط مفتاح Azure الأول'); db.prefs.azVoice = b.dataset.azpick; db.prefs.gmVoice = 'off'; save(); openVoicePicker(); toast('تم اختيار ' + AZ_VOICES[b.dataset.azpick]); });
  });
}
function voiceSettingsHtml() {
  const list = arVoices();
  return `<h3 style="margin-top:16px">صوت المساعد</h3>
    <label class="row"><input type="checkbox" id="stVoiceOn" ${db.prefs.voiceOff ? '' : 'checked'}> المساعد يرد بالصوت (لو قفلته هيرد بالكتابة بس)</label>
    <button class="btn primary block" id="stVoices" style="margin-top:8px">${ic('speaker')} اسمع أمثلة الأصوات واختار (${list.length})</button>
    <label class="f">السرعة</label><div class="chips">${[[0.8, 'بطيء'], [0.95, 'عادي'], [1.1, 'سريع']].map(([r, t]) => `<button class="chip ${(db.prefs.voiceRate || 0.95) === r ? 'on' : ''}" data-vr="${r}">${t}</button>`).join('')}</div>
    <button class="btn block" id="stVoiceTest" style="margin-top:8px">${ic('speaker')} جرّب الصوت</button>
    <p class="muted">لصوت أوضح على الآيفون: الإعدادات ← تسهيلات الاستخدام ← المحتوى المنطوق ← الأصوات ← العربية، ونزّل صوت «Majed» أو «Laila» بنسخة <b>Enhanced/محسّن</b>، وبعدين اختاره هنا.</p>`;
}
const NUM_WORDS = { 'واحد': 1, 'واحده': 1, 'اتنين': 2, 'اثنين': 2, 'تلاته': 3, 'ثلاثه': 3, 'اربعه': 4, 'خمسه': 5, 'سته': 6, 'سبعه': 7, 'تمانيه': 8, 'ثمانيه': 8, 'تسعه': 9, 'عشره': 10,
  'حداشر': 11, 'اتناشر': 12, 'تلتاشر': 13, 'اربعتاشر': 14, 'خمستاشر': 15, 'ستاشر': 16, 'سبعتاشر': 17, 'تمنتاشر': 18, 'تسعتاشر': 19,
  'عشرين': 20, 'تلاتين': 30, 'ثلاثين': 30, 'اربعين': 40, 'خمسين': 50, 'ستين': 60, 'سبعين': 70, 'تمانين': 80, 'ثمانين': 80, 'تسعين': 90,
  'ميه': 100, 'مائه': 100, 'مية': 100, 'ميتين': 200, 'مئتين': 200, 'تلتميه': 300, 'ثلاثمائه': 300, 'ربعميه': 400, 'اربعمائه': 400, 'خمسميه': 500, 'خمسمائه': 500,
  'ستميه': 600, 'سبعميه': 700, 'تمنميه': 800, 'تسعميه': 900, 'نص': .5 };
function wordsToNumber(t) {
  let total = 0, cur = 0, found = false;
  for (let w of t.split(/\s+/)) {
    w = w.replace(/^و(?=.{2,})/, '').replace(/ة/g, 'ه');
    if (NUM_WORDS[w] != null) { cur += NUM_WORDS[w]; found = true; }
    else if (/^(الف|ألف|آلاف|الاف)$/.test(w)) { total += (cur || 1) * 1000; cur = 0; found = true; }
    else if (/^(الفين|ألفين)$/.test(w)) { total += 2000; found = true; }
    else if (/^مليون$/.test(w)) { total += (cur || 1) * 1e6; cur = 0; found = true; }
  }
  return found ? total + cur : null;
}
const VOICE_SYN = { cat_food: ['اكل', 'أكل', 'مطعم', 'مطاعم', 'طعام', 'غدا', 'عشا', 'فطار', 'سوبر ماركت', 'بقاله'], cat_transport: ['مواصلات', 'بنزين', 'اوبر', 'تاكسي', 'عربيه', 'مترو'],
  cat_bills: ['فاتوره', 'فواتير', 'كهربا', 'كهرباء', 'مياه', 'غاز', 'نت'], cat_shopping: ['تسوق', 'شوبينج', 'مشتريات'], cat_health: ['دكتور', 'دوا', 'علاج', 'صيدليه', 'صحه'],
  cat_fun: ['خروج', 'سينما', 'ترفيه', 'كافيه', 'قهوه'], cat_telecom: ['رصيد', 'شحن', 'موبايل', 'باقه'], cat_clothes: ['هدوم', 'لبس', 'ملابس', 'جزمه'], cat_rent: ['ايجار', 'إيجار'],
  cat_edu: ['دروس', 'مدرسه', 'كورس', 'جامعه'], cat_gifts: ['هديه', 'هدايا'], cat_salary: ['مرتب', 'راتب'], cat_bonus: ['مكافأه', 'بونص'] };
function parseVoice(raw) {
  const t = normDigits(raw).toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
  if (/(^|\s)(كم|كام|قد ايه|اد ايه|بكام|اجمالي)\s/.test(t + ' ') && !/^(صرفت|دفعت|اشتريت)\s+\d/.test(t)) return { question: true, text: raw };
  const m = /(\d+(?:[.,]\d+)?)/.exec(t.replace(/(\d),(\d{3})/g, '$1$2'));
  const amount = m ? parseFloat(m[1].replace(',', '.')) : wordsToNumber(t);
  const income = /(دخل|قبضت|استلمت|اتحولي|اتحول لي|كسبت|جالي|مرتب|راتب|مكافاه)/.test(t) && !/(صرفت|دفعت|اشتريت)/.test(t);
  let categoryId = null;
  for (const c of db.categories.filter(c => c.isIncome === income)) {
    const names = [lbl(c.name), ...(VOICE_SYN[c.name] || [])].map(x => x.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه'));
    if (names.some(n => n && new RegExp('(^|\\s|ال|ب|ل)' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(t))) { categoryId = c.id; break; }
  }
  const a = db.accounts.find(x => !x.archived && lbl(x.name).length > 1 && t.includes(lbl(x.name).toLowerCase()));
  const mm = /(?:في|من|عند|لدي|علي)\s+(.+)$/.exec(t);
  let merchant = mm ? mm[1].replace(/\d+|جنيه|جنيهات|دولار|ريال|ب?الكارت|ب?الفيزا|كاش/g, '').trim() : '';
  if (categoryId && merchant && [lbl(cat(categoryId).name), ...(VOICE_SYN[cat(categoryId).name] || [])].some(n => merchant.replace(/^ال/, '') === n.replace(/^ال/, ''))) merchant = '';
  if (!categoryId) categoryId = suggestCategory(merchant || t, income ? 'CREDIT' : 'DEBIT');
  return { amount, type: income ? 'INCOME' : 'EXPENSE', categoryId, merchant: merchant.slice(0, 40), accountId: a && a.id };
}
// ينفّذ الأمر الصوتي ويرجّع الرد اللي هيتقال. الإضافة بتتسجّل مباشرة مع إمكانية التراجع.
function handleVoice(text) {
  const t = normDigits(text).replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
  if (/(يومي العادي|زي العادي|زي كل يوم|نفس كل يوم|زي امبارح)/.test(t)) {
    const miss = missedDays(); const today = !db.txns.some(x => x.type === 'EXPENSE' && x.date >= dayStart(Date.now()));
    const days = /(امبارح|الايام|فاتت)/.test(t) ? miss : today ? [Date.now()] : miss;
    if (!days.length) return { reply: 'مفيش أيام ناقصة، كل حاجة متسجلة' };
    const r = fillUsual(days); render();
    if (!r.n) return { reply: 'لسه مش عارف يومك العادي، سجّل مصاريفك كام يوم الأول' };
    return { reply: `سجّلت ${Math.round(r.total)} جنيه تقديري لـ ${days.length === 1 ? 'يوم' : days.length + ' أيام'}، وتقدر تعدّلها من الحركات` };
  }
  const hr = helpReply(t); if (hr) return hr;
  const p = dailyPlan();
  if (/(فاضل|باقي|متبقي|اقدر اصرف|ممكن اصرف|مسموح)/.test(t)) {
    if (!p.incBase) return { reply: 'سجّل دخلك الأول عشان أعرف أحسبلك' };
    return { reply: `فاضلك ${Math.round(Math.max(0, p.remaining))} جنيه للشهر، يعني تقدر تصرف حوالي ${Math.round(p.daily)} في اليوم. صرفت النهارده ${Math.round(p.todaySpent)}.` };
  }
  if (/(ساعه|ساعات)/.test(t) && /\d/.test(t)) {
    const v = parseFloat((t.match(/\d+(\.\d+)?/) || [])[0]);
    if (!hourRate()) return { reply: 'سجّل مرتبك وساعات شغلك من بياناتي المالية الأول' };
    return { reply: `${v} جنيه = ${workTime(v)}` };
  }
  if (/(سيوله|هفلس|افلس|افلاس|حالتي|وضعي|القبض)/.test(t)) {
    if (!hasProfile()) return { reply: 'سجّل مرتبك ويوم القبض من بياناتي المالية عشان أقدر أحسب' };
    const cp = cashPlan(); const d = riskAlerts(cp).find(x => x.lvl === 'danger' || x.lvl === 'warn');
    return { reply: `${{ ok: 'وضعك آمن', warn: 'خلي بالك', danger: 'في خطر سيولة' }[cp.level]}. باقي ${cp.cyc.left} يوم على القبض، والآمن تصرفه ${Math.round(cp.safeDaily)} في اليوم.${d ? ' ' + d.text.replace(/<[^>]+>/g, '') : ''}` };
  }
  if (/(ثابت|الثابته)/.test(t) && !/\d/.test(t)) return { reply: `مصاريفك الثابتة حوالي ${Math.round(fixedMonthly())} في الشهر${prof().salary ? `، يعني ${Math.round(fixedMonthly() / prof().salary * 100)}% من مرتبك` : ''}` };
  if (/(اقتراح|نصيحه|نصيحة|انصحني|اعمل ايه)/.test(t)) return { reply: p.tips.map(x => x.text.replace(/<[^>]+>/g, '')).join('. ') };
  // أسئلة إضافية بيجاوب عليها المساعد المحلي من غير إنترنت
  if (!/\d/.test(t)) {
    const [f, to] = monthRange(0); const month = inRange(f, to);
    const [inc, exp] = typeTotals(month);
    const [lf, lt] = monthRange(-1); const lastExp = typeTotals(inRange(lf, lt))[1];
    const n = v => Math.round(v);
    if (/(اكبر|اعلي|اغلي) (مصروف|حاجه|حركه)/.test(t)) {
      const top = month.filter(x => x.type === 'EXPENSE').sort((a, b) => conv(b.amount, txCur(b)) - conv(a.amount, txCur(a)))[0];
      if (!top) return { reply: 'مفيش مصروفات الشهر ده لسه' };
      const c = cat(top.categoryId);
      return { reply: `أكبر مصروف الشهر ده ${n(top.amount)} ${top.merchant ? 'في ' + top.merchant : c ? 'على ' + lbl(c.name) : ''}` };
    }
    if (/(اكتر تصنيف|بصرف علي ايه|صارف علي ايه|فلوسي بتروح)/.test(t)) {
      const cats = catTotals(month, 'EXPENSE'); const k = Object.keys(cats).sort((a, b) => cats[b] - cats[a]).slice(0, 3);
      if (!k.length) return { reply: 'مفيش مصروفات الشهر ده لسه' };
      return { reply: 'أكتر حاجات بتصرف عليها: ' + k.map(id => `${cat(+id) ? lbl(cat(+id).name) : 'بدون تصنيف'} ${n(cats[id])}`).join('، ') };
    }
    if (/(الشهر اللي فات|الشهر الماضي|مقارنه|قارن)/.test(t) && !/(كام صرفت|كم صرفت)/.test(t)) {
      if (!lastExp) return { reply: `صرفت الشهر ده ${n(exp)}، ومفيش بيانات للشهر اللي فات` };
      const d = (exp - lastExp) / lastExp * 100;
      return { reply: `صرفت الشهر ده ${n(exp)} مقابل ${n(lastExp)} الشهر اللي فات، يعني ${d >= 0 ? 'أكتر' : 'أقل'} بـ ${n(Math.abs(d))}%` };
    }
    if (/(توقع|هخلص|اخر الشهر|نهايه الشهر)/.test(t)) {
      const now = new Date(); const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const fc = exp / now.getDate() * days;
      return { reply: `لو كملت بنفس المعدل هتصرف حوالي ${n(fc)} لحد آخر الشهر${p.incBase ? `، وده ${fc > p.incBase ? 'أكتر من' : 'أقل من'} دخلك` : ''}` };
    }
    if (/(ميزاني)/.test(t)) {
      const cats = catTotals(month, 'EXPENSE');
      const bs = db.categories.filter(c => c.monthlyBudget > 0 && !c.isIncome);
      if (!bs.length) return { reply: 'مفيش ميزانيات متحددة. تقدر تحددها من التصنيفات' };
      return { reply: bs.map(c => `${lbl(c.name)} ${n((cats[c.id] || 0) / c.monthlyBudget * 100)}%`).join('، ') + ' من الميزانية' };
    }
    if (/(ادخرت|وفرت|حوشت|الادخار)/.test(t)) {
      if (!inc) return { reply: 'مفيش دخل متسجّل الشهر ده عشان أحسب الادخار' };
      return { reply: `وفّرت الشهر ده ${n(inc - exp)}، يعني ${n((inc - exp) / inc * 100)}% من دخلك، والهدف ${db.prefs.savingRate || 20}%` };
    }
    if (/(النهارده|اليوم) .*(صرفت)|صرفت (النهارده|اليوم)/.test(t)) return { reply: `صرفت النهارده ${n(p.todaySpent)}، وحدّك اليومي ${n(p.daily)}` };
    if (/(قسط|اقساط)/.test(t)) {
      const ns = db.installments.map(x => [x, nextInstallment(x)]).filter(x => x[1]).sort((a, b) => a[1].date - b[1].date);
      if (!ns.length) return { reply: 'مفيش أقساط جاية' };
      const tot = ns.reduce((s0, x) => s0 + x[1].payment, 0); const last = ns.map(x => planDates(x[0])).sort((a, b) => b.end - a.end)[0];
      return { reply: `عندك ${ns.length} تقسيط بإجمالي ${n(tot)} في الشهر. أقرب قسط ${ns[0][0].name} بـ ${n(ns[0][1].payment)} يوم ${fmtDate(ns[0][1].date)}، وآخر قسط هيخلص ${fmtDate(last.end)}` };
    }
    if (/(مساعده|تقدر تعمل ايه|بتعمل ايه|اوامر)/.test(t)) return { reply: 'قول مثلاً: إزاي أضيف مصروف ثابت، جولة، صرفت 200 أكل، قبضت 5000، فاضلي كام، حالتي المالية، 500 جنيه تساوي كام ساعة، مصاريفي الثابتة، أكبر مصروف، قارن بالشهر اللي فات، توقع آخر الشهر، الميزانية، وفرت كام، أو اقتراح' };
  }
  if (/(صافي|بعد الاقساط|المركز المالي)/.test(t) && !/\d/.test(t)) {
    const ps = positions();
    return { reply: `رصيدك الحالي ${Math.round(ps.total)}، وبعد أقساط الشهر ${Math.round(ps.afterInst)}، وصافي رصيدك بعد كل الديون والأقساط ${Math.round(ps.net)}` };
  }
  if (/(رصيدي|رصيد|معايا كام)/.test(t) && !/\d/.test(t)) {
    const b = balances(); const tot = db.accounts.filter(a => !a.archived).reduce((s, a) => s + conv(b[a.id] || 0, a.currency), 0);
    return { reply: `إجمالي رصيدك ${Math.round(tot)} ${base() === 'EGP' ? 'جنيه' : base()}` };
  }
  const r = parseVoice(text);
  if (r.question) { const d = document.createElement('div'); askNl(text, d); return { reply: d.textContent.replace('عرض', '').trim() || 'ماعرفتش أجاوب على ده' }; }
  if (!(r.amount > 0)) return { reply: 'مافهمتش. قول مثلاً: صرفت 200 أكل، أو فاضلي كام، أو قول «أوامر» تعرف أقدر أعمل إيه' };
  const accountId = r.accountId || (db.accounts.find(a => !a.archived && a.type !== 'CREDIT') || db.accounts[0] || {}).id;
  if (!accountId) return { reply: 'أضف حساب الأول' };
  const id = newId();
  db.txns.push({ id, type: r.type, amount: r.amount, accountId, categoryId: r.categoryId, merchant: r.merchant, note: 'بالصوت', date: Date.now(), source: 'VOICE' });
  if (r.categoryId && r.merchant) learn(r.merchant, r.categoryId);
  save(); render();
  const c = cat(r.categoryId);
  return { reply: `سجّلت ${r.type === 'INCOME' ? 'دخل' : 'مصروف'} ${r.amount}${c ? ' على ' + lbl(c.name) : ''}${r.merchant ? ' من ' + r.merchant : ''}`, undoId: id };
}

// المساعد الصغير العائم: زر مايك صغير، يسمع ويرد في فقاعة صغيرة
let vRec = null;
function voiceBubble(state, text, undoId, go) {
  const b = $('#vbubble'); b.classList.remove('hidden');
  b.innerHTML = `<div class="row between"><b>${state}</b><button class="x" id="vbX">✕</button></div>${text ? `<div class="vb-text">${esc(text)}</div>` : ''}${undoId ? '<button class="btn small" id="vbUndo">تراجع</button> <button class="btn small" id="vbEdit">تعديل</button>' : ''}${go ? `<button class="btn small primary" id="vbGo">افتح ${esc(go.goLabel)}</button>` : ''}`;
  if (go) $('#vbGo').onclick = () => { b.classList.add('hidden'); go.go(); };
  $('#vbX').onclick = () => { b.classList.add('hidden'); if (vRec) vRec.abort(); speechSynthesis && speechSynthesis.cancel(); };
  if (undoId) {
    $('#vbUndo').onclick = () => { db.txns = db.txns.filter(x => x.id !== undoId); save(); render(); voiceBubble('اتلغت', ''); setTimeout(() => b.classList.add('hidden'), 1200); };
    $('#vbEdit').onclick = () => { b.classList.add('hidden'); openTxn(db.txns.find(x => x.id === undoId)); };
  }
}
function quickVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return openVoice();
  if (vRec) { vRec.stop(); return; }
  let heard = '';
  vRec = new SR(); vRec.lang = 'ar-EG'; vRec.interimResults = true;
  $('#vfab').classList.add('on'); voiceBubble('بسمعك...', 'قول: صرفت 150 أكل، أو فاضلي كام؟');
  vRec.onresult = e => { heard = [...e.results].map(x => x[0].transcript).join(' '); voiceBubble('بسمعك...', heard); };
  vRec.onerror = e => { voiceBubble(e.error === 'not-allowed' ? 'المايك مش مسموح' : 'ماسمعتش كويس', e.error === 'not-allowed' ? 'اسمح بالمايك من إعدادات الآيفون، أو اكتب الأمر' : 'اضغط على المايك وجرّب تاني'); };
  vRec.onend = () => {
    vRec = null; $('#vfab').classList.remove('on');
    if (!heard.trim()) return;
    const r = handleVoice(heard);
    if (r.silent) return;
    voiceBubble('«' + heard + '»', r.reply, r.undoId, r.go && r); setTimeout(() => speak(r.reply), 700);
  };
  try { vRec.start(); } catch (e) { vRec = null; $('#vfab').classList.remove('on'); openVoice(); }
}

function openVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  sheet('المساعد الصوتي', `
    <p class="muted">قول مثلاً: «صرفت 150 جنيه أكل من طلبات» أو «قبضت المرتب 25000» أو «كام صرفت على المواصلات الشهر ده».</p>
    ${SR ? `<button class="mic-big" id="vMic">${ic('mic')}</button><div class="muted" id="vState" style="text-align:center">اضغط واتكلم</div>` : ''}
    <textarea class="in" id="vText" placeholder="${SR ? 'الكلام هيظهر هنا ويمكنك تعديله' : 'اضغط على المايك في كيبورد الآيفون واتكلم، أو اكتب'}" style="min-height:80px;margin-top:10px"></textarea>
    <div class="btns"><button class="btn primary" id="vGo">تنفيذ</button><button class="btn" id="vTips">${ic('speaker')} اسمع اقتراح النهارده</button></div>
    <div id="vOut" style="margin-top:10px"></div>
    <button class="btn block" id="vPick" style="margin-top:8px">${ic('speaker')} غيّر صوت المساعد</button>
    <h3 style="margin-top:16px">ساعدني أفهم البرنامج</h3>
    <button class="btn primary block" id="vTour">${ic('sparkle')} جولة صوتية في البرنامج</button>
    <div class="chips" style="margin-top:10px;flex-wrap:wrap">${HELP.map((h, i) => `<button class="chip" data-hp="${i}">${h.t}</button>`).join('')}</div>
    <p class="muted">أو اسأل بصوتك: «إزاي أضيف مصروف ثابت؟» «يعني إيه حد الأمان؟» «اشرح الصفحة دي».</p>`, () => {
    $('#vTour').onclick = startTour;
    $('#vPick').onclick = openVoicePicker;
    document.querySelectorAll('[data-hp]').forEach(b => b.onclick = () => { const h = HELP[+b.dataset.hp]; $('#vOut').innerHTML = insH('bulb', `<b>${h.t}</b><br>${esc(h.a)}`) + (h.go ? '<button class="btn small primary" id="vOpen">افتحها</button>' : ''); if (h.go) $('#vOpen').onclick = h.go; speak(h.a); $('#vOut').scrollIntoView({ behavior: 'smooth' }); });
    const out = $('#vOut');
    const run = () => {
      const text = $('#vText').value.trim(); if (!text) return toast('قول أو اكتب حاجة الأول');
      const r = handleVoice(text);
      if (r.silent) return;
      out.innerHTML = insH(r.undoId ? 'sparkle' : 'speaker', esc(r.reply)) + (r.undoId ? '<button class="btn small" id="vUndo">تراجع</button>' : '') + (r.go ? `<button class="btn small primary" id="vOpen">افتح ${esc(r.goLabel)}</button>` : '');
      if (r.go) $('#vOpen').onclick = r.go;
      setTimeout(() => speak(r.reply), 600);
      if (r.undoId) $('#vUndo').onclick = () => { db.txns = db.txns.filter(x => x.id !== r.undoId); save(); out.innerHTML = insH('alert', 'اتلغت'); };
      $('#vText').value = '';
    };
    $('#vGo').onclick = run;
    $('#vTips').onclick = () => speak(dailyPlan().tips.map(x => x.text.replace(/<[^>]+>/g, '')).join('. '));
    if (SR) {
      let rec = null;
      $('#vMic').onclick = () => {
        if (rec) { rec.stop(); return; }
        rec = new SR(); rec.lang = 'ar-EG'; rec.interimResults = true; rec.continuous = false;
        $('#vMic').classList.add('on'); $('#vState').textContent = 'بسمعك...';
        rec.onresult = e => { $('#vText').value = [...e.results].map(r => r[0].transcript).join(' '); };
        rec.onerror = e => { $('#vState').textContent = e.error === 'not-allowed' ? 'اسمح للتطبيق باستخدام المايك من الإعدادات' : 'ماسمعتش كويس، جرّب تاني'; };
        rec.onend = () => { rec = null; $('#vMic').classList.remove('on'); if ($('#vText').value.trim()) { $('#vState').textContent = 'تمام'; run(); } else if ($('#vState').textContent === 'بسمعك...') $('#vState').textContent = 'اضغط واتكلم'; };
        try { rec.start(); } catch (e) { rec = null; $('#vMic').classList.remove('on'); }
      };
    }
  });
}

// ================= النوافذ =================
function sheet(title, html, onReady) {
  $('#sheetTitle').textContent = title;
  $('#sheetBody').innerHTML = html;
  $('#sheet').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (onReady) onReady($('#sheetBody'));
}
function closeSheet() { $('#sheet').classList.add('hidden'); document.body.style.overflow = ''; render(); }

const accOptions = (sel, filterFn = () => true) => db.accounts.filter(a => !a.archived || a.id === sel).filter(filterFn).map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(lbl(a.name))} (${a.currency})</option>`).join('');
const catOptions = (income, sel) => `<option value="">بدون تصنيف</option>` + db.categories.filter(c => c.isIncome === income).map(c => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.icon} ${esc(lbl(c.name))}</option>`).join('');

function openTxn(t, preset) {
  const isNew = !t;
  t = t || Object.assign({ type: 'EXPENSE', amount: '', accountId: (db.accounts.find(a => !a.archived) || {}).id, categoryId: null, merchant: '', note: '', date: Date.now() }, preset || {});
  let type = t.type;
  const fixedOf = () => t.fixedId && db.recurring.find(r => r.id === t.fixedId);
  const draw = () => sheet(isNew ? 'حركة جديدة' : 'تعديل حركة', `
    <div class="seg"><button data-ty="EXPENSE" class="${type === 'EXPENSE' ? 'on e' : ''}">مصروف</button><button data-ty="INCOME" class="${type === 'INCOME' ? 'on i' : ''}">دخل</button><button data-ty="TRANSFER" class="${type === 'TRANSFER' ? 'on' : ''}">تحويل</button></div>
    <label class="f">المبلغ</label><input class="in num" id="tAmt" inputmode="decimal" value="${t.amount}" placeholder="0.00" style="font-size:24px;text-align:center">
    <div id="tHrs" class="muted hrs"></div>
    ${isNew && type === 'EXPENSE' ? txnSuggestions() : ''}
    <label class="f">${type === 'TRANSFER' ? 'من حساب' : 'الحساب'}</label><select class="in" id="tAcc">${accOptions(t.accountId)}</select>
    ${type === 'TRANSFER' ? `<label class="f">إلى حساب</label><select class="in" id="tTo">${accOptions(t.toAccountId)}</select>
      <label class="f">المبلغ المستلم (إن كانت العملة مختلفة)</label><input class="in num" id="tToAmt" inputmode="decimal" value="${t.toAmount ?? ''}">`
      : `<label class="f">التصنيف</label><select class="in" id="tCat">${catOptions(type === 'INCOME', t.categoryId)}</select>`}
    <label class="f">${type === 'INCOME' ? 'المصدر' : 'التاجر / الوصف'}</label><input class="in" id="tMer" value="${esc(t.merchant)}">
    <label class="f">ملاحظة</label><input class="in" id="tNote" value="${esc(t.note)}">
    <label class="f">التاريخ</label><input class="in" id="tDate" type="datetime-local" value="${toLocalInput(t.date)}">
    ${type === 'EXPENSE' ? (fixedOf() ? `<div class="insight" style="margin-top:12px">📌 مصروف ثابت: ${esc(fixedOf().merchant || '')} (${PERIODS[fixedOf().period]})</div>` : `
    <label class="row" style="margin-top:12px"><input type="checkbox" id="tFix" ${t.makeFixed ? 'checked' : ''}> مصروف ثابت (يدخل في التوقعات والتنبيهات)</label>
    <div id="tFixOpt" class="${t.makeFixed ? '' : 'hidden'}" style="margin-top:8px">
      <div class="seg">${['DAILY', 'WEEKLY', 'MONTHLY'].map(k => `<button data-fp="${k}" class="${(t.fixPeriod || 'MONTHLY') === k ? 'on' : ''}">${PERIODS[k]}</button>`).join('')}</div>
      <label class="row" style="margin-top:8px"><input type="checkbox" id="tFixAuto" ${t.fixAuto ? 'checked' : ''}> سجّله تلقائياً في معاده</label>
    </div>`) : ''}
    <div class="btns"><button class="btn primary" id="tSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="tDel">حذف</button>'}</div>`, body => {
    const hrs = () => { const v = parseAmount($('#tAmt').value); const a = acc(+$('#tAcc').value); $('#tHrs').textContent = type === 'EXPENSE' && v ? '⏱️ = ' + workTime(conv(v, a ? a.currency : base())) : ''; };
    $('#tAmt').oninput = hrs; hrs();
    if ($('#tFix')) $('#tFix').onchange = e => $('#tFixOpt').classList.toggle('hidden', !e.target.checked);
    body.querySelectorAll('[data-fp]').forEach(b => b.onclick = () => { t.fixPeriod = b.dataset.fp; body.querySelectorAll('[data-fp]').forEach(x => x.classList.toggle('on', x === b)); });
    body.querySelectorAll('[data-sg]').forEach(b => b.onclick = () => {
      readForm(); const g = JSON.parse(b.dataset.sg);
      Object.assign(t, { amount: g.amount, categoryId: g.categoryId, merchant: g.merchant, fixedId: g.fixedId || null });
      if (g.accountId && acc(g.accountId)) t.accountId = g.accountId;
      draw();
    });
    body.querySelectorAll('[data-ty]').forEach(b => b.onclick = () => { readForm(); type = b.dataset.ty; t.categoryId = null; draw(); });
    const mer = $('#tMer');
    mer.onblur = () => { const c = $('#tCat'); if (c && !c.value && mer.value.trim()) { const s = suggestCategory(mer.value, type === 'INCOME' ? 'CREDIT' : 'DEBIT'); if (s && cat(s) && cat(s).isIncome === (type === 'INCOME')) c.value = s; } };
    $('#tSave').onclick = () => {
      readForm();
      const amt = parseAmount(t.amount);
      if (!(amt > 0)) return toast('أدخل مبلغاً صحيحاً');
      if (!t.accountId) return toast('أضف حساباً أولاً');
      if (type === 'TRANSFER' && (!t.toAccountId || t.toAccountId === t.accountId)) return toast('اختر حساباً مختلفاً للتحويل');
      const rec = { id: t.id || newId(), type, amount: amt, accountId: t.accountId, toAccountId: type === 'TRANSFER' ? t.toAccountId : null,
        toAmount: type === 'TRANSFER' ? parseAmount(t.toAmount) : null, categoryId: type === 'TRANSFER' ? null : t.categoryId,
        merchant: t.merchant.trim(), note: t.note.trim(), date: t.date, source: t.source === 'ESTIMATE' ? 'MANUAL' : t.source || 'MANUAL', hash: t.hash || null, fixedId: type === 'EXPENSE' ? t.fixedId || null : null };
      if (rec.type === 'EXPENSE') linkFixed(rec, isNew, t.makeFixed && { period: t.fixPeriod || 'MONTHLY', auto: !!t.fixAuto });
      const i = db.txns.findIndex(x => x.id === rec.id);
      if (i >= 0) db.txns[i] = rec; else db.txns.push(rec);
      if (t.inboxId) { const m = db.inbox.find(x => x.id === t.inboxId); if (m) m.status = 'ACCEPTED'; const a = acc(rec.accountId); if (m && m.parsed.last4 && a && !a.last4) a.last4 = m.parsed.last4; }
      if (rec.categoryId && rec.merchant) learn(rec.merchant, rec.categoryId);
      save(); closeSheet(); toast('تم الحفظ');
    };
    if (!isNew) $('#tDel').onclick = () => { if (confirm('حذف هذه الحركة؟')) { db.txns = db.txns.filter(x => x.id !== t.id); save(); closeSheet(); } };
    if (isNew && !t.amount) setTimeout(() => { const el = $('#tAmt'); if (el) el.focus(); }, 250);
  });
  function readForm() {
    t.amount = $('#tAmt').value; t.accountId = +$('#tAcc').value; t.merchant = $('#tMer').value; t.note = $('#tNote').value;
    const d = new Date($('#tDate').value).getTime(); if (isFinite(d)) t.date = d;
    if ($('#tCat')) t.categoryId = +$('#tCat').value || null;
    if ($('#tTo')) { t.toAccountId = +$('#tTo').value; t.toAmount = $('#tToAmt').value; }
    if ($('#tFix')) { t.makeFixed = $('#tFix').checked; t.fixAuto = $('#tFixAuto').checked; }
  }
  draw();
}

function openSmsPaste() {
  sheet('لصق رسالة بنك', `
    <p class="muted">الآيفون لا يسمح للتطبيقات بقراءة الرسائل تلقائياً. انسخ رسالة البنك من تطبيق الرسائل والصقها هنا، وسيتعرّف التطبيق على المبلغ والنوع والتاجر.</p>
    <textarea class="in" id="smsTxt" placeholder="الصق نص الرسالة هنا (يمكن لصق أكثر من رسالة، افصل بينها بسطر فارغ)"></textarea>
    <div class="btns"><button class="btn" id="smsPaste">📋 لصق من الحافظة</button><button class="btn primary" id="smsGo">تحليل</button></div>
    <div id="smsOut" style="margin-top:10px"></div>`, () => {
    $('#smsPaste').onclick = async () => { try { $('#smsTxt').value = await navigator.clipboard.readText(); } catch (e) { toast('اضغط مطولاً داخل الخانة واختر «لصق»'); } };
    $('#smsGo').onclick = () => {
      const r = ingestMessages($('#smsTxt').value);
      if (!r.added && !r.auto && !r.dup) { $('#smsOut').innerHTML = '<div class="insight w">لم يتم التعرف على حركة مالية في النص.</div>'; return; }
      reportIngest(r); closeSheet(); setTab('inbox');
    };
  });
}

function openAccounts() {
  const bal = balances();
  sheet('الحسابات', `<div class="list">${db.accounts.map(a => `<div class="item" data-a="${a.id}"><div class="ico blue">${accIcon(a)}</div>
    <div class="grow"><div>${esc(lbl(a.name))}${a.archived ? ' <span class="muted">(مؤرشف)</span>' : ''}</div><div class="muted">${ACC_TYPES[a.type] || a.type}${a.last4 ? ' · ••' + esc(a.last4) : ''}</div></div>
    <div class="num">${money(bal[a.id] || 0)} <small class="muted">${a.currency}</small></div></div>`).join('')}</div>
    <button class="btn primary block" id="aNew" style="margin-top:10px">＋ حساب جديد</button>`, () => {
    document.querySelectorAll('[data-a]').forEach(el => el.onclick = () => editAccount(acc(+el.dataset.a)));
    $('#aNew').onclick = () => editAccount();
  });
}
function editAccount(a, fromCards) {
  const isNew = !a; a = a || { name: '', type: fromCards ? 'CREDIT' : 'BANK', currency: base(), initialBalance: 0, last4: '', archived: false };
  let type = a.type;
  const draw = () => sheet(isNew ? (type === 'CREDIT' ? 'بطاقة ائتمان جديدة' : 'حساب جديد') : 'تعديل حساب', `
    <label class="f">الاسم</label><input class="in" id="aName" value="${esc(lbl(a.name))}" placeholder="${type === 'CREDIT' ? 'مثال: فيزا CIB' : ''}">
    <label class="f">النوع</label><select class="in" id="aType">${Object.entries(ACC_TYPES).map(([k, v]) => `<option value="${k}" ${type === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <label class="f">العملة</label><select class="in" id="aCur">${CURRENCIES.map(c => `<option ${a.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
    ${type === 'CREDIT' ? `
      <label class="f">الحد الائتماني</label><input class="in num" id="aLim" inputmode="decimal" value="${a.creditLimit || ''}">
      <label class="f">المبلغ المستحق عليها حالياً</label><input class="in num" id="aBal" inputmode="decimal" value="${-(a.initialBalance || 0) || 0}">
      <div class="grid2"><div><label class="f">يوم كشف الحساب</label><input class="in num" id="aSt" inputmode="numeric" value="${a.statementDay || ''}" placeholder="مثال 25"></div>
      <div><label class="f">آخر يوم للسداد</label><input class="in num" id="aDue" inputmode="numeric" value="${a.dueDay || ''}" placeholder="مثال 15"></div></div>
      <div class="grid2"><div><label class="f">المطلوب في الكشف (أقساط + استخدام)</label><input class="in num" id="aStmt" inputmode="decimal" value="${a.stmtDue || ''}" placeholder="من تطبيق البنك"></div>
      <div><label class="f">آخر ميعاد لسداده</label><input class="in" type="date" id="aStmtD" value="${a.stmtDate ? fmtDate(a.stmtDate) : ''}"></div></div>`
      : `<label class="f">الرصيد الافتتاحي</label><input class="in num" id="aBal" inputmode="decimal" value="${a.initialBalance}">`}
    <label class="f">آخر 4 أرقام من البطاقة/الحساب (لربط رسائل البنك)</label><input class="in num" id="aL4" inputmode="numeric" maxlength="4" value="${esc(a.last4)}">
    ${isNew ? '' : `<label class="row" style="margin-top:12px"><input type="checkbox" id="aArc" ${a.archived ? 'checked' : ''}> أرشفة (إخفاء من الرئيسية)</label>`}
    <div class="btns"><button class="btn primary" id="aSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="aDel">حذف</button>'}</div>`, () => {
    $('#aType').onchange = e => { a = { ...a, name: $('#aName').value, currency: $('#aCur').value }; type = e.target.value; draw(); };
    $('#aSave').onclick = () => {
      const name = $('#aName').value.trim(); if (!name) return toast('أدخل اسم الحساب');
      const day = id => { const v = parseInt(normDigits(($(id) || {}).value)); return v >= 1 && v <= 31 ? v : null; };
      const amt = parseAmount($('#aBal').value) || 0;
      const rec = { ...a, id: a.id || newId(), name: name === lbl(a.name) ? a.name : name, type, currency: $('#aCur').value,
        initialBalance: type === 'CREDIT' ? -Math.abs(amt) : amt, last4: $('#aL4').value.trim(), archived: isNew ? false : $('#aArc').checked };
      if (type === 'CREDIT') {
        Object.assign(rec, { creditLimit: parseAmount($('#aLim').value) || 0, statementDay: day('#aSt'), dueDay: day('#aDue') });
        const sd = parseAmount($('#aStmt').value) || 0, sdt = new Date($('#aStmtD').value + 'T09:00').getTime();
        if (sd !== (+a.stmtDue || 0) || sdt !== a.stmtDate) Object.assign(rec, { stmtDue: sd, stmtDate: isFinite(sdt) ? sdt : null, stmtSetAt: Date.now() });
        if (rec.stmtDate && !rec.dueDay) rec.dueDay = new Date(rec.stmtDate).getDate();
      }
      const i = db.accounts.findIndex(x => x.id === rec.id); if (i >= 0) db.accounts[i] = rec; else db.accounts.push(rec);
      save();
      if (fromCards) { closeSheet(); setTab('cards'); } else openAccounts();
      if (rec.currency !== base() && !db.rates[rec.currency]) refreshRates();
    };
    if (!isNew) $('#aDel').onclick = () => {
      if (!confirm('حذف الحساب سيحذف كل حركاته. متأكد؟')) return;
      db.txns = db.txns.filter(t => t.accountId !== a.id && t.toAccountId !== a.id);
      db.recurring = db.recurring.filter(r => r.accountId !== a.id);
      db.accounts = db.accounts.filter(x => x.id !== a.id); save(); openAccounts();
    };
  });
  draw();
}

function openCategories() {
  const sugg = budgetSuggestions();
  const block = inc => db.categories.filter(c => c.isIncome === inc).map(c => `<div class="item" data-c="${c.id}"><div class="ico">${c.icon}</div><div class="grow">${esc(lbl(c.name))}</div>${c.monthlyBudget > 0 ? `<span class="muted num">${money(c.monthlyBudget)}</span>` : ''}</div>`).join('');
  sheet('التصنيفات والميزانيات', `
    ${sugg.length ? `<div class="insight">💡 ميزانيات مقترحة (متوسط آخر 3 أشهر + 10%):<br>${sugg.map(([c, v]) => `${c.icon} ${esc(lbl(c.name))}: <b class="num">${money(v)}</b>`).join('<br>')}
      <div class="btns"><button class="btn small primary" id="cApply">تطبيق الكل</button></div></div>` : ''}
    <h3>المصروفات</h3><div class="list">${block(false)}</div>
    <h3 style="margin-top:12px">الدخل</h3><div class="list">${block(true)}</div>
    <button class="btn primary block" id="cNew" style="margin-top:10px">＋ تصنيف جديد</button>`, () => {
    document.querySelectorAll('[data-c]').forEach(el => el.onclick = () => editCategory(cat(+el.dataset.c)));
    $('#cNew').onclick = () => editCategory();
    if ($('#cApply')) $('#cApply').onclick = () => { sugg.forEach(([c, v]) => c.monthlyBudget = v); save(); toast(`تم تطبيق ${sugg.length} ميزانية`); openCategories(); };
  });
}
function budgetSuggestions() {
  const sums = {};
  for (let o = -3; o <= -1; o++) { const [f, t] = monthRange(o); const m = catTotals(inRange(f, t), 'EXPENSE'); for (const k in m) sums[k] = (sums[k] || 0) + m[k]; }
  const nice = v => v <= 0 ? 0 : v < 100 ? Math.ceil(v / 10) * 10 : v < 1000 ? Math.ceil(v / 50) * 50 : Math.ceil(v / 100) * 100;
  return db.categories.filter(c => !c.isIncome && !(c.monthlyBudget > 0)).map(c => [c, nice((sums[c.id] || 0) / 3 * 1.1)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
}
function editCategory(c) {
  const isNew = !c; c = c || { name: '', isIncome: false, icon: '📦', monthlyBudget: 0 };
  let icon = c.icon;
  sheet(isNew ? 'تصنيف جديد' : 'تعديل تصنيف', `
    <label class="f">الاسم</label><input class="in" id="cName" value="${esc(lbl(c.name))}">
    <label class="f">النوع</label><select class="in" id="cInc"><option value="0" ${!c.isIncome ? 'selected' : ''}>مصروف</option><option value="1" ${c.isIncome ? 'selected' : ''}>دخل</option></select>
    <label class="f">الأيقونة</label><div class="emojis">${EMOJIS.map(e => `<button class="${e === icon ? 'on' : ''}" data-e="${e}">${e}</button>`).join('')}</div>
    <label class="f">الميزانية الشهرية (${base()}) — اتركها 0 لعدم التحديد</label><input class="in num" id="cBud" inputmode="decimal" value="${c.monthlyBudget}">
    <label class="f">نوع المصروف (لخطة الادخار 50/30/20)</label><select class="in" id="cGrp"><option value="NEED" ${catGroup(c) === 'NEED' ? 'selected' : ''}>🏠 احتياج أساسي</option><option value="WANT" ${catGroup(c) === 'WANT' ? 'selected' : ''}>🎉 رغبة / كماليات</option></select>
    <div class="btns"><button class="btn primary" id="cSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="cDel">حذف</button>'}</div>`, body => {
    body.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { icon = b.dataset.e; body.querySelectorAll('[data-e]').forEach(x => x.classList.toggle('on', x === b)); });
    $('#cSave').onclick = () => {
      const name = $('#cName').value.trim(); if (!name) return toast('أدخل اسم التصنيف');
      const rec = { ...c, id: c.id || newId(), name: name === lbl(c.name) ? c.name : name, isIncome: $('#cInc').value === '1', icon, monthlyBudget: parseAmount($('#cBud').value) || 0, group: $('#cGrp').value };
      const i = db.categories.findIndex(x => x.id === rec.id); if (i >= 0) db.categories[i] = rec; else db.categories.push(rec);
      save(); openCategories();
    };
    if (!isNew) $('#cDel').onclick = () => {
      if (!confirm('حذف التصنيف؟ ستبقى الحركات بدون تصنيف.')) return;
      db.txns.forEach(t => { if (t.categoryId === c.id) t.categoryId = null; });
      db.recurring.forEach(r => { if (r.categoryId === c.id) r.categoryId = null; });
      db.categories = db.categories.filter(x => x.id !== c.id); save(); openCategories();
    };
  });
}

function openRecurring() {
  const salary = prof().salary || 0; const fm = fixedMonthly();
  const due = new Set(dueFixed().map(r => r.id));
  const row = r => { const c = cat(r.categoryId); const a = acc(r.accountId);
    return `<div class="item" data-r="${r.id}"><div class="ico">${c ? c.icon : '🔁'}</div><div class="grow"><div class="ellipsis">${esc(r.merchant || (c ? lbl(c.name) : ''))}${r.active ? '' : ' <span class="muted">(متوقف)</span>'}</div>
      <div class="muted">${r.auto === false ? 'يدوي' : 'تلقائي'} · ${due.has(r.id) ? '<b class="exp">معاده جه</b>' : 'القادم ' + ltr(fmtDate(r.nextDate))}</div></div>
      <div class="num ${r.type === 'INCOME' ? 'inc' : 'exp'}">${money(r.amount)} <small class="muted">${a ? a.currency : ''}</small></div>${due.has(r.id) ? `<button class="btn small primary" data-pay="${r.id}">سجّل</button>` : ''}</div>`; };
  const exp = db.recurring.filter(r => r.type === 'EXPENSE'), inc = db.recurring.filter(r => r.type === 'INCOME');
  const hints = repeatHints();
  sheet('المصاريف الثابتة والمتكررة', `
    <div class="grid2"><div class="stat"><span class="muted">الثابت شهرياً</span><b class="num exp">${money(fm)}</b></div><div class="stat"><span class="muted">من المرتب</span><b class="num">${salary ? Math.round(fm / salary * 100) + '%' : '—'}</b></div></div>
    <p class="muted">«تلقائي» يتسجّل لوحده في معاده. «يدوي» يظهرلك كاقتراح لما تسجّل مصروف ويتحسب في التوقعات لحد ما تسجّله. الإيجار والأقساط داخلين في الحساب.</p>
    ${Object.keys(PERIODS).map(k => { const l = exp.filter(r => r.period === k); if (!l.length) return '';
      const tot = l.filter(r => r.active).reduce((s, r) => s + conv(r.amount, recCur(r)), 0);
      return `<div class="section-title row between"><span>${PERIODS[k]}</span><span class="num">${money(tot)}${k !== 'MONTHLY' ? ` ≈ ${money(tot * MONTH_FACTOR[k])} شهرياً` : ''}</span></div><div class="list">${l.map(row).join('')}</div>`; }).join('') || '<div class="empty">مفيش مصاريف ثابتة لسه</div>'}
    ${db.installments.some(p => nextInstallment(p)) ? `<div class="section-title">أقساط</div><div class="list">${db.installments.filter(p => nextInstallment(p)).map(p => `<div class="item" data-inst="${p.id}"><div class="ico">💳</div><div class="grow"><div class="ellipsis">${esc(p.name)}</div><div class="muted">${planDates(p).txt}</div></div><div class="num exp">${money(nextInstallment(p).payment)}</div></div>`).join('')}</div>` : ''}
    <button class="btn primary block" id="rNew" style="margin-top:10px">＋ مصروف ثابت</button>
    ${hints.length ? `<h3 style="margin-top:16px">بتتكرر كتير، تخليها ثابتة؟</h3>${hints.map(h => `<div class="insight"><div class="grow">${esc(h.merchant)} · <span class="num">${money(h.amount)}</span> · ${PERIODS[h.period]} <span class="muted">(${h.n} مرات)</span></div><button class="btn small" data-sub='${esc(JSON.stringify(h))}'>خليه ثابت</button></div>`).join('')}` : ''}
    <div class="section-title">الدخل المتكرر</div>
    <div class="list">${inc.length ? inc.map(row).join('') : '<div class="empty">مفيش دخل متكرر. سجّل مرتبك من «بياناتي المالية».</div>'}</div>
    <button class="btn block" id="rNewI" style="margin-top:10px">＋ دخل متكرر</button>`, () => {
    document.querySelectorAll('[data-r]').forEach(el => el.onclick = e => { if (e.target.closest('[data-pay]')) return; editRecurring(db.recurring.find(r => r.id === +el.dataset.r)); });
    document.querySelectorAll('[data-pay]').forEach(el => el.onclick = () => {
      const r = db.recurring.find(x => x.id === +el.dataset.pay);
      db.txns.push({ id: newId(), type: 'EXPENSE', amount: r.amount, accountId: r.accountId, categoryId: r.categoryId, merchant: r.merchant, note: '', date: Date.now(), source: 'MANUAL', fixedId: r.id });
      markFixedPaid(r, Date.now()); save(); toast('تم تسجيل ' + (r.merchant || 'المصروف')); openRecurring();
    });
    document.querySelectorAll('[data-sub]').forEach(el => el.onclick = () => { const h = JSON.parse(el.dataset.sub); editRecurring(null, h); });
    $('#rNew').onclick = () => editRecurring(null, null, 'EXPENSE');
    document.querySelectorAll('[data-inst]').forEach(el => el.onclick = () => openPlan(db.installments.find(p => p.id === +el.dataset.inst)));
    $('#rNewI').onclick = () => editRecurring(null, null, 'INCOME');
  });
}
function editRecurring(r, hint, kind) {
  const isNew = !r;
  r = r || { type: kind || 'EXPENSE', auto: kind === 'INCOME', amount: hint ? hint.amount : '', accountId: hint ? hint.accountId : (db.accounts[0] || {}).id, categoryId: hint ? hint.categoryId : null,
    merchant: hint ? hint.merchant : '', note: '', period: hint ? hint.period : 'MONTHLY', nextDate: Date.now(), anchorDay: new Date().getDate(), active: true };
  if (hint) { r.nextDate = hint.lastDate; r.anchorDay = new Date(hint.lastDate).getDate(); r.nextDate = advance(r); while (r.nextDate <= Date.now()) r.nextDate = advance(r); }
  let type = r.type;
  const draw = () => sheet(isNew ? 'معاملة متكررة' : 'تعديل معاملة متكررة', `
    <div class="seg"><button data-ty="EXPENSE" class="${type === 'EXPENSE' ? 'on e' : ''}">مصروف</button><button data-ty="INCOME" class="${type === 'INCOME' ? 'on i' : ''}">دخل</button></div>
    <label class="f">المبلغ</label><input class="in num" id="rAmt" inputmode="decimal" value="${r.amount}">
    <label class="f">الحساب</label><select class="in" id="rAcc">${accOptions(r.accountId)}</select>
    <label class="f">التصنيف</label><select class="in" id="rCat">${catOptions(type === 'INCOME', r.categoryId)}</select>
    <label class="f">الوصف</label><input class="in" id="rMer" value="${esc(r.merchant)}">
    <label class="f">التكرار</label><select class="in" id="rPer">${Object.entries(PERIODS).map(([k, v]) => `<option value="${k}" ${r.period === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <label class="f">الموعد القادم</label><input class="in" type="date" id="rNext" value="${fmtDate(r.nextDate)}">
    <label class="row" style="margin-top:12px"><input type="checkbox" id="rAuto" ${r.auto !== false ? 'checked' : ''}> سجّلها تلقائياً في معادها</label>
    ${isNew ? '' : `<label class="row" style="margin-top:12px"><input type="checkbox" id="rAct" ${r.active ? 'checked' : ''}> مفعّلة</label>`}
    <div class="btns"><button class="btn primary" id="rSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="rDel">حذف</button>'}</div>`, body => {
    body.querySelectorAll('[data-ty]').forEach(b => b.onclick = () => { r.amount = $('#rAmt').value; r.merchant = $('#rMer').value; type = b.dataset.ty; r.categoryId = null; draw(); });
    $('#rSave').onclick = () => {
      const amt = parseAmount($('#rAmt').value); if (!(amt > 0)) return toast('أدخل مبلغاً صحيحاً');
      const [y, m, d] = $('#rNext').value.split('-').map(Number);
      const next = new Date(y, m - 1, d, 9, 0).getTime();
      const rec = { ...r, id: r.id || newId(), type, amount: amt, accountId: +$('#rAcc').value, categoryId: +$('#rCat').value || null, merchant: $('#rMer').value.trim(),
        period: $('#rPer').value, nextDate: next, anchorDay: d || 1, active: isNew ? true : $('#rAct').checked, auto: $('#rAuto').checked };
      const i = db.recurring.findIndex(x => x.id === rec.id); if (i >= 0) db.recurring[i] = rec; else db.recurring.push(rec);
      save(); runRecurring(); openRecurring();
    };
    if (!isNew) $('#rDel').onclick = () => { if (confirm('حذف؟')) { db.recurring = db.recurring.filter(x => x.id !== r.id); save(); openRecurring(); } };
  });
  draw();
}

function openDebts() {
  sheet('الديون والقروض', `<div class="list">${db.debts.length ? db.debts.map(d => { const rem = d.amount - d.paid;
    return `<div class="item" data-d="${d.id}"><div class="ico">${d.lent ? '📤' : '📥'}</div><div class="grow"><div class="ellipsis">${esc(d.person)} <span class="muted">${d.lent ? 'يدين لي' : 'أدين له'}</span></div>
    <div class="muted">${d.dueDate ? 'الاستحقاق ' + ltr(fmtDate(d.dueDate)) : ltr(fmtDate(d.date))}${rem <= 0 ? ' · ✅ مسدد' : ''}</div><div class="bar"><i style="width:${Math.min(100, d.paid / d.amount * 100)}%"></i></div></div>
    <div class="num ${d.lent ? 'inc' : 'exp'}">${money(rem)} <small class="muted">${d.currency}</small></div></div>`; }).join('') : '<div class="empty">لا توجد ديون</div>'}</div>
    <button class="btn primary block" id="dNew" style="margin-top:10px">＋ دين جديد</button>`, () => {
    document.querySelectorAll('[data-d]').forEach(el => el.onclick = () => editDebt(db.debts.find(d => d.id === +el.dataset.d)));
    $('#dNew').onclick = () => editDebt();
  });
}
function editDebt(d) {
  const isNew = !d; d = d || { person: '', amount: '', paid: 0, currency: base(), lent: true, date: Date.now(), dueDate: null, note: '' };
  sheet(isNew ? 'دين جديد' : d.person, `
    <div class="seg"><button data-l="1" class="${d.lent ? 'on i' : ''}">أقرضت</button><button data-l="0" class="${!d.lent ? 'on e' : ''}">اقترضت</button></div>
    <label class="f">الشخص</label><input class="in" id="dP" value="${esc(d.person)}">
    <label class="f">المبلغ</label><input class="in num" id="dA" inputmode="decimal" value="${d.amount}">
    <label class="f">العملة</label><select class="in" id="dC">${CURRENCIES.map(c => `<option ${d.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
    <label class="f">تاريخ الاستحقاق (اختياري)</label><input class="in" type="date" id="dDue" value="${d.dueDate ? fmtDate(d.dueDate) : ''}">
    <label class="f">ملاحظة</label><input class="in" id="dN" value="${esc(d.note)}">
    ${isNew ? '' : `<div class="insight" style="margin-top:12px">المسدد: <b class="num">${money(d.paid)}</b> من <b class="num">${money(d.amount)}</b>
      <label class="f">تسجيل دفعة</label><input class="in num" id="dPay" inputmode="decimal" placeholder="المبلغ">
      <label class="f">تسجيلها أيضاً في حساب (نفس العملة)</label><select class="in" id="dAcc"><option value="">لا</option>${accOptions(null, a => a.currency === d.currency)}</select>
      <button class="btn small primary" id="dPayGo" style="margin-top:8px">تسجيل الدفعة</button></div>`}
    <div class="btns"><button class="btn primary" id="dSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="dDel">حذف</button>'}</div>`, body => {
    let lent = d.lent;
    body.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { lent = b.dataset.l === '1'; body.querySelectorAll('[data-l]').forEach(x => { x.className = ''; }); b.className = 'on ' + (lent ? 'i' : 'e'); });
    $('#dSave').onclick = () => {
      const amt = parseAmount($('#dA').value); const p = $('#dP').value.trim();
      if (!p || !(amt > 0)) return toast('أدخل الاسم والمبلغ');
      const due = $('#dDue').value ? new Date($('#dDue').value + 'T09:00').getTime() : null;
      const rec = { ...d, id: d.id || newId(), person: p, amount: amt, currency: $('#dC').value, lent, dueDate: due, note: $('#dN').value.trim() };
      const i = db.debts.findIndex(x => x.id === rec.id); if (i >= 0) db.debts[i] = rec; else db.debts.push(rec);
      save(); openDebts();
    };
    if (!isNew) {
      $('#dDel').onclick = () => { if (confirm('حذف؟')) { db.debts = db.debts.filter(x => x.id !== d.id); save(); openDebts(); } };
      $('#dPayGo').onclick = () => {
        const pay = Math.min(parseAmount($('#dPay').value) || 0, d.amount - d.paid);
        if (!(pay > 0)) return toast('أدخل مبلغ الدفعة');
        d.paid += pay;
        const aId = +$('#dAcc').value;
        if (aId) db.txns.push({ id: newId(), type: d.lent ? 'INCOME' : 'EXPENSE', amount: pay, accountId: aId, categoryId: null, merchant: d.person, note: 'سداد دين', date: Date.now(), source: 'MANUAL' });
        save(); toast('تم تسجيل الدفعة'); openDebts();
      };
    }
  });
}

function openGoals() {
  sheet('الأهداف', `<div class="list">${db.goals.length ? db.goals.map(g => `<div class="item" data-g="${g.id}"><div class="ico">${g.icon}</div><div class="grow"><div>${esc(g.name)}</div>
    <div class="bar"><i style="width:${Math.min(100, g.saved / g.target * 100)}%"></i></div></div><div class="num muted">${money(g.saved)} / ${money(g.target)}</div></div>`).join('') : '<div class="empty">لا توجد أهداف</div>'}</div>
    <button class="btn primary block" id="gNew" style="margin-top:10px">＋ هدف جديد</button>`, () => {
    document.querySelectorAll('[data-g]').forEach(el => el.onclick = () => editGoal(db.goals.find(g => g.id === +el.dataset.g)));
    $('#gNew').onclick = () => editGoal();
  });
}
function editGoal(g) {
  const isNew = !g; g = g || { name: '', target: '', saved: 0, currency: base(), icon: '🎯' };
  let icon = g.icon;
  sheet(isNew ? 'هدف جديد' : 'تعديل هدف', `
    <label class="f">الاسم</label><input class="in" id="gN" value="${esc(g.name)}">
    <label class="f">المبلغ المستهدف</label><input class="in num" id="gT" inputmode="decimal" value="${g.target}">
    <label class="f">المدّخر حتى الآن</label><input class="in num" id="gS" inputmode="decimal" value="${g.saved}">
    <label class="f">العملة</label><select class="in" id="gC">${CURRENCIES.map(c => `<option ${g.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
    <label class="f">عاوز توصل للهدف قبل (اختياري)</label><input class="in" type="date" id="gD" value="${g.deadline ? fmtDate(g.deadline) : ''}">
    <label class="f">الأيقونة</label><div class="emojis">${['🎯', '🚗', '🏠', '✈️', '💍', '🎓', '💻', '📱', '🏖️', '🕋', '💰'].map(e => `<button class="${e === icon ? 'on' : ''}" data-e="${e}">${e}</button>`).join('')}</div>
    <div class="btns"><button class="btn primary" id="gSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="gDel">حذف</button>'}</div>`, body => {
    body.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { icon = b.dataset.e; body.querySelectorAll('[data-e]').forEach(x => x.classList.toggle('on', x === b)); });
    $('#gSave').onclick = () => {
      const t = parseAmount($('#gT').value); const n = $('#gN').value.trim();
      if (!n || !(t > 0)) return toast('أدخل الاسم والمبلغ');
      const rec = { ...g, id: g.id || newId(), name: n, target: t, saved: parseAmount($('#gS').value) || 0, currency: $('#gC').value, icon, deadline: $('#gD').value ? new Date($('#gD').value + 'T09:00').getTime() : null };
      const i = db.goals.findIndex(x => x.id === rec.id); if (i >= 0) db.goals[i] = rec; else db.goals.push(rec);
      save(); openGoals();
    };
    if (!isNew) $('#gDel').onclick = () => { if (confirm('حذف؟')) { db.goals = db.goals.filter(x => x.id !== g.id); save(); openGoals(); } };
  });
}

function openSplit() {
  sheet('تقسيم فاتورة', `
    <label class="f">إجمالي الفاتورة</label><input class="in num" id="sT" inputmode="decimal">
    <label class="f">البقشيش / الخدمة</label><input class="in num" id="sTip" inputmode="decimal" value="0">
    <label class="f">عدد الأشخاص (معك)</label><input class="in num" id="sN" inputmode="numeric" value="2">
    <label class="f">المكان</label><input class="in" id="sM">
    <label class="f">الحساب</label><select class="in" id="sA">${accOptions((db.accounts[0] || {}).id)}</select>
    <label class="f">التصنيف</label><select class="in" id="sC">${catOptions(false, (catByName('cat_food') || {}).id)}</select>
    <div class="insight" id="sOut" style="margin-top:12px">نصيبك: —</div>
    <button class="btn primary block" id="sSave">تسجيل نصيبي كمصروف</button>`, () => {
    const calc = () => {
      const t = (parseAmount($('#sT').value) || 0) + (parseAmount($('#sTip').value) || 0); const n = Math.max(1, parseInt(normDigits($('#sN').value)) || 1);
      const each = Math.floor(t / n * 100) / 100; const mine = Math.round((t - each * (n - 1)) * 100) / 100;
      $('#sOut').innerHTML = `نصيبك: <b class="num">${money(mine)}</b> · نصيب كل شخص آخر: <span class="num">${money(each)}</span>`;
      return { mine, n };
    };
    ['#sT', '#sTip', '#sN'].forEach(s => $(s).oninput = calc);
    $('#sSave').onclick = () => {
      const { mine, n } = calc(); if (!(mine > 0)) return toast('أدخل إجمالي الفاتورة');
      const m = $('#sM').value.trim(); const c = +$('#sC').value || null;
      db.txns.push({ id: newId(), type: 'EXPENSE', amount: mine, accountId: +$('#sA').value, categoryId: c, merchant: m, note: `تقسيم على ${n}`, date: Date.now(), source: 'MANUAL' });
      if (c && m) learn(m, c);
      save(); closeSheet(); toast('تم تسجيل نصيبك');
    };
  });
}

function openRates() {
  const used = [...new Set([...db.accounts.map(a => a.currency), ...db.goals.map(g => g.currency), ...db.debts.map(d => d.currency), 'USD'])].filter(c => c !== base());
  sheet('العملة وأسعار الصرف', `
    <label class="f">العملة الأساسية</label><select class="in" id="rBase">${CURRENCIES.map(c => `<option ${base() === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
    <p class="muted">آخر تحديث: ${db.prefs.ratesUpdated ? ltr(fmtDT(db.prefs.ratesUpdated)) : 'لم يتم بعد'}</p>
    ${used.map(c => `<label class="f">1 ${c} = ? ${base()}</label><input class="in num" data-rc="${c}" inputmode="decimal" value="${db.rates[c] ? +db.rates[c].toFixed(4) : ''}">`).join('')}
    <div class="btns"><button class="btn" id="rRef">🔄 تحديث من الإنترنت</button><button class="btn primary" id="rSave">حفظ</button></div>`, () => {
    $('#rBase').onchange = e => { db.prefs.base = e.target.value; db.rates = {}; save(); refreshRates(true).then(openRates); };
    $('#rRef').onclick = () => refreshRates(true).then(openRates);
    $('#rSave').onclick = () => { document.querySelectorAll('[data-rc]').forEach(i => { const v = parseAmount(i.value); if (v > 0) db.rates[i.dataset.rc] = v; }); save(); closeSheet(); toast('تم الحفظ'); };
  });
}

// ================= ملفات: نسخ احتياطي وتصدير =================
async function shareOrDownload(name, blob) {
  try {
    const file = new File([blob], name, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function downloadCsv(name, rows) {
  const csv = '﻿' + rows.map(r => r.map(v => { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\r\n');
  shareOrDownload(name, new Blob([csv], { type: 'text/csv;charset=utf-8' }));
}
function exportCsv() {
  const rows = [['Date', 'Type', 'Amount', 'Currency', 'Account', 'Category/To', 'Merchant', 'Note']];
  [...db.txns].sort((a, b) => a.date - b.date).forEach(t => {
    const a = acc(t.accountId);
    const third = t.type === 'TRANSFER' ? lbl((acc(t.toAccountId) || {}).name || '') : (cat(t.categoryId) ? lbl(cat(t.categoryId).name) : '');
    rows.push([fmtDT(t.date), t.type, t.amount, a ? a.currency : '', a ? lbl(a.name) : '', third, t.merchant, t.note]);
  });
  downloadCsv(`mywallet-${fmtDate(Date.now())}.csv`, rows);
}

const enc = new TextEncoder(), dec = new TextDecoder();
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function deriveKey(pass, salt) {
  const k = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
function openBackup() {
  sheet('نسخ احتياطي واستعادة', `
    <p class="muted">احفظ الملف في «الملفات» أو iCloud Drive. يمكنك أيضاً استعادة نسخة من تطبيق الأندرويد إذا صدّرت الحركات كـ CSV.</p>
    <label class="f">كلمة مرور للتشفير (اختيارية)</label><input class="in" id="bPass" type="password" autocomplete="new-password">
    <button class="btn primary block" id="bSave" style="margin-top:10px">💾 إنشاء نسخة احتياطية</button>
    <label class="f" style="margin-top:16px">استعادة من ملف</label><input class="in" id="bFile" type="file" accept=".json,.mwb,application/json">
    <label class="f" style="margin-top:16px">استيراد حركات من CSV (التاريخ، النوع، المبلغ، الحساب، التصنيف، التاجر، ملاحظة)</label><input class="in" id="bCsv" type="file" accept=".csv,text/csv">
    <button class="btn danger block" id="bWipe" style="margin-top:16px">مسح كل البيانات</button>`, () => {
    $('#bSave').onclick = async () => {
      const pass = $('#bPass').value; let payload = JSON.stringify(db), name = `mywallet-backup-${fmtDate(Date.now())}.json`;
      if (pass) {
        const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await deriveKey(pass, salt), enc.encode(payload));
        payload = JSON.stringify({ mywalletEncrypted: 1, salt: b64(salt), iv: b64(iv), data: b64(ct) });
      }
      shareOrDownload(name, new Blob([payload], { type: 'application/json' }));
    };
    $('#bFile').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try {
        let o = JSON.parse(await f.text());
        if (o.mywalletEncrypted) {
          const pass = $('#bPass').value || prompt('كلمة مرور النسخة'); if (!pass) return;
          const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(o.iv) }, await deriveKey(pass, unb64(o.salt)), unb64(o.data));
          o = JSON.parse(dec.decode(pt));
        }
        if (!o.accounts || !o.txns) throw new Error('bad');
        if (!confirm('سيتم استبدال كل البيانات الحالية بالنسخة. متابعة؟')) return;
        db = migrate(o); save(); closeSheet(); toast('تمت الاستعادة');
      } catch (err) { toast('تعذّرت الاستعادة: الملف أو كلمة المرور غير صحيحة'); }
    };
    $('#bCsv').onchange = async e => { const f = e.target.files[0]; if (f) importCsv(await f.text()); };
    $('#bWipe').onclick = () => { if (confirm('سيتم حذف كل البيانات نهائياً من هذا الجهاز. متأكد؟') && confirm('تأكيد أخير؟')) { db = seed(); save(); closeSheet(); } };
  });
}
function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',' || c === ';' || c === '\t') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
function importCsv(text) {
  let rows = parseCsv(text.replace(/^﻿/, '')).filter(r => r.some(x => x.trim()));
  if (!rows.length) return toast('الملف فارغ');
  const hasCur = /currency/i.test(rows[0].join(','));
  if (parseAmount(rows[0][2]) == null) rows = rows.slice(1);
  const accFor = name => {
    const n = (name || '').trim() || 'acc_cash';
    let a = db.accounts.find(x => x.name.toLowerCase() === n.toLowerCase() || lbl(x.name).toLowerCase() === n.toLowerCase());
    if (!a) { a = { id: newId(), name: n, type: 'BANK', currency: base(), initialBalance: 0, last4: '', archived: false }; db.accounts.push(a); }
    return a;
  };
  let added = 0, skipped = 0;
  rows.forEach(r => {
    if (hasCur) r = [r[0], r[1], r[2], r[4], r[5], r[6], r[7]];
    const d = new Date(normDigits(r[0]).trim().replace(' ', 'T')).getTime(); const amt = parseAmount(r[2]);
    if (!isFinite(d) || !(amt > 0)) { skipped++; return; }
    const s = normDigits(r[1] || '').toLowerCase();
    let type = s.startsWith('inc') || /دخل|ايراد|إيراد/.test(s) ? 'INCOME' : s.startsWith('tran') || s.includes('تحويل') ? 'TRANSFER' : 'EXPENSE';
    const a = accFor(r[3]); const third = (r[4] || '').trim(); let toId = null, catId = null;
    if (type === 'TRANSFER') { if (!third) type = 'EXPENSE'; else toId = accFor(third).id; }
    if (type !== 'TRANSFER' && third) {
      let c = db.categories.find(x => x.isIncome === (type === 'INCOME') && (x.name.toLowerCase() === third.toLowerCase() || lbl(x.name) === third));
      if (!c) { c = { id: newId(), name: third, isIncome: type === 'INCOME', icon: '📦', monthlyBudget: 0 }; db.categories.push(c); }
      catId = c.id;
    }
    db.txns.push({ id: newId(), type, amount: amt, accountId: a.id, toAccountId: toId, categoryId: catId, merchant: r[5] || '', note: r[6] || '', date: d, source: 'IMPORT' });
    added++;
  });
  save(); closeSheet(); toast(`تم استيراد ${added} حركة، وتخطي ${skipped}`);
}

// ================= قفل PIN =================
async function hashPin(pin) { return b64(await crypto.subtle.digest('SHA-256', enc.encode('mywallet:' + pin))); }
// Face ID / Touch ID عبر WebAuthn: مفتاح مرور على الجهاز، والتحقق بيتم بالوجه أو البصمة. الـ PIN يفضل كبديل.
const bioSupported = async () => { try { return !!window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(); } catch (e) { return false; } };
async function enableBio() {
  const cred = await navigator.credentials.create({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: { name: 'محفظتي' },
    user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'mywallet', displayName: 'محفظتي' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'preferred' },
    timeout: 60000 } });
  db.prefs.bioCred = b64(cred.rawId); save();
}
async function bioUnlock(silent) {
  try {
    await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type: 'public-key', id: unb64(db.prefs.bioCred) }], userVerification: 'required', timeout: 60000 } });
    fails = 0; $('#lock').classList.add('hidden');
  } catch (e) { if (silent !== true) $('#pinErr').textContent = 'تعذّر التحقق بـ Face ID، استخدم الرمز'; }
}
async function openPin() {
  const bio = await bioSupported();
  sheet('القفل و Face ID', db.prefs.pinHash ? `
    <div class="insight"><span class="ib">${ic('lock')}</span><div class="grow">قفل الرمز مفعّل</div></div>
    ${bio ? (db.prefs.bioCred
      ? `<div class="insight"><span class="ib">${ic('faceid')}</span><div class="grow">Face ID مفعّل لفتح التطبيق</div></div><button class="btn block" id="bOff">إيقاف Face ID</button>`
      : `<button class="btn primary block" id="bOn">${ic('faceid')} تفعيل Face ID</button><p class="muted">هتفتح التطبيق بوشّك، والرمز يفضل موجود لو Face ID ماشتغلش.</p>`)
      : '<p class="muted">Face ID مش متاح هنا. لازم تفتح التطبيق من الشاشة الرئيسية على آيفون فيه Face ID.</p>'}
    <button class="btn danger block" id="pOff" style="margin-top:10px">إلغاء القفل بالكامل</button>` : `
    <p class="muted">فعّل رمز PIN الأول، وبعدها تقدر تفعّل Face ID.</p>
    <label class="f">رمز PIN جديد (4 إلى 8 أرقام)</label><input class="in num" id="p1" type="password" inputmode="numeric" maxlength="8">
    <label class="f">تأكيد الرمز</label><input class="in num" id="p2" type="password" inputmode="numeric" maxlength="8">
    <button class="btn primary block" id="pOn" style="margin-top:12px">تفعيل</button>`, () => {
    if ($('#pOff')) $('#pOff').onclick = () => { db.prefs.pinHash = ''; db.prefs.bioCred = ''; save(); closeSheet(); toast('تم إلغاء القفل'); };
    if ($('#bOff')) $('#bOff').onclick = () => { db.prefs.bioCred = ''; save(); openPin(); };
    if ($('#bOn')) $('#bOn').onclick = async () => { try { await enableBio(); toast('تم تفعيل Face ID'); openPin(); } catch (e) { toast('ماقدرناش نفعّل Face ID'); } };
    if ($('#pOn')) $('#pOn').onclick = async () => {
      const a = normDigits($('#p1').value), b = normDigits($('#p2').value);
      if (!/^\d{4,8}$/.test(a)) return toast('الرمز من 4 إلى 8 أرقام');
      if (a !== b) return toast('الرمزان غير متطابقين');
      db.prefs.pinHash = await hashPin(a); save(); toast('تم تفعيل القفل'); openPin();
    };
  });
}
let fails = 0, blockedUntil = 0;
function showLock() {
  if (!db.prefs.pinHash) return;
  $('#lock').classList.remove('hidden'); $('#pinIn').value = ''; $('#pinErr').textContent = '';
  const bio = !!db.prefs.bioCred;
  $('#faceGo').classList.toggle('hidden', !bio);
  if (bio) bioUnlock(true); else setTimeout(() => $('#pinIn').focus(), 200);
}
async function tryUnlock() {
  if (Date.now() < blockedUntil) { $('#pinErr').textContent = 'انتظر قليلاً ثم حاول مرة أخرى'; return; }
  if (await hashPin(normDigits($('#pinIn').value)) === db.prefs.pinHash) { fails = 0; $('#lock').classList.add('hidden'); return; }
  fails++; $('#pinIn').value = '';
  if (fails >= 5) { blockedUntil = Date.now() + 30000; fails = 0; $('#pinErr').textContent = 'محاولات كثيرة، انتظر 30 ثانية'; }
  else $('#pinErr').textContent = 'رمز غير صحيح';
}

// ================= التشغيل =================
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => setTab(b.dataset.tab));
$('#sheetClose').onclick = closeSheet;
document.querySelector('.sheet-bg').onclick = closeSheet;
$('#pinGo').onclick = tryUnlock;
$('#faceGo').onclick = bioUnlock;
$('#vfab').innerHTML = ic('mic');
$('#vfab').onclick = quickVoice;
$('#faceGo').innerHTML = ic('faceid') + '<span>فتح بـ Face ID</span>';
$('#pinIn').onkeydown = e => { if (e.key === 'Enter') tryUnlock(); };
$('#settingsBtn').onclick = openSettings;
$('#bellBtn').onclick = openNotifs;
$('#settingsBtn').innerHTML = ic('settings');
$('#back').innerHTML = ic('back');
const TAB_ICONS = { home: 'home', txns: 'list', add: 'plus', reports: 'chart', more: 'grid' };
document.querySelectorAll('.tabs button').forEach(b => { b.querySelector('span').innerHTML = ic(TAB_ICONS[b.dataset.tab]); });
// الوضع الفاتح / الداكن: auto يتبع إعداد الآيفون
const darkMq = matchMedia('(prefers-color-scheme: dark)');
const isDark = () => db.prefs.theme === 'dark' || (db.prefs.theme !== 'light' && darkMq.matches);
function applyTheme() {
  const t = db.prefs.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  $('#themeBtn').innerHTML = ic(isDark() ? 'sun' : 'moon');
  document.querySelector('meta[name=theme-color]').content = isDark() ? '#07172e' : '#062a57';
}
function setTheme(t) { db.prefs.theme = t; save(); applyTheme(); }
$('#themeBtn').onclick = () => setTheme(isDark() ? 'light' : 'dark');
darkMq.addEventListener && darkMq.addEventListener('change', applyTheme);
applyTheme();
// استقبال رسالة من اختصار iOS عبر الرابط: ...#sms=<نص الرسالة>
function handleHash() {
  const pm = /[#&]plans=([^&]*)/.exec(location.hash);
  if (pm) { history.replaceState(null, '', location.pathname); const r = importPlanCode(decodeURIComponent(pm[1])); toast(`اتضاف ${r.added} تقسيط${r.updated ? ` واتحدّث ${r.updated}` : ''}`); setTab('cards'); return; }
  const m = /[#&]sms=([^&]*)/.exec(location.hash);
  if (!m) return;
  history.replaceState(null, '', location.pathname);
  reportIngest(ingestMessages(decodeURIComponent(m[1].replace(/\+/g, ' '))));
  setTab('inbox');
}
window.addEventListener('hashchange', handleHash);
$('#iosHintClose').onclick =() => { $('#iosHint').classList.add('hidden'); try { localStorage.setItem('mywallet.hint', '1'); } catch (e) { } };
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) hiddenAt = Date.now();
  else { if (hiddenAt && Date.now() - hiddenAt > 60000) showLock(); runRecurring(); runInstallments(); if ($('#sheet').classList.contains('hidden')) render(); }
});

const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let hintSeen = false; try { hintSeen = !!localStorage.getItem('mywallet.hint'); } catch (e) { }
if (isIOS && !standalone && !hintSeen) $('#iosHint').classList.remove('hidden');

// تذكير داخل التطبيق: لو عدّى وقت التذكير ومفيش حركات النهارده، يظهر إشعار مرة واحدة في اليوم
async function checkReminder() {
  const [h, m] = (db.prefs.reminderTime || '21:00').split(':').map(Number);
  const now = new Date(); const today = fmtDate(now.getTime());
  if (now.getHours() * 60 + now.getMinutes() < h * 60 + m || db.prefs.lastReminder === today) return;
  if (db.txns.some(t => t.date >= new Date().setHours(0, 0, 0, 0))) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  db.prefs.lastReminder = today; save();
  try { const reg = await navigator.serviceWorker.getRegistration(); reg.showNotification('محفظتي', { body: 'ماسجّلتش مصاريف النهارده، سجّلها دلوقتي 💰', icon: 'icons/icon-192.png', tag: 'daily' }); } catch (e) { }
}
setInterval(checkNotifs, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkNotifs(); });

showLock();
runRecurring();
runInstallments();
render();
handleHash();
setTimeout(checkNotifs, 3000);
nBadge();
if (!db.profile.done && !db.profile.skipped) openOnboarding();
if (Date.now() - (db.prefs.ratesUpdated || 0) > 12 * 3600000) refreshRates(false);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
