import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getKaplingByGudep
} from "../../services/kaplingService";


export default function KartuKapling() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD DATA KAPLING
  // ==========================================

  useEffect(() => {

    loadKapling();

  }, [id]);


  async function loadKapling() {

    try {

      console.log(
        "GUDDEP KAPLING :",
        id
      );


      const hasil =
        await getKaplingByGudep(id);


      console.log(
        "DATA KARTU KAPLING :",
        hasil
      );


      setData(hasil);


    } catch (error) {

      console.error(
        "GAGAL LOAD KARTU KAPLING:",
        error
      );

      setData(null);


    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="p-6 md:p-10 text-center">

        <p className="text-gray-500 text-sm md:text-xl">
          Memuat kartu kapling...
        </p>

      </div>

    );

  }


  // ==========================================
  // DATA TIDAK DITEMUKAN
  // ==========================================

  if (!data) {

    return (

      <div className="min-h-screen bg-gray-100 py-6 md:py-10 px-4">

        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 text-center">

            <h2 className="text-xl md:text-2xl font-bold text-red-600">

              Data Kapling Tidak Ditemukan

            </h2>


            <p className="mt-3 text-sm md:text-base text-gray-600">

              Data kartu kapling untuk Gudep ini belum tersedia.

            </p>


            <button
              onClick={() =>
                navigate("/operator/status")
              }
              className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold"
            >

              ⬅ Kembali

            </button>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // KAPLING BELUM DIBUAT
  // ==========================================

  if (!data.kapling_putra) {

    return (

      <div className="min-h-screen bg-gray-100 py-6 md:py-10 px-4">

        <div className="max-w-3xl mx-auto">


          <div className="text-center mb-6 md:mb-8">

            <h2 className="text-xs md:text-sm tracking-[4px] uppercase text-gray-500">

              Jambore Ranting

            </h2>


            <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mt-2">

              KARTU KAPLING

            </h1>


            <p className="text-sm md:text-base text-gray-500 mt-2">

              Kwarran Cikarang Utara

            </p>

          </div>


          <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 md:p-8 text-center">

            <h2 className="text-xl md:text-2xl font-bold text-yellow-700">

              Kapling Belum Dibuat

            </h2>


            <p className="mt-3 text-sm md:text-base text-gray-700">

              Silakan menunggu panitia melakukan Generate Kapling.

            </p>

          </div>


          <div className="flex justify-center mt-6 md:mt-8 no-print">

            <button
              onClick={() =>
                navigate("/operator/status")
              }
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow font-bold"
            >

              ⬅ Kembali

            </button>

          </div>


        </div>

      </div>

    );

  }


  // ==========================================
  // KARTU KAPLING
  // ==========================================

  return (

    <div className="min-h-screen bg-gray-100 py-5 md:py-10 px-3 md:px-4">


      <div className="max-w-5xl mx-auto">


        {/* =====================================
            JUDUL HALAMAN
        ===================================== */}

        <div className="text-center mb-5 md:mb-8">

          <h2 className="text-xs md:text-sm tracking-[3px] md:tracking-[5px] uppercase text-gray-500">

            Jambore Ranting

          </h2>


          <h1 className="text-2xl md:text-4xl font-extrabold text-green-700 mt-2">

            KARTU KAPLING

          </h1>


          <p className="text-xs md:text-base text-gray-500 mt-1 md:mt-2">

            Kwarran Cikarang Utara

          </p>

        </div>


        {/* =====================================
            KARTU
        ===================================== */}

        <div
          id="print-area"
          className="
            bg-white
            border-2
            md:border-4
            border-green-700
            rounded-xl
            md:rounded-2xl
            shadow-xl
            overflow-hidden
            w-full
            mx-auto
          "
        >


          {/* ===================================
              HEADER KARTU
          =================================== */}

          <div className="bg-green-700 text-white text-center py-4 md:py-5 px-3">

            <h1 className="text-xl md:text-3xl font-extrabold">

              JAMBORE RANTING

            </h1>


            <h2 className="text-sm md:text-xl mt-1">

              KWARRAN CIKARANG UTARA

            </h2>


            <p className="mt-1 text-[10px] md:text-sm tracking-wider">

              KARTU KAPLING PERKEMAHAN

            </p>

          </div>


          {/* ===================================
              NAMA GUDEP
          =================================== */}

          <div className="bg-green-50 py-3 px-3 border-b">

            <h2 className="text-center text-lg md:text-2xl font-bold text-green-700 break-words">

              {data?.profil_gudep?.nama_pangkalan || "-"}

            </h2>

          </div>


          {/* ===================================
              ISI KARTU
          =================================== */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-3
              md:gap-4
              p-3
              md:p-5
            "
          >


            {/* =================================
                BLOK PUTRA
            ================================= */}

            <div className="bg-green-50 border-2 border-green-600 rounded-xl p-3 md:p-4">

              <h3 className="text-center text-lg md:text-2xl font-bold text-green-700 mb-4 md:mb-6">

                🏕 BLOK PUTRA

              </h3>


              <div className="space-y-3 md:space-y-4">


                <div>

                  <p className="text-gray-500 text-xs md:text-sm">

                    Kecamatan

                  </p>


                  <p className="font-bold text-sm md:text-lg break-words">

                    {data?.kecamatan_putra || "-"}

                  </p>

                </div>


                <div>

                  <p className="text-gray-500 text-xs md:text-sm">

                    Kelurahan

                  </p>


                  <p className="font-bold text-sm md:text-lg break-words">

                    {data?.kelurahan_putra || "-"}

                  </p>

                </div>


              </div>


              <div className="mt-4 md:mt-6 text-center">

                <p className="text-gray-500 text-xs md:text-sm">

                  NOMOR KAPLING

                </p>


                <div className="text-4xl md:text-5xl font-extrabold text-green-700 mt-1">

                  {data?.kapling_putra || "-"}

                </div>

              </div>


            </div>


            {/* =================================
                BLOK PUTRI
            ================================= */}

            <div className="bg-pink-50 border-2 border-pink-500 rounded-xl p-3 md:p-4">

              <h3 className="text-center text-lg md:text-2xl font-bold text-pink-600 mb-4 md:mb-6">

                🌸 BLOK PUTRI

              </h3>


              <div className="space-y-3 md:space-y-4">


                <div>

                  <p className="text-gray-500 text-xs md:text-sm">

                    Kecamatan

                  </p>


                  <p className="font-bold text-sm md:text-lg break-words">

                    {data?.kecamatan_putri || "-"}

                  </p>

                </div>


                <div>

                  <p className="text-gray-500 text-xs md:text-sm">

                    Kelurahan

                  </p>


                  <p className="font-bold text-sm md:text-lg break-words">

                    {data?.kelurahan_putri || "-"}

                  </p>

                </div>


              </div>


              <div className="mt-4 md:mt-6 text-center">

                <p className="text-gray-500 text-xs md:text-sm">

                  NOMOR KAPLING

                </p>


                <div className="text-4xl md:text-5xl font-extrabold text-pink-600 mt-1">

                  {data?.kapling_putri || "-"}

                </div>

              </div>


            </div>


          </div>


          {/* ===================================
              FOOTER
          =================================== */}

          <div className="bg-gray-100 border-t px-3 md:px-5 py-3 md:py-4">

            <div className="text-center">

              <p className="text-[10px] md:text-sm text-gray-600 leading-relaxed">

                Pembina wajib membawa kartu ini sebagai bukti resmi
                penempatan kapling saat registrasi ulang dan pendirian tenda.

              </p>


              <div className="mt-3 md:mt-5">

                <span className="inline-block bg-green-700 text-white px-3 md:px-6 py-2 rounded-full font-bold text-[9px] md:text-sm">

                  JAMBORE RANTING KWARRAN CIKARANG UTARA

                </span>

              </div>


            </div>

          </div>


        </div>


        {/* =====================================
            TOMBOL
        ===================================== */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            justify-between
            gap-3
            mt-5
            md:mt-8
            no-print
          "
        >


          <button
            onClick={() =>
              navigate("/operator/status")
            }
            className="
              w-full
              md:w-auto
              bg-gray-600
              hover:bg-gray-700
              text-white
              px-6
              py-3
              rounded-xl
              shadow
              font-bold
              text-sm
              md:text-base
            "
          >

            ⬅ Kembali

          </button>


          <button
            onClick={() => window.print()}
            className="
              w-full
              md:w-auto
              bg-green-700
              hover:bg-green-800
              text-white
              px-6
              py-3
              rounded-xl
              shadow
              font-bold
              text-sm
              md:text-base
            "
          >

            🖨 Print Out Kartu

          </button>


        </div>


      </div>

    </div>

  );

}

