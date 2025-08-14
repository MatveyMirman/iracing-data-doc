"use client";
import * as React from "react";
import "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "typescript", className = "" }: CodeBlockProps) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      window.Prism && window.Prism.highlightElement(ref.current);
    }
  }, [code, language]);

  return (
    <pre className={`p-4 bg-muted rounded text-xs overflow-x-auto max-h-96 font-mono ${className}`}
         style={{ fontFamily: 'Menlo, monospace' }}>
      <code ref={ref} className={`language-${language}`}>{code}</code>
    </pre>
  );
}
