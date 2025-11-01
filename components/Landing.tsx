"use client";

import Link from "next/link";
import { ArrowRight, Zap, Users, MapPin, Calendar, Shield } from "lucide-react";
import Header from "./Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Header />

      <main className=" sm:pt-20">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-900 mb-6 leading-tight">
              Find the Perfect Meeting Time
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
                Powered by AI
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Stop wasting time coordinating schedules. Our AI instantly
              analyzes availability across multiple time zones and suggests the
              best meeting times with optimal central locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/meeting"
                className=" text-[13px] sm:text-lg py-2 sm:px-8 sm:py-4 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="text-[13px] sm:text-lg py-1 sm:px-8 sm:py-4 border-2 border-purple-800 text-purple-800 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg">
                Learn More
              </button>
            </div>
          </div>
        </section>

        <section className="sm:py-20 bg-gradient-to-b from-transparent to-purple-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-purple-900 mb-16">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-800" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  Enter Availability
                </h3>
                <p className="text-gray-600 text-[13px] sm:text-lg">
                  Add 3 people, their time zones, zip codes, and available time
                  slots
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-800" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  AI Analyzes
                </h3>
                <p className="text-gray-600 text-[13px] sm:text-lg">
                  Our AI finds overlapping times and calculates travel distances
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-800" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  Get Results
                </h3>
                <p className="text-gray-600 text-[13px] sm:text-lg">
                  Receive up to 3 perfect meeting options with central locations
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-purple-900 mb-16">
              Powerful Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-800" />
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  Multiple Input Modes
                </h3>
                <p className="text-gray-600 text-[13px] sm:text-lg">
                  Use the intuitive form or paste JSON data - whatever works
                  best for you
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-800" />
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 text-[13px] sm:text-lg">
                  Get meeting suggestions in seconds, not hours of
                  back-and-forth emails
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-purple-800" />
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  Smart Location
                </h3>
                <p className="text-gray-600 text-[13px] sm:text-lg">
                  AI finds central meeting points within 30 minutes travel time
                  for everyone
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-800" />
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  Privacy First
                </h3>
                <p className="text-gray-600 text-[13px] sm:text-lg">
                  Your data is processed securely and never stored without
                  permission
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-purple-800 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Save Time on Scheduling?
            </h2>
            <p className="text-purple-100  text-[13px] sm:text-lg mb-8 max-w-2xl mx-auto">
              Join teams that are already using AI to find perfect meeting times
              instantly
            </p>
            <Link
              href="/meeting"
              className="inline-block text-[13px] sm:text-lg py-2 px-6 sm:px-8 sm:py-4 bg-white text-purple-800 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Launch Meet 4.ai Now
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-purple-100">
        <p>Meet 4.ai - Powered by OpenAI</p>
      </footer>
    </div>
  );
}
