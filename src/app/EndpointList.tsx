// ...existing code...
import React, { useEffect, useState } from "react";

export interface EndpointDoc {
  name: string;
  url: string;
}

export default function EndpointList({ onSelect }: { onSelect: (endpoint: EndpointDoc) => void }) {
  const [endpoints, setEndpoints] = useState<EndpointDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEndpoints() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://members-ng.iracing.com/data/doc");
        const html = await res.text();
        // Parse endpoint links from the HTML
        const matches = Array.from(html.matchAll(/<a href=\"([\w\-/]+)\">(.*?)<\/a>/g));
        const found = matches.map(m => ({
          name: m[2],
          url: m[1].replace(/^\//, ""),
        }));
        setEndpoints(found);
      } catch (err: any) {
        setError("Failed to load endpoints");
      } finally {
        setLoading(false);
      }
    }
    fetchEndpoints();
  }, []);

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
