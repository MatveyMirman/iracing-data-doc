"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function EndpointDocDisplay({ doc }: { doc: any }) {
  if (!doc) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl p-8 shadow-md">
      <div className="mb-4">
        <div className="text-lg font-semibold mb-2 text-muted-foreground dark:text-zinc-300">Endpoint</div>
        <a
          href={doc.link}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-blue-600 dark:text-blue-400 hover:underline"
        >
          {doc.link}
        </a>
      </div>
      {doc.cache_expiration && (
        <div className="mb-2 text-muted-foreground dark:text-zinc-400">
          <span className="font-semibold">Cache Expiration:</span> {doc.cache_expiration} seconds
        </div>
      )}
      {doc.note && (
        <div className="text-xs text-muted-foreground dark:text-zinc-400 whitespace-pre-line break-words opacity-80">
          Note: {doc.note}
        </div>
      )}
      {doc.parameters && Object.keys(doc.parameters).length > 0 && (
        <div className="mt-6">
          <div className="font-semibold mb-2">Parameters</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-1 pr-2 font-medium">Name</th>
                <th className="text-left py-1 pr-2 font-medium">Type</th>
                <th className="text-left py-1 pr-2 font-medium">Required</th>
                <th className="text-left py-1 pr-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(doc.parameters).map(([name, param]: any) => (
                <tr key={name} className="border-b border-border last:border-0">
                  <td className="py-1 pr-2 font-mono text-xs">{name}</td>
                  <td className="py-1 pr-2 text-xs">{param.type}</td>
                  <td className="py-1 pr-2 text-xs">{param.required ? "Yes" : "No"}</td>
                  <td className="py-1 pr-2 text-xs max-w-xs whitespace-pre-line break-words opacity-80">
                    {param.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
