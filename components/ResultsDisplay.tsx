"use client";

import { AIResponse } from "@/lib/types";
import { Calendar, Clock, MapPin, Copy, CheckCircle, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast"; // optional toast notification

interface ResultsDisplayProps {
  results: AIResponse | null;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  if (!results) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatMeetingText = (suggestion: any, index: number) => {
    return `Meeting Option ${index + 1}
Date: ${suggestion.date}
Time: ${suggestion.time}
Location: ${suggestion.zipCode}`;
  };

  const saveResults = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/find-meeting/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results }),
      });
      if (res.ok) toast.success("Results saved successfully");
      else toast.error("Failed to save results");
    } catch (err) {
      toast.error("Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-900 mb-2">
            Meeting Suggestions
          </h2>
          <p className="text-gray-600">
            We found {results.suggestions.length} optimal meeting{" "}
            {results.suggestions.length === 1 ? "time" : "times"} for your group
          </p>
        </div>
        <button
          onClick={saveResults}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Results"}
        </button>
      </div>

      {results.summary && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-800 p-4 rounded-lg">
          <p className="text-purple-900 font-medium">
            <span className="font-semibold">AI Summary: </span>
            {results.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-800 text-white rounded-full text-sm font-bold">
                {index + 1}
              </span>
              <button
                onClick={() =>
                  copyToClipboard(formatMeetingText(suggestion, index), index)
                }
                className="text-purple-800 hover:text-purple-900 transition-colors"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-800 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(suggestion.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-800 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Time
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {suggestion.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-800 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-gray-900 font-semibold">
                    Zip Code: {suggestion.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
