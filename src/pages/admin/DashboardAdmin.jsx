import { useEffect, useState } from "react";

import GrafikGudep from "./GrafikGudep";
import TabelGudepTerbaru from "./TabelGudepTerbaru";
import AktivitasHariIni from "./AktivitasHariIni";
import RingkasanPembayaran from "./RingkasanPembayaran";
import StatusBerkas from "./StatusBerkas";
import AgendaJamran from "./AgendaJamran";
import NotifikasiPendaftaran from "./NotifikasiPendaftaran";

import {
  FaCampground,
  FaUsers,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import {
  getAdminDashboard,
} from "../../services/adminDashboardService";


export default function DashboardAdmin() {

  // =====================================================
  // DATA DASHBOARD
  // =====================================================

  const [dashboard, setDashboard] = useState({
    gudep: 0,
    peserta: 0,
    pembina: 0,
    regu: 0,
    pembayaran: 0,
    verifikasi: 0,
    menunggu: 0,
  });


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    async function load() {

      try {

        const hasil = await getAdminDashboard();

        console.log(
          "ADMIN DASHBOARD:",
          hasil
        );

        setDashboard(
          hasil || {
            gudep: 0,
            peserta: 0,
            pembina: 0,
            regu: 0,
            pembayaran: 0,
            verifikasi: 0,
            menunggu: 0,
          }
        );

      } catch (error) {

        console.error(
          "GAGAL LOAD DASHBOARD:",
          error
        );

      }

    }

    load();

  }, []);


  // =====================================================
  // TAMPILAN
  // =====================================================

  return (

    <div
      className="
        w-full
        max-w-full
        space-y-5
        sm:space-y-6
        lg:space-y-8
        overflow-x-hidden
      "
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="w-full">

        <h1
          className="
            text-2xl
            sm:text-3xl
            lg:text-4xl
            font-bold
            text-amber-700
            leading-tight
          "
        >
          Dashboard Admin
        </h1>

        <p
          className="
            text-gray-600
            text-sm
            sm:text-base
            mt-1
            sm:mt-2
          "
        >
          Selamat datang di Panel Admin SI BELA
        </p>

      </div>


      {/* =================================================
          NOTIFIKASI PENDAFTARAN
      ================================================= */}

      <div className="w-full min-w-0">

        <NotifikasiPendaftaran />

      </div>


      {/* =================================================
          KARTU STATISTIK
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-3
          sm:gap-4
          lg:gap-6
          w-full
        "
      >


        {/* =================================================
            GUDEP
        ================================================= */}

        <div
          className="
            bg-blue-600
            text-white
            rounded-xl
            sm:rounded-2xl
            shadow-lg
            p-4
            sm:p-5
            lg:p-6
            w-full
            min-w-0
            transition
            hover:scale-[1.02]
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
              gap-3
            "
          >

            <div className="min-w-0">

              <p className="text-sm sm:text-base lg:text-lg">
                🏕 Gudep
              </p>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  mt-2
                  sm:mt-3
                "
              >
                {dashboard.gudep}
              </h2>

              <p
                className="
                  mt-1
                  sm:mt-2
                  text-xs
                  sm:text-sm
                  opacity-80
                "
              >
                Total Gugus Depan
              </p>

            </div>

            <FaCampground
              className="
                text-3xl
                sm:text-4xl
                lg:text-[45px]
                shrink-0
              "
            />

          </div>

        </div>


        {/* =================================================
            PESERTA
        ================================================= */}

        <div
          className="
            bg-green-600
            text-white
            rounded-xl
            sm:rounded-2xl
            shadow-lg
            p-4
            sm:p-5
            lg:p-6
            w-full
            min-w-0
            transition
            hover:scale-[1.02]
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
              gap-3
            "
          >

            <div className="min-w-0">

              <p className="text-sm sm:text-base lg:text-lg">
                👥 Peserta
              </p>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  mt-2
                  sm:mt-3
                "
              >
                {dashboard.peserta}
              </h2>

              <p
                className="
                  mt-1
                  sm:mt-2
                  text-xs
                  sm:text-sm
                  opacity-80
                "
              >
                Total Peserta
              </p>

            </div>

            <FaUsers
              className="
                text-3xl
                sm:text-4xl
                lg:text-[45px]
                shrink-0
              "
            />

          </div>

        </div>


        {/* =================================================
            VERIFIKASI
        ================================================= */}

        <div
          className="
            bg-purple-600
            text-white
            rounded-xl
            sm:rounded-2xl
            shadow-lg
            p-4
            sm:p-5
            lg:p-6
            w-full
            min-w-0
            transition
            hover:scale-[1.02]
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
              gap-3
            "
          >

            <div className="min-w-0">

              <p className="text-sm sm:text-base lg:text-lg">
                ✅ Verifikasi
              </p>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  mt-2
                  sm:mt-3
                "
              >
                {dashboard.verifikasi}
              </h2>

              <p
                className="
                  mt-1
                  sm:mt-2
                  text-xs
                  sm:text-sm
                  opacity-80
                "
              >
                Sudah Diverifikasi
              </p>

            </div>

            <FaCheckCircle
              className="
                text-3xl
                sm:text-4xl
                lg:text-[45px]
                shrink-0
              "
            />

          </div>

        </div>


        {/* =================================================
            MENUNGGU
        ================================================= */}

        <div
          className="
            bg-orange-500
            text-white
            rounded-xl
            sm:rounded-2xl
            shadow-lg
            p-4
            sm:p-5
            lg:p-6
            w-full
            min-w-0
            transition
            hover:scale-[1.02]
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
              gap-3
            "
          >

            <div className="min-w-0">

              <p className="text-sm sm:text-base lg:text-lg">
                ⏳ Menunggu
              </p>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  mt-2
                  sm:mt-3
                "
              >
                {dashboard.menunggu}
              </h2>

              <p
                className="
                  mt-1
                  sm:mt-2
                  text-xs
                  sm:text-sm
                  opacity-80
                "
              >
                Belum Diverifikasi
              </p>

            </div>

            <FaClock
              className="
                text-3xl
                sm:text-4xl
                lg:text-[45px]
                shrink-0
              "
            />

          </div>

        </div>

      </div>


      {/* =================================================
          GRAFIK
      ================================================= */}

      <div
        className="
          w-full
          min-w-0
          overflow-hidden
        "
      >

        <GrafikGudep
          totalGudep={dashboard.gudep}
          sudahVerifikasi={dashboard.verifikasi}
          belumVerifikasi={dashboard.menunggu}
        />

      </div>


      {/* =================================================
          TABEL GUDEP TERBARU
      ================================================= */}

      <div
        className="
          mt-5
          sm:mt-6
          lg:mt-8
          w-full
          min-w-0
          overflow-hidden
        "
      >

        <TabelGudepTerbaru />

      </div>


      {/* =================================================
          INFORMASI TAMBAHAN
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-4
          sm:gap-5
          lg:gap-6
          mt-5
          sm:mt-6
          lg:mt-8
          w-full
          min-w-0
        "
      >

        <div className="w-full min-w-0 overflow-hidden">

          <AktivitasHariIni />

        </div>


        <div className="w-full min-w-0 overflow-hidden">

          <RingkasanPembayaran />

        </div>


        <div className="w-full min-w-0 overflow-hidden">

          <StatusBerkas />

        </div>


        <div className="w-full min-w-0 overflow-hidden">

          <AgendaJamran />

        </div>

      </div>


    </div>

  );

}