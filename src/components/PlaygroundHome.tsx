"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EndpointDocDisplay } from "./EndpointDocDisplay";
import LoginTest from "./LoginTest";
import EndpointList, { EndpointDoc } from "./EndpointList";

export default function PlaygroundHome() {
  const [selected, setSelected] = useState<EndpointDoc | null>(null);
    const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
          <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>iRacing Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoginError(null);
                    setLoading(true);
                    try {
                      const res = await fetch("/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                      });
                      if (!res.ok) throw new Error("Login failed");
                      setCredentials({ email, password });
                    } catch (err) {
                      setLoginError("Invalid credentials or network error.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                  />
                  {loginError && (
                    <div className="text-destructive text-sm text-center">{loginError}</div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
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
