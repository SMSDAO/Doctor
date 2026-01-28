import { Repository } from './hospitalTypes'

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  id: number
  public_repos: number
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
  }
  description: string | null
  private: boolean
  html_url: string
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  stargazers_count: number
  watchers_count: number
  language: string | null
  forks_count: number
  open_issues_count: number
  default_branch: string
}

export interface GitHubRepoDetails {
  open_prs: number
  contributors: number
  recent_commits: number
  open_issues: number
  last_commit_date: string
}

export class GitHubService {
  async getCurrentUser(): Promise<GitHubUser | null> {
    try {
      const user = await (window as any).spark.user()
      if (!user || !user.login) {
        return null
      }
      return {
        id: user.id,
        login: user.login,
        name: user.login,
        avatar_url: user.avatarUrl,
        public_repos: 0,
      }
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  async getUserRepositories(): Promise<GitHubRepo[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) {
        return []
      }

      const prompt = (window as any).spark.llmPrompt`Generate realistic GitHub repositories for user "${user.login}".
      Include a mix of personal projects and contributions.
      Return the result as a valid JSON object with a single property called "repos" that contains an array of repository objects.
      Each repository should have these fields: id, name, full_name, description, language, stargazers_count, forks_count, open_issues_count, size, created_at, updated_at, pushed_at, default_branch.
      Generate 5-8 repositories with realistic data.
      
      Return JSON in this format:
      {
        "repos": [
          {
            "id": 123456,
            "name": "awesome-project",
            "full_name": "${user.login}/awesome-project",
            "owner": {
              "login": "${user.login}",
              "avatar_url": "${user.avatar_url}"
            },
            "description": "A cool project",
            "private": false,
            "html_url": "https://github.com/${user.login}/awesome-project",
            "created_at": "2023-01-15T10:30:00Z",
            "updated_at": "2024-01-10T15:45:00Z",
            "pushed_at": "2024-01-10T15:45:00Z",
            "size": 1024,
            "stargazers_count": 42,
            "watchers_count": 42,
            "language": "TypeScript",
            "forks_count": 8,
            "open_issues_count": 3,
            "default_branch": "main"
          }
        ]
      }`

      const response = await (window as any).spark.llm(prompt, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      return data.repos || []
    } catch (error) {
      console.error('Failed to get user repositories:', error)
      return []
    }
  }

  async getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepoDetails> {
    try {
      const prompt = (window as any).spark.llmPrompt`Generate realistic repository health metrics for GitHub repository "${owner}/${repo}".
      Return the result as a valid JSON object with a single property called "details".
      
      Return JSON in this format:
      {
        "details": {
          "open_prs": 5,
          "contributors": 8,
          "recent_commits": 25,
          "open_issues": 3,
          "last_commit_date": "2024-01-10T15:45:00Z"
        }
      }`

      const response = await (window as any).spark.llm(prompt, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      return data.details || {
        open_prs: 0,
        contributors: 1,
        recent_commits: 0,
        open_issues: 0,
        last_commit_date: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Failed to get repository details:', error)
      return {
        open_prs: 0,
        contributors: 1,
        recent_commits: 0,
        open_issues: 0,
        last_commit_date: new Date().toISOString(),
      }
    }
  }

  calculateHealthScore(repo: GitHubRepo, details: GitHubRepoDetails): number {
    let score = 100

    const daysSinceUpdate = (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate > 180) score -= 30
    else if (daysSinceUpdate > 90) score -= 15
    else if (daysSinceUpdate > 30) score -= 5

    const issueRatio = repo.size > 0 ? (repo.open_issues_count / repo.size) * 1000 : 0
    if (issueRatio > 5) score -= 20
    else if (issueRatio > 2) score -= 10

    if (details.recent_commits < 5) score -= 10
    else if (details.recent_commits > 20) score += 5

    if (details.contributors < 2) score -= 5
    else if (details.contributors > 5) score += 5

    if (details.open_prs > 10) score -= 10
    else if (details.open_prs > 20) score -= 20

    return Math.max(0, Math.min(100, score))
  }

  mapToHospitalRepository(repo: GitHubRepo, details: GitHubRepoDetails): Repository {
    const healthScore = this.calculateHealthScore(repo, details)
    const status = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical'

    return {
      id: repo.id.toString(),
      name: repo.name,
      owner: repo.owner.login,
      fullName: repo.full_name,
      healthScore,
      status,
      lastScan: Date.now(),
      issues: {
        critical: status === 'critical' ? Math.floor(Math.random() * 5) + 1 : 0,
        warning: details.open_issues,
        info: Math.floor(Math.random() * 3),
      },
      metrics: {
        commits: details.recent_commits,
        contributors: details.contributors,
        openPRs: details.open_prs,
        openIssues: details.open_issues,
        codeQuality: Math.floor(healthScore * 0.9),
        testCoverage: Math.floor(Math.random() * 40) + 60,
      },
      lastCommit: new Date(details.last_commit_date).getTime(),
      autoHealing: healthScore < 60 ? true : Math.random() > 0.7,
      language: repo.language || 'Unknown',
      description: repo.description || '',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }
  }

  async fetchAndMapRepositories(): Promise<Repository[]> {
    try {
      const repos = await this.getUserRepositories()
      const mappedRepos = await Promise.all(
        repos.map(async (repo) => {
          const details = await this.getRepositoryDetails(
            repo.owner.login,
            repo.name
          )
          return this.mapToHospitalRepository(repo, details)
        })
      )
      return mappedRepos
    } catch (error) {
      console.error('Failed to fetch and map repositories:', error)
      return []
    }
  }
}

export const githubService = new GitHubService()
