"use client";

import React ,  { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BackendUrl } from "@/constant/constants";
const SubmissionDetailsPage = ({
  params,
}: {
  params: { endpointId: string; submissionId: string };
}) => {
  //@ts-ignore
  const { endpointId, submissionId } = React.use(params);
  const [submission, setSubmission] = useState<any>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = Cookies.get("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const res = await fetch(`${BackendUrl}/api/submission/${submissionId}`, {
          // method:"POST" ,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res) {
          const data = await res.json();
          setSubmission(data.submission);
        } else {
          console.error("Failed to fetch submissions");
        }
      } catch (err) { 
        console.error("Error fetching submissions:", err);
      }
    };

    fetchSubmissions();
  }, [endpointId , submissionId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!submission) {
    return <p>Loading submission details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Submission Details</h1>
      <div className="border p-4 rounded shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">
          Submission ID: {submission.submissionId}
        </h2>
        <p>
          <strong>Submitted At:</strong>{" "}
          {new Date(submission.submittedAt).toLocaleString()}
        </p>
        <p>
          <strong>Endpoint ID:</strong> {submission.endpointId}
        </p>
        <div>
          <h3 className="font-semibold">Form Data:</h3>
          <ul className="pl-4 list-disc">
            { submission && Object.entries(submission.formData).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Analytics:</h3>
          <ul className="pl-4 list-disc">
            <li>
              <strong>OS:</strong> {submission.analytics.os}
            </li>
            <li>
              <strong>Browser:</strong> {submission.analytics.browser}
            </li>
            <li>
              <strong>Device:</strong> {submission.analytics.device}
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Location:</h3>
          <p>
            {submission.location.city}, {submission.location.state},{" "}
            {submission.location.country}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Notification Status:</h3>
          <ul className="pl-4 list-disc">
            <li>
              <strong>Email:</strong> {submission.email_status}
            </li>
            <li>
              <strong>Discord:</strong> {submission.discord_status}
            </li>
            <li>
              <strong>Slack:</strong> {submission.slack_status}
            </li>
            <li>
              <strong>Webhook:</strong> {submission.webhook_status}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailsPage;
