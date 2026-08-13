import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-b
        from-green-700
        to-green-500
        flex
        items-center
        justify-center
        p-3
        sm:p-5
        md:p-6
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          sm:rounded-3xl
          shadow-2xl
          max-w-4xl
          w-full
          overflow-hidden
        "
      >

        <div className="grid md:grid-cols-2">

          {/* ==========================================
              BAGIAN KIRI
          ========================================== */}

          <div
            className="
              p-5
              sm:p-8
              md:p-10
              flex
              flex-col
              justify-center
            "
          >

            <img
              src="/logo/sibela.png"
              alt="SI BELA"
              className="
                w-24
                h-24
                sm:w-28
                sm:h-28
                md:w-32
                md:h-32
                mx-auto
                object-contain
              "
            />

            <h1
              className="
                text-3xl
                sm:text-4xl
                font-bold
                text-center
                text-green-700
                mt-3
              "
            >
              SI BELA
            </h1>

            <p
              className="
                text-center
                text-gray-600
                mt-2
                text-sm
                sm:text-base
              "
            >
              Sistem Informasi Pendaftaran
            </p>

            <p
              className="
                text-center
                text-lg
                sm:text-xl
                font-semibold
                mt-3
              "
            >
              Jambore Ranting 2026
            </p>

            <p
              className="
                text-center
                mt-5
                sm:mt-6
                text-gray-700
                text-sm
                sm:text-base
              "
            >
              Tema:
            </p>

            <p
              className="
                text-center
                italic
                text-green-700
                font-semibold
                text-sm
                sm:text-base
                leading-relaxed
                px-2
              "
            >
              "Si BELA : Pramuka Tangguh, Adaptif dan
              Berjiwa Kebangsaan"
            </p>

          </div>


          {/* ==========================================
              BAGIAN KANAN
          ========================================== */}

          <div
            className="
              bg-green-50
              p-5
              sm:p-8
              md:p-10
              flex
              flex-col
              justify-center
            "
          >

            <Link
              to="/login"
              className="
                bg-green-700
                text-white
                text-center
                py-3
                sm:py-3.5
                rounded-xl
                hover:bg-green-800
                transition
                font-semibold
                text-sm
                sm:text-base
                shadow-sm
              "
            >
              👨‍🏫 Login Operator
            </Link>


            <Link
              to="/admin-login"
              className="
                mt-3
                sm:mt-4
                border
                border-green-700
                text-green-700
                text-center
                py-3
                sm:py-3.5
                rounded-xl
                hover:bg-green-100
                transition
                font-semibold
                text-sm
                sm:text-base
              "
            >
              🔐 Login Panitia
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}