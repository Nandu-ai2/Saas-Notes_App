import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700">📊 Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your dashboard. Track your notes and progress here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="font-semibold text-gray-800">Total Notes</h2>
            <p className="text-2xl font-bold text-indigo-600">24</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="font-semibold text-gray-800">Recent Activity</h2>
            <p className="text-gray-600">You added 3 notes today</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="font-semibold text-gray-800">Profile Strength</h2>
            <p className="text-green-600">80%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
