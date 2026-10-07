import React from "react";
import { fetchGitHubRepos } from "@/lib/github";
import { GitHubReposScroll } from "@/components/sections/GitHubReposScroll";

export async function GitHubReposSection() {
  const repos = await fetchGitHubRepos();

  if (repos.length === 0) {
    return null;
  }

  return <GitHubReposScroll initialRepos={repos} />;
}

export default GitHubReposSection;
