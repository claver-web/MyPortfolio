import { prisma } from "@/lib/prisma";

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  homepage: string | null;
  isFork: boolean;
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    // Read the secret/private GitHub API endpoint configured in Admin SiteSetting
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "githubReposUrl" },
    });

    const endpoint =
      setting?.value?.trim() || "https://api.github.com/users/claver-web/repos";

    const headers: Record<string, string> = {
      "User-Agent": "Portfolio-App/1.0",
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const parsedUrl = new URL(endpoint);
    if (!parsedUrl.searchParams.has("per_page")) {
      parsedUrl.searchParams.set("per_page", "100");
    }
    if (!parsedUrl.searchParams.has("sort")) {
      parsedUrl.searchParams.set("sort", "updated");
    }

    const res = await fetch(parsedUrl.toString(), {
      headers,
      next: { revalidate: 3600 }, // Server-side ISR cache for 1 hour
    });

    if (!res.ok) {
      console.error(`GitHub API response error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || null,
      htmlUrl: repo.html_url,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      language: repo.language || null,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      updatedAt: repo.updated_at,
      homepage: repo.homepage || null,
      isFork: Boolean(repo.fork),
    }));
  } catch (error) {
    console.error("Failed to fetch GitHub repos securely:", error);
    return [];
  }
}
