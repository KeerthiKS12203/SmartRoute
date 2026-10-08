"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("farmer");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const url="https://8000-kode-ws-c69bd7bb1.hebbale.academy"

  useEffect(() => {
    const savedPhone = localStorage.getItem("temp_register_phone") || "";
    setPhone(savedPhone);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${url}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_no: Number(phone), name, role, password }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail || "Registration processing error");
        return;
      }

      const data = await res.json();
      localStorage.removeItem("temp_register_phone");

      if (data.role === "trader") router.push("/loads");
      else router.push("/trips");
    } catch (err) {
      setError("Failed to register profile database entry.");
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 350, margin: "auto" }}>
      <h2>Account Enrollment</h2>
      <p style={{ color: "orange" }}>Your phone entry is completely clean. Register details below:</p>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label>Target Phone:</label>
          <input type="number" value={phone} disabled style={{ width: "100%", background: "#e5e5e5" }} />
        </div>
        <div>
          <label>Full Legal Name:</label>
          <input type="text" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Select Operating Profile Role:</label>
          <label style={{ marginRight: 15 }}><input type="radio" value="farmer" checked={role === "farmer"} onChange={() => setRole("farmer")} /> Farmer</label>
          <label><input type="radio" value="driver" checked={role === "driver"} onChange={() => setRole("driver")} /> Driver</label>
        </div>
        <div>
          <label>Define Account Password:</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%" }} />
        </div>
        <button type="submit" style={{ padding: 8, cursor: "pointer" }}>Finalise Profile Account</button>
      </form>
      {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
    </div>
  );
}
