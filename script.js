/**
 * LLM Cost Lens
 * Phase 4: Comparison Modes (Same Provider vs Cross Provider)
 */

'use strict';

const STORAGE_KEY = 'llm_cost_lens_lang';
const DEFAULT_LANG = 'en';

const LAST_CHECKED = '2026-09-04';

let currentLang = DEFAULT_LANG;
let comparisonMode = 'same'; // 'same' | 'cross'

const MODEL_PRICING = [
  // OpenAI (4 models)
  {
    provider: 'OpenAI',
    model: 'GPT-6 Astra',
    inputPrice: 10,
    outputPrice: 50,
    longContext: {
      threshold: 272000,
      inclusive: false,
      inputPrice: 20,
      outputPrice: 75
    }
  },
  {
    provider: 'OpenAI',
    model: 'GPT-5.6 Sol',
    inputPrice: 4,
    outputPrice: 20,
    longContext: {
      threshold: 272000,
      inclusive: false,
      inputPrice: 8,
      outputPrice: 30
    }
  },
  {
    provider: 'OpenAI',
    model: 'GPT-5.6 Terra',
    inputPrice: 2,
    outputPrice: 12,
    longContext: {
      threshold: 272000,
      inclusive: false,
      inputPrice: 4,
      outputPrice: 18
    }
  },
  {
    provider: 'OpenAI',
    model: 'GPT-5.6 Luna',
    inputPrice: 0.2,
    outputPrice: 1.2,
    longContext: {
      threshold: 272000,
      inclusive: false,
      inputPrice: 0.4,
      outputPrice: 1.8
    }
  },

  // Anthropic (4 models)
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

  // Google (7 models)
  {
    provider: 'Google',
    model: 'Gemini 3.8 Flash',
    inputPrice: 0.75,
    outputPrice: 3.75
  },
  {
    provider: 'Google',
    model: 'Gemini 3.7 Flash',
    inputPrice: 0.75,
    outputPrice: 3.75
  },
  {
    provider: 'Google',
    model: 'Gemini 3.6 Flash',
    inputPrice: 0.75,
    outputPrice: 3.75
  },
  {
    provider: 'Google',
    model: 'Gemini 3.5 Flash',
    inputPrice: 1.5,
    outputPrice: 9
  },
  {
    provider: 'Google',
    model: 'Gemini 3.5 Flash-Lite',
    inputPrice: 0.3,
    outputPrice: 2.5
  },
  {
    provider: 'Google',
    model: 'Gemini 3.1 Flash-Lite',
    inputPrice: 0.25,
    outputPrice: 1.5
  },
  {
    provider: 'Google',
    model: 'Gemini 3.1 Pro Preview',
    inputPrice: 2,
    outputPrice: 12,
    longContext: {
      threshold: 200000,
      inclusive: false,
      inputPrice: 4,
      outputPrice: 18
    }
  },

  // xAI (7 models)
  {
    provider: 'xAI',
    model: 'Grok 4.6',
    inputPrice: 2,
    outputPrice: 6,
    longContext: {
      threshold: 200000,
      inclusive: true,
      inputPrice: 4,
      outputPrice: 12
    }
  },
  {
    provider: 'xAI',
    model: 'Grok Build 0.1',
    inputPrice: 1,
    outputPrice: 2,
    longContext: {
      threshold: 200000,
      inclusive: true,
      inputPrice: 2,
      outputPrice: 4
    }
  },
  {
    provider: 'xAI',
    model: 'Grok 4.5',
    inputPrice: 2,
    outputPrice: 6,
    longContext: {
      threshold: 200000,
      inclusive: true,
      inputPrice: 4,
      outputPrice: 12
    }
  },
  {
    provider: 'xAI',
    model: 'Grok 4.3',
    inputPrice: 1.25,
    outputPrice: 2.5,
    longContext: {
      threshold: 200000,
      inclusive: true,
      inputPrice: 2.5,
      outputPrice: 5
    }
  },
  {
    provider: 'xAI',
    model: 'Grok 4.20 Multi-Agent',
    inputPrice: 1.25,
    outputPrice: 2.5,
    longContext: {
      threshold: 200000,
      inclusive: true,
      inputPrice: 2.5,
      outputPrice: 5
    }
  },
  {
    provider: 'xAI',
    model: 'Grok 4.20 Reasoning',
    inputPrice: 1.25,
    outputPrice: 2.5,
    longContext: {
      threshold: 200000,
      inclusive: true,
      inputPrice: 2.5,
      outputPrice: 5
    }
  },
  {
    provider: 'xAI',
    model: 'Grok 4.20 Non-Reasoning',
    inputPrice: 1.25,
    outputPrice: 2.5,
    longContext: {
      threshold: 200000,
      inclusive: true,
      inputPrice: 2.5,
      outputPrice: 5
    }
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
    'comparisonSettings.title': 'Comparison settings',
    'comparisonSettings.sameProvider': 'Same provider',
    'comparisonSettings.crossProvider': 'Cross provider',
    'comparisonSettings.provider': 'Provider',
    'comparisonSettings.models': 'Models',
    'comparisonSettings.noModels': 'No models selected.',
    'comparison.title': 'Model comparison',
    'card.lowestCost': 'Lowest cost',
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
    'comparisonSettings.title': '对比设置',
    'comparisonSettings.sameProvider': '同品牌对比',
    'comparisonSettings.crossProvider': '跨品牌对比',
    'comparisonSettings.provider': '品牌',
    'comparisonSettings.models': '模型',
    'comparisonSettings.noModels': '尚未选择模型。',
    'comparison.title': '模型成本对比',
    'card.lowestCost': '成本最低',
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
 * Parse input string to safe non-negative finite number
 * @param {string|number} value
 * @returns {number}
 */
function parseNonNegativeNumber(value) {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num) || num < 0) {
    return 0;
  }
  return num;
}

/**
 * Format token price to standard USD string ($X.XX / 1M tokens)
 * @param {number} price
 * @returns {string}
 */
function formatTokenPrice(price) {
  return `$${price.toFixed(2)} / 1M tokens`;
}

/**
 * Format dynamic cost values for per-request and per-day:
 * - cost === 0: $0.00
 * - 0 < cost < 0.01: up to 8 decimals, trimmed trailing zeros, minimum 4 decimals
 * - cost >= 0.01: up to 4 decimals, trimmed trailing zeros, minimum 2 decimals
 * @param {number} cost
 * @returns {string}
 */
function formatDynamicCost(cost) {
  if (cost === 0) {
    return '$0.00';
  }

  if (cost < 0.01) {
    const str = cost.toFixed(8).replace(/0+$/, '');
    const parts = str.split('.');
    const decimals = parts[1] || '';
    if (decimals.length < 4) {
      return `$${parts[0]}.${decimals.padEnd(4, '0')}`;
    }
    return `$${str}`;
  }

  const str = cost.toFixed(4).replace(/0+$/, '');
  const parts = str.split('.');
  const decimals = parts[1] || '';
  if (decimals.length < 2) {
    return `$${parts[0]}.${decimals.padEnd(2, '0')}`;
  }
  return `$${str}`;
}

function formatPerRequest(cost) {
  return formatDynamicCost(cost);
}

function formatPerDay(cost) {
  return formatDynamicCost(cost);
}

/**
 * Format 30-day estimate (strictly 2 decimal places, e.g. $13.20, $600.00)
 * @param {number} cost
 * @returns {string}
 */
function format30Days(cost) {
  return `$${cost.toFixed(2)}`;
}

/**
 * Calculate cost for a single model
 * @param {Object} model
 * @param {number} inputTokens
 * @param {number} outputTokens
 * @param {number} requestsPerDay
 * @returns {Object}
 */
/**
 * Return effective input and output token prices based on input tokens and long-context rules
 * @param {Object} model
 * @param {number} inputTokens
 * @returns {{ inputPrice: number, outputPrice: number }}
 */
function getEffectivePrices(model, inputTokens) {
  if (!model.longContext) {
    return {
      inputPrice: model.inputPrice,
      outputPrice: model.outputPrice
    };
  }

  const { threshold, inclusive, inputPrice, outputPrice } = model.longContext;
  const isLongContext = inclusive ? inputTokens >= threshold : inputTokens > threshold;

  if (isLongContext) {
    return { inputPrice, outputPrice };
  }

  return {
    inputPrice: model.inputPrice,
    outputPrice: model.outputPrice
  };
}

/**
 * Calculate cost for a single model using effective prices
 * @param {Object} model
 * @param {number} inputTokens
 * @param {number} outputTokens
 * @param {number} requestsPerDay
 * @returns {Object}
 */
function calculateModelCost(model, inputTokens, outputTokens, requestsPerDay) {
  const { inputPrice, outputPrice } = getEffectivePrices(model, inputTokens);

  const costPerRequest =
    (inputTokens / 1000000) * inputPrice +
    (outputTokens / 1000000) * outputPrice;

  const costPerDay = costPerRequest * requestsPerDay;
  const cost30Days = costPerDay * 30;

  return {
    ...model,
    effectiveInputPrice: inputPrice,
    effectiveOutputPrice: outputPrice,
    costPerRequest,
    costPerDay,
    cost30Days
  };
}

const ALL_PROVIDERS = [...new Set(MODEL_PRICING.map(item => item.provider))];

let currentSameProvider = 'OpenAI';

// Track selected model names per provider for Same provider mode (initially all models selected)
const sameProviderSelected = {};
ALL_PROVIDERS.forEach(p => {
  sameProviderSelected[p] = new Set(
    MODEL_PRICING.filter(m => m.provider === p).map(m => m.model)
  );
});

// Track selected model names for Cross provider mode (initial default 4 models)
const crossProviderSelected = new Set([
  'GPT-5.6 Terra',
  'Claude Sonnet 5',
  'Gemini 3.8 Flash',
  'Grok 4.6'
]);

/**
 * Return subset of MODEL_PRICING that should participate in comparison
 * @returns {Array}
 */
function getSelectedModels() {
  if (comparisonMode === 'same') {
    const selectedSet = sameProviderSelected[currentSameProvider] || new Set();
    return MODEL_PRICING.filter((item) => item.provider === currentSameProvider && selectedSet.has(item.model));
  }

  // Cross provider mode
  return MODEL_PRICING.filter((item) => crossProviderSelected.has(item.model));
}

/**
 * Render checkboxes for models under the current provider in Same provider mode
 */
function renderSameProviderCheckboxes() {
  const container = document.getElementById('same-provider-models');
  if (!container) return;

  const models = MODEL_PRICING.filter(m => m.provider === currentSameProvider);
  const selectedSet = sameProviderSelected[currentSameProvider] || new Set();

  container.innerHTML = models.map(m => {
    const isChecked = selectedSet.has(m.model) ? 'checked' : '';
    return `
      <label class="model-checkbox-label">
        <input type="checkbox" class="same-model-checkbox" value="${m.model}" ${isChecked}>
        <span class="model-label-text">${m.model}</span>
      </label>
    `;
  }).join('');
}

/**
 * Render grouped checkboxes for all providers in Cross provider mode
 */
function renderCrossProviderGroups() {
  const container = document.getElementById('cross-provider-groups');
  if (!container) return;

  container.innerHTML = ALL_PROVIDERS.map(provider => {
    const models = MODEL_PRICING.filter(m => m.provider === provider);
    const checkboxesHtml = models.map(m => {
      const isChecked = crossProviderSelected.has(m.model) ? 'checked' : '';
      return `
        <label class="model-checkbox-label">
          <input type="checkbox" class="cross-model-checkbox" data-provider="${provider}" value="${m.model}" ${isChecked}>
          <span class="model-label-text">${m.model}</span>
        </label>
      `;
    }).join('');

    return `
      <div class="cross-provider-group">
        <h3 class="provider-group-title">${provider}</h3>
        <div class="model-checkbox-grid">
          ${checkboxesHtml}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Switch comparison mode between 'same' and 'cross'
 * @param {string} mode - 'same' | 'cross'
 */
function setComparisonMode(mode) {
  if (mode !== 'same' && mode !== 'cross') return;
  comparisonMode = mode;

  const sameBtn = document.getElementById('mode-btn-same');
  const crossBtn = document.getElementById('mode-btn-cross');
  const sameControls = document.getElementById('same-provider-controls');
  const crossControls = document.getElementById('cross-provider-controls');

  const isSame = mode === 'same';

  if (sameBtn) {
    sameBtn.classList.toggle('active', isSame);
    sameBtn.setAttribute('aria-pressed', String(isSame));
  }
  if (crossBtn) {
    crossBtn.classList.toggle('active', !isSame);
    crossBtn.setAttribute('aria-pressed', String(!isSame));
  }

  if (sameControls) {
    sameControls.hidden = !isSame;
  }
  if (crossControls) {
    crossControls.hidden = isSame;
  }

  if (isSame) {
    renderSameProviderCheckboxes();
  }

  updateComparison();
}

/**
 * Render dynamic model cards from calculated models list
 * @param {Array} modelsWithCost
 */
function renderModelCards(modelsWithCost) {
  const container = document.getElementById('model-grid');
  if (!container) return;

  if (modelsWithCost.length === 0) {
    container.innerHTML = `
      <div class="empty-state" data-i18n="comparisonSettings.noModels">No models selected.</div>
    `;
    return;
  }

  // Identify minimum 30-day cost
  const minCost = Math.min(...modelsWithCost.map(m => m.cost30Days));

  container.innerHTML = modelsWithCost.map((item) => {
    const isLowest = Math.abs(item.cost30Days - minCost) < 1e-10;
    const lowestBadgeHtml = isLowest
      ? `<span class="badge badge-lowest" data-i18n="card.lowestCost">Lowest cost</span>`
      : '';

    return `
      <article class="model-card">
        <div class="card-header">
          <div class="model-info">
            <span class="provider-name">${item.provider}</span>
            <h3 class="model-name">${item.model}</h3>
          </div>
          ${lowestBadgeHtml}
        </div>

        <div class="card-metrics">
          <div class="metric-row">
            <span class="metric-label" data-i18n="card.inputPrice">Input price</span>
            <span class="metric-value">${formatTokenPrice(item.effectiveInputPrice ?? item.inputPrice)}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label" data-i18n="card.outputPrice">Output price</span>
            <span class="metric-value">${formatTokenPrice(item.effectiveOutputPrice ?? item.outputPrice)}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label" data-i18n="card.perRequest">Per request</span>
            <span class="metric-value">${formatPerRequest(item.costPerRequest)}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label" data-i18n="card.perDay">Per day</span>
            <span class="metric-value">${formatPerDay(item.costPerDay)}</span>
          </div>
        </div>

        <div class="card-footer">
          <span class="estimate-label" data-i18n="card.estimate30Day">30-day estimate</span>
          <span class="estimate-value">${format30Days(item.cost30Days)}</span>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Main update routine: read inputs, calculate costs, sort, and render
 */
function updateComparison() {
  const inputTokensVal = document.getElementById('input-tokens')?.value;
  const outputTokensVal = document.getElementById('output-tokens')?.value;
  const requestsPerDayVal = document.getElementById('requests-per-day')?.value;

  const inputTokens = parseNonNegativeNumber(inputTokensVal);
  const outputTokens = parseNonNegativeNumber(outputTokensVal);
  const requestsPerDay = parseNonNegativeNumber(requestsPerDayVal);

  const selectedModels = getSelectedModels();

  // Calculate costs without mutating original MODEL_PRICING array
  const calculated = selectedModels.map((model) =>
    calculateModelCost(model, inputTokens, outputTokens, requestsPerDay)
  );

  // Sort ascending by 30-day estimate
  calculated.sort((a, b) => a.cost30Days - b.cost30Days);

  // Render cards or empty state
  renderModelCards(calculated);

  // Ensure current language translations are correctly applied to the newly rendered cards
  applyTranslations(currentLang);
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
  currentLang = translations[lang] ? lang : DEFAULT_LANG;
  try {
    localStorage.setItem(STORAGE_KEY, currentLang);
  } catch (err) {
    // Graceful fallback if localStorage is unavailable
  }
  applyTranslations(currentLang);
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
  // Render static sources first
  renderPricingSources();

  // Bind input listeners for real-time calculation
  ['input-tokens', 'output-tokens', 'requests-per-day'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateComparison);
    }
  });

  // Bind comparison mode switcher
  const modeGroup = document.querySelector('.mode-switch-group');
  if (modeGroup) {
    modeGroup.addEventListener('click', (event) => {
      const btn = event.target.closest('.mode-btn');
      if (btn) {
        const mode = btn.getAttribute('data-mode');
        if (mode && mode !== comparisonMode) {
          setComparisonMode(mode);
        }
      }
    });
  }

  // Populate Same provider select options dynamically
  const sameProviderSelect = document.getElementById('same-provider-select');
  if (sameProviderSelect) {
    sameProviderSelect.innerHTML = ALL_PROVIDERS.map(p => `<option value="${p}">${p}</option>`).join('');
    sameProviderSelect.value = currentSameProvider;
    sameProviderSelect.addEventListener('change', (event) => {
      currentSameProvider = event.target.value;
      renderSameProviderCheckboxes();
      updateComparison();
    });
  }

  // Initial render of model checkboxes
  renderSameProviderCheckboxes();
  renderCrossProviderGroups();

  // Bind Same provider model checkboxes change event delegation
  const sameModelsContainer = document.getElementById('same-provider-models');
  if (sameModelsContainer) {
    sameModelsContainer.addEventListener('change', (event) => {
      const cb = event.target.closest('.same-model-checkbox');
      if (cb) {
        const modelName = cb.value;
        if (!sameProviderSelected[currentSameProvider]) {
          sameProviderSelected[currentSameProvider] = new Set();
        }
        if (cb.checked) {
          sameProviderSelected[currentSameProvider].add(modelName);
        } else {
          sameProviderSelected[currentSameProvider].delete(modelName);
        }
        updateComparison();
      }
    });
  }

  // Bind Cross provider model checkboxes change event delegation
  const crossGroupsContainer = document.getElementById('cross-provider-groups');
  if (crossGroupsContainer) {
    crossGroupsContainer.addEventListener('change', (event) => {
      const cb = event.target.closest('.cross-model-checkbox');
      if (cb) {
        const modelName = cb.value;
        if (cb.checked) {
          crossProviderSelected.add(modelName);
        } else {
          crossProviderSelected.delete(modelName);
        }
        updateComparison();
      }
    });
  }

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

  // Set initial language preference
  currentLang = getInitialLanguage();

  // Run initial calculation and render
  updateComparison();
});
