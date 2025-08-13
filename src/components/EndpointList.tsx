"use client";
import React, { useEffect, useState } from "react";

export interface EndpointDoc {
  name: string;
  url: string;
}

export default function EndpointList({ onSelect, credentials }: { onSelect: (endpoint: EndpointDoc) => void, credentials: { email: string; password: string } }) {
  const [endpoints, setEndpoints] = useState<EndpointDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEndpoints() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/endpoints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (res.ok && data.endpoints) {
          setEndpoints(data.endpoints);
        } else {
          setError("Failed to load endpoints");
        }
      } catch (err: any) {
        setError("Failed to load endpoints");
      } finally {
        setLoading(false);
      }
    }
    fetchEndpoints();
  }, [credentials]);

  if (loading) return <div>Loading endpoints…</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Available Endpoints</h3>
      <ul style={{ maxHeight: 400, overflowY: "auto", padding: 0 }}>
        {endpoints.map((ep) => (
          <li key={ep.url} style={{ listStyle: "none", margin: "4px 0" }}>
            <button onClick={() => onSelect(ep)} style={{ textAlign: "left", width: "100%" }}>
              {ep.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
