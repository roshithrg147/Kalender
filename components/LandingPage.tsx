"use client";

import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4 py-10 animate-fade-in">
      <div className="w-full max-w-6xl flex gap-16 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg p-10 md:p-16 items-center md:flex-row flex-col">
        <section className="flex-1 flex flex-col items-center text-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/assets/logo.svg"
              alt="Logo"
              width={120}
              height={120}
              className="drop-shadow-lg"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight mb-2">
              Your time,{" "}
              <span className="text-blue-500">perfectly planned</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-light max-w-xl">
              Join millions of professionals who easily book meetings with the{" "}
              <span className="font-semibold text-blue-600">
                #1 scheduling tool
              </span>
              .
            </p>
          </div>
          <div className="relative w-full flex justify-center mt-6">
            <Image
              src="/assets/planning.svg"
              width={400}
              height={400}
              alt="Planning illustration"
              className="rounded-2xl shadow-xl border-4 border-blue-100 bg-white/60"
              priority
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-4 bg-blue-200 blur-2xl opacity-60 rounded-full" />
          </div>
        </section>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm bg-white/90 rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Sign in to get started
            </h2>
            <SignIn
              routing="hash"
              appearance={{
                baseTheme: neobrutalism,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
