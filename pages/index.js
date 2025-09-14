import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">
        🚀 Notes SaaS Starter
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Use the{" "}
        <Link
          href="/login"
          className="font-bold text-blue-600 hover:underline hover:text-blue-800"
        >
          Login Page
        </Link>{" "}
        to sign in with seeded users.
      </p>
      <p className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg shadow">
        Example Accounts: <br />
        <strong>Email:</strong> test1@example.com | <strong>Password:</strong> password123 <br />
        <strong>Email:</strong> test2@example.com | <strong>Password:</strong> password123
      </p>
    </main>
  );
}
