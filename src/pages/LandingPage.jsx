import { Link } from "react-router-dom";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-green-500 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden">

        <div className="grid md:grid-cols-2">

          {/* kiri */}

          <div className="p-10 flex flex-col justify-center">

            <img
  src="/logo/sibela.png"
  alt="SI BELA"
  className="w-32 h-32 mx-auto"
/>

            <h1 className="text-4xl font-bold text-center text-green-700">
              SI BELA
            </h1>

            <p className="text-center text-gray-600 mt-2">
              Sistem Informasi Pendaftaran
            </p>

            <p className="text-center text-xl font-semibold mt-3">
              Jambore Ranting 2026
            </p>

            <p className="text-center mt-6 text-gray-700">
              Tema:
            </p>

            <p className="text-center italic text-green-700 font-semibold">
              "Si BELA : Pramuka Tangguh, Adaptif dan Berjiwa Kebangsaan"
            </p>

          </div>

          {/* kanan */}

          <div className="bg-green-50 p-10 flex flex-col justify-center">

            <Link
  to="/login"
  className="bg-green-700 text-white text-center py-3 rounded-xl hover:bg-green-800"
>
  👨‍🏫 Login Operator
</Link>


<Link
  to="/admin-login"
  className="mt-4 border border-green-700 text-green-700 text-center py-3 rounded-xl hover:bg-green-100"
>
  🔐 Login Panitia
</Link>

          </div>

        </div>

      </div>

    </div>
  );
}