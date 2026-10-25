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
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
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
    installments: [], inbox: [],
    prefs: { base: 'EGP', goldOz: 0, ratesUpdated: 0, pinHash: '', reminderTime: '21:00', autoAddSms: false, savingRate: 20 }
  };
}

// يضيف الحقول الجديدة للبيانات المحفوظة من الإصدار الأول
function migrate(d) {
  d.installments = d.installments || [];
  d.inbox = d.inbox || [];
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
    if (!r.active || !acc(r.accountId)) return;
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

const SUB_VIEWS = { cards: 'more', savings: 'home', inbox: 'home' };
function setTab(t) {
  if (t === 'add') { openTxn(); return; }
  tab = t;
  const main = SUB_VIEWS[t] || t;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === main));
  window.scrollTo(0, 0);
  render();
}

function render() {
  const titles = { home: 'محفظتي', txns: 'الحركات', reports: 'التقارير', more: 'المزيد', cards: 'بطاقات الائتمان', savings: 'الادخار', inbox: 'رسائل البنك' };
  $('#title').textContent = titles[tab] || 'محفظتي';
  const back = $('#back');
  back.classList.toggle('hidden', !SUB_VIEWS[tab]);
  back.onclick = () => setTab(SUB_VIEWS[tab]);
  ({ home: renderHome, txns: renderTxns, reports: renderReports, more: renderMore, cards: renderCards, savings: renderSavings, inbox: renderInbox })[tab]();
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
    ['cards', 'card', 'البطاقات'], ['savings', 'coins', 'الادخار'], ['rep', 'chart', 'التقارير'], ['plans', 'calendar', 'الأقساط']];
  view().innerHTML = `
    <section class="band">
      <div class="greet">${greet}</div>
      <div class="bal-row">
        <div><div class="label">إجمالي الرصيد</div><div class="big num">${m(total)} <small>${base()}</small></div></div>
        <button class="eye" id="hEye" aria-label="إظهار أو إخفاء الرصيد">${ic(hide ? 'eyeOff' : 'eye')}</button>
      </div>
      <div class="acc-scroll">${db.accounts.filter(a => !a.archived).map(a => `<button class="acc-card ${a.type === 'CREDIT' ? 'credit' : ''}" data-acc="${a.id}">
        <div class="row between"><span class="acc-ic">${accIcon(a)}</span><span class="acc-type">${ACC_TYPES[a.type] || ''}</span></div>
        <div class="acc-name ellipsis">${esc(lbl(a.name))}</div>
        <div class="acc-no num">${a.last4 ? '•••• ' + esc(a.last4) : '&nbsp;'}</div>
        <div class="acc-bal num">${m(bal[a.id] || 0)} <small>${a.currency}</small></div>
      </button>`).join('')}<button class="acc-card add" id="hAcc">${ic('plus')}<span>إدارة الحسابات</span></button></div>
    </section>
    <div class="card tiles">${tiles.map(([k, i, t, b]) => `<button data-q="${k}"><span class="ti">${ic(i)}</span><span>${t}</span>${b ? `<i class="badge">${b}</i>` : ''}</button>`).join('')}</div>
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
    cards: () => setTab('cards'), savings: () => setTab('savings'), rep: () => setTab('reports'), plans: () => setTab('cards') };
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
    <button class="btn block" id="repCsv">⬇️ تصدير التقرير (Excel/CSV)</button>`;
  view().querySelectorAll('[data-p]').forEach(b => b.onclick = () => { reportPeriod = b.dataset.p; renderReports(); });
  view().querySelectorAll('[data-rt]').forEach(b => b.onclick = () => { reportType = b.dataset.rt; renderReports(); });
  bindTxRows(view());
  $('#nl').onkeydown = e => { if (e.key === 'Enter') askNl(e.target.value); };
  $('#nl').onchange = e => askNl(e.target.value);
  $('#repCsv').onclick = () => {
    const rows = [['القسم', 'البند', `المبلغ (${base()})`, '%'], ['ملخص', 'الدخل', inc.toFixed(2), ''], ['ملخص', 'المصروف', exp.toFixed(2), ''], ['ملخص', 'الصافي', (inc - exp).toFixed(2), '']];
    slices.forEach(([id, v]) => rows.push(['التصنيفات', cat(+id) ? lbl(cat(+id).name) : 'بدون تصنيف', v.toFixed(2), total ? (v / total * 100).toFixed(1) : '0']));
    months.forEach(m => { rows.push(['الأشهر', m.k + ' دخل', m.inc.toFixed(2), '']); rows.push(['الأشهر', m.k + ' مصروف', m.exp.toFixed(2), '']); });
    downloadCsv(`report-${fmtDate(Date.now())}.csv`, rows);
  };
}

// بحث بلغة طبيعية (قواعد محلية)
function askNl(text) {
  const out = $('#nlOut'); const t = normDigits(text).toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي');
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
  $('#nlGo').onclick = () => { filter = { q: '', type, accountId: 0, categoryId: catId, period }; setTab('txns'); };
}

function renderMore() {
  const groups = [
    ['الفلوس', [
      ['bank', 'الحسابات', 'بنوك، نقدي، توفير، ذهب', openAccounts],
      ['card', 'بطاقات الائتمان والتقسيط', 'الحد المستخدم، مواعيد السداد، جدول الأقساط', () => setTab('cards')],
      ['coins', 'الادخار', 'قاعدة 50/30/20، صندوق الطوارئ، خطة الأهداف', () => setTab('savings')],
      ['target', 'الأهداف', 'أهداف الادخار', openGoals],
      ['users', 'الديون والقروض', 'أقرضت / اقترضت وسداد جزئي', openDebts]]],
    ['التنظيم', [
      ['mail', 'رسائل البنك', 'لصق أو استيراد الرسائل وربطها تلقائياً', () => setTab('inbox')],
      ['tag', 'التصنيفات والميزانيات', 'ميزانية كل تصنيف ونوعه (احتياج/رغبة)', openCategories],
      ['repeat', 'المعاملات المتكررة', 'إيجار، اشتراكات، راتب...', openRecurring],
      ['split', 'تقسيم فاتورة', 'سجّل نصيبك فقط كمصروف', openSplit]]],
    ['البيانات والإعدادات', [
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
    $('#stRates').onclick = openRates; $('#stPin').onclick = openPin; $('#stBackup').onclick = openBackup;
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
  const draw = () => sheet(isNew ? 'حركة جديدة' : 'تعديل حركة', `
    <div class="seg"><button data-ty="EXPENSE" class="${type === 'EXPENSE' ? 'on e' : ''}">مصروف</button><button data-ty="INCOME" class="${type === 'INCOME' ? 'on i' : ''}">دخل</button><button data-ty="TRANSFER" class="${type === 'TRANSFER' ? 'on' : ''}">تحويل</button></div>
    <label class="f">المبلغ</label><input class="in num" id="tAmt" inputmode="decimal" value="${t.amount}" placeholder="0.00" style="font-size:24px;text-align:center">
    <label class="f">${type === 'TRANSFER' ? 'من حساب' : 'الحساب'}</label><select class="in" id="tAcc">${accOptions(t.accountId)}</select>
    ${type === 'TRANSFER' ? `<label class="f">إلى حساب</label><select class="in" id="tTo">${accOptions(t.toAccountId)}</select>
      <label class="f">المبلغ المستلم (إن كانت العملة مختلفة)</label><input class="in num" id="tToAmt" inputmode="decimal" value="${t.toAmount ?? ''}">`
      : `<label class="f">التصنيف</label><select class="in" id="tCat">${catOptions(type === 'INCOME', t.categoryId)}</select>`}
    <label class="f">${type === 'INCOME' ? 'المصدر' : 'التاجر / الوصف'}</label><input class="in" id="tMer" value="${esc(t.merchant)}">
    <label class="f">ملاحظة</label><input class="in" id="tNote" value="${esc(t.note)}">
    <label class="f">التاريخ</label><input class="in" id="tDate" type="datetime-local" value="${toLocalInput(t.date)}">
    <div class="btns"><button class="btn primary" id="tSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="tDel">حذف</button>'}</div>`, body => {
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
        merchant: t.merchant.trim(), note: t.note.trim(), date: t.date, source: t.source || 'MANUAL', hash: t.hash || null };
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
  sheet('المعاملات المتكررة', `
    <p class="muted">تُضاف تلقائياً عند فتح التطبيق، وتعوّض المواعيد الفائتة.</p>
    <div class="list">${db.recurring.length ? db.recurring.map(r => { const c = cat(r.categoryId); const a = acc(r.accountId);
      return `<div class="item" data-r="${r.id}"><div class="ico">${c ? c.icon : '🔁'}</div><div class="grow"><div class="ellipsis">${esc(r.merchant || (c ? lbl(c.name) : ''))}${r.active ? '' : ' <span class="muted">(متوقف)</span>'}</div>
      <div class="muted">${PERIODS[r.period]} · القادم ${ltr(fmtDate(r.nextDate))}</div></div><div class="num ${r.type === 'INCOME' ? 'inc' : 'exp'}">${money(r.amount)} <small class="muted">${a ? a.currency : ''}</small></div></div>`; }).join('') : '<div class="empty">لا توجد معاملات متكررة</div>'}</div>
    ${subscriptionHints()}
    <button class="btn primary block" id="rNew" style="margin-top:10px">＋ إضافة</button>`, () => {
    document.querySelectorAll('[data-r]').forEach(el => el.onclick = () => editRecurring(db.recurring.find(r => r.id === +el.dataset.r)));
    document.querySelectorAll('[data-sub]').forEach(el => el.onclick = () => { const h = JSON.parse(el.dataset.sub); editRecurring(null, h); });
    $('#rNew').onclick = () => editRecurring();
  });
}
function subscriptionHints() {
  const since = Date.now() - 200 * DAY;
  const existing = new Set(db.recurring.map(r => merchantKey(r.merchant)));
  const groups = {};
  db.txns.filter(t => t.type === 'EXPENSE' && t.merchant && t.date >= since).forEach(t => { const k = merchantKey(t.merchant); (groups[k] = groups[k] || []).push(t); });
  const hints = [];
  for (const k in groups) {
    if (existing.has(k)) continue;
    const l = groups[k].sort((a, b) => a.date - b.date);
    if (l.length < 3) continue;
    const avg = l.reduce((s, t) => s + t.amount, 0) / l.length;
    if (!l.every(t => Math.abs(t.amount - avg) <= avg * 0.1)) continue;
    const gaps = l.slice(1).map((t, i) => (t.date - l[i].date) / DAY);
    const g = gaps.reduce((s, x) => s + x, 0) / gaps.length;
    const period = g >= 5 && g <= 9 ? 'WEEKLY' : g >= 25 && g <= 35 ? 'MONTHLY' : null;
    if (!period || !gaps.every(x => Math.abs(x - g) <= (period === 'WEEKLY' ? 2 : 6))) continue;
    const last = l[l.length - 1];
    hints.push({ merchant: last.merchant, amount: Math.round(avg * 100) / 100, accountId: last.accountId, categoryId: last.categoryId, period, lastDate: last.date });
  }
  if (!hints.length) return '';
  return `<h3 style="margin-top:12px">اشتراكات مكتشفة</h3>${hints.map(h => `<div class="insight">${esc(h.merchant)} · <span class="num">${money(h.amount)}</span> · ${PERIODS[h.period]} <button class="btn small" data-sub='${esc(JSON.stringify(h))}'>إضافة كمتكررة</button></div>`).join('')}`;
}
function editRecurring(r, hint) {
  const isNew = !r;
  r = r || { type: 'EXPENSE', amount: hint ? hint.amount : '', accountId: hint ? hint.accountId : (db.accounts[0] || {}).id, categoryId: hint ? hint.categoryId : null,
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
    ${isNew ? '' : `<label class="row" style="margin-top:12px"><input type="checkbox" id="rAct" ${r.active ? 'checked' : ''}> مفعّلة</label>`}
    <div class="btns"><button class="btn primary" id="rSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="rDel">حذف</button>'}</div>`, body => {
    body.querySelectorAll('[data-ty]').forEach(b => b.onclick = () => { r.amount = $('#rAmt').value; r.merchant = $('#rMer').value; type = b.dataset.ty; r.categoryId = null; draw(); });
    $('#rSave').onclick = () => {
      const amt = parseAmount($('#rAmt').value); if (!(amt > 0)) return toast('أدخل مبلغاً صحيحاً');
      const [y, m, d] = $('#rNext').value.split('-').map(Number);
      const next = new Date(y, m - 1, d, 9, 0).getTime();
      const rec = { ...r, id: r.id || newId(), type, amount: amt, accountId: +$('#rAcc').value, categoryId: +$('#rCat').value || null, merchant: $('#rMer').value.trim(),
        period: $('#rPer').value, nextDate: next, anchorDay: d || 1, active: isNew ? true : $('#rAct').checked };
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
function openPin() {
  sheet('قفل PIN', db.prefs.pinHash ? `<p>القفل مفعّل.</p><button class="btn danger block" id="pOff">إلغاء القفل</button>` : `
    <label class="f">رمز PIN جديد (4 إلى 8 أرقام)</label><input class="in num" id="p1" type="password" inputmode="numeric" maxlength="8">
    <label class="f">تأكيد الرمز</label><input class="in num" id="p2" type="password" inputmode="numeric" maxlength="8">
    <button class="btn primary block" id="pOn" style="margin-top:12px">تفعيل</button>`, () => {
    if ($('#pOff')) $('#pOff').onclick = () => { db.prefs.pinHash = ''; save(); closeSheet(); toast('تم إلغاء القفل'); };
    if ($('#pOn')) $('#pOn').onclick = async () => {
      const a = normDigits($('#p1').value), b = normDigits($('#p2').value);
      if (!/^\d{4,8}$/.test(a)) return toast('الرمز من 4 إلى 8 أرقام');
      if (a !== b) return toast('الرمزان غير متطابقين');
      db.prefs.pinHash = await hashPin(a); save(); closeSheet(); toast('تم تفعيل القفل');
    };
  });
}
let fails = 0, blockedUntil = 0;
function showLock() {
  if (!db.prefs.pinHash) return;
  $('#lock').classList.remove('hidden'); $('#pinIn').value = ''; $('#pinErr').textContent = '';
  setTimeout(() => $('#pinIn').focus(), 200);
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
  document.querySelector('meta[name=theme-color]').content = isDark() ? '#0c111d' : '#0e7c6b';
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
if (Date.now() - (db.prefs.ratesUpdated || 0) > 12 * 3600000) refreshRates(false);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
