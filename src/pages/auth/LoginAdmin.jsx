import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    // Sementara login sederhana
    if (username === "mochalle" && password === "040975") {
      navigate("/admin/dashboard");
    } else {
      alert("Username atau Password salah!");
    }
  }

  return (
    <div className="min-h-screen bg-green-700 flex items-center justify-center">

      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

          <img
            src="/logo/sibela.png"
            alt="SI BELA"
            className="w-24 mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold text-green-700">
            Login Panitia
          </h1>

          <p className="text-gray-500 mt-2">
            SI BELA - Jambore Ranting 2026
          </p>

        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg"
        >
          Masuk
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Kwarran Cikarang Utara
        </p>

      </div>

    </div>
  );
}