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
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-green-50
        p-3
        sm:p-5
        md:p-6
      "
    >

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-2xl
          shadow-xl
          w-full
          max-w-lg
          p-5
          sm:p-7
          md:p-8
        "
      >

        {/* =====================================
            JUDUL
        ===================================== */}

        <div className="text-center mb-6 sm:mb-8">

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-green-700
            "
          >
            Daftar Operator Gudep
          </h1>

          <p
            className="
              text-gray-500
              text-sm
              mt-2
            "
          >
            Silakan lengkapi data operator
          </p>

        </div>


        {/* =====================================
            NAMA OPERATOR
        ===================================== */}

        <Input
          label="Nama Operator"
          name="namaOperator"
          value={form.namaOperator}
          onChange={handleChange}
        />


        {/* =====================================
            EMAIL
        ===================================== */}

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />


        {/* =====================================
            NOMOR HP
        ===================================== */}

        <Input
          label="Nomor HP"
          name="noHp"
          type="tel"
          value={form.noHp}
          onChange={handleChange}
        />


        {/* =====================================
            PASSWORD
        ===================================== */}

        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />


        {/* =====================================
            KONFIRMASI PASSWORD
        ===================================== */}

        <Input
          label="Konfirmasi Password"
          name="konfirmasiPassword"
          type="password"
          value={form.konfirmasiPassword}
          onChange={handleChange}
        />


        {/* =====================================
            TOMBOL
        ===================================== */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            mt-4
            sm:mt-6
            h-12
            rounded-xl
            bg-green-700
            hover:bg-green-800
            disabled:bg-green-400
            text-white
            font-semibold
            transition
            text-sm
            sm:text-base
          "
        >
          {loading
            ? "Menyimpan..."
            : "Daftar Operator"}
        </button>


        {/* =====================================
            KEMBALI LOGIN
        ===================================== */}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="
            w-full
            mt-3
            h-11
            rounded-xl
            border
            border-green-700
            text-green-700
            hover:bg-green-50
            font-semibold
            transition
            text-sm
          "
        >
          Kembali ke Login
        </button>

      </form>

    </div>
  );
}


/* ==========================================
   KOMPONEN INPUT
========================================== */

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="mb-4 sm:mb-5">

      <label
        className="
          block
          text-sm
          font-semibold
          mb-2
          text-gray-700
        "
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          h-12
          rounded-xl
          border
          border-gray-300
          px-4
          text-base
          outline-none
          focus:border-green-600
          focus:ring-2
          focus:ring-green-100
          transition
        "
      />

    </div>
  );
}