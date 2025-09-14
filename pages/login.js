import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("supabaseAccessToken", data.supabaseAccessToken);

      router.push("/notes");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-indigo-600 text-center">
          Login
        </h1>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white w-full py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold">Example Accounts:</p>
          <ul className="mt-2 space-y-1">
            <li>📧 test1@example.com | 🔑 password123</li>
            <li>📧 test2@example.com | 🔑 password123</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
