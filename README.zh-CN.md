# LLM Cost Lens

[English](README.md) | 简体中文

一个用于比较主流 AI Provider 下不同 LLM API 预计使用成本的轻量浏览器端工具。

---

## 在线体验

[在线体验 LLM Cost Lens](https://llm-cost-lens.netlify.app/)

---

## 项目截图

![LLM Cost Lens](docs/screenshot.png)

---

## 核心功能

- 实时 API 成本估算
- 同品牌模型对比（Same-provider）
- 跨品牌多模型对比（Cross-provider）
- 模型多选过滤
- 成本最低模型自动高亮标注
- 动态 30 天预估成本排序
- 英文 / 中文双语界面
- 适配桌面端与移动端的响应式布局
- 官方定价来源直达链接
- 支持基于阈值的长上下文阶梯定价模型
- 针对非法或极端超大数值输入的数学安全处理

---

## 对比模式

- **同品牌对比（Same provider）**：在下拉菜单中选择一个 Provider，然后可从该 Provider 下任意多选多个模型进行横向成本比较。
- **跨品牌对比（Cross provider）**：可同时从多个 Provider 中自由勾选多个模型进行统一对比。跨品牌对比不限制每个 Provider 只能选择一个模型，用户可在任意品牌下勾选任意数量的模型。

---

## 支持的品牌与模型

收录 **4 大 Provider** 共 **22 款模型**：

- **OpenAI (4)**: GPT-6 Astra, GPT-5.6 Sol, GPT-5.6 Terra, GPT-5.6 Luna
- **Anthropic (4)**: Claude Fable 5.1, Claude Opus 5, Claude Sonnet 5, Claude Haiku 4.5
- **Google (7)**: Gemini 3.8 Flash, Gemini 3.7 Flash, Gemini 3.6 Flash, Gemini 3.5 Flash, Gemini 3.5 Flash-Lite, Gemini 3.1 Flash-Lite, Gemini 3.1 Pro Preview
- **xAI (7)**: Grok 4.6, Grok Build 0.1, Grok 4.5, Grok 4.3, Grok 4.20 Multi-Agent, Grok 4.20 Reasoning, Grok 4.20 Non-Reasoning

---

## 成本计算方式

单价基准均为每百万（1M）Token 美元价格（USD per 1M tokens）。具体计算方式如下：

- **单次请求成本（Per-request cost）**：
  $$\text{Cost} = \left(\frac{\text{Input Tokens}}{1{,}000{,}000} \times \text{Input Price}\right) + \left(\frac{\text{Output Tokens}}{1{,}000{,}000} \times \text{Output Price}\right)$$

- **每日成本（Daily cost）**：
  $$\text{Daily Cost} = \text{Per-request Cost} \times \text{Requests per Day}$$

- **30 天预估成本（30-day estimate）**：
  $$\text{30-day Estimate} = \text{Daily Cost} \times 30$$

---

## 定价数据

所有模型价格数据均经官方文档人工核验。

- **最近核验日期**：2026-09-04
- **官方来源**：
  - [OpenAI Pricing](https://developers.openai.com/api/docs/models/compare)
  - [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  - [Google Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing)
  - [xAI Pricing](https://docs.x.ai/developers/pricing)

*说明：价格数据为核验时的快照，厂商未来可能会对定价进行调整。*

---

## 长上下文定价

对于当前 `MODEL_PRICING` 中存在基于阈值（threshold-based）长上下文定价规则的模型，计算器会根据每次请求输入的 Token 数（Input tokens / request）自动切换至对应费率。

---

## 已知限制

- 仅限标准文本 Token 定价
- 不包含 Prompt 缓存优惠价格
- 不包含 Batch API 折扣
- 不包含工具调用及其他特定 API 附加费用
- 各模型及供应商的实际 Token 计费可能存在差异

*本计算器仅用于成本估算，不作为账单对账依据。*

---

## 技术栈

- HTML5
- CSS3
- Vanilla JavaScript
- Netlify（静态托管）

无框架、无后端、无 npm 依赖。本项目特意采用极简纯静态技术栈，因核心需求聚焦于浏览器端的前端计算与对比。

---

## 本地运行

克隆代码仓库并通过本地静态服务器运行：

```bash
git clone https://github.com/aThreeleaf/llm-cost-lens.git
cd llm-cost-lens
python -m http.server 8000
```

在浏览器中访问：`http://localhost:8000`

由于本项目为纯静态页面，也可以直接在浏览器中打开 `index.html`。

---

## AI 协作开发

本项目采用 AI 辅助研发工作流构建。AI 工具参与了方案探讨、编码实现、代码审查与迭代，而产品决策、范围控制、质量校验与最终验收始终由人类开发者主导：

- 产品范围定义与迭代审查：ChatGPT
- 核心代码实现：Antigravity
- 独立代码审查与 QA：Codex
- 最终技术决策、需求变更、手工验证与 Git 提交：人类开发者

[查看完整 AI 协作开发记录](docs/ai-collaboration.md)

---

## 项目状态

MVP complete.

已完成交付项：
- 核心计算器
- 同品牌模型对比
- 跨品牌多模型对比
- 响应式 UI 布局
- 英文 / 中文双语界面
- Netlify 公网部署
- 独立 Codex QA 审计
- 计算溢出修复并通过针对性复审 PASS
