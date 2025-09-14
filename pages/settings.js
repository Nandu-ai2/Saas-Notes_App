import Navbar from "../components/Navbar";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700">⚙️ Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings, preferences, and profile here.
        </p>

        <div className="mt-6 space-y-4">
          <div className="bg-white shadow p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800">Profile</h2>
            <p className="text-gray-500">Update your personal details.</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800">Preferences</h2>
            <p className="text-gray-500">Change themes and app settings.</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800">Security</h2>
            <p className="text-gray-500">Manage your password and sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
