"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface EndpointTestProps {
  endpoint: string;
  params: Record<string, any>;
  paramDefs: Record<string, any>;
  credentials: { email: string; password: string };
}

export default function EndpointTest({ endpoint, params, paramDefs, credentials }: EndpointTestProps) {
  const [form, setForm] = useState<Record<string, string>>(params);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [linkedData, setLinkedData] = useState<any>(null);
  const [fetchingLink, setFetchingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if last test was successful
  const [testSuccess, setTestSuccess] = useState(false);

  // Reset state when endpoint changes
  React.useEffect(() => {
    setForm(params);
    setResult(null);
    setLinkedData(null);
    setError(null);
    setLoading(false);
    setFetchingLink(false);
  }, [endpoint]);

  const allParams = Object.entries(paramDefs);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setTestSuccess(false);
    try {
      const res = await fetch("/api/test-endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...credentials,
          endpoint,
          params: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data.result);
      setTestSuccess(true);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setTestSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <CardContent className="p-6 flex-1 flex flex-col min-h-full">
        {/* Buttons at the top */}
        <div className="flex flex-row items-center gap-4 mb-4">
          <Button
            type="submit"
            disabled={loading}
            className={`w-32 h-10 transition-colors ${testSuccess ? 'bg-green-100 text-green-900 border border-green-200 hover:bg-green-200' : ''}`}
            onClick={handleSubmit as any}
          >
            {loading ? "Testing..." : testSuccess ? "Success" : "Test Endpoint"}
          </Button>
          {result && result.link && (
            <Button
              className="w-32 h-10"
              disabled={fetchingLink}
              onClick={async () => {
                setFetchingLink(true);
                setLinkedData(null);
                try {
                  const resp = await fetch("/api/test-endpoint", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...credentials,
                      endpoint: result.link,
                      params: {},
                    }),
                  });
                  const data = await resp.json();
                  setLinkedData(data.result);
                } catch (err) {
                  setLinkedData({ error: 'Failed to fetch linked data' });
                } finally {
                  setFetchingLink(false);
                }
              }}
            >
              {fetchingLink ? 'Fetching…' : 'Fetch Data'}
            </Button>
          )}
          {result && result.expires && (
            <span className="ml-2 text-xs text-muted-foreground">
              Expires: {new Date(result.expires).toLocaleString()}
            </span>
          )}
        </div>
        {/* Parameter form */}
        <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmit}>
          {allParams.length > 0 && (
            <div className="font-semibold mb-2">Parameters:</div>
          )}
          {allParams.map(([key, def]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor={key}>
                {key}
                {def.required && <span className="text-destructive ml-1">*</span>}
              </label>
              <Input
                id={key}
                type={def.type === "number" ? "number" : "text"}
                value={form[key] || ""}
                onChange={e => handleChange(key, e.target.value)}
                required={!!def.required}
                placeholder={def.note || key}
              />
            </div>
          ))}
        </form>
        {error && <div className="text-destructive mt-4">{error}</div>}
        {/* Collapsible raw JSON result */}
        {result && (
          <Collapsible defaultOpen={!result.link}>
            <CollapsibleTrigger className="font-semibold text-xs text-muted-foreground underline mb-2">
              {result.link ? 'Show Raw JSON Result' : 'Hide Raw JSON Result'}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="p-4 bg-muted rounded text-xs overflow-x-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        )}
        {/* Linked data display */}
        {linkedData && (
          <div className="mt-4">
            <div className="font-semibold mb-1">Linked Data:</div>
            <pre className="p-4 bg-muted rounded text-xs overflow-x-auto max-h-96">
              {JSON.stringify(linkedData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
