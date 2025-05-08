import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase'; // ✅ Import from firebase.js

function CautionFormApp() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [station, setStation] = useState('');

  const [form, setForm] = useState({
    startKm: '',
    endKm: '',
    speed: '',
    reason: '',
    rake: 'Rake-001',
  });

  const rakeOptions = ['Rake-001', 'Rake-002', 'Rake-003'];

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      const stationCode = email.split('@')[0];
      setStation(stationCode.toUpperCase());
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.code);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'cautions', form.rake);
    const existing = await getDoc(docRef);
    let items = [];
    if (existing.exists()) {
      const data = existing.data();
      items = Array.isArray(data.items) ? data.items : [];
    }
    items.push({ ...form, station, timestamp: Date.now() });
    await setDoc(docRef, { items });
    alert('Caution submitted to ' + form.rake);
    setForm({ startKm: '', endKm: '', speed: '', reason: '', rake: form.rake });
  };

  if (!user) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Station Master Login</h2>
        <input
          className="w-full mb-2 p-2 border"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2" onClick={login}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Enter Caution Order ({station})</h2>
      <form onSubmit={handleSubmit} className="grid gap-2">
        <input
          className="p-2 border"
          placeholder="Start KM"
          value={form.startKm}
          onChange={(e) => setForm({ ...form, startKm: e.target.value })}
          required
        />
        <input
          className="p-2 border"
          placeholder="End KM"
          value={form.endKm}
          onChange={(e) => setForm({ ...form, endKm: e.target.value })}
          required
        />
        <input
          className="p-2 border"
          placeholder="Speed Limit (kmph)"
          value={form.speed}
          onChange={(e) => setForm({ ...form, speed: e.target.value })}
          required
        />
        <input
          className="p-2 border"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        />
        <select
          className="p-2 border"
          value={form.rake}
          onChange={(e) => setForm({ ...form, rake: e.target.value })}
        >
          {rakeOptions.map((rake) => (
            <option key={rake} value={rake}>
              {rake}
            </option>
          ))}
        </select>
        <button className="bg-green-600 text-white px-4 py-2" type="submit">
          Submit Caution
        </button>
      </form>
    </div>
  );
}

export default CautionFormApp;
