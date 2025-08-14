"use client";
// Simple JSON syntax highlighter
function syntaxHighlight(json: string) {
  if (!json) return '';
  // Escape HTML
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = '';
    if (/^".*"$/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-blue-700 dark:text-blue-300'; // key
      } else {
        cls = 'text-green-700 dark:text-green-300'; // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-purple-700 dark:text-purple-300'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-gray-500 dark:text-gray-400'; // null
    } else {
      cls = 'text-orange-700 dark:text-orange-300'; // number
    }
    return `<span class=\"${cls}\">${match}</span>`;
  });
}

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CodeBlock } from "./CodeBlock";
import { generateTypesFromJson } from "../lib/jsonTypegen";


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
  const [schema, setSchema] = useState<string>("");
  const [showSchema, setShowSchema] = useState(false);
  const [linkedSchema, setLinkedSchema] = useState<string>("");
  const [showLinkedSchema, setShowLinkedSchema] = useState(false);

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
    setSchema("");
    setShowSchema(false);
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
    setSchema("");
    setShowSchema(false);
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
      // Generate schema from result
      if (data.result) {
        try {
          const types = await generateTypesFromJson(JSON.stringify(data.result));
          setSchema(types);
        } catch (err) {
          setSchema("// Failed to generate schema");
        }
      }
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
          {result && (result.data_url || result.link) && (
            <Button
              className="w-32 h-10"
              disabled={fetchingLink}
              onClick={async () => {
                setFetchingLink(true);
                setLinkedData(null);
                try {
                  const endpointUrl = result.data_url || result.link;
                  const resp = await fetch("/api/test-endpoint", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...credentials,
                      endpoint: endpointUrl,
                      params: {},
                    }),
                  });
                  const data = await resp.json();
                  setLinkedData(data.result);
                  // Generate schema for linked data
                  if (data.result) {
                    try {
                      const types = await generateTypesFromJson(JSON.stringify(data.result));
                      setLinkedSchema(types);
                    } catch (err) {
                      setLinkedSchema("// Failed to generate schema");
                    }
                  }
                } catch (err) {
                  setLinkedData({ error: 'Failed to fetch linked data' });
                  setLinkedSchema("");
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
        {/* Collapsible raw JSON result and schema preview */}
        {result && (
          <>
            <div className="mb-2 w-full">
              <Collapsible defaultOpen={!(result && (result.link || result.data_url))}>
                <CollapsibleTrigger className="font-semibold text-xs text-muted-foreground underline">
                  {(result && (result.link || result.data_url)) ? 'Show Raw JSON Result' : 'Hide Raw JSON Result'}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="p-4 bg-muted rounded text-xs overflow-x-auto max-h-96 w-full" style={{ fontFamily: 'Menlo, monospace' }}
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(result, null, 2)) }}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
            {schema && (
              <div className="mb-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 px-2 py-1 text-xs"
                  onClick={() => setShowSchema((v) => !v)}
                >
                  {showSchema ? "Hide Schema" : "Show Schema"}
                </Button>
              </div>
            )}
            {showSchema && schema && (
              <div className="w-full">
                <CodeBlock code={schema} language="typescript" />
              </div>
            )}
          </>
        )}
        {/* Linked data display */}
        {linkedData && (
          <div className="mt-4 w-full">
            <div className="font-semibold mb-1">Linked Data:</div>
            <pre className="p-4 bg-muted rounded text-xs overflow-x-auto max-h-96 w-full" style={{ fontFamily: 'Menlo, monospace' }}
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(linkedData, null, 2)) }}
            />
            {linkedSchema && (
              <div className="mt-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 px-2 py-1 text-xs"
                  onClick={() => setShowLinkedSchema((v) => !v)}
                >
                  {showLinkedSchema ? "Hide Schema" : "Show Schema"}
                </Button>
              </div>
            )}
            {showLinkedSchema && linkedSchema && (
              <div className="w-full">
                <CodeBlock code={linkedSchema} language="typescript" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
