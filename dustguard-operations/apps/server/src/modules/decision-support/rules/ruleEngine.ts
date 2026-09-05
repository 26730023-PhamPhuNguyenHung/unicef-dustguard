import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RuleDefinition, RuleTraceItem, RuleCondition, NormalizedFact } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface EvaluationContext {
  facts: NormalizedFact[];
  hasCompletedInspection: boolean;
  hasWashFailure: boolean;
  hasMeshFailure: boolean;
  verifiedEvidenceCount: number;
  tamperedEvidenceCount: number;
  claimCount: number;
  hasHumanViolationConfirm: boolean;
  pm25Avg?: number;
  [key: string]: any;
}

export class RuleEngine {
  private static rulesCache: RuleDefinition[] | null = null;
  public static readonly RULE_SET_VERSION = '2026.09.05';

  /**
   * Đọc danh sách quy tắc từ file JSON declarative
   */
  public static getRules(): RuleDefinition[] {
    if (this.rulesCache) {
      return this.rulesCache;
    }
    const filePath = path.join(__dirname, 'ruleDefinitions.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    this.rulesCache = JSON.parse(content) as RuleDefinition[];
    return this.rulesCache;
  }

  /**
   * So khớp 1 điều kiện (hoàn toàn không dùng eval)
   */
  private static evaluateCondition(condition: RuleCondition, context: EvaluationContext): boolean {
    const actual = context[condition.field];
    const expected = condition.value;

    switch (condition.operator) {
      case 'eq':
        return actual === expected;
      case 'neq':
        return actual !== expected;
      case 'gt':
        return typeof actual === 'number' && actual > expected;
      case 'gte':
        return typeof actual === 'number' && actual >= expected;
      case 'lt':
        return typeof actual === 'number' && actual < expected;
      case 'lte':
        return typeof actual === 'number' && actual <= expected;
      case 'in':
        return Array.isArray(expected) && expected.includes(actual);
      case 'contains':
        return typeof actual === 'string' && actual.toLowerCase().includes(String(expected).toLowerCase());
      default:
        return false;
    }
  }

  /**
   * Đánh giá toàn bộ tập quy tắc dựa trên context dữ kiện
   */
  public static evaluateRules(context: EvaluationContext): {
    trace: RuleTraceItem[];
    matchedRules: RuleDefinition[];
  } {
    const rules = this.getRules();
    const trace: RuleTraceItem[] = [];
    const matchedRules: RuleDefinition[] = [];

    for (const rule of rules) {
      const conditionResults = rule.conditions.map(cond => {
        const passed = this.evaluateCondition(cond, context);
        return {
          field: cond.field,
          actualValue: context[cond.field],
          expected: cond.value,
          passed,
        };
      });

      let isMatched = false;
      if (rule.conditionLogic === 'AND') {
        isMatched = conditionResults.every(r => r.passed);
      } else {
        isMatched = conditionResults.some(r => r.passed);
      }

      const explanation = isMatched
        ? `Khớp quy tắc: ${rule.title}. Hành động đề xuất: ${rule.action.recommendedAction || 'Không có'}.`
        : `Không khớp quy tắc "${rule.title}": Các điều kiện (${rule.conditionLogic}) chưa thỏa mãn.`;

      trace.push({
        ruleId: rule.id,
        ruleTitle: rule.title,
        version: rule.version,
        matched: isMatched,
        conditionsEvaluated: conditionResults,
        firedAction: isMatched ? rule.action : undefined,
        explanation,
      });

      if (isMatched) {
        matchedRules.push(rule);
      }
    }

    return { trace, matchedRules };
  }
}
