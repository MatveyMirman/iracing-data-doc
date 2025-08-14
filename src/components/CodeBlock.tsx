"use client";
import * as React from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "typescript", className = "" }: CodeBlockProps) {
  return (
    <pre className={`p-4 bg-muted rounded text-xs overflow-x-auto max-h-96 font-mono ${className}`}
         style={{ fontFamily: 'Menlo, monospace' }}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
