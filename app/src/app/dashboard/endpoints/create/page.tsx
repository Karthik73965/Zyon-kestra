'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { BackendUrl } from '@/constant/constants';

const CreateEndpointPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    discord_wh: '',
    slack_wh: '',
    webhook: '',
  });
  const [loading, setLoading] = useState(false);

  // Corrected handleChange function to update form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });  // Update the specific field in the form
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get('token'); // Fetch token from cookies

      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      const res = await fetch(`${BackendUrl}/api/endpoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Endpoint created successfully!');
        router.push('/dashboard/endpoints');
      } else {
        throw new Error(data.message || 'Failed to create endpoint');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create a New Endpoint</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Notification Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-transparent border p-2 rounded"
            placeholder="example@example.com"
          />
        </div>
        <div>
          <label htmlFor="discord_wh" className="block font-semibold mb-1">
            Discord Webhook
          </label>
          <input
            type="url"
            id="discord_wh"
            name="discord_wh"
            value={form.discord_wh}
            onChange={handleChange}
            className="w-full bg-transparent border p-2 rounded"
            placeholder="Discord webhook URL"
          />
        </div>
        <div>
          <label htmlFor="slack_wh" className="block font-semibold mb-1">
            Slack Webhook
          </label>
          <input
            type="url"
            id="slack_wh"
            name="slack_wh"
            value={form.slack_wh}
            onChange={handleChange}
            className="w-full bg-transparent border p-2 rounded"
            placeholder="Slack webhook URL"
          />
        </div>
        <div>
          <label htmlFor="webhook" className="block font-semibold mb-1">
            Custom Webhook
          </label>
          <input
            type="url"
            id="webhook"
            name="webhook"
            value={form.webhook}
            onChange={handleChange}
            className="w-full bg-transparent border p-2 rounded"
            placeholder="Custom webhook URL"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Endpoint'}
        </button>
      </form>
    </div>
  );
};

export default CreateEndpointPage;
