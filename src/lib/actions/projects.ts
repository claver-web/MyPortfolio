"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectCategory, ProjectStatus } from "@prisma/client";
import { z } from "zod";

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  readme: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  techStack: z.array(z.string()).default([]),
  category: z.nativeEnum(ProjectCategory).default(ProjectCategory.WEBSITE),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.LIVE),
  featured: z.boolean().default(false),
  thumbnail: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function saveProject(input: z.infer<typeof projectSchema>) {
  await requireAuth();

  const validated = projectSchema.parse(input);

  // Clean empty strings to null
  const payload = {
    title: validated.title,
    slug: validated.slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-"),
    description: validated.description,
    readme: validated.readme || null,
    liveUrl: validated.liveUrl?.trim() || null,
    repoUrl: validated.repoUrl?.trim() || null,
    techStack: validated.techStack,
    category: validated.category,
    status: validated.status,
    featured: validated.featured,
    thumbnail: validated.thumbnail?.trim() || null,
    order: validated.order,
  };

  if (validated.id) {
    await prisma.project.update({
      where: { id: validated.id },
      data: payload,
    });
  } else {
    await prisma.project.create({
      data: payload,
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${payload.slug}`);
  revalidatePath("/agentic-ai");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireAuth();

  const project = await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/agentic-ai");
  revalidatePath("/");
  return { success: true };
}

export async function toggleFeaturedProject(id: string, featured: boolean) {
  await requireAuth();

  await prisma.project.update({
    where: { id },
    data: { featured },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true };
}
