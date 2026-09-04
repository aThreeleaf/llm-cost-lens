# LLM Cost Lens：AI 协作记录
1. 我使用了 ChatGPT、Antigravity 和 Codex：ChatGPT 负责需求拆解、产品方案讨论、阶段审查和测试思路，Antigravity 负责主要 HTML/CSS/JavaScript 实现与 Bug 修复，Codex 负责独立代码 Review、边界测试和修复后的复审。
2. 我刻意把“实现”和“审查”拆给不同工具，避免同一个 AI 既写代码又证明自己的代码没问题；最终产品决策、范围控制、事实核验、手工验证、Git、部署和验收由我完成。
3. 一次明确的 AI 错误出现在 README：Antigravity 写入了 Grok 4 Fast、Grok 3、Grok 3 Mini 等与项目实际数据不一致的 xAI 模型。
4. 我通过人工对照 script.js 中的 MODEL_PRICING 发现问题，并以代码里的 Source of Truth 为准，修正为 Grok Build 0.1、Grok 4.3、Grok 4.20 Multi-Agent 等项目实际模型。
5. Codex 还发现极端大的有限输入（如 1e308）会让成本计算溢出为 Infinity，导致金额显示和 Lowest cost 判断异常。
6. 修复时我没有随意设置最大输入值，而是在排序和渲染前用 Number.isFinite 检查 costPerRequest、costPerDay、cost30Days；溢出时显示明确提示，随后由 Codex 定向复审并 PASS。
7. 目前仍不完全确定的是未来厂商价格和计费规则是否变化；当前数据只是 2026-09-04 的官方文档核验快照，且未覆盖缓存、Batch、工具调用等附加计费，因此结果只能作为成本估算，不能等同于最终账单。