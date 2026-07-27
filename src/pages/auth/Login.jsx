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
  "operator",
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

    <div className="min-h-screen bg-green-700 flex items-center justify-center">


      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8">


        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-green-700">
  {isAdmin ? "Login Panitia" : "SI BELA"}
</h1>

          <p className="text-gray-500 mt-2">
            Sistem Informasi Pendaftaran dan Administrasi
          </p>

        </div>

        <div className="mb-4">
  <label className="block mb-2 font-semibold">
    Login Operator Gudep
  </label>

  <div className="w-full border rounded-lg p-3 bg-gray-100">
    👨‍🏫 Operator Gudep
  </div>
</div>

        <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
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
  disabled={loading}
  className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg"
>
  {loading ? "Memproses..." : "Masuk"}
</button>

<div className="text-center mt-5">
  <p className="text-gray-600">
    Belum punya akun?
    <Link
      to="/daftar-operator"
      className="ml-2 text-green-700 font-semibold hover:underline"
    >
      Daftar Operator
    </Link>
  </p>
</div>

        <p className="text-center text-sm text-gray-400 mt-6">

          Jambore Ranting Kwarran Cikarang Utara

        </p>


      </div>


    </div>

  );

}