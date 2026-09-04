/**
 * LLM Cost Lens
 * Phase 2: Verified Model Pricing & Dynamic Card Rendering
 *
 * NOTE: Calculation logic, sorting, and lowest-cost detection are
 * strictly omitted in Phase 2 per design specifications.
 */

'use strict';

const STORAGE_KEY = 'llm_cost_lens_lang';
const DEFAULT_LANG = 'en';

const LAST_CHECKED = '2026-09-04';

const MODEL_PRICING = [
  {
    provider: 'OpenAI',
    model: 'GPT-6 Astra',
    inputPrice: 10,
    outputPrice: 50
  },
  {
    provider: 'OpenAI',
    model: 'GPT-5.6 Sol',
    inputPrice: 4,
    outputPrice: 20
  },
  {
    provider: 'OpenAI',
    model: 'GPT-5.6 Terra',
    inputPrice: 2,
    outputPrice: 12
  },
  {
    provider: 'OpenAI',
    model: 'GPT-5.6 Luna',
    inputPrice: 0.2,
    outputPrice: 1.2
  },
  {
    provider: 'Anthropic',
    model: 'Claude Fable 5.1',
    inputPrice: 10,
    outputPrice: 50
  },
  {
    provider: 'Anthropic',
    model: 'Claude Opus 5',
    inputPrice: 5,
    outputPrice: 25
  },
  {
    provider: 'Anthropic',
    model: 'Claude Sonnet 5',
    inputPrice: 2,
    outputPrice: 10
  },
  {
    provider: 'Anthropic',
    model: 'Claude Haiku 4.5',
    inputPrice: 1,
    outputPrice: 5
  },
  {
    provider: 'Google',
    model: 'Gemini 3.8 Flash',
    inputPrice: 0.75,
    outputPrice: 3.75
  },
  {
    provider: 'xAI',
    model: 'Grok 4.6',
    inputPrice: 2,
    outputPrice: 6
  }
];

const PRICING_SOURCES = [
  {
    nameKey: 'pricing.source.openai',
    url: 'https://developers.openai.com/api/docs/models/compare'
  },
  {
    nameKey: 'pricing.source.anthropic',
    url: 'https://platform.claude.com/docs/en/about-claude/pricing'
  },
  {
    nameKey: 'pricing.source.google',
    url: 'https://ai.google.dev/gemini-api/docs/pricing'
  },
  {
    nameKey: 'pricing.source.xai',
    url: 'https://docs.x.ai/developers/pricing'
  }
];

const translations = {
  en: {
    'header.subtitle': 'Compare estimated API costs across leading AI models.',
    'header.description': 'Estimate and compare LLM API spending before you ship.',
    'calculator.title': 'Calculator',
    'calculator.inputTokens': 'Input tokens / request',
    'calculator.outputTokens': 'Output tokens / request',
    'calculator.requestsPerDay': 'Requests / day',
    'comparison.title': 'Model comparison',
    'card.inputPrice': 'Input price',
    'card.outputPrice': 'Output price',
    'card.perRequest': 'Per request',
    'card.perDay': 'Per day',
    'card.estimate30Day': '30-day estimate',
    'pricing.title': 'Pricing sources',
    'pricing.source.openai': 'OpenAI official pricing',
    'pricing.source.anthropic': 'Anthropic official pricing',
    'pricing.source.google': 'Google Gemini official pricing',
    'pricing.source.xai': 'xAI official pricing',
    'pricing.note': 'Prices are snapshots from official provider documentation and may change over time.',
    'pricing.lastChecked': 'Last checked:',
    'limitations.title': 'Known limitations',
    'limitations.item1': 'Standard text token pricing only',
    'limitations.item2': 'Cached input pricing is not included',
    'limitations.item3': 'Batch API discounts are not included',
    'limitations.item4': 'Tool calls and other API-specific charges are not included',
    'limitations.item5': 'Actual token usage may differ by provider and model'
  },
  zh: {
    'header.subtitle': '比较主流大语言模型 API 的预计使用成本',
    'header.description': '在上线前快速估算并比较 LLM API 使用成本',
    'calculator.title': '计算器',
    'calculator.inputTokens': '每次请求输入 Token 数',
    'calculator.outputTokens': '每次请求输出 Token 数',
    'calculator.requestsPerDay': '每日请求次数',
    'comparison.title': '模型成本对比',
    'card.inputPrice': '输入价格',
    'card.outputPrice': '输出价格',
    'card.perRequest': '单次请求',
    'card.perDay': '每日成本',
    'card.estimate30Day': '30 天预估',
    'pricing.title': '价格来源',
    'pricing.source.openai': 'OpenAI 官方价格',
    'pricing.source.anthropic': 'Anthropic 官方价格',
    'pricing.source.google': 'Google Gemini 官方价格',
    'pricing.source.xai': 'xAI 官方价格',
    'pricing.note': '价格为官方文档核验时的快照，未来可能发生变化。',
    'pricing.lastChecked': '最近核验：',
    'limitations.title': '已知限制',
    'limitations.item1': '仅限标准文本 Token 定价',
    'limitations.item2': '不包含 Prompt 缓存优惠价格',
    'limitations.item3': '不包含 Batch API 折扣',
    'limitations.item4': '不包含工具调用及其他特定 API 附加费用',
    'limitations.item5': '各模型及供应商的实际 Token 计费可能存在差异'
  }
};

/**
 * Format token price to standard USD string
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  return `$${price.toFixed(2)} / 1M tokens`;
}

/**
 * Render dynamic model cards from MODEL_PRICING array
 */
function renderModelCards() {
  const container = document.getElementById('model-grid');
  if (!container) return;

  container.innerHTML = MODEL_PRICING.map((item) => `
    <article class="model-card">
      <div class="card-header">
        <div class="model-info">
          <span class="provider-name">${item.provider}</span>
          <h3 class="model-name">${item.model}</h3>
        </div>
      </div>

      <div class="card-metrics">
        <div class="metric-row">
          <span class="metric-label" data-i18n="card.inputPrice">Input price</span>
          <span class="metric-value">${formatPrice(item.inputPrice)}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label" data-i18n="card.outputPrice">Output price</span>
          <span class="metric-value">${formatPrice(item.outputPrice)}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label" data-i18n="card.perRequest">Per request</span>
          <span class="metric-value">—</span>
        </div>
        <div class="metric-row">
          <span class="metric-label" data-i18n="card.perDay">Per day</span>
          <span class="metric-value">—</span>
        </div>
      </div>

      <div class="card-footer">
        <span class="estimate-label" data-i18n="card.estimate30Day">30-day estimate</span>
        <span class="estimate-value">—</span>
      </div>
    </article>
  `).join('');
}

/**
 * Render pricing sources list and verification date
 */
function renderPricingSources() {
  const list = document.getElementById('sources-list');
  if (list) {
    list.innerHTML = PRICING_SOURCES.map((source) => `
      <li class="source-item">
        <a href="${source.url}" target="_blank" rel="noopener noreferrer" class="source-link" data-i18n="${source.nameKey}"></a>
      </li>
    `).join('');
  }

  const lastCheckedEl = document.getElementById('last-checked-value');
  if (lastCheckedEl) {
    lastCheckedEl.textContent = LAST_CHECKED;
  }
}

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
    // Graceful fallback if localStorage is unavailable
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
    // Graceful fallback if localStorage is unavailable
  }
  return DEFAULT_LANG;
}

document.addEventListener('DOMContentLoaded', () => {
  // Render model cards and pricing sources
  renderModelCards();
  renderPricingSources();

  // Bind language switcher
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
