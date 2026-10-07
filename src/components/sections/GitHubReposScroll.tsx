"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GitHubRepo } from "@/lib/github";
import { GithubIcon } from "@/components/ui/Icons";
import {
  Star,
  GitFork,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  FolderGit2,
  Sparkles,
  Layers,
  LayoutGrid,
  Columns,
  Loader2,
} from "lucide-react";

interface GitHubReposScrollProps {
  initialRepos: GitHubRepo[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Rust: "#dea584",
  "C++": "#f34b7d",
  Shell: "#89e051",
  Dart: "#00B4AB",
};

export function GitHubReposScroll({ initialRepos }: GitHubReposScrollProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>(initialRepos);
  const [viewMode, setViewMode] = useState<"scroll" | "grid">("scroll");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialRepos.length >= 6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract unique languages
  const languages = [
    "ALL",
    ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean) as string[])),
  ];

  const filteredRepos = repos.filter((repo) => {
    if (selectedLanguage === "ALL") return true;
    return repo.language === selectedLanguage;
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const loadMoreRepos = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/github/repos?page=${nextPage}&limit=6`);
      const data = await res.json();

      if (data.repos && Array.isArray(data.repos)) {
        // Append unique repos
        setRepos((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const newUnique = data.repos.filter((r: GitHubRepo) => !existingIds.has(r.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to load more repos:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-24 border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-950/40 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-neutral-300/20 dark:bg-neutral-800/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live GitHub Repositories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Open Source Codebases
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
              Real-time engineering repositories, autonomous agent pipelines, APIs, and experiments synced securely via server proxy.
            </p>
          </div>

          {/* Controls: View toggle & Scroll navigation */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-800 p-1 bg-white dark:bg-neutral-900 text-xs shadow-sm">
              <button
                onClick={() => setViewMode("scroll")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "scroll"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }`}
                title="Horizontal Carousel View"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }`}
                title="Grid Catalog View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll buttons (Active in scroll view mode) */}
            {viewMode === "scroll" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scroll("left")}
                  className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        {languages.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-8">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedLanguage === lang
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                    : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* Repository Items Presentation */}
        {filteredRepos.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950">
            <FolderGit2 className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No repositories matching selected filter.</p>
          </div>
        ) : viewMode === "scroll" ? (
          /* Horizontal Parallax / Snap Scroll */
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar [mask-image:linear-gradient(to_right,black_85%,transparent)]"
            style={{ scrollbarWidth: "none" }}
          >
            {filteredRepos.map((repo, idx) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="w-[320px] sm:w-[360px] shrink-0 snap-start flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
              >
                <div>
                  {/* Top Bar: Language & External link */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {repo.language ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: LANGUAGE_COLORS[repo.language] || "#71717a",
                          }}
                        />
                        <span>{repo.language}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-neutral-400">Codebase</span>
                    )}

                    <div className="flex items-center gap-2">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-1"
                        aria-label="View on GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white mb-2 font-mono group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center justify-between"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
                    </a>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6 font-normal min-h-[48px]">
                    {repo.description || "Open source software project and technical architecture."}
                  </p>
                </div>

                <div>
                  {/* Topics badges */}
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border border-neutral-200/50 dark:border-neutral-800/50"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Meta: Stars, Forks, Updated Date */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{repo.stars}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{repo.forks}</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400">
                      {formatDate(repo.updatedAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Grid View Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo, idx) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {repo.language ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: LANGUAGE_COLORS[repo.language] || "#71717a",
                          }}
                        />
                        <span>{repo.language}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-neutral-400">Codebase</span>
                    )}

                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-1"
                      aria-label="View on GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white mb-2 font-mono">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center justify-between"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
                    </a>
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6 font-normal">
                    {repo.description || "Open source software project and technical architecture."}
                  </p>
                </div>

                <div>
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border border-neutral-200/50 dark:border-neutral-800/50"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{repo.stars}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{repo.forks}</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400">
                      {formatDate(repo.updatedAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMoreRepos}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-mono hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading additional repositories...</span>
                </>
              ) : (
                <>
                  <FolderGit2 className="w-4 h-4 text-neutral-400" />
                  <span>Load More Repositories ({repos.length} loaded)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default GitHubReposScroll;
