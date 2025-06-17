import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchMessages = async () => {
    const res = await fetch('http://localhost:3001/api/messages');
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch(`http://localhost:3001/api/messages/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
    } else {
      await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
    }
    setName('');
    setMessage('');
    setEditId(null);
    fetchMessages();
  };

  const handleEdit = (msg) => {
    setName(msg.name);
    setMessage(msg.message);
    setEditId(msg.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/api/messages/${id}`, {
      method: 'DELETE',
    });
    fetchMessages();
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 border rounded shadow">
      <h1 className="text-2xl font-bold mb-5">Guestbook CRUD</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        ></textarea>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          type="submit"
        >
          {editId ? 'Update' : 'Add'}
        </button>
      </form>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      {messages.map(m => (
        <div key={m.id} className="p-4 border rounded mb-2">
          <strong>{m.name}</strong>
          <p>{m.message}</p>
          <div className="mt-2 space-x-2">
            <button
              onClick={() => handleEdit(m)}
              className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(m.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;