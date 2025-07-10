import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import PublicNavBar from "@/components/PublicNavBar";
import PrivateNavBar from "@/components/PrivateNavBar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
    }): Promise<React.ReactNode> {
    
    const user = await currentUser();
  return (
      <main className="relative">
          {/* Render PrivateNavBar if user exists, otherwise PublicNavBar */}
          {user ? <PrivateNavBar /> : <PublicNavBar />}
          {/* <PublicNavBar /> */}
      <section className="pt-36">{children}</section>
    </main>
  );
}
