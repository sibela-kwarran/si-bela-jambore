import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginOperator } from "../../services/operatorService";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    localStorage.getItem("lastEmail") || ""
  );

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = location.pathname === "/admin-login";

  async function handleLogin() {
    if (isAdmin) {
      navigate("/admin/dashboard");
      return;
    }

    if (!email || !password) {
      alert("Email dan Password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const operator = await loginOperator(email, password);

      if (!operator) {
        alert("Email atau Password salah.");
        return;
      }

      // Simpan session
      localStorage.setItem(
        "operatorLogin",
        JSON.stringify(operator)
      );

      alert(`Selamat datang ${operator.nama_operator}`);

      navigate("/operator/dashboard");

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
        bg-green-700
        flex
        items-center
        justify-center
        p-4
        sm:p-6
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-[420px]
          rounded-2xl
          shadow-xl
          p-5
          sm:p-8
        "
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="text-center mb-6 sm:mb-8">

          <h1
            className="
              text-3xl
              sm:text-4xl
              font-bold
              text-green-700
            "
          >
            {isAdmin ? "Login Panitia" : "SI BELA"}
          </h1>

          <p
            className="
              text-gray-500
              mt-2
              text-sm
              sm:text-base
              leading-relaxed
            "
          >
            Sistem Informasi Pendaftaran dan Administrasi
          </p>

        </div>


        {/* =====================================
            ROLE
        ===================================== */}

        <div className="mb-4">

          <label className="block mb-2 font-semibold text-sm sm:text-base">
            Login Operator Gudep
          </label>

          <div
            className="
              w-full
              border
              rounded-lg
              p-3
              bg-gray-100
              text-sm
              sm:text-base
            "
          >
            👨‍🏫 Operator Gudep
          </div>

        </div>


        {/* =====================================
            EMAIL
        ===================================== */}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full
            border
            rounded-lg
            p-3
            mb-4
            text-base
            outline-none
            focus:ring-2
            focus:ring-green-600
          "
        />


        {/* =====================================
            PASSWORD
        ===================================== */}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full
            border
            rounded-lg
            p-3
            mb-5
            sm:mb-6
            text-base
            outline-none
            focus:ring-2
            focus:ring-green-600
          "
        />


        {/* =====================================
            TOMBOL MASUK
        ===================================== */}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            bg-green-700
            hover:bg-green-800
            disabled:bg-green-400
            text-white
            font-semibold
            py-3
            rounded-lg
            transition
            text-base
          "
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>


        {/* =====================================
            DAFTAR OPERATOR
        ===================================== */}

        <div className="text-center mt-5">

          <p className="text-gray-600 text-sm sm:text-base">

            Belum punya akun?

            <Link
              to="/daftar-operator"
              className="
                ml-2
                text-green-700
                font-semibold
                hover:underline
              "
            >
              Daftar Operator
            </Link>

          </p>

        </div>


        {/* =====================================
            FOOTER
        ===================================== */}

        <p
          className="
            text-center
            text-xs
            sm:text-sm
            text-gray-400
            mt-6
          "
        >
          Jambore Ranting Kwarran Cikarang Utara
        </p>

      </div>

    </div>
  );
}