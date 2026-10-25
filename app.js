'use strict';
/* محفظتي — نسخة الويب (PWA) للآيفون. كل البيانات محفوظة على الجهاز فقط (localStorage). */

const KEY = 'mywallet.v1';
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
    <div class="grow"><div class="ellipsis">${esc(title)}</div><div class="muted ellipsis">${esc(lbl(a ? a.name : ''))} · ${ltr(fmtDT(t.date))}${t.note ? ' · ' + esc(t.note) : ''}</div></div>
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
    const owed = -(bal[a.id] || 0); const left = daysUntilDay(a.dueDay);
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
  const showReminder = db.prefs.reminderTime && new Date().getHours() * 60 + new Date().getMinutes() >= rh * 60 + rm && !db.txns.some(t => t.date >= todayStart);

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
        <div><div class="label">إجمالي الرصيد</div><div class="big num">${m(total)} <small>${base()}</small></div></div>
        <div class="row" style="gap:8px"><button class="eye" id="hMic" aria-label="المساعد الصوتي">${ic('mic')}</button><button class="eye" id="hEye" aria-label="إظهار أو إخفاء الرصيد">${ic(hide ? 'eyeOff' : 'eye')}</button></div>
      </div>
      <div class="acc-scroll">${db.accounts.filter(a => !a.archived).map(a => `<button class="acc-card ${a.type === 'CREDIT' ? 'credit' : ''}" data-acc="${a.id}">
        <div class="row between"><span class="acc-ic">${accIcon(a)}</span><span class="acc-type">${ACC_TYPES[a.type] || ''}</span></div>
        <div class="acc-name ellipsis">${esc(lbl(a.name))}</div>
        <div class="acc-no num">${a.last4 ? '•••• ' + esc(a.last4) : '&nbsp;'}</div>
        <div class="acc-bal num">${m(bal[a.id] || 0)} <small>${a.currency}</small></div>
      </button>`).join('')}<button class="acc-card add" id="hAcc">${ic('plus')}<span>إدارة الحسابات</span></button></div>
    </section>
    <div class="card tiles">${tiles.map(([k, i, t, b]) => `<button data-q="${k}"><span class="ti">${ic(i)}</span><span>${t}</span>${b ? `<i class="badge">${b}</i>` : ''}</button>`).join('')}</div>
    ${riskCard(hide)}
    ${showReminder ? `<div class="card reminder"><div class="row"><span class="ib warn">${ic('bell')}</span><div class="grow"><b>ماسجّلتش مصاريف النهارده</b><div class="muted">سجّلها دلوقتي عشان تفضل حساباتك مظبوطة</div></div><button class="btn small primary" id="hRem">إضافة</button></div></div>` : ''}
    <div class="card">
      <div class="row between"><h3>ملخص الشهر</h3><span class="muted">${new Date().toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}</span></div>
      <div class="sum3">
        <div><span class="dot inc-bg"></span><span class="muted">الدخل</span><b class="num">${m(inc)}</b></div>
        <div><span class="dot exp-bg"></span><span class="muted">المصروف</span><b class="num">${m(exp)}</b></div>
        <div><span class="dot pri-bg"></span><span class="muted">الادخار</span><b class="num">${savedPct == null ? '—' : savedPct.toFixed(0) + '%'}</b></div>
      </div>
      <div class="bar ${expPct >= 90 ? 'over' : expPct >= 70 ? 'warn' : ''}" style="height:10px"><i style="width:${expPct}%"></i></div>
      <div class="muted" style="margin-top:6px">${inc > 0 ? `صرفت ${expPct.toFixed(0)}% من دخلك الشهر ده` : 'سجّل دخلك عشان تشوف نسبة الصرف'}</div>
    </div>
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
  $('#hAll').onclick = () => setTab('txns');
  if ($('#hRem')) $('#hRem').onclick = () => openTxn();
  const qa = { exp: () => openTxn(null, { type: 'EXPENSE' }), inc: () => openTxn(null, { type: 'INCOME' }), tr: () => openTxn(null, { type: 'TRANSFER' }), sms: () => setTab('inbox'),
    cards: () => setTab('cards'), savings: () => setTab('savings'), ctrl: () => setTab('ctrl'), voice: openVoice };
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
    `<p class="muted" style="text-align:center">بياناتك محفوظة على هذا الجهاز فقط ولا تُرسل لأي خادم. خذ نسخة احتياطية بانتظام.</p>`;
  view().querySelectorAll('[data-m]').forEach(el => el.onclick = () => items[+el.dataset.m][3]());
}

// ================= بطاقات الائتمان والتقسيط =================
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
function planSummary(p) {
  const rows = schedule(p); const paid = Math.min(p.paid || 0, rows.length);
  const sum = (a, k) => a.reduce((s, r) => s + r[k], 0);
  const rest = rows.slice(paid);
  return { rows, paid, monthly: rows[0] ? rows[rows.length > 1 ? 1 : 0].payment : 0, totalInterest: sum(rows, 'interest'), total: sum(rows, 'payment'),
    remaining: sum(rest, 'payment'), remainingPrincipal: sum(rest, 'principal'), remainingInterest: sum(rest, 'interest'), next: rest[0] || null };
}
const nextInstallment = p => planSummary(p).next;

function renderCards() {
  const bal = balances();
  const cards = db.accounts.filter(a => a.type === 'CREDIT' && !a.archived);
  view().innerHTML = `
    ${cards.length ? cards.map(a => {
      const owed = Math.max(0, -(bal[a.id] || 0)); const lim = +a.creditLimit || 0; const p = lim ? owed / lim * 100 : 0;
      const plans = db.installments.filter(x => x.cardId === a.id);
      const blocked = plans.reduce((s, x) => s + planSummary(x).remainingPrincipal, 0);
      return `<div class="card ccard">
        <div class="row between"><b>${esc(lbl(a.name))}</b><span class="muted">${a.last4 ? '•••• ' + esc(a.last4) : ''}</span></div>
        <div class="row between" style="margin-top:14px"><div><div class="muted">المستخدم</div><div class="big2 num">${money(owed)}</div></div>
          ${lim ? `<div style="text-align:left"><div class="muted">المتاح</div><div class="big2 num">${money(Math.max(0, lim - owed))}</div></div>` : ''}</div>
        ${lim ? `<div class="bar light ${p >= 80 ? 'over' : p >= 50 ? 'warn' : ''}"><i style="width:${Math.min(100, p)}%"></i></div><div class="muted" style="margin-top:4px">${p.toFixed(0)}% من الحد ${money(lim)} ${a.currency}${p >= 30 ? ' · يُفضّل إبقاء الاستخدام أقل من 30%' : ''}</div>` : ''}
        <div class="muted" style="margin-top:6px">${a.statementDay ? `كشف الحساب يوم ${a.statementDay}` : ''}${a.dueDay ? ` · آخر موعد سداد يوم ${a.dueDay} (بعد ${daysUntilDay(a.dueDay)} يوم)` : ''}${blocked ? ` · أقساط متبقية ${money(blocked)}` : ''}</div>
        <div class="btns"><button class="btn small" data-pay="${a.id}">سداد البطاقة</button><button class="btn small" data-plan="${a.id}">تقسيط جديد</button><button class="btn small" data-edit="${a.id}">تعديل</button></div>
      </div>`;
    }).join('') : `<div class="card empty">لا توجد بطاقات ائتمان بعد.<br>أضف بطاقة لمتابعة الحد المستخدم ومواعيد السداد والتقسيط.</div>`}
    <button class="btn primary block" id="ccNew">＋ إضافة بطاقة ائتمان</button>
    <h3 style="margin-top:18px">خطط التقسيط</h3>
    ${db.installments.length ? db.installments.map(p => {
      const s = planSummary(p); const a = acc(p.cardId);
      return `<div class="card plan" data-p="${p.id}">
        <div class="row between"><b>${esc(p.name)}</b><span class="pill">${s.paid}/${s.rows.length}</span></div>
        <div class="muted">${a ? esc(lbl(a.name)) + ' · ' : ''}${p.method === 'REDUCING' ? 'فائدة متناقصة' : 'فائدة ثابتة'} ${p.rate}% سنوياً</div>
        <div class="grid3" style="margin-top:10px">
          <div><span class="muted">القسط الشهري</span><b class="num">${money(s.monthly)}</b></div>
          <div><span class="muted">المتبقي</span><b class="num">${money(s.remaining)}</b></div>
          <div><span class="muted">القسط القادم</span><b>${s.next ? ltr(fmtDate(s.next.date)) : '✅ انتهى'}</b></div>
        </div>
        <div class="bar"><i style="width:${s.paid / s.rows.length * 100}%"></i></div>
      </div>`;
    }).join('') : '<div class="card empty">لا توجد خطط تقسيط. اضغط «تقسيط جديد» من البطاقة أو من هنا.</div>'}
    <button class="btn block" id="plNew">＋ خطة تقسيط</button>`;
  view().querySelectorAll('[data-pay]').forEach(b => b.onclick = () => {
    const a = acc(+b.dataset.pay); const owed = Math.max(0, -(balances()[a.id] || 0));
    const from = db.accounts.find(x => x.type !== 'CREDIT' && x.currency === a.currency && !x.archived);
    openTxn(null, { type: 'TRANSFER', amount: owed || '', accountId: from ? from.id : a.id, toAccountId: a.id, merchant: 'سداد ' + lbl(a.name) });
  });
  view().querySelectorAll('[data-plan]').forEach(b => b.onclick = () => editPlan(null, +b.dataset.plan));
  view().querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editAccount(acc(+b.dataset.edit), true));
  view().querySelectorAll('[data-p]').forEach(el => el.onclick = () => openPlan(db.installments.find(p => p.id === +el.dataset.p)));
  $('#ccNew').onclick = () => editAccount(null, true);
  $('#plNew').onclick = () => editPlan();
}

function editPlan(p, cardId) {
  const isNew = !p;
  p = p || { name: '', cardId: cardId || (db.accounts.find(a => a.type === 'CREDIT') || {}).id || null, principal: '', rate: '', months: 12, method: 'FLAT', fees: 0, startDate: Date.now(), paid: 0 };
  sheet(isNew ? 'خطة تقسيط جديدة' : 'تعديل خطة التقسيط', `
    <label class="f">اسم المشتريات</label><input class="in" id="pN" value="${esc(p.name)}" placeholder="مثال: موبايل، تكييف">
    <label class="f">البطاقة / الحساب</label><select class="in" id="pC"><option value="">بدون</option>${accOptions(p.cardId)}</select>
    <div class="grid2">
      <div><label class="f">أصل المبلغ (Principal)</label><input class="in num" id="pP" inputmode="decimal" value="${p.principal}"></div>
      <div><label class="f">عدد الشهور</label><input class="in num" id="pM" inputmode="numeric" value="${p.months}"></div>
      <div><label class="f">سعر الفائدة السنوي %</label><input class="in num" id="pR" inputmode="decimal" value="${p.rate}" placeholder="0 = بدون فوائد"></div>
      <div><label class="f">مصاريف إدارية</label><input class="in num" id="pF" inputmode="decimal" value="${p.fees || 0}"></div>
    </div>
    <label class="f">طريقة حساب الفائدة</label>
    <div class="seg"><button data-m="FLAT" class="${p.method !== 'REDUCING' ? 'on' : ''}">ثابتة (Flat)</button><button data-m="REDUCING" class="${p.method === 'REDUCING' ? 'on' : ''}">متناقصة</button></div>
    <p class="muted" style="margin:6px 0 0">الثابتة: الفائدة تُحسب على أصل المبلغ كله طول المدة (أغلب البنوك في مصر). المتناقصة: تُحسب على المتبقي فقط.</p>
    <label class="f">تاريخ أول قسط</label><input class="in" type="date" id="pD" value="${fmtDate(p.startDate)}">
    ${isNew ? '' : `<label class="f">عدد الأقساط المدفوعة</label><input class="in num" id="pPaid" inputmode="numeric" value="${p.paid || 0}">`}
    <div class="insight" id="pPrev" style="margin-top:12px"></div>
    <div class="btns"><button class="btn primary" id="pSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="pDel">حذف</button>'}</div>`, body => {
    let method = p.method || 'FLAT';
    const read = () => ({ ...p, name: $('#pN').value.trim(), cardId: +$('#pC').value || null, principal: parseAmount($('#pP').value) || 0, months: parseInt(normDigits($('#pM').value)) || 1,
      rate: parseAmount($('#pR').value) || 0, fees: parseAmount($('#pF').value) || 0, method, startDate: new Date($('#pD').value + 'T09:00').getTime() || Date.now(),
      paid: isNew ? 0 : Math.max(0, parseInt(normDigits($('#pPaid').value)) || 0) });
    const prev = () => { const x = read(); if (!x.principal) { $('#pPrev').innerHTML = 'أدخل أصل المبلغ لعرض القسط'; return; } const s = planSummary(x);
      $('#pPrev').innerHTML = `القسط الشهري: <b class="num">${money(s.monthly)}</b><br>إجمالي الفوائد: <b class="num">${money(s.totalInterest)}</b> · الإجمالي: <b class="num">${money(s.total)}</b>`; };
    body.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { method = b.dataset.m; body.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b)); prev(); });
    body.querySelectorAll('input,select').forEach(i => i.addEventListener('input', prev));
    prev();
    $('#pSave').onclick = () => {
      const x = read(); if (!x.name || !(x.principal > 0)) return toast('أدخل الاسم وأصل المبلغ');
      x.id = x.id || newId();
      const i = db.installments.findIndex(y => y.id === x.id); if (i >= 0) db.installments[i] = x; else db.installments.push(x);
      save(); closeSheet(); setTab('cards');
    };
    if (!isNew) $('#pDel').onclick = () => { if (confirm('حذف خطة التقسيط؟')) { db.installments = db.installments.filter(y => y.id !== p.id); save(); closeSheet(); } };
  });
}

function openPlan(p) {
  const s = planSummary(p);
  sheet(p.name, `
    <div class="grid2">
      <div class="stat"><span class="muted">أصل المبلغ</span><b class="num">${money(p.principal)}</b></div>
      <div class="stat"><span class="muted">إجمالي الفوائد</span><b class="num exp">${money(s.totalInterest)}</b></div>
      <div class="stat"><span class="muted">المتبقي من الأصل</span><b class="num">${money(s.remainingPrincipal)}</b></div>
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
    <h3 style="margin-top:16px">التذكير اليومي</h3>
    <label class="f">وقت التذكير</label><input class="in" type="time" id="stTime" value="${db.prefs.reminderTime || '21:00'}">
    <button class="btn primary block" id="stIcs" style="margin-top:10px">📅 إضافة التذكير اليومي للتقويم</button>
    <p class="muted">هيظهر لك تنبيه كل يوم في الوقت ده على الآيفون <b>وعلى ساعة أبل</b> كمان. اضغط «Add All» لما يظهر لك التقويم.</p>
    ${notifOk ? `<button class="btn block" id="stNotif">🔔 تفعيل إشعارات التطبيق</button><p class="muted">على الآيفون محتاج تكون ضايف التطبيق للشاشة الرئيسية (iOS 16.4 أو أحدث).</p>` : ''}
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
    $('#stTime').onchange = e => { db.prefs.reminderTime = e.target.value; save(); };
    $('#stIcs').onclick = () => {
      db.prefs.reminderTime = $('#stTime').value || '21:00'; save();
      const blob = new Blob([icsFor(db.prefs.reminderTime)], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      if (isIOS) location.href = url; else shareOrDownload('masrfi-reminder.ics', blob);
    };
    if ($('#stNotif')) $('#stNotif').onclick = async () => {
      const r = await Notification.requestPermission();
      if (r === 'granted') { const reg = await navigator.serviceWorker?.getRegistration(); const opts = { body: 'هنفكّرك تسجّل مصاريفك لما تفتح التطبيق', icon: 'icons/icon-192.png' };
        if (reg) reg.showNotification('محفظتي', opts); else new Notification('محفظتي', opts); toast('تم تفعيل الإشعارات'); }
      else toast('الإشعارات مش مسموحة. فعّلها من إعدادات الآيفون');
    };
    $('#stAuto').onchange = e => { db.prefs.autoAddSms = e.target.checked; save(); };
    $('#stSmsHow').onclick = openSmsAutomation;
    $('#stProf').onclick = () => openOnboarding(true);
    $('#stRates').onclick = openRates; $('#stPin').onclick = openPin; $('#stBackup').onclick = openBackup;
  });
}

// ================= صرفت كام على إيه =================
const PIE_COLORS = ['#1e74d6', '#0f9d58', '#e37400', '#d93025', '#8e44ad', '#00a3a3', '#c2185b', '#7c8a9e'];
function spendCard(cats, exp, hide) {
  const rows = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  if (!rows.length || !(exp > 0)) return '';
  const top = rows.slice(0, 5);
  const rest = rows.slice(5).reduce((s, r) => s + r[1], 0);
  if (rest > 0) top.push(['0', rest]);
  let acc0 = 0;
  const stops = top.map(([, v], i) => { const a = acc0; acc0 += v / exp * 100; return `${PIE_COLORS[i % PIE_COLORS.length]} ${a}% ${acc0}%`; }).join(',');
  return `<div class="card">
    <div class="row between"><h3>صرفت على إيه الشهر ده</h3><span class="muted num">${hide ? '••••' : money(exp)}</span></div>
    <div class="spend">
      <div class="donut" style="background:conic-gradient(${stops})"><div><b>${top.length}</b><span class="muted">تصنيفات</span></div></div>
      <div class="spend-list">${top.map(([id, v], i) => { const c = cat(+id); const name = +id === 0 ? 'أخرى' : c ? lbl(c.name) : 'بدون تصنيف';
        return `<div class="srow" ${+id > 0 ? `data-cat="${id}"` : ''}><span class="sw" style="background:${PIE_COLORS[i % PIE_COLORS.length]}"></span><span class="grow ellipsis">${c && +id > 0 ? c.icon + ' ' : ''}${esc(name)}</span><b class="num">${hide ? '••' : money(v)}</b><span class="muted pct">${(v / exp * 100).toFixed(0)}%</span></div>`; }).join('')}</div>
    </div></div>`;
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
const isFixedTxn = t => !!t.fixedId || t.source === 'RECURRING';

// توقع الرصيد يوم بيوم لحد بعد القبض الجاي بشهر
function cashPlan() {
  const p = prof(); const now = Date.now(); const t0 = dayStart(now);
  const cyc = payCycle();
  const H = cyc.left + 30;
  const end = t0 + (H + 1) * DAY - 1;
  const bal = balances();
  const liquid = db.accounts.filter(a => !a.archived && LIQUID.has(a.type)).reduce((s, a) => s + conv(bal[a.id] || 0, a.currency), 0);
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
  db.installments.forEach(pl => planSummary(pl).rows.slice(Math.min(pl.paid || 0, 999)).forEach(r => { if (r.date >= t0 && r.date <= end) add(r.date, -r.payment, 'قسط ' + pl.name, 'fixed'); }));
  db.accounts.filter(a => a.type === 'CREDIT' && !a.archived && a.dueDay).forEach(a => {
    const owed = -(bal[a.id] || 0); if (owed > 0) add(t0 + daysUntilDay(a.dueDay) * DAY, -conv(owed, a.currency), 'سداد ' + lbl(a.name), 'fixed');
  });
  db.debts.filter(d => !d.lent && d.dueDate && d.paid < d.amount && d.dueDate <= end).forEach(d => add(Math.max(d.dueDate, t0), -conv(d.amount - d.paid, d.currency), 'دين لـ ' + d.person, 'fixed'));
  db.debts.filter(d => d.lent && d.dueDate && d.paid < d.amount && d.dueDate >= t0 && d.dueDate <= end).forEach(d => add(d.dueDate, conv(d.amount - d.paid, d.currency), 'دين عند ' + d.person, 'in'));
  // المصروف المتغير اليومي: متوسط آخر 30 يوم، أو تقدير من المرتب لو مفيش تاريخ كفاية
  const hist = db.txns.filter(t => t.type === 'EXPENSE' && t.date >= t0 - 30 * DAY && t.date < t0);
  const firstTx = db.txns.reduce((m, t) => Math.min(m, t.date), now);
  const histDays = Math.min(30, Math.max(1, Math.round((t0 - dayStart(firstTx)) / DAY)));
  let varDaily = hist.filter(t => !isFixedTxn(t)).reduce((s, t) => s + conv(t.amount, txCur(t)), 0) / histDays;
  const estimated = histDays < 10 && p.salary > 0;
  if (estimated) varDaily = Math.max(varDaily, Math.max(0, p.salary * (1 - (db.prefs.savingRate || 20) / 100) - fixedMonthly()) / 30.44);
  const todayVar = db.txns.filter(t => t.type === 'EXPENSE' && t.date >= t0 && !isFixedTxn(t)).reduce((s, t) => s + conv(t.amount, txCur(t)), 0);
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
  return { liquid, cyc, H, ev: ev.sort((a, b) => a.i - b.i), series, varDaily, estimated, todayVar, fixedDue, inflowDue, cushion, saveLeft, free, safeDaily, zeroDay, low, low7, atPay, runway, level, t0 };
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
      ${cp.saveLeft > 0 ? `<p class="muted">محجوز <b class="num">${m(cp.saveLeft)}</b> ادخار الشهر ده لسه ماتحوّلش لحساب التوفير، ومش داخل في المسموح اليومي.</p>` : ''}
    </div>
    ${up.length ? `<div class="card"><h3>الجاي لحد القبض</h3><div class="list">${up.map(e => `<div class="item"><div class="ico">${e.amt > 0 ? '⬇️' : '📌'}</div><div class="grow"><div class="ellipsis">${esc(e.label)}</div><div class="muted">${e.n > 1 ? `${e.n} مرات من ${ltr(fmtDate(e.date))}` : ltr(fmtDate(e.date))}</div></div><div class="num ${e.amt > 0 ? 'inc' : 'exp'}">${money(Math.abs(e.amt))}</div></div>`).join('')}</div></div>` : ''}
    <div class="card"><div class="row between"><h3>توزيع المرتب</h3><span class="muted num">${money(a.S)}</span></div>
      ${[['🏠', 'مصاريف ثابتة', a.fixed, 'exp'], ['🛟', 'صندوق الطوارئ', a.emerg, 'inc'], ['📈', 'استثمار', a.invest, 'primary'], ['🛍️', 'مصروف حر', Math.max(0, a.free), 'warn']].filter(x => x[2] > 0).map(([i, t, v, c]) => `<div class="rule"><div class="row between"><span>${i} ${t}</span><span class="num">${m(v)} <small class="muted">${a.S ? Math.round(v / a.S * 100) : 0}%</small></span></div><div class="bar"><i style="width:${a.S ? v / a.S * 100 : 0}%;background:var(--${c})"></i></div></div>`).join('')}
      ${a.free < 0 ? insH('alert', `مصاريفك الثابتة والادخار أكتر من المرتب بـ <b class="num">${money(-a.free)}</b>. قلّل نسبة الادخار أو راجع الثابت.`, 1) : insH('coins', `يوم القبض: حوّل <b class="num">${money(a.save)}</b> للادخار الأول، وسيب <b class="num">${money(a.fixed)}</b> للثابت، والباقي <b class="num">${money(a.free)}</b> مصروفك الحر (حوالي <b class="num">${money(a.perDay)}</b> في اليوم).`)}
      ${a.emDone ? insH('check', 'صندوق الطوارئ مكتمل، كل الادخار يروح للاستثمار.') : a.emTarget ? insH('target', `صندوق الطوارئ: معاك <b class="num">${money(a.savingsBal)}</b> من <b class="num">${money(a.emTarget)}</b> (${p.emMonths || 6} شهور ثابت).`) : ''}
    </div>
    <div class="card"><h3>قيمة وقتك</h3>
      ${hourRate() ? `<div class="row between"><span>ساعة شغلك تساوي</span><b class="num">${money(hourRate())} ${base()}</b></div>
      <input class="in num" id="cHr" inputmode="decimal" placeholder="اكتب سعر حاجة عاوز تشتريها" style="margin-top:10px"><div id="cHrOut" class="muted" style="margin-top:6px"></div>
      <p class="muted">صرفت الشهر ده ${workTime(typeTotals(inRange(...monthRange(0)))[1]) || '—'}.</p>` : '<p class="muted">حدّد ساعات شغلك في «بياناتي المالية» عشان نحسبلك قيمة الساعة.</p>'}
    </div>
    <div class="card"><h3>أفكار للادخار والاستثمار</h3>
      ${INVEST_IDEAS.map(([i, t, d, r]) => `<div class="insight"><span style="font-size:20px">${i}</span><div class="grow"><b>${t}</b> <span class="pill">${r}</span><div class="muted">${d}</div></div></div>`).join('')}
      <p class="muted">أفكار عامة مش نصيحة استثمارية. الأولوية: صندوق الطوارئ، بعدين سداد الديون الغالية، بعدين الاستثمار.</p>
    </div>
    <div class="btns" style="margin-bottom:12px"><button class="btn" id="cFixed">${ic('repeat')} المصاريف الثابتة</button><button class="btn" id="cRep">${ic('chart')} التقرير الشهري</button></div>
    <button class="btn block" id="cProf">${ic('settings')} تعديل بياناتي المالية</button>`;
  if ($('#cHr')) $('#cHr').oninput = e => { const v = parseAmount(e.target.value); $('#cHrOut').innerHTML = v ? `= <b>${workTime(v)}</b>` : ''; };
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

// ================= المساعد الصوتي =================
function speak(text) {
  if (!('speechSynthesis' in window)) return toast('القراءة بالصوت مش مدعومة هنا');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const v = voices.find(x => /ar[-_]EG/i.test(x.lang)) || voices.find(x => /^ar/i.test(x.lang));
  if (v) u.voice = v;
  u.lang = v ? v.lang : 'ar-EG'; u.rate = 1;
  speechSynthesis.speak(u);
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
      return { reply: `أقرب قسط ${ns[0][0].name} بـ ${n(ns[0][1].payment)} يوم ${fmtDate(ns[0][1].date)}` };
    }
    if (/(مساعده|تقدر تعمل ايه|بتعمل ايه|اوامر)/.test(t)) return { reply: 'قول مثلاً: صرفت 200 أكل، قبضت 5000، فاضلي كام، حالتي المالية، 500 جنيه تساوي كام ساعة، مصاريفي الثابتة، أكبر مصروف، قارن بالشهر اللي فات، توقع آخر الشهر، الميزانية، وفرت كام، أو اقتراح' };
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
function voiceBubble(state, text, undoId) {
  const b = $('#vbubble'); b.classList.remove('hidden');
  b.innerHTML = `<div class="row between"><b>${state}</b><button class="x" id="vbX">✕</button></div>${text ? `<div class="vb-text">${esc(text)}</div>` : ''}${undoId ? '<button class="btn small" id="vbUndo">تراجع</button> <button class="btn small" id="vbEdit">تعديل</button>' : ''}`;
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
    voiceBubble('«' + heard + '»', r.reply, r.undoId); speak(r.reply);
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
    <div id="vOut" style="margin-top:10px"></div>`, () => {
    const out = $('#vOut');
    const run = () => {
      const text = $('#vText').value.trim(); if (!text) return toast('قول أو اكتب حاجة الأول');
      const r = handleVoice(text);
      out.innerHTML = insH(r.undoId ? 'sparkle' : 'speaker', esc(r.reply)) + (r.undoId ? '<button class="btn small" id="vUndo">تراجع</button>' : '');
      speak(r.reply);
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
        merchant: t.merchant.trim(), note: t.note.trim(), date: t.date, source: t.source || 'MANUAL', hash: t.hash || null, fixedId: type === 'EXPENSE' ? t.fixedId || null : null };
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
      <div><label class="f">آخر يوم للسداد</label><input class="in num" id="aDue" inputmode="numeric" value="${a.dueDay || ''}" placeholder="مثال 15"></div></div>`
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
      if (type === 'CREDIT') Object.assign(rec, { creditLimit: parseAmount($('#aLim').value) || 0, statementDay: day('#aSt'), dueDay: day('#aDue') });
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
  else { if (hiddenAt && Date.now() - hiddenAt > 60000) showLock(); runRecurring(); if ($('#sheet').classList.contains('hidden')) render(); }
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
setInterval(checkReminder, 60000);

showLock();
runRecurring();
render();
handleHash();
setTimeout(checkReminder, 3000);
setTimeout(checkRiskNotify, 4000);
if (!db.profile.done && !db.profile.skipped) openOnboarding();
if (Date.now() - (db.prefs.ratesUpdated || 0) > 12 * 3600000) refreshRates(false);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
