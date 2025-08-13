"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function EndpointDocDisplay({ doc }: { doc: any }) {
  if (!doc) return null;
  return (
    <Card className="w-full max-w-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Endpoint</CardTitle>
        <a
          href={doc.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 break-all underline text-sm font-mono"
        >
          {doc.link}
        </a>
      </CardHeader>
      <CardContent className="space-y-4">
        {doc.expirationSeconds && (
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold">Cache Expiration:</span> {doc.expirationSeconds} seconds
          </div>
        )}
        {doc.note && (
          <div className="text-sm">
            <span className="font-semibold">Note:</span>{" "}
            {Array.isArray(doc.note)
              ? doc.note.map((n: string, i: number) => <div key={i}>{n}</div>)
              : doc.note}
          </div>
        )}
        {doc.parameters && (
          <div>
            <div className="font-semibold mb-2">Parameters:</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(doc.parameters).map(([name, param]: [string, any]) => (
                  <TableRow key={name}>
                    <TableCell className="font-mono text-xs">{name}</TableCell>
                    <TableCell>{param.type || ""}</TableCell>
                    <TableCell>{param.required ? "Yes" : ""}</TableCell>
                    <TableCell>{param.note || ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
