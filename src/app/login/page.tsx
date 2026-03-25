"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Auto-redirect based on session role
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = session.user.role;
      if (
        userRole === "ADMIN" ||
        userRole === "SUPER_ADMIN" ||
        userRole === "MODERATOR"
      ) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        // Provide a clearer message for credential failures
        const msg = result?.error
          ? /credentials/i.test(result.error)
            ? "Invalid email or password"
            : result.error
          : "Invalid email or password";
        setError(msg);
        return;
      }

      // signIn was successful - session will be updated and useEffect will handle redirect
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("signIn error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-sm border border-gray-700 focus:border-red-500 outline-hidden"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-sm border border-gray-700 focus:border-red-500 outline-hidden"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-sm transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-red-500 hover:text-red-400">
            Sign Up
          </Link>
        </p>

        <p className="text-gray-400 text-center mt-2">
          <Link
            href="/forgot-password"
            className="text-red-500 hover:text-red-400"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}
