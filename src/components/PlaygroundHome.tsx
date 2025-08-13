"use client";
import React, { useState, useEffect } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EndpointDocDisplay } from "./EndpointDocDisplay";
import EndpointTest from "./EndpointTest";
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
  <main className="flex min-h-screen w-full flex-col items-stretch justify-stretch bg-muted">
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
  <div className="relative w-full h-full flex-1">
        {/* Fixed logout + theme switcher in top-right */}
        <div className="fixed top-6 right-8 z-50 flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="default"
            className="shadow-lg px-6 py-2 text-base font-semibold"
            onClick={() => {
              setCredentials(null);
              sessionStorage.removeItem("iracingCredentials");
            }}
          >
            Log out
          </Button>
        </div>
        <div className="flex w-full h-[calc(100vh-0.5rem)] gap-0 bg-muted rounded-xl shadow-lg overflow-hidden">
          <EndpointList onSelect={setSelected} credentials={credentials} selectedEndpoint={selected?.name} />
          <section className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">
            {selected ? (
              <>
                {(() => {
                  const prettify = (name: string) =>
                    name
                      .split('/')
                      .map(seg => seg.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
                      .join(' / ');
                  return (
                    <div className="w-full flex flex-col items-center mb-6">
                      <h2 className="text-3xl font-extrabold tracking-tight text-center mb-2">
                        {prettify(selected.name)}
                      </h2>
                      <div className="h-1 w-16 bg-primary/20 rounded-full"></div>
                    </div>
                  );
                })()}
                <div className="grid w-full gap-6 md:grid-cols-2 items-start">
                  <Card className="w-full h-full">
                    <CardContent className="p-6 flex flex-col gap-4">
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
                  {doc && (
                    <EndpointTest
                      endpoint={selected.name}
                      params={{}}
                      paramDefs={doc.parameters || {}}
                      credentials={credentials}
                    />
                  )}
                </div>
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
