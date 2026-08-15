import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPengaturanPendaftaran,
} from "../../services/pengaturanPendaftaranService";

export default function PendaftaranDitutup() {

  const navigate = useNavigate();

  const [pengaturan, setPengaturan] = useState(null);

  useEffect(() => {

    async function loadPengaturan() {

      try {

        const data =
          await getPengaturanPendaftaran();

        setPengaturan(data);

      } catch (error) {

        console.error(
          "Gagal mengambil pengaturan pendaftaran:",
          error
        );

      }

    }

    loadPengaturan();

  }, []);


  function handleLogout() {

    localStorage.removeItem("operatorLogin");

    navigate("/login", {
      replace: true,
    });

  }


  return (

    <div
      className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-xl
          rounded-2xl
          shadow-xl
          p-6
          sm:p-10
          text-center
        "
      >

        {/* ICON */}

        <div className="text-6xl mb-5">
          🔒
        </div>


        {/* JUDUL */}

        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-red-600
            mb-4
          "
        >
          PENDAFTARAN TELAH DITUTUP
        </h1>


        {/* PESAN */}

        <p
          className="
            text-gray-600
            text-base
            sm:text-lg
            leading-relaxed
          "
        >
          {pengaturan?.pesan_penutupan ||
            "Pendaftaran Jambore Ranting Kwarran Cikarang Utara telah ditutup."}
        </p>


        {/* BATAS WAKTU */}

        {pengaturan?.tanggal_tutup && (
          <div
            className="
              mt-6
              bg-gray-50
              border
              rounded-xl
              p-4
            "
          >

            <p className="text-sm text-gray-500 mb-1">
              Batas akhir pendaftaran
            </p>

            <p
              className="
                font-bold
                text-gray-800
                text-lg
              "
            >
              {new Date(
                `${pengaturan.tanggal_tutup}T${pengaturan.jam_tutup || "00:00:00"}+07:00`
              ).toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })} WIB
            </p>

          </div>
        )}


        {/* INFORMASI */}

        <p
          className="
            text-gray-500
            text-sm
            mt-6
          "
        >
          Silakan menghubungi panitia apabila
          membutuhkan informasi lebih lanjut.
        </p>


        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="
            mt-8
            w-full
            bg-gray-700
            hover:bg-gray-800
            text-white
            font-semibold
            py-3
            rounded-lg
            transition
          "
        >
          Keluar
        </button>

      </div>

    </div>

  );
}