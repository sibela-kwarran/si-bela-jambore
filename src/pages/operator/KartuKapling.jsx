
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getKaplingByGudep,
} from "../../services/kaplingService";

import {
  getReguByGudep,
} from "../../services/reguService";

export default function KartuKapling() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataKapling, setDataKapling] = useState(null);
  const [dataRegu, setDataRegu] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      console.log("GUDDEP KAPLING:", id);

      const [kapling, regu] = await Promise.all([
        getKaplingByGudep(id),
        getReguByGudep(id),
      ]);

      console.log("DATA KAPLING:", kapling);
      console.log("DATA REGU:", regu);

      setDataKapling(kapling);
      setDataRegu(regu || []);
    } catch (error) {
      console.error("GAGAL LOAD KARTU KAPLING:", error);

      setDataKapling(null);
      setDataRegu([]);
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
  // DATA KAPLING TIDAK ADA
  // ==========================================

  if (!dataKapling) {
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
              onClick={() => navigate("/operator/status")}
              className="
                mt-6
                bg-gray-600
                hover:bg-gray-700
                text-white
                px-6
                py-3
                rounded-xl
                font-bold
              "
            >
              ⬅ Kembali
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CEK KAPLING
  // ==========================================

  const adaKaplingPutra =
    dataKapling?.kapling_putra !== null &&
    dataKapling?.kapling_putra !== undefined &&
    dataKapling?.kapling_putra !== "";

  const adaKaplingPutri =
    dataKapling?.kapling_putri !== null &&
    dataKapling?.kapling_putri !== undefined &&
    dataKapling?.kapling_putri !== "";

  if (!adaKaplingPutra && !adaKaplingPutri) {
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
              onClick={() => navigate("/operator/status")}
              className="
                bg-gray-600
                hover:bg-gray-700
                text-white
                px-6
                py-3
                rounded-xl
                shadow
                font-bold
              "
            >
              ⬅ Kembali
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // PISAHKAN REGU PUTRA & PUTRI
  // ==========================================

  const reguPutra = dataRegu.filter(
    (regu) =>
      String(regu.jenis || "")
        .trim()
        .toLowerCase() === "putra"
  );

  const reguPutri = dataRegu.filter(
    (regu) =>
      String(regu.jenis || "")
        .trim()
        .toLowerCase() === "putri"
  );

  // ==========================================
  // FUNGSI AMBIL NOMOR KAPLING
  //
  // "019"       -> ["019"]
  // "019,020"   -> ["019", "020"]
  // "019, 020"  -> ["019", "020"]
  // ==========================================

  function ambilNomorKapling(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return [];
    }

    return String(value)
      .split(",")
      .map((nomor) => nomor.trim())
      .filter(Boolean);
  }

  // ==========================================
  // NOMOR KAPLING PUTRA
  // ==========================================

  const daftarKaplingPutra =
    ambilNomorKapling(
      dataKapling.kapling_putra
    );

  // ==========================================
  // NOMOR KAPLING PUTRI
  // ==========================================

  const daftarKaplingPutri =
    ambilNomorKapling(
      dataKapling.kapling_putri
    );

  // ==========================================
  // BUAT KARTU
  // ==========================================

  const kartu = [];

  // ==========================================
  // KARTU PUTRA
  //
  // Regu 1 -> nomor index 0
  // Regu 2 -> nomor index 1
  // Regu 3 -> nomor index 2
  // ==========================================

  if (adaKaplingPutra) {
    reguPutra.forEach((regu, index) => {

      const nomorKapling =
        daftarKaplingPutra[index] || "";

      kartu.push({
        ...dataKapling,
        regu,
        jenis: "putra",
        nomorUrut: index + 1,
        nomorKapling,
        kecamatan: dataKapling.kecamatan_putra,
        kelurahan: dataKapling.kelurahan_putra,
      });

    });
  }

  // ==========================================
  // KARTU PUTRI
  //
  // Regu 1 -> nomor index 0
  // Regu 2 -> nomor index 1
  // Regu 3 -> nomor index 2
  // ==========================================

  if (adaKaplingPutri) {
    reguPutri.forEach((regu, index) => {

      const nomorKapling =
        daftarKaplingPutri[index] || "";

      kartu.push({
        ...dataKapling,
        regu,
        jenis: "putri",
        nomorUrut: index + 1,
        nomorKapling,
        kecamatan: dataKapling.kecamatan_putri,
        kelurahan: dataKapling.kelurahan_putri,
      });

    });
  }

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("DAFTAR KAPLING PUTRA:", daftarKaplingPutra);
  console.log("DAFTAR KAPLING PUTRI:", daftarKaplingPutri);
  console.log("KARTU FINAL:", kartu);

  // ==========================================
  // JIKA BELUM ADA DATA REGU
  // ==========================================

  if (kartu.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 md:py-10 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 text-center">

            <h2 className="text-xl md:text-2xl font-bold text-yellow-700">
              Data Regu Belum Tersedia
            </h2>

            <p className="mt-3 text-sm md:text-base text-gray-600">
              Belum ada regu yang terdaftar untuk Gudep ini.
            </p>

            <button
              onClick={() => navigate("/operator/status")}
              className="
                mt-6
                bg-gray-600
                hover:bg-gray-700
                text-white
                px-6
                py-3
                rounded-xl
                font-bold
              "
            >
              ⬅ Kembali
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // KOMPONEN SATU KARTU
  // ==========================================

  function CardKapling({ item }) {

    const isPutra =
      item.jenis === "putra";

    return (
      <div
        className="
          kartu-kapling
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
          mb-8
        "
      >

        {/* ===================================
            HEADER
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
            NAMA PANGKALAN
        =================================== */}

        <div className="bg-green-50 py-3 px-3 border-b">

          <h2 className="text-center text-lg md:text-2xl font-bold text-green-700 break-words">

            {item?.profil_gudep?.nama_pangkalan || "-"}

          </h2>

        </div>

        {/* ===================================
            IDENTITAS REGU
        =================================== */}

        <div
          className={`
            py-4
            px-4
            text-center
            border-b
            ${
              isPutra
                ? "bg-green-100 border-green-300"
                : "bg-pink-100 border-pink-300"
            }
          `}
        >

          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">
            Regu
          </p>

          <h2
            className={`
              text-2xl
              md:text-3xl
              font-extrabold
              mt-1
              ${
                isPutra
                  ? "text-green-700"
                  : "text-pink-600"
              }
            `}
          >

            {item.regu?.nama_regu ||
              item.regu?.regu ||
              item.regu?.nama ||
              `Regu ${item.nomorUrut}`}

          </h2>

          <p className="text-sm md:text-base font-semibold text-gray-600 mt-1">
            {isPutra ? "PUTRA" : "PUTRI"}
          </p>

        </div>

        {/* ===================================
            ISI KARTU
        =================================== */}

        <div className="p-3 md:p-5">

          <div
            className={`
              border-2
              rounded-xl
              p-4
              md:p-6
              ${
                isPutra
                  ? "bg-green-50 border-green-600"
                  : "bg-pink-50 border-pink-500"
              }
            `}
          >

            <h3
              className={`
                text-center
                text-lg
                md:text-2xl
                font-bold
                mb-5
                ${
                  isPutra
                    ? "text-green-700"
                    : "text-pink-600"
                }
              `}
            >

              {isPutra
                ? "🏕 BLOK PUTRA"
                : "🌸 BLOK PUTRI"}

            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* KECAMATAN */}

              <div>

                <p className="text-gray-500 text-xs md:text-sm">
                  Kecamatan
                </p>

                <p className="font-bold text-sm md:text-lg break-words">
                  {item.kecamatan || "-"}
                </p>

              </div>

              {/* KELURAHAN */}

              <div>

                <p className="text-gray-500 text-xs md:text-sm">
                  Kelurahan
                </p>

                <p className="font-bold text-sm md:text-lg break-words">
                  {item.kelurahan || "-"}
                </p>

              </div>

            </div>

            {/* NOMOR KAPLING */}

            <div className="mt-6 md:mt-8 text-center">

              <p className="text-gray-500 text-xs md:text-sm">
                NOMOR KAPLING
              </p>

              <div
                className={`
                  text-5xl
                  md:text-7xl
                  font-extrabold
                  mt-1
                  ${
                    isPutra
                      ? "text-green-700"
                      : "text-pink-600"
                  }
                `}
              >

                {item.nomorKapling
                  ? `${isPutra ? "PA" : "PI"}${String(
                      item.nomorKapling
                    ).padStart(3, "0")}`
                  : "—"}

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
    );
  }

  // ==========================================
  // TAMPILAN
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 py-5 md:py-10 px-3 md:px-4">

      <div className="max-w-5xl mx-auto">

        {/* =====================================
            JUDUL HALAMAN
        ===================================== */}

        <div className="text-center mb-5 md:mb-8 no-print">

          <h2 className="text-xs md:text-sm tracking-[3px] md:tracking-[5px] uppercase text-gray-500">
            Jambore Ranting
          </h2>

          <h1 className="text-2xl md:text-4xl font-extrabold text-green-700 mt-2">
            KARTU KAPLING
          </h1>

          <p className="text-xs md:text-base text-gray-500 mt-1 md:mt-2">
            Kwarran Cikarang Utara
          </p>

          {/* JUMLAH KARTU */}

          <div className="mt-3">

            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">

              {kartu.length} Kartu Kapling

            </span>

          </div>

        </div>

        {/* =====================================
            AREA PRINT
        ===================================== */}

        <div id="print-area">

          {kartu.map((item, index) => (

            <CardKapling
              key={`${item.jenis}-${item.regu?.id || index}`}
              item={item}
            />

          ))}

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
            🖨 Print Out {kartu.length} Kartu
          </button>

        </div>

      </div>

      {/* ==========================================
          CSS PRINT
      ========================================== */}

      <style>{`
        @media print {

          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .kartu-kapling {
            box-shadow: none !important;
            margin-bottom: 0 !important;
            page-break-after: always;
            break-after: page;
          }

          .kartu-kapling:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          #print-area {
            width: 100%;
          }
        }
      `}</style>

    </div>
  );
}

