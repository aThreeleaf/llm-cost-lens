/**
 * LLM Cost Lens
 * Phase 1: Skeleton initialization & I18n support
 *
 * NOTE: Formal calculation, model pricing, sorting, and lowest-cost detection
 * are intentionally omitted in Phase 1 per design specifications.
 */

'use strict';

const STORAGE_KEY = 'llm_cost_lens_lang';
const DEFAULT_LANG = 'en';

const translations = {
  en: {
    'header.subtitle': 'Compare estimated API costs across leading AI models.',
    'header.description': 'Estimate and compare LLM API spending before you ship.',
    'calculator.title': 'Calculator',
    'calculator.inputTokens': 'Input tokens / request',
    'calculator.outputTokens': 'Output tokens / request',
    'calculator.requestsPerDay': 'Requests / day',
    'comparison.title': 'Model comparison',
    'common.demoData': 'Demo data',
    'card.lowestCost': 'Lowest cost',
    'card.inputPrice': 'Input price',
    'card.outputPrice': 'Output price',
    'card.perRequest': 'Per request',
    'card.perDay': 'Per day',
    'card.estimate30Day': '30-day estimate',
    'pricing.title': 'Pricing sources',
    'pricing.description': 'Official pricing sources will be added after verification.',
    'pricing.lastChecked': 'Last checked:',
    'pricing.pendingVerification': 'Pending verification',
    'limitations.title': 'Known limitations',
    'limitations.item1': 'Standard text token pricing only',
    'limitations.item2': 'Cached input pricing is not included',
    'limitations.item3': 'Batch API discounts are not included',
    'limitations.item4': 'Tool calls and other API-specific charges are not included',
    'limitations.item5': 'Actual token usage may differ by provider and model',
    'footer.note': 'LLM Cost Lens — Phase 1 Skeleton'
  },
  zh: {
    'header.subtitle': '比较主流大语言模型 API 的预计使用成本',
    'header.description': '在上线前快速估算并比较 LLM API 使用成本',
    'calculator.title': '计算器',
    'calculator.inputTokens': '每次请求输入 Token 数',
    'calculator.outputTokens': '每次请求输出 Token 数',
    'calculator.requestsPerDay': '每日请求次数',
    'comparison.title': '模型成本对比',
    'common.demoData': '演示数据',
    'card.lowestCost': '成本最低',
    'card.inputPrice': '输入价格',
    'card.outputPrice': '输出价格',
    'card.perRequest': '单次请求',
    'card.perDay': '每日成本',
    'card.estimate30Day': '30 天预估',
    'pricing.title': '价格来源',
    'pricing.description': '官方价格来源将在核验后补充。',
    'pricing.lastChecked': '最近核验：',
    'pricing.pendingVerification': '待核验',
    'limitations.title': '已知限制',
    'limitations.item1': '仅限标准文本 Token 定价',
    'limitations.item2': '不包含 Prompt 缓存优惠价格',
    'limitations.item3': '不包含 Batch API 折扣',
    'limitations.item4': '不包含工具调用及其他特定 API 附加费用',
    'limitations.item5': '各模型及供应商的实际 Token 计费可能存在差异',
    'footer.note': 'LLM Cost Lens — 第一阶段页面骨架'
  }
};

/**
 * Update all DOM elements with data-i18n attribute based on dictionary.
 * @param {string} lang - 'en' | 'zh'
 */
function applyTranslations(lang) {
  const dict = translations[lang] || translations[DEFAULT_LANG];
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update active state on language switcher buttons
  const buttons = document.querySelectorAll('.lang-btn');
  buttons.forEach((btn) => {
    const btnLang = btn.getAttribute('data-lang');
    const isActive = btnLang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

/**
 * Set current language and persist to localStorage
 * @param {string} lang - 'en' | 'zh'
 */
function setLanguage(lang) {
  const validLang = translations[lang] ? lang : DEFAULT_LANG;
  try {
    localStorage.setItem(STORAGE_KEY, validLang);
  } catch (err) {
    // Graceful fallback if localStorage is disabled
  }
  applyTranslations(validLang);
}

/**
 * Get initial language preference from localStorage or fallback
 * @returns {string}
 */
function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) {
      return saved;
    }
  } catch (err) {
    // Graceful fallback if localStorage is disabled
  }
  return DEFAULT_LANG;
}

document.addEventListener('DOMContentLoaded', () => {
  // Bind language toggle buttons
  const langSwitch = document.querySelector('.lang-switch');
  if (langSwitch) {
    langSwitch.addEventListener('click', (event) => {
      const targetBtn = event.target.closest('.lang-btn');
      if (targetBtn) {
        const lang = targetBtn.getAttribute('data-lang');
        if (lang) {
          setLanguage(lang);
        }
      }
    });
  }

  // Apply initial language
  const initialLang = getInitialLanguage();
  setLanguage(initialLang);
});
