import React from "react";
import { PublicNav } from "@/components/sections/PublicNav";
import { PublicFooter } from "@/components/sections/PublicFooter";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorGlow } from "@/components/motion/CursorGlow";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <ScrollProgress />
      <CursorGlow />
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
