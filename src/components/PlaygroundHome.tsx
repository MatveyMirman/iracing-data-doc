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
    // Restore credentials from sessionStorage on mount
    useEffect(() => {
      const stored = sessionStorage.getItem("iracingCredentials");
      if (stored) {
        try {
          const creds = JSON.parse(stored);
          if (creds.email && creds.password) setCredentials(creds);
        } catch {}
      }
    }, []);
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
                      sessionStorage.setItem("iracingCredentials", JSON.stringify({ email, password }));
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
      <div className="relative w-full">
        {/* Fixed logout button in top-right */}
        <Button
          variant="default"
          className="fixed top-6 right-8 z-50 shadow-lg px-6 py-2 text-base font-semibold"
          onClick={() => {
            setCredentials(null);
            sessionStorage.removeItem("iracingCredentials");
          }}
        >
          Log out
        </Button>
        <div className="flex w-full h-[80vh] gap-0 bg-muted rounded-xl shadow-lg overflow-hidden">
          <EndpointList onSelect={setSelected} credentials={credentials} selectedEndpoint={selected?.name} />
          <section className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">
            {selected ? (
              <>
                <h2 className="text-2xl font-bold mb-4">{selected.name}</h2>
                <Card className="w-full max-w-2xl mb-4">
                  <CardContent className="p-6">
                    {docLoading ? (
                      <div className="text-muted-foreground">Loading documentation…</div>
                    ) : docError ? (
                      <div className="text-destructive">{docError}</div>
                    ) : doc ? (
                      <EndpointDocDisplay doc={doc} />
                    ) : (
                      <div>No documentation found.</div>
                    )}
                  </CardContent>
                </Card>
                {/* Playground for this endpoint will go here */}
              </>
            ) : (
              <div className="text-muted-foreground text-lg">Select an endpoint to view details</div>
            )}
          </section>
        </div>
      </div>
      )}
    </main>
  );
}
