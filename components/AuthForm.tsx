"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) setError("Invalid credentials");
    else router.push("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) router.push("/login");
      else {
        const data = await res.json();
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-purple-200">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center animate-pulse">
            {error}
          </p>
        )}

        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          className="space-y-5"
        >
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {mode === "login" && (
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-xl py-3 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-18.2-1.5-36.4-4.6-54H272v102.5h146.9c-6.4 34.7-25.8 64.1-54.9 84v69h88.7c51.9-47.8 81.8-118 81.8-201.5z"
                  fill="#4285F4"
                />
                <path
                  d="M272 544.3c73.7 0 135.5-24.5 180.7-66.5l-88.7-69c-24.5 16.5-55.8 26.3-92 26.3-70.8 0-130.7-47.7-152.2-111.7H31.8v70.3C76.8 476.1 167.3 544.3 272 544.3z"
                  fill="#34A853"
                />
                <path
                  d="M119.8 322.4c-5.9-16.9-9.3-34.8-9.3-53.4s3.4-36.5 9.3-53.4v-70.3H31.8C11.5 207.2 0 246.2 0 278.9s11.5 71.7 31.8 106.8l88-63.3z"
                  fill="#FBBC05"
                />
                <path
                  d="M272 107.2c38.8 0 73.6 13.4 101 39.8l75.2-75.2C407.5 24.5 345.7 0 272 0 167.3 0 76.8 68.2 31.8 175.6l88 63.3c21.5-64 81.4-111.7 152.2-111.7z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
          </div>
        )}

        <p className="text-center text-sm mt-6 text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <a href="/signup" className="text-purple-600 font-medium hover:underline">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="text-purple-600 font-medium hover:underline">
                Login
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
