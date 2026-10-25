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
  cat_other_inc: 'إيرادات أخرى', acc_cash: 'نقدي'
};
const ACC_TYPES = { BANK: 'بنك', CASH: 'نقدي', SAVING: 'توفير', GOLD: 'ذهب', WALLET: 'محفظة إلكترونية' };
const PERIODS = { DAILY: 'يومي', WEEKLY: 'أسبوعي', MONTHLY: 'شهري', YEARLY: 'سنوي' };
const DAY = 86400000;

// ================= التخزين =================
function seed() {
  const exp = [['cat_food', '🍽️'], ['cat_transport', '🚗'], ['cat_bills', '🧾'], ['cat_rent', '🏠'], ['cat_shopping', '🛒'],
    ['cat_health', '💊'], ['cat_fun', '🎬'], ['cat_edu', '🎓'], ['cat_telecom', '📱'], ['cat_clothes', '👕'],
    ['cat_gifts', '🎁'], ['cat_travel', '✈️'], ['cat_family', '👨‍👩‍👧'], ['cat_cash', '🏧'], ['cat_transfer', '🔁'],
    ['cat_other_exp', '📦']];
  const inc = [['cat_salary', '💼'], ['cat_bonus', '🎉'], ['cat_refund', '↩️'], ['cat_other_inc', '💰']];
  let id = 1;
  const categories = [];
  exp.forEach(([n, i]) => categories.push({ id: id++, name: n, isIncome: false, icon: i, monthlyBudget: 0 }));
  inc.forEach(([n, i]) => categories.push({ id: id++, name: n, isIncome: true, icon: i, monthlyBudget: 0 }));
  return {
    v: 1, nextId: 1000,
    accounts: [{ id: id++, name: 'acc_cash', type: 'CASH', currency: 'EGP', initialBalance: 0, last4: '', archived: false }],
    categories, txns: [], recurring: [], goals: [], debts: [], merchants: {}, rates: {},
    prefs: { base: 'EGP', goldOz: 0, ratesUpdated: 0, pinHash: '' }
  };
}

let db;
try { db = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch (e) { db = seed(); }
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

function setTab(t) {
  if (t === 'add') { openTxn(); return; }
  tab = t;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  window.scrollTo(0, 0);
  render();
}

function render() {
  const titles = { home: 'محفظتي', txns: 'الحركات', reports: 'التقارير', more: 'المزيد' };
  $('#title').textContent = titles[tab] || 'محفظتي';
  ({ home: renderHome, txns: renderTxns, reports: renderReports, more: renderMore })[tab]();
}

function txRow(t) {
  const a = acc(t.accountId); const c = cat(t.categoryId);
  const cur = a ? a.currency : base();
  let icon = c ? c.icon : '📦', title = t.merchant || (c ? lbl(c.name) : 'بدون تصنيف'), cls = 'exp', sign = '-';
  if (t.type === 'INCOME') { cls = 'inc'; sign = '+'; }
  if (t.type === 'TRANSFER') { icon = '🔁'; cls = ''; sign = ''; title = t.merchant || `تحويل إلى ${lbl((acc(t.toAccountId) || {}).name || '')}`; }
  return `<div class="item" data-tx="${t.id}">
    <div class="ico">${icon}</div>
    <div class="grow"><div class="ellipsis">${esc(title)}</div><div class="muted ellipsis">${esc(lbl(a ? a.name : ''))} · ${fmtDT(t.date)}${t.note ? ' · ' + esc(t.note) : ''}</div></div>
    <div class="num ${cls}">${sign}${money(t.amount)} <small class="muted">${cur}</small></div>
  </div>`;
}
function bindTxRows(root) {
  root.querySelectorAll('[data-tx]').forEach(el => el.onclick = () => openTxn(db.txns.find(t => t.id === +el.dataset.tx)));
}

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
    ins.push(`<div class="insight">📈 المتوقع صرفه حتى نهاية الشهر: <b class="num">${money(fc)}</b> ${base()}</div>`);
    if (lastExp > 0) { const p = (fc - lastExp) / lastExp * 100; ins.push(`<div class="insight ${p > 0 ? 'w' : ''}">${p > 0 ? '🔺' : '🔻'} ${p > 0 ? 'أعلى' : 'أقل'} من الشهر الماضي بنسبة ${Math.abs(p).toFixed(0)}%</div>`); }
  }
  const topId = Object.keys(cats).filter(k => +k > 0).sort((a, b) => cats[b] - cats[a])[0];
  if (topId && exp > 0) ins.push(`<div class="insight">🏷️ أكثر تصنيف صرفاً: ${esc(lbl(cat(+topId).name))} (${(cats[topId] / exp * 100).toFixed(0)}%)</div>`);
  db.categories.filter(c => c.monthlyBudget > 0 && !c.isIncome).forEach(c => {
    const s = cats[c.id] || 0; const p = s / c.monthlyBudget * 100;
    if (p >= 80) ins.push(`<div class="insight w">⚠️ ميزانية ${esc(lbl(c.name))}: استهلكت ${p.toFixed(0)}%</div>`);
  });
  const due = db.debts.filter(d => d.dueDate && d.paid < d.amount && d.dueDate - Date.now() < 3 * DAY).length;
  if (due) ins.push(`<div class="insight w">⏰ لديك ${due} دين مستحق قريباً</div>`);

  const recent = [...db.txns].sort((a, b) => b.date - a.date).slice(0, 6);
  const budgets = db.categories.filter(c => c.monthlyBudget > 0 && !c.isIncome);
  const gold = goldPrices();

  view().innerHTML = `
    <div class="card hero">
      <div class="muted">إجمالي الرصيد (${base()})</div>
      <div class="big">${money(total)}</div>
      <div class="grid2" style="margin-top:10px">
        <div><div class="muted">دخل هذا الشهر</div><b class="num">${money(inc)}</b></div>
        <div><div class="muted">مصروف هذا الشهر</div><b class="num">${money(exp)}</b></div>
      </div>
    </div>
    ${ins.length ? `<div class="card"><h3>🤖 رؤى ذكية</h3>${ins.join('')}</div>` : ''}
    <div class="card"><div class="row between"><h3>الحسابات</h3><button class="btn small" id="hAcc">إدارة</button></div>
      <div class="list">${db.accounts.filter(a => !a.archived).map(a => `<div class="item"><div class="ico">${{ BANK: '🏦', CASH: '💵', SAVING: '🐷', GOLD: '🪙', WALLET: '📲' }[a.type] || '💳'}</div>
      <div class="grow ellipsis">${esc(lbl(a.name))}${a.last4 ? ` <span class="muted">••${esc(a.last4)}</span>` : ''}</div>
      <div class="num">${money(bal[a.id] || 0)} <small class="muted">${a.currency}</small></div></div>`).join('')}</div></div>
    ${budgets.length ? `<div class="card"><h3>الميزانيات</h3>${budgets.map(c => { const s = cats[c.id] || 0; const p = s / c.monthlyBudget * 100;
      return `<div style="margin-bottom:10px"><div class="row between"><span>${c.icon} ${esc(lbl(c.name))}</span><span class="num muted">${money(s)} / ${money(c.monthlyBudget)}</span></div>
      <div class="bar ${p >= 100 ? 'over' : p >= 80 ? 'warn' : ''}"><i style="width:${Math.min(100, p)}%"></i></div></div>`; }).join('')}</div>` : ''}
    ${db.goals.length ? `<div class="card"><h3>الأهداف</h3>${db.goals.map(g => { const p = g.target ? g.saved / g.target * 100 : 0;
      return `<div style="margin-bottom:10px"><div class="row between"><span>${g.icon} ${esc(g.name)}</span><span class="num muted">${money(g.saved)} / ${money(g.target)} ${g.currency}</span></div>
      <div class="bar"><i style="width:${Math.min(100, p)}%"></i></div></div>`; }).join('')}</div>` : ''}
    ${gold ? `<div class="card"><h3>🪙 سعر الذهب (${base()} للجرام)</h3><div class="grid2">
      <div>عيار 24<br><b class="num">${money(gold.k24)}</b></div><div>عيار 21<br><b class="num">${money(gold.k21)}</b></div>
      <div>عيار 18<br><b class="num">${money(gold.k18)}</b></div><div>الجنيه الذهب<br><b class="num">${money(gold.pound)}</b></div></div></div>` : ''}
    <div class="card"><div class="row between"><h3>آخر الحركات</h3><button class="btn small" id="hAll">الكل</button></div>
      <div class="list">${recent.length ? recent.map(txRow).join('') : '<div class="empty">لا توجد حركات بعد. اضغط ＋ لإضافة أول حركة.</div>'}</div></div>
  `;
  $('#hAcc').onclick = openAccounts;
  $('#hAll').onclick = () => setTab('txns');
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
    <div class="card"><h3>🧠 اسأل عن مصروفاتك</h3>
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
  const items = [
    ['🧾', 'لصق رسالة بنك', 'حوّل رسالة SMS من البنك إلى حركة تلقائياً', openSmsPaste],
    ['🏦', 'الحسابات', 'بنوك، نقدي، توفير، ذهب', openAccounts],
    ['🏷️', 'التصنيفات والميزانيات', 'تعديل التصنيفات وميزانية كل تصنيف', openCategories],
    ['🔁', 'المعاملات المتكررة', 'إيجار، اشتراكات، راتب...', openRecurring],
    ['🤝', 'الديون والقروض', 'أقرضت / اقترضت وسداد جزئي', openDebts],
    ['🎯', 'الأهداف', 'أهداف الادخار', openGoals],
    ['🍕', 'تقسيم فاتورة', 'سجّل نصيبك فقط كمصروف', openSplit],
    ['💱', 'العملة وأسعار الصرف والذهب', `العملة الأساسية: ${base()}`, openRates],
    ['💾', 'نسخ احتياطي واستعادة', 'حفظ بياناتك في ملف (iCloud Drive أو الملفات)', openBackup],
    ['📤', 'تصدير الحركات (Excel/CSV)', 'كل الحركات في ملف واحد', exportCsv],
    ['🔒', 'قفل PIN', db.prefs.pinHash ? 'مفعّل' : 'غير مفعّل', openPin],
    ['📲', 'التثبيت على الآيفون', 'إضافة التطبيق للشاشة الرئيسية', () => $('#iosHint').classList.remove('hidden')]
  ];
  view().innerHTML = `<div class="card list menu">${items.map((x, i) => `<div class="item" data-m="${i}"><div class="ico">${x[0]}</div><div class="grow"><div>${x[1]}</div><div class="muted">${x[2]}</div></div><span class="muted">‹</span></div>`).join('')}</div>
    <p class="muted" style="text-align:center">بياناتك محفوظة على هذا الجهاز فقط ولا تُرسل لأي خادم. خذ نسخة احتياطية بانتظام.</p>`;
  view().querySelectorAll('[data-m]').forEach(el => el.onclick = () => items[+el.dataset.m][3]());
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
        merchant: t.merchant.trim(), note: t.note.trim(), date: t.date, source: t.source || 'MANUAL' };
      const i = db.txns.findIndex(x => x.id === rec.id);
      if (i >= 0) db.txns[i] = rec; else db.txns.push(rec);
      if (rec.categoryId && rec.merchant) learn(rec.merchant, rec.categoryId);
      save(); closeSheet(); toast('تم الحفظ');
    };
    if (!isNew) $('#tDel').onclick = () => { if (confirm('حذف هذه الحركة؟')) { db.txns = db.txns.filter(x => x.id !== t.id); save(); closeSheet(); } };
    if (isNew && !t.amount) setTimeout(() => $('#tAmt').focus(), 250);
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
      const msgs = $('#smsTxt').value.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
      const parsed = msgs.map(m => ({ m, p: SMS.parse(m) })).filter(x => x.p);
      if (!parsed.length) { $('#smsOut').innerHTML = '<div class="insight w">لم يتم التعرف على حركة مالية في النص.</div>'; return; }
      $('#smsOut').innerHTML = parsed.map((x, i) => {
        const p = x.p; const kindL = { DEBIT: 'مصروف', CREDIT: 'دخل', TRANSFER: 'تحويل صادر', ATM: 'سحب نقدي' }[p.kind];
        return `<div class="insight"><div class="row between"><b class="num ${p.kind === 'CREDIT' ? 'inc' : 'exp'}">${money(p.amount)} ${p.currency || ''}</b><span>${kindL}</span></div>
          <div class="muted">${esc(p.merchant || '—')} · ${fmtDT(p.date)}${p.last4 ? ' · ••' + p.last4 : ''}${p.balance != null ? ' · الرصيد ' + money(p.balance) : ''}</div>
          <button class="btn small primary" data-use="${i}" style="margin-top:6px">مراجعة وإضافة</button></div>`;
      }).join('');
      $('#smsOut').querySelectorAll('[data-use]').forEach(b => b.onclick = () => {
        const p = parsed[+b.dataset.use].p; const body = parsed[+b.dataset.use].m;
        let a = p.last4 && db.accounts.find(x => x.last4 === p.last4);
        if (!a && p.currency) a = db.accounts.find(x => x.currency === p.currency && x.type !== 'CASH') || db.accounts.find(x => x.currency === p.currency);
        a = a || db.accounts[0];
        const type = p.kind === 'CREDIT' ? 'INCOME' : 'EXPENSE';
        openTxn(null, { type, amount: p.amount, accountId: a && a.id, categoryId: suggestCategory(p.merchant, p.kind, body), merchant: p.merchant, date: p.date, source: 'SMS_OK', note: p.last4 ? '••' + p.last4 : '' });
      });
    };
  });
}

function openAccounts() {
  const bal = balances();
  sheet('الحسابات', `<div class="list">${db.accounts.map(a => `<div class="item" data-a="${a.id}"><div class="ico">${{ BANK: '🏦', CASH: '💵', SAVING: '🐷', GOLD: '🪙', WALLET: '📲' }[a.type] || '💳'}</div>
    <div class="grow"><div>${esc(lbl(a.name))}${a.archived ? ' <span class="muted">(مؤرشف)</span>' : ''}</div><div class="muted">${ACC_TYPES[a.type] || a.type}${a.last4 ? ' · ••' + esc(a.last4) : ''}</div></div>
    <div class="num">${money(bal[a.id] || 0)} <small class="muted">${a.currency}</small></div></div>`).join('')}</div>
    <button class="btn primary block" id="aNew" style="margin-top:10px">＋ حساب جديد</button>`, () => {
    document.querySelectorAll('[data-a]').forEach(el => el.onclick = () => editAccount(acc(+el.dataset.a)));
    $('#aNew').onclick = () => editAccount();
  });
}
function editAccount(a) {
  const isNew = !a; a = a || { name: '', type: 'BANK', currency: base(), initialBalance: 0, last4: '', archived: false };
  sheet(isNew ? 'حساب جديد' : 'تعديل حساب', `
    <label class="f">الاسم</label><input class="in" id="aName" value="${esc(lbl(a.name))}">
    <label class="f">النوع</label><select class="in" id="aType">${Object.entries(ACC_TYPES).map(([k, v]) => `<option value="${k}" ${a.type === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <label class="f">العملة</label><select class="in" id="aCur">${CURRENCIES.map(c => `<option ${a.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
    <label class="f">الرصيد الافتتاحي</label><input class="in num" id="aBal" inputmode="decimal" value="${a.initialBalance}">
    <label class="f">آخر 4 أرقام من البطاقة/الحساب (لربط رسائل البنك)</label><input class="in num" id="aL4" inputmode="numeric" maxlength="4" value="${esc(a.last4)}">
    ${isNew ? '' : `<label class="row" style="margin-top:12px"><input type="checkbox" id="aArc" ${a.archived ? 'checked' : ''}> أرشفة (إخفاء من الرئيسية)</label>`}
    <div class="btns"><button class="btn primary" id="aSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="aDel">حذف</button>'}</div>`, () => {
    $('#aSave').onclick = () => {
      const name = $('#aName').value.trim(); if (!name) return toast('أدخل اسم الحساب');
      const rec = { ...a, id: a.id || newId(), name: name === lbl(a.name) ? a.name : name, type: $('#aType').value, currency: $('#aCur').value,
        initialBalance: parseAmount($('#aBal').value) || 0, last4: $('#aL4').value.trim(), archived: isNew ? false : $('#aArc').checked };
      const i = db.accounts.findIndex(x => x.id === rec.id); if (i >= 0) db.accounts[i] = rec; else db.accounts.push(rec);
      save(); openAccounts();
      if (rec.currency !== base() && !db.rates[rec.currency]) refreshRates();
    };
    if (!isNew) $('#aDel').onclick = () => {
      if (!confirm('حذف الحساب سيحذف كل حركاته. متأكد؟')) return;
      db.txns = db.txns.filter(t => t.accountId !== a.id && t.toAccountId !== a.id);
      db.recurring = db.recurring.filter(r => r.accountId !== a.id);
      db.accounts = db.accounts.filter(x => x.id !== a.id); save(); openAccounts();
    };
  });
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
    <div class="btns"><button class="btn primary" id="cSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="cDel">حذف</button>'}</div>`, body => {
    body.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { icon = b.dataset.e; body.querySelectorAll('[data-e]').forEach(x => x.classList.toggle('on', x === b)); });
    $('#cSave').onclick = () => {
      const name = $('#cName').value.trim(); if (!name) return toast('أدخل اسم التصنيف');
      const rec = { ...c, id: c.id || newId(), name: name === lbl(c.name) ? c.name : name, isIncome: $('#cInc').value === '1', icon, monthlyBudget: parseAmount($('#cBud').value) || 0 };
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
      <div class="muted">${PERIODS[r.period]} · القادم ${fmtDate(r.nextDate)}</div></div><div class="num ${r.type === 'INCOME' ? 'inc' : 'exp'}">${money(r.amount)} <small class="muted">${a ? a.currency : ''}</small></div></div>`; }).join('') : '<div class="empty">لا توجد معاملات متكررة</div>'}</div>
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
  return `<h3 style="margin-top:12px">💡 اشتراكات مكتشفة</h3>${hints.map(h => `<div class="insight">${esc(h.merchant)} · <span class="num">${money(h.amount)}</span> · ${PERIODS[h.period]} <button class="btn small" data-sub='${esc(JSON.stringify(h))}'>إضافة كمتكررة</button></div>`).join('')}`;
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
    <div class="muted">${d.dueDate ? 'الاستحقاق ' + fmtDate(d.dueDate) : fmtDate(d.date)}${rem <= 0 ? ' · ✅ مسدد' : ''}</div><div class="bar"><i style="width:${Math.min(100, d.paid / d.amount * 100)}%"></i></div></div>
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
    <label class="f">الأيقونة</label><div class="emojis">${['🎯', '🚗', '🏠', '✈️', '💍', '🎓', '💻', '📱', '🏖️', '🕋', '💰'].map(e => `<button class="${e === icon ? 'on' : ''}" data-e="${e}">${e}</button>`).join('')}</div>
    <div class="btns"><button class="btn primary" id="gSave">حفظ</button>${isNew ? '' : '<button class="btn danger" id="gDel">حذف</button>'}</div>`, body => {
    body.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { icon = b.dataset.e; body.querySelectorAll('[data-e]').forEach(x => x.classList.toggle('on', x === b)); });
    $('#gSave').onclick = () => {
      const t = parseAmount($('#gT').value); const n = $('#gN').value.trim();
      if (!n || !(t > 0)) return toast('أدخل الاسم والمبلغ');
      const rec = { ...g, id: g.id || newId(), name: n, target: t, saved: parseAmount($('#gS').value) || 0, currency: $('#gC').value, icon };
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
    <p class="muted">آخر تحديث: ${db.prefs.ratesUpdated ? fmtDT(db.prefs.ratesUpdated) : 'لم يتم بعد'}</p>
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
        db = o; save(); closeSheet(); toast('تمت الاستعادة');
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
$('#iosHintClose').onclick = () => { $('#iosHint').classList.add('hidden'); try { localStorage.setItem('mywallet.hint', '1'); } catch (e) { } };
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) hiddenAt = Date.now();
  else { if (hiddenAt && Date.now() - hiddenAt > 60000) showLock(); runRecurring(); if ($('#sheet').classList.contains('hidden')) render(); }
});

const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let hintSeen = false; try { hintSeen = !!localStorage.getItem('mywallet.hint'); } catch (e) { }
if (isIOS && !standalone && !hintSeen) $('#iosHint').classList.remove('hidden');

showLock();
runRecurring();
render();
if (Date.now() - (db.prefs.ratesUpdated || 0) > 12 * 3600000) refreshRates(false);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
