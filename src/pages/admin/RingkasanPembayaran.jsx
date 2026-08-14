import { useEffect, useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";

import {
  getPembayaranAdmin,
} from "../../services/pembayaranService";


export default function RingkasanPembayaran() {

  const [data, setData] = useState({
    totalMasuk: 0,
    targetPembayaran: 0,
    sisa: 0,
    sudahBayar: 0,
    belumBayar: 0,
    progress: 0,
  });


  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {

    async function loadData() {

      try {

        const pembayaran = await getPembayaranAdmin();

        console.log(
          "RINGKASAN PEMBAYARAN ADMIN:",
          pembayaran
        );


        // ==================================================
        // JUMLAH GUDEP
        // ==================================================

        const totalGudep = pembayaran.length;


        // ==================================================
        // SUDAH BAYAR
        // ==================================================

        const sudahBayar = pembayaran.filter(
          (item) =>
            String(item.status || "").toLowerCase() ===
            "lunas"
        ).length;


        // ==================================================
        // BELUM BAYAR
        // ==================================================

        const belumBayar =
          totalGudep - sudahBayar;


        // ==================================================
        // TARGET PEMBAYARAN
        //
        // Menggunakan biaya_per_regu
        // ==================================================

        const targetPembayaran =
          pembayaran.reduce(
            (total, item) =>
              total +
              Number(
                item.biaya_per_regu || 0
              ),
            0
          );


        // ==================================================
        // DANA MASUK
        // ==================================================

        const totalMasuk =
          pembayaran.reduce(
            (total, item) =>
              total +
              Number(
                item.nominal || 0
              ),
            0
          );


        // ==================================================
        // SISA
        // ==================================================

        const sisa =
          Math.max(
            targetPembayaran - totalMasuk,
            0
          );


        // ==================================================
        // PROGRESS
        // ==================================================

        const progress =
          targetPembayaran === 0
            ? 0
            : Math.min(
                Math.round(
                  (totalMasuk /
                    targetPembayaran) *
                    100
                ),
                100
              );


        // ==================================================
        // SET DATA
        // ==================================================

        setData({
          totalMasuk,
          targetPembayaran,
          sisa,
          sudahBayar,
          belumBayar,
          progress,
        });


      } catch (error) {

        console.error(
          "GAGAL LOAD RINGKASAN PEMBAYARAN:",
          error
        );

      }

    }


    loadData();

  }, []);


  // ======================================================
  // FORMAT RUPIAH
  // ======================================================

  function formatRupiah(angka) {

    return Number(
      angka || 0
    ).toLocaleString(
      "id-ID"
    );

  }


  // ======================================================
  // TAMPILAN
  // ======================================================

  return (

    <div className="bg-white rounded-xl shadow p-6">


      {/* HEADER */}

      <div className="flex items-center gap-3 mb-5">

        <FaMoneyBillWave
          className="text-green-600"
          size={28}
        />

        <h2 className="text-xl font-bold">
          Ringkasan Pembayaran
        </h2>

      </div>


      <div className="space-y-3">


        {/* SUDAH BAYAR */}

        <div className="flex justify-between">

          <span>
            ✅ Sudah Bayar
          </span>

          <span className="font-bold text-green-600">

            {data.sudahBayar} Gudep

          </span>

        </div>


        {/* BELUM BAYAR */}

        <div className="flex justify-between">

          <span>
            ⏳ Belum Bayar
          </span>

          <span className="font-bold text-red-600">

            {data.belumBayar} Gudep

          </span>

        </div>


        <hr />


        {/* TARGET */}

        <div className="flex justify-between gap-4">

          <span>
            🎯 Target Pembayaran
          </span>

          <span className="font-bold">

            Rp {formatRupiah(
              data.targetPembayaran
            )}

          </span>

        </div>


        {/* DANA MASUK */}

        <div className="flex justify-between gap-4">

          <span>
            💰 Dana Masuk
          </span>

          <span className="font-bold text-green-700">

            Rp {formatRupiah(
              data.totalMasuk
            )}

          </span>

        </div>


        {/* SISA */}

        <div className="flex justify-between gap-4">

          <span>
            ❌ Sisa Pembayaran
          </span>

          <span className="font-bold text-red-600">

            Rp {formatRupiah(
              data.sisa
            )}

          </span>

        </div>


        {/* PROGRESS */}

        <div className="mt-5">

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="
                bg-green-600
                h-4
                rounded-full
                transition-all
                duration-700
              "
              style={{
                width: `${data.progress}%`,
              }}
            />

          </div>


          <p className="
            text-center
            mt-3
            font-semibold
            text-green-700
          ">

            Progress Pembayaran{" "}
            {data.progress}%

          </p>

        </div>

      </div>

    </div>

  );

}