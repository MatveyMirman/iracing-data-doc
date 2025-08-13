"use client";
import React, { useState, useEffect } from "react";
import { EndpointDocDisplay } from "./EndpointDocDisplay";
import LoginTest from "./LoginTest";
import EndpointList, { EndpointDoc } from "./EndpointList";

export default function PlaygroundHome() {
  const [selected, setSelected] = useState<EndpointDoc | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [doc, setDoc] = useState<any | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  useEffect(() => {
    if (!selected || !credentials) {
      setDoc(null);
      setDocError(null);
      return;
    }
    setDocLoading(true);
    setDocError(null);
    fetch("/api/endpoint-doc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...credentials, endpoint: selected.name }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.doc) setDoc(data.doc);
        else setDocError(data.error || "Failed to load documentation");
      })
      .catch(() => setDocError("Failed to load documentation"))
      .finally(() => setDocLoading(false));
  }, [selected, credentials]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!credentials ? (
        <LoginTest onSuccess={(email, password) => setCredentials({ email, password })} />
      ) : (
        <div style={{ display: "flex", gap: 32 }}>
          <EndpointList onSelect={setSelected} credentials={credentials} />
          <div style={{ minWidth: 320, maxWidth: 600 }}>
            {selected ? (
              <>
                <h2>{selected.name}</h2>
                <div
                  style={{
                    margin: '1rem 0',
                    width: '100%',
                    minHeight: 200,
                    maxHeight: 400,
                    border: '1px solid #222',
                    borderRadius: 8,
                    padding: 16,
                    background: '#fff',
                    color: '#222',
                    overflow: 'auto',
                    fontFamily: 'Menlo, Monaco, Consolas, monospace',
                  }}
                >
                  {docLoading ? (
                    <div>Loading documentation…</div>
                  ) : docError ? (
                    <div style={{ color: 'red' }}>{docError}</div>
                  ) : doc ? (
                    <EndpointDocDisplay doc={doc} />
                  ) : (
                    <div>No documentation found.</div>
                  )}
                </div>
                {/* Playground for this endpoint will go here */}
              </>
            ) : (
              <div>Select an endpoint to view details</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
