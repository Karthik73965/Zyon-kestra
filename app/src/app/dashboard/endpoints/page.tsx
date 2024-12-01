'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Endpoint } from 'next/dist/build/swc/types';
import Cookies from 'js-cookie';
import { BackendUrl } from '@/constant/constants';
const EndpointsPage = () => {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEndpoints = async () => {
      const token = Cookies.get('token');

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const res = await fetch(`${BackendUrl}/api/endpoints/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res) {
          const data = await res.json();
          console.log(data)
          setEndpoints(data);
        } else {
          console.error('Failed to fetch endpoints');
        }
      } catch (err) {
        console.error('Error fetching endpoints:', err);
      }
    };

    fetchEndpoints();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Endpoints</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        { endpoints && endpoints.map((endpoint) => (
          <div key={endpoint.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold">{endpoint.endpointId}</h2>
            <p>Email: {endpoint.email || 'N/A'}</p>
            <p>token: {endpoint.token || 'N/A'}</p>


            <Link
              href={`/dashboard/endpoints/${endpoint.endpointId}`}
              className="text-blue-500 hover:underline"
            >
              View Submissions
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EndpointsPage;
