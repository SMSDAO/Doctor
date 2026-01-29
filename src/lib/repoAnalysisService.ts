import { Repository, AdmonitionScan, AdmonitionItem, PRSuggestion } from './hospitalTypes'

export class RepoAnalysisService {
  async scanAdmonitions(repo: Repository): Promise<AdmonitionScan> {
    try {
      const prompt = `Generate realistic code admonition/comment markers found in a ${repo.language} repository named "${repo.fullName}".

Consider the repository's health score (${repo.healthScore}) and status (${repo.status}).
Lower health scores should have more FIXME and HACK items. Healthier repos have more TODO and NOTE items.

Generate 8-15 realistic admonition items with these types: TODO, FIXME, HACK, WARNING, NOTE, OPTIMIZE

Return the result as a valid JSON object with a single property called "items" containing an array.

Each item should have:
- type: one of TODO, FIXME, HACK, WARNING, NOTE, OPTIMIZE
- message: realistic comment message relevant to ${repo.language} development
- file: realistic file path for ${repo.language} (e.g., src/components/UserCard.tsx for TypeScript)
- line: random line number between 10-500
- author: random developer name (optional, 60% of items)

Example format:
{
  "items": [
    {
      "type": "TODO",
      "message": "Add input validation for email field",
      "file": "src/utils/validation.ts",
      "line": 45,
      "author": "alice"
    },
    {
      "type": "FIXME",
      "message": "Memory leak when unmounting component",
      "file": "src/components/Dashboard.tsx",
      "line": 127
    }
  ]
}`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      const items: AdmonitionItem[] = data.items || []

      const byType = {
        TODO: items.filter(i => i.type === 'TODO').length,
        FIXME: items.filter(i => i.type === 'FIXME').length,
        HACK: items.filter(i => i.type === 'HACK').length,
        WARNING: items.filter(i => i.type === 'WARNING').length,
        NOTE: items.filter(i => i.type === 'NOTE').length,
        OPTIMIZE: items.filter(i => i.type === 'OPTIMIZE').length,
      }

      return {
        timestamp: Date.now(),
        totalCount: items.length,
        byType,
        items: items.sort((a, b) => {
          const priority = { FIXME: 0, HACK: 1, WARNING: 2, OPTIMIZE: 3, TODO: 4, NOTE: 5 }
          return priority[a.type] - priority[b.type]
        })
      }
    } catch (error) {
      console.error('Failed to scan admonitions:', error)
      return {
        timestamp: Date.now(),
        totalCount: 0,
        byType: { TODO: 0, FIXME: 0, HACK: 0, WARNING: 0, NOTE: 0, OPTIMIZE: 0 },
        items: []
      }
    }
  }

  async generatePRSuggestions(repo: Repository): Promise<PRSuggestion[]> {
    try {
      const prompt = `Generate realistic Pull Request suggestions for improving a ${repo.language} repository named "${repo.fullName}".

Repository context:
- Health Score: ${repo.healthScore}/100
- Status: ${repo.status}
- Open Issues: ${repo.metrics?.openIssues || 0}
- Open PRs: ${repo.metrics?.openPRs || 0}
- Test Coverage: ${repo.metrics?.testCoverage || 0}%
- Code Quality: ${repo.metrics?.codeQuality || 0}/100
- Language: ${repo.language}

Generate 4-7 actionable PR suggestions that would improve the repository. Consider:
- If health score is low, suggest critical fixes
- If test coverage is low, suggest testing improvements
- If code quality is low, suggest refactoring
- Include documentation, performance, and feature suggestions

Return the result as a valid JSON object with a single property called "suggestions" containing an array.

Each suggestion should have:
- title: concise PR title (40-60 chars)
- description: detailed description of the change (2-3 sentences)
- priority: "high", "medium", or "low"
- category: one of "bug-fix", "feature", "refactor", "documentation", "testing", "performance"
- effort: "small" (< 2 hours), "medium" (2-8 hours), or "large" (> 8 hours)
- impact: "high", "medium", or "low"
- files: array of 1-4 realistic file paths that would be changed

Example format:
{
  "suggestions": [
    {
      "title": "Add unit tests for authentication module",
      "description": "Currently the auth module has 0% test coverage. This PR adds comprehensive unit tests covering login, logout, and token refresh flows. Improves overall test coverage by 15%.",
      "priority": "high",
      "category": "testing",
      "effort": "medium",
      "impact": "high",
      "files": ["src/auth/auth.service.ts", "tests/auth/auth.service.test.ts"]
    }
  ]
}`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      const suggestions = data.suggestions || []

      return suggestions.map((s: any, index: number) => ({
        id: `pr-${repo.id}-${Date.now()}-${index}`,
        title: s.title,
        description: s.description,
        priority: s.priority,
        category: s.category,
        effort: s.effort,
        impact: s.impact,
        files: s.files || [],
        createdAt: Date.now()
      }))
    } catch (error) {
      console.error('Failed to generate PR suggestions:', error)
      return []
    }
  }

  async analyzeRepository(repo: Repository): Promise<{ admonitions: AdmonitionScan; prSuggestions: PRSuggestion[] }> {
    const [admonitions, prSuggestions] = await Promise.all([
      this.scanAdmonitions(repo),
      this.generatePRSuggestions(repo)
    ])

    return { admonitions, prSuggestions }
  }
}

export const repoAnalysisService = new RepoAnalysisService()
