'use client';
import { useState } from 'react';

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    try {
      const response = await fetch(
        'http://localhost:5000/r/4f214558-2387-43ed-b97b-a82e534452c2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer c4cd58c71ffff1b535496c2e4f100f3a09783803be8a60e16b27a212f3f4a261',
          },
          body: JSON.stringify({ formData }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResponseMessage('Submission successful!');
      } else {
        setResponseMessage(data.error || 'Error submitting data');
      }
    } catch (error) {
      setResponseMessage('Error submitting form');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Submit Your Data</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block font-semibold mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-transparent border p-2 rounded"
            placeholder="Enter your name"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {responseMessage && <p className="mt-4 text-lg">{responseMessage}</p>}
    </div>
  );
};

export default FormPage;
