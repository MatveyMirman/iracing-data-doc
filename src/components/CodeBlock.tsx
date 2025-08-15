"use client";
import * as React from "react";

import "prismjs";
import "prismjs/components/prism-typescript";



interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "typescript", className = "" }: CodeBlockProps) {
  // Dynamically load Prism theme based on app theme and update on theme change
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    function updateTheme() {
      const isDark = document.documentElement.classList.contains('dark');
      const lightThemeId = 'prism-light-theme';
      const darkThemeId = 'prism-dark-theme';
      document.getElementById(lightThemeId)?.remove();
      document.getElementById(darkThemeId)?.remove();
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = isDark ? darkThemeId : lightThemeId;
      link.href = isDark
        ? 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css'
        : 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css';
      document.head.appendChild(link);
      // Re-highlight after theme change
      setTimeout(() => {
        if (ref.current) {
          // @ts-ignore
          window.Prism && window.Prism.highlightElement(ref.current);
        }
      }, 0);
    }
    updateTheme();
    // Listen for theme changes (class change on <html>)
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      // Remove both themes
      document.getElementById('prism-light-theme')?.remove();
      document.getElementById('prism-dark-theme')?.remove();
    };
  }, []);

  React.useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      window.Prism && window.Prism.highlightElement(ref.current);
    }
  }, [code, language]);

  // Use Tailwind for background/text color to match app theme
  return (
    <pre
      className={`p-4 rounded text-xs overflow-x-auto max-h-96 font-mono border border-border bg-muted text-foreground ${className}`}
      style={{ fontFamily: 'Menlo, monospace', background: 'inherit', color: 'inherit' }}
    >
      <code ref={ref} className={`language-${language}`}>{code}</code>
    </pre>
  );
}
