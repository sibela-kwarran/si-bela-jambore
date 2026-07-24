import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState("operator");


  function handleLogin() {

    if (role === "operator") {

      navigate("/operator/dashboard");

    } else {

      navigate("/admin/dashboard");

    }

  }


  return (

    <div className="min-h-screen bg-green-700 flex items-center justify-center">


      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8">


        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-green-700">
            SI BELA
          </h1>

          <p className="text-gray-500 mt-2">
            Sistem Informasi Pendaftaran dan Administrasi
          </p>

        </div>



        <label className="block mb-2 font-semibold">
          Login Sebagai
        </label>


        <select
          value={role}
          onChange={(e)=>setRole(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        >

          <option value="operator">
            Operator Gugus Depan
          </option>


          <option value="admin">
            Panitia / Admin
          </option>


        </select>



        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded-lg p-3 mb-4"
        />


        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6"
        />



        <button

          onClick={handleLogin}

          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg"

        >

          Masuk

        </button>



        <p className="text-center text-sm text-gray-400 mt-6">

          Jambore Ranting Kwarran Cikarang Utara

        </p>


      </div>


    </div>

  );

}