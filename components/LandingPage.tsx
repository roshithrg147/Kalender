"use client";

import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

// Extend the Window interface to include Pi
declare global {
  interface Window {
    Pi?: any;
  }
}

export default function LandingPage() {
  //Pi Integrations
  const [isPiBrowser, setIsPiBrowser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Pi) {
      setIsPiBrowser(true);
    }
  }, []);

  const handlePiLogin = async () => {
    if (!window.Pi) {
      alert("This feature only works inside the Pi Browser.");
      return;
    }

    setLoading(true);

    window.Pi.authenticate(
      ["username", "payments"],
      async (authData: any) => {
        try {
          const res = await fetch("/api/pi-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(authData),
          });

          const data = await res.json();
          if (data?.uid) {
            alert(`Welcome, Pi user ${data.uid}`);
            // Redirect to dashboard or store session here
            // For example: router.push("/dashboard");
          } else {
            alert("Pi login failed.");
          }
        } catch (err) {
          console.error("Login error:", err);
          alert("An error occurred during Pi login.");
        } finally {
          setLoading(false);
        }
      },
      (error: unknown) => {
        console.error("Pi auth error:", error);
        alert("Pi Authentication failed.");
        setLoading(false);
      }
    );
  };
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
          {isPiBrowser && (
            <Button
              onClick={handlePiLogin}
              className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition"
              disabled={loading}
            >
              {loading ? "Logging in with Pi..." : "Login with Pi Browser"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
