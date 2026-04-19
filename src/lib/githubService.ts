import { Repository } from './hospitalTypes'
import { Octokit } from 'octokit'

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
  private octokit: Octokit | null = null

  private async getOctokit(): Promise<Octokit | null> {
    if (this.octokit) {
      return this.octokit
    }

    try {
      const user = await (window as any).spark.user()
      if (!user || !user.login) {
        return null
      }

      this.octokit = new Octokit()
      return this.octokit
    } catch (error) {
      console.error('Failed to initialize Octokit:', error)
      return null
    }
  }

  async getCurrentUser(): Promise<GitHubUser | null> {
    try {
      const user = await (window as any).spark.user()
      if (!user || !user.login) {
        return null
      }

      const octokit = await this.getOctokit()
      if (!octokit) {
        return null
      }

      const { data } = await octokit.rest.users.getByUsername({
        username: user.login,
      })

      return {
        id: data.id,
        login: data.login,
        name: data.name || data.login,
        avatar_url: data.avatar_url,
        public_repos: data.public_repos,
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

      const octokit = await this.getOctokit()
      if (!octokit) {
        return []
      }

      const { data } = await octokit.rest.repos.listForUser({
        username: user.login,
        sort: 'updated',
        per_page: 100,
      })

      return data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
        },
        description: repo.description,
        private: repo.private,
        html_url: repo.html_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        size: repo.size,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        language: repo.language,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        default_branch: repo.default_branch,
      }))
    } catch (error) {
      console.error('Failed to get user repositories:', error)
      return []
    }
  }

  async getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepoDetails> {
    try {
      const octokit = await this.getOctokit()
      if (!octokit) {
        return {
          open_prs: 0,
          contributors: 1,
          recent_commits: 0,
          open_issues: 0,
          last_commit_date: new Date().toISOString(),
        }
      }

      const [prsResponse, contributorsResponse, commitsResponse] = await Promise.allSettled([
        octokit.rest.pulls.list({
          owner,
          repo,
          state: 'open',
          per_page: 100,
        }),
        octokit.rest.repos.listContributors({
          owner,
          repo,
          per_page: 100,
        }),
        octokit.rest.repos.listCommits({
          owner,
          repo,
          per_page: 30,
          since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      ])

      const open_prs = prsResponse.status === 'fulfilled' ? prsResponse.value.data.length : 0
      const contributors = contributorsResponse.status === 'fulfilled' ? contributorsResponse.value.data.length : 1
      const recent_commits = commitsResponse.status === 'fulfilled' ? commitsResponse.value.data.length : 0
      const last_commit_date = 
        commitsResponse.status === 'fulfilled' && commitsResponse.value.data[0]
          ? commitsResponse.value.data[0].commit.author?.date || new Date().toISOString()
          : new Date().toISOString()

      const repoResponse = await octokit.rest.repos.get({ owner, repo })
      const open_issues = repoResponse.data.open_issues_count - open_prs

      return {
        open_prs,
        contributors,
        recent_commits,
        open_issues,
        last_commit_date,
      }
    } catch (error) {
      console.error(`Failed to get repository details for ${owner}/${repo}:`, error)
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
