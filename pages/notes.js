import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Home, FileText, Settings, LogOut, Menu, Search } from "lucide-react";
import Navbar from "../components/Navbar";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const router = useRouter();

  const supabaseAccessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("supabaseAccessToken")
      : null;

  useEffect(() => {
    if (!supabaseAccessToken) {
      router.push("/login");
      return;
    }

    async function fetchNotes() {
      try {
        setLoading(true);
        const res = await fetch("/api/notes", {
          headers: { Authorization: `Bearer ${supabaseAccessToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch notes");
        setNotes(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [supabaseAccessToken, router]);

  async function handleSave(e) {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/notes/${editingId}` : "/api/notes";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error saving note");

      if (editingId) {
        setNotes(notes.map((n) => (n.id === editingId ? data : n)));
      } else {
        setNotes([data, ...notes]);
      }

      setTitle("");
      setBody("");
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this note?")) return;
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${supabaseAccessToken}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }

      setNotes(notes.filter((n) => n.id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search notes..."
            className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-xl shadow mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Note" : "Create Note"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your note..."
            className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {editingId ? "Update" : "Add"} Note
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setBody("");
                }}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-gray-500">No notes found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 mb-3">{note.body}</p>
                <p className="text-xs text-gray-400 mb-4">
                  {new Date(note.created_at).toLocaleString()}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setEditingId(note.id);
                      setTitle(note.title);
                      setBody(note.body);
                    }}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
