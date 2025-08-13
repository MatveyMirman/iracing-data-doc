"use client";
import React, { useState } from "react";


export default function LoginTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("Login successful!");
      } else {
        setStatus("Login failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      setStatus("Login failed: Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "2rem auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <h2>Test iRacing Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
