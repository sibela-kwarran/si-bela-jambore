import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerOperator } from "../../services/operatorService";

export default function DaftarOperator() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    namaOperator: "",
    email: "",
    noHp: "",
    password: "",
    konfirmasiPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.namaOperator ||
      !form.email ||
      !form.noHp ||
      !form.password ||
      !form.konfirmasiPassword
    ) {
      alert("Semua data wajib diisi.");
      return;
    }

    if (form.password !== form.konfirmasiPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    try {

      setLoading(true);

      await registerOperator(form);
localStorage.setItem("lastEmail", form.email);
      alert("Pendaftaran berhasil.\nSilakan Login.");

      navigate("/login?role=operator");

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8"
      >

        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Daftar Operator Gudep
        </h1>

        <Input
          label="Nama Operator"
          name="namaOperator"
          value={form.namaOperator}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label="Nomor HP"
          name="noHp"
          value={form.noHp}
          onChange={handleChange}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <Input
          label="Konfirmasi Password"
          name="konfirmasiPassword"
          type="password"
          value={form.konfirmasiPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 h-12 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold"
        >
          {loading ? "Menyimpan..." : "Daftar Operator"}
        </button>

      </form>

    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="mb-5">

      <label className="block text-sm font-semibold mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:border-green-600 outline-none"
      />

    </div>
  );
}