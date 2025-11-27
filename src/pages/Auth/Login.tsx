import React, { useState } from 'react';
import { sendLoginOtp } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'sent'|'error'|'sending'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const res = await sendLoginOtp(email);
    if (res.error) {
      setStatus('error');
      setMessage(res.error.message || JSON.stringify(res.error));
    } else {
      setStatus('sent');
      setMessage('Check your email for a login link.');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login / Sign up</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm">Email</label>
        <input
          required
          type="email"
          className="w-full border px-3 py-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full bg-red-600 text-white py-2 rounded"
          type="submit"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Send Login Link'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}