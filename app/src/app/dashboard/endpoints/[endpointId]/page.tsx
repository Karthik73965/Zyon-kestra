'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { BackendUrl } from '@/constant/constants';

const SubmissionsPage = ({ params }: { params: { endpointId: string } }) => {
  //@ts-ignore
  const endpointId = React.use(params).endpointId
    const [submissions, setSubmissions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = Cookies.get('token');

        if (!token) {
          throw new Error('Authentication token is missing.');
        }

        const res = await fetch(`${BackendUrl}/api/endpoints/${endpointId}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res) {
          setSubmissions(data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch submissions');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [endpointId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Submissions for Endpoint: {endpointId}</h1>

      {loading ? (
        <p>Loading submissions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.submissionId} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">Submission ID: {submission.id}</h2>
              <p>Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>
              <Link
                href={`/dashboard/endpoints/${endpointId}/${submission.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No submissions found for this endpoint.</p>
      )}
    </div>
  );
};

export default SubmissionsPage;
