import { PrismaClient, ProjectCategory, ProjectStatus, SkillCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "kartik1999";
  const adminRawPassword = process.env.ADMIN_PASSWORD || "@kartik321";
  const hashedPassword = await bcrypt.hash(adminRawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "kartik1999",
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: "kartik1999",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log(`👤 Admin user seeded: ${admin.email}`);

  // 2. Default Profile Links
  const defaultLinks = [
    {
      key: "github",
      label: "GitHub (Personal)",
      url: "https://github.com",
      icon: "Github",
      order: 1,
    },
    {
      key: "githubWork",
      label: "GitHub (Work)",
      url: "https://github.com",
      icon: "GitBranch",
      order: 2,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com",
      icon: "Linkedin",
      order: 3,
    },
    {
      key: "leetcode",
      label: "LeetCode",
      url: "https://leetcode.com",
      icon: "Code2",
      order: 4,
    },
    {
      key: "resume",
      label: "Resume",
      url: "/resume.pdf",
      icon: "FileText",
      order: 5,
    },
  ];

  for (const link of defaultLinks) {
    await prisma.profileLink.upsert({
      where: { key: link.key },
      update: {
        label: link.label,
        url: link.url,
        icon: link.icon,
        order: link.order,
      },
      create: link,
    });
  }
  console.log(`🔗 Seeded ${defaultLinks.length} profile links`);

  // 3. Site Settings
  const settings = [
    { key: "heroTitle", value: "Crafting High-Impact Intelligent Systems" },
    { key: "tagline", value: "Full Stack Engineer & AI Specialist passionate about autonomous agents and modern web architectures." },
    { key: "bio", value: "I design and engineer end-to-end full-stack applications and autonomous agentic AI workflows. Dedicated to clean code, robust performance, and minimalist monochrome UI." },
    { key: "resumeUrl", value: "/resume.pdf" },
    { key: "email", value: "contact@portfolio.local" },
    { key: "location", value: "San Francisco, CA / Remote" },
    { key: "githubReposUrl", value: "https://api.github.com/users/claver-web/repos" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`⚙️ Seeded ${settings.length} site settings`);

  // 4. Sample Skills
  const sampleSkills = [
    { name: "TypeScript", category: SkillCategory.LANGUAGE, proficiency: 95, order: 1 },
    { name: "Python", category: SkillCategory.LANGUAGE, proficiency: 90, order: 2 },
    { name: "Next.js / React", category: SkillCategory.FRAMEWORK, proficiency: 95, order: 3 },
    { name: "Node.js", category: SkillCategory.FRAMEWORK, proficiency: 88, order: 4 },
    { name: "PostgreSQL", category: SkillCategory.DATABASE, proficiency: 88, order: 5 },
    { name: "LangChain / LangGraph", category: SkillCategory.AI_ML, proficiency: 85, order: 6 },
    { name: "Docker", category: SkillCategory.TOOL, proficiency: 82, order: 7 },
    { name: "Tailwind CSS", category: SkillCategory.FRAMEWORK, proficiency: 92, order: 8 },
  ];

  for (const skill of sampleSkills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (existing) {
      await prisma.skill.update({
        where: { id: existing.id },
        data: skill,
      });
    } else {
      await prisma.skill.create({ data: skill });
    }
  }
  console.log(`⚡ Seeded ${sampleSkills.length} skills`);

  // 5. Sample Projects
  const sampleProjects = [
    {
      title: "OmniPortfolio System",
      slug: "omni-portfolio-system",
      description: "A production-grade, minimalist portfolio powered by Next.js 14, PostgreSQL, NextAuth, and privacy-first analytics.",
      readme: `# OmniPortfolio System\n\nModern monochrome engineering portfolio with CMS admin dashboard.\n\n## Features\n- Next.js 14 App Router\n- Prisma ORM + PostgreSQL\n- Secure Admin Panel\n- Dynamic Visitor Tracking`,
      liveUrl: "https://example.com",
      repoUrl: "https://github.com",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
      category: ProjectCategory.WEBSITE,
      status: ProjectStatus.LIVE,
      featured: true,
      order: 1,
    },
    {
      title: "Autonomous Agentic Orchestrator",
      slug: "autonomous-agentic-orchestrator",
      description: "Multi-agent autonomous cognitive pipeline that breaks down complex user objectives into parallel subtasks and executes them deterministically.",
      readme: `# Autonomous Agentic Orchestrator\n\nA resilient framework for autonomous agent coordination and real-time execution.\n\n## Architecture\n- ReAct feedback loop\n- Hierarchical task planning\n- Sandboxed execution environments`,
      liveUrl: "https://agent-demo.example.com",
      repoUrl: "https://github.com",
      techStack: ["Python", "FastAPI", "TypeScript", "LangChain", "Vector DB"],
      category: ProjectCategory.AGENTIC_AI,
      status: ProjectStatus.LIVE,
      featured: true,
      order: 2,
    },
    {
      title: "Neural Code Synthesizer",
      slug: "neural-code-synthesizer",
      description: "Next-generation context-aware reasoning engine for instant semantic code refactoring and automatic test generation.",
      readme: `# Neural Code Synthesizer\n\nNext-gen semantic code intelligence engine.\n\n## Roadmap\n- Abstract syntax tree parsing\n- Speculative multi-token generation`,
      liveUrl: undefined,
      repoUrl: "https://github.com",
      techStack: ["Rust", "PyTorch", "gRPC", "Next.js"],
      category: ProjectCategory.FUTURE,
      status: ProjectStatus.PLANNED,
      featured: false,
      order: 3,
    },
  ];

  for (const proj of sampleProjects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {
        title: proj.title,
        description: proj.description,
        readme: proj.readme,
        liveUrl: proj.liveUrl,
        repoUrl: proj.repoUrl,
        techStack: proj.techStack,
        category: proj.category,
        status: proj.status,
        featured: proj.featured,
        order: proj.order,
      },
      create: proj,
    });
  }
  console.log(`🚀 Seeded ${sampleProjects.length} sample projects`);

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
