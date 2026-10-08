"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = Phone Check, 2 = Password Entry
  const [error, setError] = useState("");
  const router = useRouter();
  const url="https://8000-kode-ws-c69bd7bb1.hebbale.academy"
  const handleCheckPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // ✅ FIX: Full localhost URL with port 8000 and the complete API route
      const res = await fetch(`${url}/users/check-phone/${phone}`);
      
      const rawText = await res.text(); 
      
      if (rawText.includes("true")) {
        setStep(2); // Unlock password field
      } else {
        localStorage.setItem("temp_register_phone", phone);
        router.push("/register");
      }
    } catch (err) {
      setError("Server error. Is your FastAPI engine active?");
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // ✅ FIX: Aligned perfectly to use localhost on port 8000
      const res = await fetch(`${url}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_no: Number(phone), password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail || "Authentication broken");
        return;
      }

      const data = await res.json();
      if (data.role === "trader") router.push("/loads");
      else if (data.role === "driver") router.push("/driver_home");
      else setError(`Unknown role context: ${data.role}`);
    } catch (err) {
      setError("Network timeout communicating with backend API.");
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 320, margin: "auto" }}>
      <h2>Portal Authentication</h2>
      {step === 1 ? (
        <form onSubmit={handleCheckPhone} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label>Enter Registered Phone Number:</label>
          <input type="number" placeholder="9999988888" value={phone} onChange={e => setPhone(e.target.value)} required />
          <button type="submit">Verify Phone</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyPassword} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p>Phone Session: <strong>{phone}</strong></p>
          <label>Input Password Credentials:</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Confirm Secure Access</button>
          <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>Change Number</button>
        </form>
      )}
      {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
    </div>
  );
}
