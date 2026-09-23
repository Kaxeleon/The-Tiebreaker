import { DecisionAnalysis } from '../types/decision';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export function getSavedDecisions(): DecisionAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved decisions:', err);
    return [];
  }
}

export function saveDecisionToStorage(decision: DecisionAnalysis): void {
  try {
    const existing = getSavedDecisions();
    const filtered = existing.filter((d) => d.id !== decision.id);
    const updated = [decision, ...filtered].slice(0, 30); // keep up to 30 decisions
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save decision:', err);
  }
}

export function deleteDecisionFromStorage(id: string): DecisionAnalysis[] {
  try {
    const existing = getSavedDecisions();
    const updated = existing.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete decision:', err);
    return [];
  }
}

export function exportDecisionAsMarkdown(decision: DecisionAnalysis): string {
  let md = `# ${decision.decisionTitle}\n\n`;
  md += `**Date:** ${new Date(decision.timestamp).toLocaleDateString()} | **Urgency:** ${decision.urgency} | **Risk Tolerance:** ${decision.riskTolerance}\n\n`;
  
  if (decision.description) {
    md += `### Context\n${decision.description}\n\n`;
  }

  md += `### Executive Framing\n${decision.executiveSummary}\n\n`;
  md += `**Core Tradeoff:** ${decision.primaryDilemmaCore}\n\n`;

  md += `## 🏆 The Tiebreaker Verdict\n`;
  md += `**Recommended Option:** ${decision.verdict.recommendedOption} (${decision.verdict.confidenceScore}% Confidence)\n\n`;
  md += `> **The Tiebreaker Principle:** "${decision.verdict.tiebreakerInsight}"\n\n`;

  md += `### When to Choose Each Option\n`;
  decision.verdict.whenToChooseEachOption.forEach((item) => {
    md += `- **${item.optionName}:**\n`;
    item.conditions.forEach((c) => (md += `  - ${c}\n`));
  });

  md += `\n### Red Line Dealbreakers\n`;
  decision.verdict.redLines.forEach((r) => (md += `- ⚠️ ${r}\n`));

  md += `\n### Immediate Next Step (48h Action)\n${decision.verdict.immediateNextStep}\n\n`;
  md += `### Thought Experiment\n${decision.verdict.thoughtExperiment}\n\n`;

  md += `## ⚖️ Pros & Cons Analysis\n\n`;
  decision.options.forEach((opt) => {
    md += `### ${opt.name}\n${opt.summary}\n\n`;
    md += `#### Pros:\n`;
    opt.pros.forEach((p) => {
      md += `- **[+${p.weight}/5] ${p.text}** (${p.category}): ${p.detail}\n`;
    });
    md += `\n#### Cons:\n`;
    opt.cons.forEach((c) => {
      md += `- **[-${c.weight}/5] ${c.text}** (${c.category}): ${c.detail}\n`;
      md += `  - *Mitigation Plan:* ${c.mitigation}\n`;
    });
    md += `\n`;
  });

  md += `## 📊 Multi-Criteria Comparison Matrix\n\n`;
  md += `| Criteria | Importance | ` + decision.options.map((o) => o.name).join(' | ') + ` |\n`;
  md += `| --- | --- | ` + decision.options.map(() => '---').join(' | ') + ` |\n`;
  decision.comparisonTable.criteria.forEach((crit) => {
    const scores = decision.options.map((opt) => {
      const match = crit.optionScores.find((s) => s.optionName === opt.name);
      return match ? `${match.score}/10` : 'N/A';
    });
    md += `| ${crit.name} | Weight ${crit.importanceWeight}/5 | ${scores.join(' | ')} |\n`;
  });
  md += `\n`;

  md += `## 🧭 SWOT Analysis\n\n`;
  decision.swotAnalysis.forEach((swot) => {
    md += `### SWOT: ${swot.optionName}\n\n`;
    md += `**Strengths:**\n`;
    swot.strengths.forEach((s) => (md += `- **${s.title}** (${s.impact}): ${s.explanation}\n`));
    md += `\n**Weaknesses:**\n`;
    swot.weaknesses.forEach((w) => (md += `- **${w.title}** (${w.impact}): ${w.explanation}\n`));
    md += `\n**Opportunities:**\n`;
    swot.opportunities.forEach((o) => (md += `- **${o.title}** (${o.impact}): ${o.explanation}\n`));
    md += `\n**Threats:**\n`;
    swot.threats.forEach((t) => (md += `- **${t.title}** (${t.impact}): ${t.explanation} (Mitigation: ${t.mitigationPlan})\n`));
    md += `\n`;
  });

  return md;
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
