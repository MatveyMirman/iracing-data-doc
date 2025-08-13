"use client";
import React, { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export interface EndpointDoc {
  name: string;
  url: string;
}

export default function EndpointList({ onSelect, credentials, selectedEndpoint }: { onSelect: (endpoint: EndpointDoc) => void, credentials: { email: string; password: string }, selectedEndpoint?: string }) {
  const [endpoints, setEndpoints] = useState<EndpointDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

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

  // Group endpoints by first segment
  const tree: { [group: string]: EndpointDoc[] } = {};
  endpoints.forEach((ep) => {
    const [group, ...rest] = ep.name.split("/");
    if (!tree[group]) tree[group] = [];
    tree[group].push(ep);
  });

  if (loading) return <div className="p-4 text-muted-foreground">Loading endpoints…</div>;
  if (error) return <div className="p-4 text-destructive">{error}</div>;

  return (
    <aside className="w-64 h-full bg-card border-r flex flex-col p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="font-extrabold text-xl tracking-tight text-primary mb-2">iRacing data API</h2>
        <h3 className="font-bold text-base mb-2">Available Endpoints</h3>
      </div>
      <nav>
        {Object.entries(tree).map(([group, endpoints]) => (
          <Collapsible key={group} open={openGroups[group] ?? true} onOpenChange={(open) => setOpenGroups((prev) => ({ ...prev, [group]: open }))}>
            <CollapsibleTrigger className="w-full flex items-center justify-between font-semibold py-2 px-2 rounded hover:bg-accent focus:bg-accent transition">
              <span>{group}</span>
              <span className="ml-2">{openGroups[group] ?? true ? "▾" : "▸"}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="pl-4">
                {endpoints.map((ep) => (
                  <li key={ep.url}>
                    <button
                      className={`w-full text-left py-1 px-2 rounded hover:bg-accent focus:bg-accent transition ${selectedEndpoint === ep.name ? "bg-accent font-bold" : ""}`}
                      onClick={() => onSelect(ep)}
                    >
                      {ep.name.split("/").slice(1).join("/")}
                    </button>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>
    </aside>
  );
}
