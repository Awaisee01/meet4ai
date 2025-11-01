"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ModeToggle from "@/components/ModeToggle";
import FormInput from "@/components/FormInput";
import JsonInput from "@/components/JsonInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import LoadingState from "@/components/LoadingState";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Person, AIResponse } from "@/lib/types";
import Header from "@/components/Header";

export default function MeetingPage() {
  const [mode, setMode] = useState<"form" | "json">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (people: Person[]) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/find-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ people }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to find meeting times");
      }

      if (!data.suggestions || data.suggestions.length === 0) {
        throw new Error(
          "AI could not find matching times for all participants"
        );
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen sm:pt-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <ModeToggle mode={mode} onModeChange={setMode} />

          {error && (
            <div className="mb-6">
              <ErrorDisplay message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {mode === "form" ? (
                <FormInput onSubmit={handleSubmit} isLoading={isLoading} />
              ) : (
                <JsonInput onSubmit={handleSubmit} isLoading={isLoading} />
              )}

              <ResultsDisplay results={results} />
            </>
          )}
        </main>

        <footer className="py-6 text-center text-gray-600 text-sm border-t border-purple-100 mt-12">
          <p>Meet 4.ai - Powered by OpenAI</p>
        </footer>
      </div>
    </>
  );
}
